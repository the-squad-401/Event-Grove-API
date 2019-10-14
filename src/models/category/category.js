'use strict';

const Model = require('../mongo');
const schema = require('./category-schema');

class Categories extends Model {
  constructor() {
    super(schema);
  }

  async getByName(name) {
    return await this.schema.findOne({name: name});
  }
}

module.exports = Categories;
