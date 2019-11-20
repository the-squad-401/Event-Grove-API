'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const auth = require('../auth/auth-middleware');

const Events = require('../models/event/event');
const Businesses = require('../models/business/business');
const businesses = new Businesses();

const { wrap, get401, verifyExists, send } = require('../route-helpers');

const events = new Events();

const emitEvent = require('../event-emitter');

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
 * Creates and sends back a new event from JSON in the req.body
 * @route POST /events
 * @group Events
 * @param {Event.model} event.body.required - creates a new event
 * @returns {Event.model} 200 - an event is created with the information submitted
 * @security Bearer
 */
router.post('/events', auth, wrap(postEvent));

/**
 * Retrieves and sends back all events
 * @route GET /events
 * @group Events
 * @returns {object} 200 - An object containing each event
 */
router.get('/events', wrap(getEvents));

/**
 * Retrieves and sends back a single event via ID
 * @route GET /events/{id}
 * @group Events
 * @param {string} id.path.required - ID of event to GET
 * @returns {Event.model} 200 - an object containing the information of an event.
 * @returns {Error} 404 - event with ID could not be found.
 */
router.get('/events/:id', wrap(getEventById));

/**
 * Retrieves and sends back all the events in a certain category via ID
 * @route GET /events/{id}
 * @group Events
 * @param {string} id.path.required - Category ID of event to GET
 * @returns {object} 200 - an object containing the information of an event within a category.
 */
router.get('/events/:category', wrap(getEventsByCategory));

/**
 * Retrieves and sends back all the events in a certain business via ID
 * @route GET /events/business/{id}
 * @group Events
 * @param {string} id.path.required - Business ID of events to GET
 * @returns {object} 200 - an object containing the information of events within a business.
 */
router.get('/events/business/:business', wrap(getEventsByBusiness));

/**
 * Updates and sends back the new event via ID
 * @route PUT /events/{id}
 * @group Events
 * @param {string} id.path.required - ID of the event to PUT
 * @param {object} update.body.required - Updated info
 * @returns {Event.model} 200 - an object containing the information of the updated event
 * @returns {Error} 404 - event with ID could not be found 
 * @security Bearer
 */
router.put('/events/:id', auth, wrap(updateEvent));

/**
 * Deletes and sends back, for the last time, a event via ID
 * @route DELETE /events/{id}
 * @group Events
 * @param {string} id.path.required - ID of the event to DELETE
 * @returns {Event.model} 200 - an object no longer containing the information for an event
 * @returns {Error} 404 - event with ID could not be found
 * @security Bearer
 */
router.delete('/events/:id', auth, wrap(deleteEvent));

async function getEvents(req, res) {
  let record = await events.get();
  send(record, res);
}

async function getEventById(req, res) {
  const record = await events.get(req.params.id);
  verifyExists(record, req.params.id);
  send(record, res);
}

async function getEventsByCategory(req, res) {
  const record = await events.getByCategory(req.params.category);
  send(record, res);
}

async function getEventsByBusiness(req, res) {
  const record = await events.getByBusiness(req.params.business);
  send(record, res);
}

async function authOwner(tokenData, businessId) {
  const business = await businesses.get(businessId);
  verifyExists(business, businessId);
  if (!business.owners.includes(tokenData.id) && tokenData.type !== 'admin') {
    throw get401();
  } 
}

async function postEvent(req, res) {
  const tokenData = jwt.decode(req.token);
  await authOwner(tokenData, req.body.business);
  const record = await events.post(req.body);
  emitEvent(record);
  send(record, res, 201);
}

async function updateEvent(req, res) {
  let record = await events.get(req.params.id);
  verifyExists(record, req.params.id);
  await authOwner(jwt.decode(req.token), record.business);
  record = await events.put(req.params.id, req.body);
  send(record, res);
}

async function deleteEvent(req, res) {
  let record = await events.get(req.params.id);
  verifyExists(record, req.params.id);
  await authOwner(jwt.decode(req.token), record.business);
  record = await events.delete(req.params.id);
  send(record, res);
}

module.exports = router;
