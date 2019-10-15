'use-strict';

const express = require('express');
const router = express.Router();

const Businesses = require('../models/business/business');
const businesses = new Businesses();

router.get('/businesses', getBusinesses);
router.get('/business/:id', getBusinessById);
router.get('/businesses/:category', getBusinessesByCategory);
router.put('/business/:id', updateBusinessById);
//TODO Add authorization (Admin)
router.post('/business', createBusiness);
router.delete('/business/:id', deleteBusiness);

function get404(id) {
  const error = new Error(`No business found with id: ${id}`);
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

async function getBusinesses(req, res, next) {
  res.status(200).json(await businesses.get());
}

async function getBusinessById(req, res, next) {
  const record = await businesses.get(req.params.id);
  sendRecord(record, req.params.id, res, next);
}

async function getBusinessesByCategory(req, res, next) {
  res.status(200).json(await businesses.getByCategory(req.params.category));
}

async function updateBusinessById(req, res, next) {
  const record = await businesses.put(req.params.id, req.body);
  sendRecord(record, req.params.id, res, next);
}

async function createBusiness(req, res, next) {
  try {
    const record = await businesses.post(req.body);
    res.status(201).send(record);
  } catch (error) {
    next(error);
  }
}

async function deleteBusiness(req, res, next) {
  const record = await businesses.delete(req.params.id);
  sendRecord(record, req.params.id, res, next);
}

module.exports = router;