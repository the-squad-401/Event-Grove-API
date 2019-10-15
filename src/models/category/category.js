'use strict';

const Model = require('../mongo');
const schema = require('./category-schema');

class Categories extends Model {
  constructor() {
    super(schema);
  }

  /**
   * Returns the category by the category name
   * @param {*} name - Name of the category to be returned
   */
  async getByName(name) {
    return await this.schema.findOne({name: name});
  }

  /**
   * Adds the userId to the provided category
   * @param {*} catId - The category to be subscribed to
   * @param {*} userId - The user id to be added 
   */
  async addSubscriber(catId, userId) {
    let category = await this.get(catId);
    category.subscribers.addToSet(userId); 
    return await category.save();
  }

  /**
   * Removes the userId from the provided category
   * @param {*} catId - Category to be removed from
   * @param {*} userId - The user id to be removed
   */
  async removeSubscriber(catId, userId) {
    let category = await this.get(catId);
    category.subscribers.pull(userId);
    return await category.save();
  }
}

module.exports = Categories;
