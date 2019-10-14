'use strict';

const Model = require('../mongo.js');
const schema = require('./subscription-schema.js');

// How can we connect ourselves to the mongo interface?
// What do we export?

class Subscriptions extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = exports = Subscriptions;