'use strict';

const Model = require('../mongo.js');
const schema = require('./event-schema.js');

// How can we connect ourselves to the mongo interface?
// What do we export?

class Events extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = exports = Events;