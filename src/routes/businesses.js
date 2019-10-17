'use strict';

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const auth = require('../auth/auth-middleware');

const Businesses = require('../models/business/business');
const businesses = new Businesses();

const { wrap, get401, verifyExists, send } = require('../route-helpers');

/**
 * @typedef Hours
 * @property {string} day.required - Day(s) for these hours
 * @property {string} open.required - Opening time
 * @property {string} close.required - Closing time
 */

/**
 * @typedef NewBusiness
 * @property {string} name.required - Business name
 * @property {string} address.required - Address of the business
 * @property {Array.<Hours>} hours.required - Business hours
 * @property {string} category.required - The ID of the category this business belongs to
 * @property {string} externalUrl.required - A link to a page outside of this website for the business
 * @property {string} description.required - A description of the business
 * @property {string} bannerImage.required - A link to a banner image
 * @property {Array.<string>} gallery.required - An array of images to be used in a gallery
 */

/**
 * @typedef Business
 * @property {string} id.required - ID of this business
 * @property {string} name.required - Business name
 * @property {string} address.required - Address of the business
 * @property {Array.<Hours>} hours.required - Business hours
 * @property {string} category.required - The ID of the category this business belongs to
 * @property {string} externalUrl.required - A link to a page outside of this website for the business
 * @property {string} description.required - A description of the business
 * @property {string} bannerImage.required - A link to a banner image
 * @property {Array.<string>} gallery.required - An array of images to be used in a gallery
 * @property {Array.<string>} owners.required - An array of owner IDs
 * @property {Array.<string>} subscribers.required - An array of subscriber IDs
 */

/**
 * Retrieves and sends back all the businesses
 * @route GET /businesses
 * @returns {object} 200 - An object containing each business
 */
router.get('/businesses', wrap(getBusinesses));
/**
 * Retrieves and sends back all the businesses within in a certain category via ID
 * @route GET /businesses/{id}
 * @param {string} id.path.required - ID of the category to GET businesses by
 * @returns {object} 200 - An object containing each business
 */
router.get('/businesses/:category', wrap(getBusinessesByCategory));
/**
 * Retrieves and sends back a single business via ID
 * @route GET /business/{id}
 * @param {string} id.path.required - ID of the business to GET
 * @returns {Business.model} 200 - An object containing the information for the business
 * @returns {Error}  404 - Business with ID could not be found
 */
router.get('/business/:id', wrap(getBusinessById));
/**
 * Updates and sends back the new business via ID
 * @route PUT /business/{id}
 * @param {string} id.path.required - ID of the business to PUT
 * @param {object.model} update.body.required - The document updates
 * @returns {Business.model} 200 - An object containing the updated information for the business
 * @returns {Error}  404 - Business with ID could not be found
 * @security Bearer
 */
router.put('/business/:id', auth, wrap(updateBusinessById));
/**
 * Creates and sends back a new business from JSON in the req.body
 * @route POST /business
 * @param {NewBusiness.model} business.body.required - the business information
 * @returns {Business.model} 201 - An object containing the created business
 * @returns {Error} 500 - Business data was incorrect
 * @security Bearer
 */
router.post('/business', auth, wrap(createBusiness));
/**
 * Deletes and sends back, for the last time, a business via ID
 * @route DELETE /business/{id}
 * @param {string} id.path.required - ID of the business to delete
 * @returns {Business.model} 200 - An object containing the deleted businesses information
 * @returns {Error}  404 - Business with ID could not be found
 * @security Bearer
 */
router.delete('/business/:id', auth, wrap(deleteBusiness));

async function getBusinesses(req, res) {
  const record = await businesses.get();
  send(record, res);
}

async function getBusinessById(req, res) {
  const record = await businesses.get(req.params.id);
  verifyExists(record, req.params.id);
  send(record, res);
}

async function getBusinessesByCategory(req, res) {
  const record = await businesses.getByCategory(req.params.category);
  send(record, res);
}

async function authOwner(req) {
  const business = await businesses.get(req.params.id);
  verifyExists(business, req.params.id);
  const tokenData = jwt.decode(req.token);
  if (!business.owners.includes(tokenData.id) && tokenData.type !== 'admin') {
    throw get401();
  } 
}

async function updateBusinessById(req, res) {
  await authOwner(req);
  const record = await businesses.put(req.params.id, req.body);
  verifyExists(record, req.params.id);
  send(record, res);
}

async function createBusiness(req, res) {
  const tokenData = jwt.decode(req.token);
  if (tokenData.type !== 'admin') {
    throw get401();
  }
  const record = await businesses.post(req.body);
  send(record, res, 201);
}

async function deleteBusiness(req, res) {
  await authOwner(req);
  const record = await businesses.delete(req.params.id);
  verifyExists(record, req.params.id);
  send(record, res);
}

module.exports = router;