'use strict';

const express = require('express');
const router = express.Router();

const Businesses = require('../models/business/business');
const businesses = new Businesses();

router.get('/businesses', wrap(getBusinesses));
router.get('/business/:id', wrap(getBusinessById));
router.get('/businesses/:category', wrap(getBusinessesByCategory));
router.put('/business/:id', wrap(updateBusinessById));
router.post('/business', wrap(createBusiness));
router.delete('/business/:id', wrap(deleteBusiness));

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

/**
 * Retrieves and sends back all the businesses, optionally within in a certain category via ID
 * @route GET /businesses
 * @param {string} id.param.optional - ID of the category to GET businesses by
 * @returns {object} 200 - An object containing each business
 */
async function getBusinesses(req, res) {
  const record = await businesses.get();
  send(record, res);
}

/**
 * Retrieves and sends back a single business via ID
 * @route GET /business
 * @param {string} id.param.required - ID of the business to GET
 * @returns {object} 200 - An object containing the information for the business
 * @returns {Error}  404 - Business with ID could not be found
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

/**
 * Updates and sends back the new business via ID
 * @route PUT /business
 * @param {string} id.param.required - ID of the business to PUT
 * @returns {object} 200 - An object containing the updated information for the business
 * @returns {Error}  404 - Business with ID could not be found
 */
async function updateBusinessById(req, res) {
  const record = await businesses.put(req.params.id, req.body);
  verifyExists(record, req.params.id);
  send(record, res);
}

/**
 * Creates and sends back a new business from JSON in the req.body
 * @route POST /business
 * @returns {object} 201 - An object containing the created business
 */
async function createBusiness(req, res) {
  const record = await businesses.post(req.body);
  send(record, res, 201);
}

/**
 * Deletes and sends back, for the last time, a business via ID
 * @route DELETE /business
 * @returns {object} 200 - An object containing the deleted businesses information
 * @returns {Error}  404 - Business with ID could not be found
 */
async function deleteBusiness(req, res) {
  const record = await businesses.delete(req.params.id);
  verifyExists(record, req.params.id);
  send(record, res);
}

module.exports = router;