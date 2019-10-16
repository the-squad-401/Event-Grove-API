'use strict';

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const auth = require('../auth/auth-middleware');

const Businesses = require('../models/business/business');
const businesses = new Businesses();

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
 * @property {Array.<Hours>} - Business hours
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
 * @property {Array.<Hours>} - Business hours
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
 * @param {object} update.body.required - The document updates
 * @returns {Business.model} 200 - An object containing the updated information for the business
 * @returns {Error}  404 - Business with ID could not be found
 */
router.put('/business/:id', auth, wrap(updateBusinessById));
/**
 * Creates and sends back a new business from JSON in the req.body
 * @route POST /business
 * @param {NewBusiness.model} business.body.required - the business information
 * @returns {Business.model} 201 - An object containing the created business
 * @returns {Error} 500 - Business data was incorrect
 */
router.post('/business', auth, wrap(createBusiness));
/**
 * Deletes and sends back, for the last time, a business via ID
 * @route DELETE /business/{id}
 * @param {string} id.path.required - ID of the business to delete
 * @returns {Business.model} 200 - An object containing the deleted businesses information
 * @returns {Error}  404 - Business with ID could not be found
 */
router.delete('/business/:id', auth, wrap(deleteBusiness));

/**
 * Wraps a route callback with a try/catch, which passes on uncaught errors to be properly handled
 * @param {Function} route the route to be wrapped
 */
function wrap(route) {
  return async (req, res, next) => {
    try {
      await route(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Creates an error with a 404 status
 * @param {String} id the id of the business that could not be found.
 */
function get404(id) {
  const error = new Error(`No business found with id: ${id}`);
  error.status = 404;
  return error;
}

function get401() {
  const error = new Error('You are not authorized to do this action');
  error.status = 401;
  return error;
}

/**
 * Checks if the record was found, and throws a 404 error if not
 * @param {Object} record the record to verify
 * @param {String} id the id of the record (for the 404)
 */
function verifyExists(record, id) {
  if (!record) {
    throw get404(id);
  }
}

/**
 * Sends a record to a response, with a default status of 200
 * @param {Object} record the record
 * @param {Response} res the Express Response
 * @param {Number} status a status code (200 by default)
 */
function send(record, res, status = 200) {
  res.status(status).json(record);
}

async function getBusinesses(req, res) {
  const record = await businesses.get();
  send(record, res);
}

/**
 * Retrieves and sends back a single business via ID
 * @route GET /business/{id}
 * @param {string} id.path.required - ID of the business to GET
 * @returns {object} 200 - An object containing the information for the business
 * @returns {Error}  404 - Business with ID could not be found
 * @returns {Error}  500 - Unforseen consequences
 */
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