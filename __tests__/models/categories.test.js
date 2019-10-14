'use strict';
require('../supergoose');

const Users = require('../../src/models/user/user');
let users = new Users();

const Categories = require('../../src/models/category/category');
let categories = new Categories();

let testUser;

beforeAll(async () => {
  testUser = await users.post({
    username: 'Test User',
    password: 'password',
    email: 'email@gmail.com',
    phone: '555-555-5555',
  });
});

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

  it('can put() a category by id', async () => {
    let updatedCat = {
      name: 'Test Category Updated',
    }

    let record = await categories.put(catId, updatedCat);
    expect(record).toHaveProperty('_id', catId);
    expect(record).toHaveProperty('name', 'Test Category Updated');

  });

  it('can addSubscriber() to category', async () => {
    let record = await categories.addSubscriber(catId, testUser._id);
    let subscribersArray = [...record.subscribers];

    expect(record).toHaveProperty('_id', catId);
    expect(subscribersArray).toEqual([testUser._id]);    
  });

  //Tried adding unique and dropDups to categories schema, not preventing duplicates
  it('addSubscriber() does not add duplicate subscribers', async () => {
    let record = await categories.addSubscriber(catId, testUser._id);
    let subscribersArray = [...record.subscribers];

    expect(subscribersArray).toEqual([testUser._id]);
  });

});