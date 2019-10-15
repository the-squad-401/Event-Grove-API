'use strict';

const Model = require('../mongo');
const schema = require('./business-schema');

class Businesses extends Model {
  constructor() {
    super(schema);
  }

  /**
   * Gets a business by name
   * @param {String} businessName 
   */
  async getByName(businessName) {
    return await this.schema.findOne({name: businessName});
  }

  /**
   * Adds a subscriber to a business' subscriber pool
   * @param {*} businessId 
   * @param {*} userId 
   */
  async addSubscriber(businessId, userId) {
    let business = await this.get(businessId);
    business.subscribers.addToSet(userId);
    return await business.save();
  }

  /**
   * Removes a subscriber from a business' subscriber pool
   * @param {*} businessId 
   * @param {*} userId 
   */
  async removeSubscriber(businessId, userId) {
    let business = await this.get(businessId);
    business.subscribers.pull(userId);
    return await business.save();
  }
}

module.exports = Businesses;
