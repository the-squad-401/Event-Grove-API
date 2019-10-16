'use strict';

const express = require('express');
const router = express.Router();

const Events = require('../models/event/event');
const Users = require('../models/user/user');

const emitEvent = require('../event-emitter');

const events = new Events();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.get('/events/:category', getEventsByCategory);
router.post('/events', postEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

/**
 * Creates an error with a 404 status
 * @route GET /events
 * @param {string} id the id of the business that could not be found.
 * @returns {object} 200 - an object containing the information of events.
 * @returns {Error} 404 - Events could not be found
 */
function get404(id) {
  const error = new Error(`No event found with id: ${id}`);
  error.status = 404;
  return error;
}

/**
 * Checks if the record was found, and throws a 404 error if not
 * @route GET  /events
 * @param {object} record the record to verify
 * @param {string} id the id of the record (for the 404)
 * @returns {object} 200 - an object containing events information was found
 * @returns {Error} 404 - Events could not be found
 */
function sendRecord(record, id, res, next) {
  if (!record) {
    next(get404(id));
  } else {
    res.status(200).json(record);
  }
}

/**
 * Retrieves and sends back all events
 * @route GET /events
 * @param {string} path.required - GET all events
 * @returns {object} 200 - An object containing each event, and count
 * @returns {Error} 500 - Unforseen difficulties.
 */
async function getEvents(req, res, next) {
  res.status(200).json(await events.get());
}

/**
 * Retrieves and sends back a single event via ID
 * @route GET /event/{id}
 * @param {string} id.path.required - ID of event to GET
 * @param {request} req the Express Request
 * @param {response} res the Express Response
 * @returns {object} 200 - an object containing the information of an event.
 * @returns {Error} 404 - event with ID could not be found.
 */
async function getEventById(req, res, next) {
  const record = await events.get(req.params.id);
  sendRecord(record, req.params.id, res, next);
}

/**
 * Retrieves and sends back all the events in a certain category via ID
 * @route GET /event/{category} 
 * @param {string} category.path.required - Category of event to GET
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 * @returns {object} 200 - an object containing the information of an event within a category.
 * @returns {Error} 404 - event from category could not be found
 */
async function getEventsByCategory(req, res, next) {
  res.status(200).json(await events.getByCategory(req.params.category));
}

/**
 * Creates and sends back a new event from JSON in the req.body
 * @route POST /event
 * @param {string} path.required - creates a new event
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 * @returns {object} 200 - an event is created with the information submitted
 * @returns {Error} 404 - event could not be created
 */
async function postEvent(req,res,next) {
  try {
    const record = await events.post(req.body);
    res.status(201).send(record);
    emitEvent(record);
  } catch (error) {
    next(error);
  }
}

/**
 * Updates and sends back the new event via ID
 * @route PUT /event/{id}
 * @param {string} id.path.required - ID of the event to PUT
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 * @returns {object} 200 - an object containing the information of the updated event
 * @returns {Error} 404 - event with ID could not be found 
 */
async function updateEvent(req,res,next) {
  const record = await events.put(req.params.id, req.body);
  sendRecord(record, req.params.id, res, next);
}

/**
 * Deletes and sends back, for the last time, a event via ID
 * @route DELETE /event/{id}
 * @param {string} id.path.required - ID of the event to DELETE
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 * @returns {object} 200 - an object no longer containing the information for an event
 * @returns {Error} 404 - event with ID could not be found
 */
async function deleteEvent(req,res,next) {
  const record = await events.delete(req.params.id);
  sendRecord(record, req.params.id, res, next);
}

module.exports = router;
