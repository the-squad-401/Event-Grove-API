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
 * @typedef category
 * @property {string} name.required - name of the category
 */

function get404(id) {
  const error = new Error(`No category found with id: ${id}`);
  error.status = 404;
  return error;
}

function sendRecord(record, id, res, next) {
  if (!record) {
    next(get404(id));
  } else {
    res.status(200).json(record);
  }
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
  res.status(200).json(await modelRepository.get());
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
  try {
    let record = await modelRepository.post(req.body);
    res.status(201).send(record);
  } catch (error) {
    next(error);
  }
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
  const record = await modelRepository.put(req.params.id, req.body);
  sendRecord(record, req.params.id, res, next);
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
  let record = await modelRepository.delete(req.params.id);
  sendRecord(record, req.params.id, res, next);
}

module.exports = router;