'use strict';
const express = require('express');
const router = express.Router();

const Businesses = require('../models/business/business');
const businesses = new Businesses();
const Categories = require('../models/category/category');
const categories = new Categories();

router.get('/subscribers/:type/:id', getSubscribers);
router.post('/subscribers/:type/:id', createSubscriber);
router.delete('/subscribers/:type/:id', deleteSubscriber);

function getSubscribers(req, res, next) {
  if (req.params.type === 'business') {
    businesses.get(req.params.id)
      .then( data => {
        res.status(200).json(data.subscribers);
      })
      .catch(next);
  } 

  if (req.params.type === 'category') {
    categories.get(req.params.id)
      .then( data => {
        res.status(200).json(data.subscribers);
      })
      .catch(next);
  }
}

async function createSubscriber(req, res, next) {
  if (req.params.type === 'business') {
    let result = await businesses.addSubscriber(req.params.id, req.body.userId);
    res.status(201).json(result.subscribers);
  }
  if (req.params.type === 'category') {
    let result = await categories.addSubscriber(req.params.id, req.body.userId);
    res.status(201).json(result.subscribers);
  }
}

async function deleteSubscriber(req, res, next) {
  if (req.params.type === 'business') {
    let result = await businesses.removeSubscriber(req.params.id, req.body.userId);
    res.status(200).json(result.subscribers);
  }
  if (req.params.type === 'category') {
    let result = await categories.removeSubscriber(req.params.id, req.body.userId);
    res.status(200).json(result.subscribers);
  }
}

module.exports = router;