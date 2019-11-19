'use strict';
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const auth = require('../auth/auth-middleware');

const Businesses = require('../models/business/business');
const businesses = new Businesses();
const Categories = require('../models/category/category');
const categories = new Categories();
const Users = require('../models/user/user');
const users = new Users();

router.get('/subscribers/:type/:id', getSubscribers);
router.post('/subscribers/:type/:id', auth, createSubscriber);
router.delete('/subscribers/:type/:id', auth, deleteSubscriber);

/**
* @typedef subscribers
* @property {Array.<string>} object
*/

/**
 * @typedef object
 * @property {string} userID.required
 */

/**
 * Creates and sends back a new subscriber from JSON in the req.body for either a business or category
 * @route POST /subscribers/{type}/{id}
 * @group Subscriptions
 * @param {string} type.path.required - business or category
 * @param {string} id.path.required - id of business or category
 * @security Bearer
 */
async function createSubscriber(req, res) {
  const { id } = jwt.decode(req.token);
  if (req.params.type === 'business') {
    let result = await users.addSubscription(id, req.params.id);
    await businesses.addSubscriber(req.params.id, id);
    res.status(201).json(result.subscriptions);
  }
  if (req.params.type === 'category') {
    let result = await categories.addSubscriber(req.params.id, id);
    res.status(201).json(result.subscribers);
  }
}

/**
 * Retrieves and sends back all subscribers
 * @route GET /subscribers/{type}/{id}
 * @group Subscriptions
 * @param {string} type.path.required - business or category
 * @param {string} id.path.required - id of business or category
 * 
 * @returns {object} 200 - An object containing each subscription, and count
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
 * @route DELETE /subscribers/{type}/{id}
 * @group Subscriptions
 * @param {string} type.path.required - business or category
 * @param {string} id.path.required - id of business or category
 * @security Bearer
 */
async function deleteSubscriber(req, res) {
  const { id } = jwt.decode(req.token);
  if (req.params.type === 'business') {
    let result = await users.removeSubscription(id, req.params.id);
    await businesses.removeSubscriber(req.params.id, id);
    res.status(200).json(result.subscriptions);
  }
  if (req.params.type === 'category') {
    let result = await categories.removeSubscriber(req.params.id, id);
    res.status(200).json(result.subscribers);
  }
}

module.exports = router;