'use strict';
const { server } = require('../../src/server');
const supergoose = require('../supergoose');
const mockRequest = supergoose(server);

const Categories = require('../../src/models/category/category');
const Users = require('../../src/models/user/user');
let categories = new Categories();
let users = new Users();

let testCategory;
let testUser;

beforeAll(async () => {
  testCategory = await categories.post({
    name: 'Test',
  });
  testUser = await users.post({ username: 'jacob8468', password: 'password', email: 'jacob.wendt@yahoo.com', phone: '319-693-9955'});
});

describe('Business Routes', () => {

  it('POST /business creates a new business', () => {
    return mockRequest
      .post('/business')
      .send({
        name: 'Iowa Brewing Companions',
        address: '1234 Iowa Blvd',
        hours: [{day: 'M-F', open: '9AM', close: '6pm'}],
        category: testCategory._id,
        externalUrl: 'http://www.google.com',
        description: 'A test',
        bannerImage: 'http://www.google.com',
        gallery: ['http://www.google.com', 'http://www.google.com'],
      })
      .expect(201);
  });

  it('GET /businesses returns all businesses', () => {
    return mockRequest
      .get('/businesses')
      .expect(200)
      .then(results => {
        console.log(results.body);
      });
  });
});