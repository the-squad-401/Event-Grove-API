'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const auth = require('../auth/auth-middleware');
const Model = require('../models/category/category');
const modelRepository = new Model();

const { wrap, get401, verifyExists, send } = require('../route-helpers');

/**
 * post a new category
 * @route POST /category
 * @group Categories
 * @param {category.model} name.body.required - name of the category
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {object} 201 - category created 
 * @returns {error} 500 - Internal Server Error
 * @security Bearer
 */
router.post('/category', auth, wrap(handlePost));

/**
 * get all categories
 * @route get /categories
 * @group Categories
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {object} 200 - OK 
 * @returns {error} 500 - Internal Server Error
 */
router.get('/categories', wrap(handleGet));

/**
 * update a category
 * @route PUT /category/{id}
 * @group Categories
 * @param {category.model} id.path.required - id of the desired category
 * @param {category.model} name.body.required - new name of the category
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {object} 200 - OK
 * @returns {error} 500 - Internal Server Error
 * @security Bearer
 */
router.put('/category/:id', auth, wrap(handlePut));

/**
 * delete a category
 * @route DELETE /category/{id}
 * @group Categories
 * @param {category.model} id.path.required - id of the desired category
 * @produces application/json application/xml
 * @consumes application/json application/xml
 * @returns {object} 200 - OK
 * @returns {error} 500 - Internal Server Error
 * @security Bearer
 */
router.delete('/category/:id', auth, wrap(handleDelete));

/**
* @typedef category
* @property {string} name.required - name of the category
*/

async function handleGet(req, res) {
  let record = await modelRepository.get();
  send(record, res);
}

async function handlePost(req, res) {
  verifyAdmin(req);
  let record = await modelRepository.post(req.body);
  send(record, res, 201);
}

async function handlePut(req, res) {
  verifyAdmin(req);
  const record = await modelRepository.put(req.params.id, req.body);
  verifyExists(record, req.params.id);
  send(record, res);
}

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