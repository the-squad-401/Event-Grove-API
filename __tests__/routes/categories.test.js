'use strict';
const {server} = require('../../src/server');
const supergoose = require('../supergoose.js');
const mockRequest = supergoose(server);

const Categories = require('../../src/models/category/category');
const Model = require('../../src/routes/categories');

let categories = new Categories();

beforeAll(async () => {
  let testCategory = await categories.post({
    name: 'Test',
  });
  let otherTestCategory = await categories.post({
    name: 'Another Test',
  });
});

describe('Category routes', () => {
  let record;
  it('should post', async () => {
    let otherOtherTestCategory = { name: 'Yet Another Test' };
    await mockRequest
      .post('/category')
      .send(otherOtherTestCategory)
      .expect(201)
      .then(results => {
        record = results.body;
      });
  });
  it('should get', async () => {
    await mockRequest
      .get('/categories')
      .expect(200)
      .then(results => {
        expect(results.body.count).toBe(3);
      });
  });
  it('should update', async () => {
    await mockRequest
      .put(`/category/${record._id}`)
      .send({name: 'updated category'})
      .expect(200)
      .then(results => {
        expect(results.body.name).toBe('updated category');
      });
  });
  it('should delete', async () => {
    await mockRequest
      .delete(`/category/${record._id}`)
      .expect(200)
      .then(async (results) => {
        const deleted = results.body;
        expect(deleted.name).toBe('updated category');
        expect(deleted._id).toBe(record._id);
        await mockRequest
          .get(`/category/${record._id}`)
          .expect(404);
      });
  });
});