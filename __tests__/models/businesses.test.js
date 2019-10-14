'use strict';

require('../supergoose');

const Businesses = require('../../src/models/business/business');
const Categories = require('../../src/models/category/category');

let businesses = new Businesses();
let categories = new Categories();

let testCategory;
beforeAll(async () => {
  testCategory = await categories.post({
    name: 'Test',
  });
  console.log(testCategory);
});

describe('Business models', () => {
  it('can post a business', async () => {
    let business = {
      name: 'Iowa Brewing Companions',
      address: '1234 Iowa Blvd',
      hours: [{day: 'M-F', open: '9AM', close: '6pm'}],
      category: testCategory._id,
      externalUrl: 'http://www.google.com',
      description: 'A test',
      bannerImage: 'http://www.google.com',
      gallery: ['http://www.google.com', 'http://www.google.com'],
    };
    let record = await businesses.post(business);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('subscribers');
    for (const key in business) {
      expect(record).toHaveProperty(key);
    }
    console.log(record);
  });

  
});