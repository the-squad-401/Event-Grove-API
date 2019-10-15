'use-strict';

const express = require('express');
const router = express.Router();

const Businesses = require('../models/business/business');
const businesses = new Businesses();

router.get('/businesses', async (req, res) => {
  res.send(200).json(businesses.get());
});