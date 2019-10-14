'use strict';

const Model = require('../mongo');
const schema = require('./business-schema');

class Businesses extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = Businesses;
