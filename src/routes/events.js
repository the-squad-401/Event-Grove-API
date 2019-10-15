'use strict';

const express = require('express');
const router = express.Router();

const Events = require('../models/event/event');
const Users = require('../models/user/user');

const events = new Events();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.get('/events/:category', getEventsByCategory);
router.post('events/', postEvent);
router.put('events/:id', updateEvent);
router.delete('events/:id', deleteEvent);

function get404(id) {
  const error = new Error(`No event found with id: ${id}`);
  error.status = 404;
  return error;
};

function sendRecord(record, id, res, next) {
  if (!record) {
    next(get404(id));
  } else {
    res.status(200).json(record);
  }
};

async function getEvents(req, res, next) {
  res.status(200).json(await events.get());
};

async function getEventById(req, res, next) {
  const record = await events.get(req.params.id);
  sendRecord(record, req.params.id, res, next);
};

async function getEventsByCategory(req, res, next) {
  res.status(200).json(await events.getByCategory(req.params.category));
};

async function postEvent(req,res,next) {
  try {
    const record = await events.post(req.body);
    res.status(201).send(record);
  } catch (error) {
    next(error);
  }
};

async function updateEvent(req,res,next) {
  const record = await events.put(req.params.id, req.body);
  sendRecord(record, req.params.id, res, next);
};

async function deleteEvent(req,res,next) {
  const record = await events.delete(req.params.id);
  sendRecord(record, req.params.id, res, next);
};

module.exports = router;
