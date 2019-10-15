'use strict';
const express = require('express');
const router = express.Router();

const Businesses = require('../models/business/business');
const businesses = new Businesses();
const Categories = require('../models/category/category');
const categories = new Categories();

router.get('/subscribers/:type/:id', getSubscribers);
router.post('/subscribers/:type', createSubscriber);
router.delete('subscribers/:type', deleteSubscriber);

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

function createSubscriber(req, res, next) {

}

function deleteSubscriber(req, res, next) {

}

module.exports = router;