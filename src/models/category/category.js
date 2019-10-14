'use strict';

const Model = require('../mongo');
const schema = require('./category-schema');

class Categories extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = Categories;
