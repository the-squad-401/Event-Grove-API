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
 * @param {String} id the id of the business that could not be found.
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
 * @returns {object} 200 - An object containing each event, and count
 * @returns {Error} 500 - Unforseen difficulties.
 */
async function getEvents(req, res, next) {
  res.status(200).json(await events.get());
}

/**
 * Retrieves and sends back a single event via ID
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 */
async function getEventById(req, res, next) {
  const record = await events.get(req.params.id);
  sendRecord(record, req.params.id, res, next);
}

/**
 * Retrieves and sends back all the events in a certain category via ID
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 */
async function getEventsByCategory(req, res, next) {
  res.status(200).json(await events.getByCategory(req.params.category));
}

/**
 * Creates and sends back a new event from JSON in the req.body
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
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
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 */
async function updateEvent(req,res,next) {
  const record = await events.put(req.params.id, req.body);
  sendRecord(record, req.params.id, res, next);
}

/**
 * Deletes and sends back, for the last time, a event via ID
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 */
async function deleteEvent(req,res,next) {
  const record = await events.delete(req.params.id);
  sendRecord(record, req.params.id, res, next);
}

module.exports = router;
