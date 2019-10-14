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

  async addSubscriber(catId, userId) {
    let category = await this.get(catId);
    category.subscribers.addToSet(userId); 
    return await category.save();
  }
}

module.exports = Categories;
