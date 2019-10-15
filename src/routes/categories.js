'use strict';

const express = require('express');
const router = express.Router();

const Model = require('../models/category/category');
const modelRepository = new Model();

var mongoose = require('mongoose');

router.get('/categories', handleGet);
router.post('/category', handlePost);
// categories.put('/category', handlePut);
// categories.delete('/category', handleDelete);

async function handleGet(req, res, next) {
  let findAll = await router.find();
  res.status(200).json(findAll);
}

async function handlePost(req, res, next) {
  modelRepository
    .post(req.body)
    .then(newCategory => {
      res.status(201)
        .send(newCategory);
    });
}

module.exports = router;