'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const auth = require('../auth/auth-middleware');
const Model = require('../models/category/category');
const modelRepository = new Model();

const { wrap, get401, verifyExists, send } = require('../route-helpers');

router.get('/categories', wrap(handleGet));
router.post('/category', auth, wrap(handlePost));
router.put('/category/:id', auth, wrap(handlePut));
router.delete('/category/:id', auth, wrap(handleDelete));

/**
* @typedef category
* @property {string} name.required - name of the category
*/

/**
 * get all categories
 * @route get /categories
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {object} 200 - OK 
 * @returns {error} 500 - Internal Server Error
 */
async function handleGet(req, res) {
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
async function handlePost(req, res) {
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
async function handlePut(req, res) {
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
async function handleDelete(req, res) {
  verifyAdmin(req);
  let record = await modelRepository.delete(req.params.id);
  verifyExists(record, req.params.id);
  send(record, res);
}

function verifyAdmin(req) {
  const tokenData = jwt.decode(req.token);
  if (tokenData.type !== 'admin') {
    throw get401();
  }
}

module.exports = router;