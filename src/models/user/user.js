'use strict';

const Model = require('../mongo');
const schema = require('./user-schema');

class Users extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = Users;
