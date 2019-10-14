'use strict';

const Model = require('../mongo');
const schema = require('./business-schema');

class Businesses extends Model {
  constructor() {
    super(schema);
  }

  async addSubscriber(businessId, userId) {
    let business = await this.get(businessId);
    business.subscribers.addToSet(userId);
    return await business.save();
  }

  async removeSubscriber(businessId, userId) {
    let business = await this.get(businessId);
    business.subscribers.pull(userId);
    return await business.save();
  }
}

module.exports = Businesses;
