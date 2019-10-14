'use strict';
require('../supergoose');

const Businesses = require('../../src/models/business/business');
const Categories = require('../../src/models/category/category');
let businesses = new Businesses();
let categories = new Categories();

const Events = require('../../src/models/event/event');
let events = new Events();

let testCategory, business;

beforeAll(async () => {
  testCategory = await categories.post({
    name: 'Test',
  });
  
  business = await businesses.post({
    name: 'Iowa Brewing Companions',
    address: '1234 Iowa Blvd',
    hours: [{day: 'M-F', open: '9AM', close: '6pm'}],
    category: testCategory._id,
    externalUrl: 'http://www.google.com',
    description: 'A test',
    bannerImage: 'http://www.google.com',
    gallery: ['http://www.google.com', 'http://www.google.com'],    
  });
});

describe('Events models', () => {
  it('can save an event', async () => {
    let event = {
      business: business._id,
      name: 'Going out of business event',
      description: 'We lost all our money, so come get some free stuff',
      startDate: Date.now(),
      endDate: Date.now(),
      image: 'http://www.google.com',
    };
    
    let record = await events.post(event);
    expect(record).toHaveProperty('_id');
    for (const key in event) {
      expect(record).toHaveProperty(key, event[key]);
    }
  });
});