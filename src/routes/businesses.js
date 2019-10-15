'use-strict';

const express = require('express');
const router = express.Router();

const Businesses = require('../models/business/business');
const businesses = new Businesses();

router.get('/businesses', async (req, res) => {
  res.status(200).json(businesses.get());
});

//TODO Add authorization (Admin)
router.post('/business', async (req, res, next) => {
  console.log(req);
  try {
    const ret = await businesses.post(req.body);
    console.log(ret);
    res.send(201);
  } catch (error) {
    next(error);
  }
});

module.exports = router;