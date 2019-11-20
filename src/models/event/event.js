'use strict';

const Model = require('../mongo.js');
const schema = require('./event-schema.js');

// How can we connect ourselves to the mongo interface?
// What do we export?

class Events extends Model {
  constructor() {
    super(schema);
  }

  /**
   * Gets all events sharing a category ID
   * @param {String} categoryId 
   */
  async getByCategory(categoryId) {
    return await this.schema.find({category: categoryId});
  }

  /**
   * Gets all events sharing a business ID
   * @param {String} businessId
   */
  async getByBusiness(businessId) {
    return await this.schema.find({business: businessId});
  }
}

module.exports = exports = Events;