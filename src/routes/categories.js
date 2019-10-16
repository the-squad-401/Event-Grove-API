'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const auth = require('../auth/auth-middleware');
const Model = require('../models/category/category');
const modelRepository = new Model();

router.get('/categories', wrap(handleGet));
router.post('/category', auth, wrap(handlePost));
router.put('/category/:id', auth, wrap(handlePut));
router.delete('/category/:id', auth, wrap(handleDelete));

/**
* @typedef category
* @property {string} name.required - name of the category
*/

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
  const error = new Error(`No category found with id: ${id}`);
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
 * get all categories
 * @route get /categories
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {object} 200 - OK 
 * @returns {error} 500 - Internal Server Error
 */
async function handleGet(req, res, next) {
  let record = await modelRepository.get();
  send(record, res);
}

/**
 * post a new category
 * @route POST /category
 * @param {category.model} name.body.required - name of the category
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {object} 201 - category created 
 * @returns {error} 500 - Internal Server Error
 */
async function handlePost(req, res, next) {
  verifyAdmin(req);
  let record = await modelRepository.post(req.body);
  send(record, res, 201);
}

/**
 * update a category
 * @route PUT /category/{id}
 * @param {category.model} id.path.required - id of the desired category
 * @param {category.model} name.body.required - new name of the category
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {object} 200 - OK
 * @returns {error} 500 - Internal Server Error
 */
async function handlePut(req, res, next) {
  verifyAdmin(req);
  const record = await modelRepository.put(req.params.id, req.body);
  verifyExists(record, req.params.id);
  send(record, res);
}

/**
 * delete a category
 * @route DELETE /category/{id}
 * @param {category.model} id.path.required - id of the desired category
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {object} 200 - OK
 * @returns {error} 500 - Internal Server Error
 */
async function handleDelete(req, res, next) {
  verifyAdmin(req);
  let record = await modelRepository.delete(req.params.id);
  verifyExists(record, req.params.id);
  send(record, res);
}

function get401() {
  const error = new Error('You are not authorized to do this action');
  error.status = 401;
  return error;
}

function verifyAdmin(req) {
  const tokenData = jwt.decode(req.token);
  if (tokenData.type !== 'admin') {
    throw get401();
  }
}

module.exports = router;