'use strict';

const mongoose = require('mongoose');
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
   * @param {mongoose.Schema.Types.ObjectId} businessId 
   * @param {mongoose.Schema.Types.ObjectId} userId 
   */
  async addSubscriber(businessId, userId) {
    let business = await this.get(businessId);
    business.subscribers.addToSet(userId);
    return await business.save();
  }

  /**
   * Removes a subscriber from a business' subscriber pool
   * @param {mongoose.Schema.Types.ObjectId} businessId 
   * @param {mongoose.Schema.Types.ObjectId} userId 
   */
  async removeSubscriber(businessId, userId) {
    let business = await this.get(businessId);
    business.subscribers.pull(userId);
    return await business.save();
  }
}

module.exports = Businesses;
