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

/**
 * Retrieves and sends back all subscribers
 * @param {string} id.param.required - business or category
 * 
 * @route GET /subscribers/:type/:id
 * @returns {object} 200 - An object containing each event, and count
 * @returns {Error} 500 - Unforseen difficulties.
 */
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

/**
 * Creates and sends back a new subscriber from JSON in the req.body for either a business or category
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 */
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

/**
 * Deletes and sends back a subscriber via ID
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 */
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