'use strict';

const {server} = require('../../src/server');
const supergoose = require('../supergoose.js');
const mockRequest = supergoose(server);

const Categories = require('../../src/models/category/category');
let categories = new Categories();

const router = require('../../src/routes/categories');


describe('Category routes', () => {
  it('should post', async () => {
    let category = { name: 'Test Category' };
    await mockRequest
      .post('/category')
      .send(category)
      .expect(201);
  });
});