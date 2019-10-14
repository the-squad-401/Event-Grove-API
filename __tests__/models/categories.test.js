'use strict';
require('../supergoose');

const Categories = require('../../src/models/category/category');
let categories = new Categories();

describe('Category models', () => {
  let category = {
    name: 'Test Category',
  };

  let catId;

  it('can post() a category', async () => {
    let record = await categories.post(category);
    catId = record._id;
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('name', 'Test Category');
    expect(record).toHaveProperty('subscribers');
  });

  it('can get() a category by id', async () => {
    let record = await categories.get(catId);
    expect(record).toHaveProperty('name', 'Test Category');

  });

  it('can getByName() a category by name', async () => {
    let record = await categories.getByName('Test Category');
    expect(record).toHaveProperty('name', 'Test Category');
    expect(record).toHaveProperty('_id', catId);
  });
});