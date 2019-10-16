'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const auth = require('../auth/auth-middleware');

const Events = require('../models/event/event');
const Businesses = require('../models/business/business');
const businesses = new Businesses();

const events = new Events();

router.get('/events', wrap(getEvents));
router.get('/events/:id', wrap(getEventById));
router.get('/events/:category', wrap(getEventsByCategory));
router.post('/events', auth, wrap(postEvent));
router.put('/events/:id', auth, wrap(updateEvent));
router.delete('/events/:id', auth, wrap(deleteEvent));

/**
 * @typedef Event
 * @property {string} business.required - ID of Business
 * @property {string} category.required - ID of Category
 * @property {string} name.required - Event name
 * @property {string} description.required - description of the Event
 * @property {number} startDate.required - When the Event starts
 * @property {number} endDate.required - When the Event ends
 * @property {string} image.required - image of Event
 */

/**
 * Wraps a route callback with a try/catch, which passes on uncaught errors to be properly handled
 * @param {Function} route the route to be wrapped
 */
function wrap(route) {
  return async (req, res, next) => {
    try {
      await route(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Creates an error with a 404 status
 * @param {String} id the id of the event that could not be found.
 */
function get404(id) {
  const error = new Error(`No event found with id: ${id}`);
  error.status = 404;
  return error;
}

/**
 * Checks if the record was found, and throws a 404 error if not
 * @param {Object} record the record to verify
 * @param {String} id the id of the record (for the 404)
 */
function verifyExists(record, id) {
  if (!record) {
    throw get404(id);
  }
}

/**
 * Sends a record to a response, with a default status of 200
 * @param {Object} record the record
 * @param {Response} res the Express Response
 * @param {Number} status a status code (200 by default)
 */
function send(record, res, status = 200) {
  res.status(status).json(record);
}

/**
 * Retrieves and sends back all events
 * @route GET /events
 * @returns {object} 200 - An object containing each event
 */
async function getEvents(req, res) {
  let record = await events.get();
  send(record, res);
}

/**
 * Retrieves and sends back a single event via ID
 * @route GET /event/{id}
 * @param {string} id.path.required - ID of event to GET
 * @returns {Event.model} 200 - an object containing the information of an event.
 * @returns {Error} 404 - event with ID could not be found.
 */
async function getEventById(req, res) {
  const record = await events.get(req.params.id);
  verifyExists(record, req.params.id);
  send(record, res);
}

/**
 * Retrieves and sends back all the events in a certain category via ID
 * @route GET /event/{category} 
 * @param {string} category.path.required - Category ID of event to GET
 * @returns {object} 200 - an object containing the information of an event within a category.
 */
async function getEventsByCategory(req, res) {
  const record = await events.getByCategory(req.params.category);
  send(record, res);
}

function get401() {
  const error = new Error('You are not authorized to do this action');
  error.status = 401;
  return error;
}

async function authOwner(tokenData, businessId) {
  const business = await businesses.get(businessId);
  if (!business.owners.includes(tokenData.id) && tokenData.type !== 'admin') {
    throw get401();
  } 
}

/**
 * Creates and sends back a new event from JSON in the req.body
 * @route POST /event
 * @param {Event.model} event.body.required - creates a new event
 * @returns {Event.model} 200 - an event is created with the information submitted
 */
async function postEvent(req, res) {
  const tokenData = jwt.decode(req.token);
  await authOwner(tokenData, req.body.business);
  const record = await events.post(req.body);
  send(record, res, 201);
}

/**
 * Updates and sends back the new event via ID
 * @route PUT /event/{id}
 * @param {string} id.path.required - ID of the event to PUT
 * @param {object} update.body.required - Updated info
 * @returns {Event.model} 200 - an object containing the information of the updated event
 * @returns {Error} 404 - event with ID could not be found 
 */
async function updateEvent(req, res) {
  let record = await events.get(req.params.id);
  await authOwner(jwt.decode(req.token), record.business);
  record = await events.put(req.params.id, req.body);
  verifyExists(record, req.params.id);
  send(record, res);
}

/**
 * Deletes and sends back, for the last time, a event via ID
 * @route DELETE /event/{id}
 * @param {string} id.path.required - ID of the event to DELETE
 * @returns {Event.model} 200 - an object no longer containing the information for an event
 * @returns {Error} 404 - event with ID could not be found
 */
async function deleteEvent(req, res) {
  let record = await events.get(req.params.id);
  await authOwner(jwt.decode(req.token), record.business);
  record = await events.delete(req.params.id);
  verifyExists(record, req.params.id);
  send(record, res);
}

module.exports = router;
