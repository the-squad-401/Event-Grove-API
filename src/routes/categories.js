'use strict';

const express = require('express');
const router = express.Router();

const Model = require('../models/category/category');
const modelRepository = new Model();

router.get('/categories', handleGet);
router.post('/category', handlePost);
router.put('/category/:id', handlePut);
router.delete('/category/:id', handleDelete);

/**
 * Creates an error with a 404 status
 * @param {String} id the id of the category that could not be found.
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
function sendRecord(record, id, res, next) {
  if (!record) {
    next(get404(id));
  } else {
    res.status(200).json(record);
  }
}

/**
 * Retrieves and sends back all categories
 * @route GET /categories
 * @returns {object} 200 - An object containing each category, and count
 * @returns {Error} 500 - Unforseen difficulties.
 */
async function handleGet(req, res, next) {
  res.status(200).json(await modelRepository.get());
}

/**
 * Retrieves and sends back a category based on id
 * @route GET /categories/:id
 * @returns {object} 200 - An object containing each category, and count
 * @returns {Error} 500 - Unforseen difficulties.
 */
async function handlePost(req, res, next) {
  try {
    let record = await modelRepository.post(req.body);
    res.status(201).send(record);
  } catch (error) {
    next(error);
  }
}

/**
 * Updates and sends back the new category via ID
 * @param {Request} req the Express Request
 * @param {Response} res the Express Response
 */
async function handlePut(req, res, next) {
  const record = await modelRepository.put(req.params.id, req.body);
  sendRecord(record, req.params.id, res, next);
}

/**
 * This function comment is parsed by doctrine
 * @route DELETE /category/:id
 * 
 * @param {string} id.param.required - ID of the category to DELETE
 * @param {Response} res the Express Response
 * 
 * @returns {object} 200 - An object containing the information for the category
 * @returns {Error}  404 - Category with ID could not be found
 * @returns {Error}  500 - Unforseen consequences
 */
async function handleDelete(req, res, next) {
  let record = await modelRepository.delete(req.params.id);
  sendRecord(record, req.params.id, res, next);
}

module.exports = router;