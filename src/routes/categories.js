'use strict';

const express = require('express');
const router = express.Router();

const Model = require('../models/category/category');
const modelRepository = new Model();

router.get('/categories', handleGet);
router.post('/category', handlePost);
router.put('/category/:id', handlePut);
router.delete('/category/:id', handleDelete);

function get404(id) {
  const error = new Error(`No category found with id: ${id}`);
  error.status = 404;
  return error;
}

function sendRecord(record, id, res, next) {
  if (!record) {
    next(get404(id));
  } else {
    res.status(200).json(record);
  }
}

async function handleGet(req, res, next) {
  res.status(200).json(await modelRepository.get());
}

async function handlePost(req, res, next) {
  try {
    let record = await modelRepository.post(req.body);
    res.status(201).send(record);
  } catch (error) {
    next(error);
  }
}

async function handlePut(req, res, next) {
  const record = await modelRepository.put(req.params.id, req.body);
  sendRecord(record, req.params.id, res, next);
}

async function handleDelete(req, res, next) {
  let record = await modelRepository.delete(req.params.id);
  sendRecord(record, req.params.id, res, next);
}

module.exports = router;