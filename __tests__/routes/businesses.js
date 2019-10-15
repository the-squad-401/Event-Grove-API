'use strict';
const { server } = require('../../src/server');
const supergoose = require('../supergoose');
const mockRequest = supergoose(server);

const Businesses = require('../../src/models/business/business');
const Categories = require('../../src/models/category/category');
const Users = require('../../src/models/user/user');

let businesses = new Businesses();
let categories = new Categories();
let users = new Users();

let testCategory;
let otherTestCategory;

beforeAll(async () => {
  testCategory = await categories.post({
    name: 'Test',
  });
  otherTestCategory = await categories.post({
    name: 'Another Test',
  });
  await businesses.post({
    name: 'Mapped Room',
    address: '1234 Iowa Blvd',
    category: testCategory._id,
    hours: [{day: 'M-F', open: '9AM', close: '6pm'}],
    externalUrl: 'http://www.google.com',
    description: 'A test',
    bannerImage: 'http://www.google.com',
    gallery: ['http://www.google.com', 'http://www.google.com'],
  });
  await businesses.post({
    name: 'Parlor Metropolis',
    address: '1234 Iowa Blvd',
    category: otherTestCategory._id,
    hours: [{day: 'M-F', open: '9AM', close: '6pm'}],
    externalUrl: 'http://www.google.com',
    description: 'A test',
    bannerImage: 'http://www.google.com',
    gallery: ['http://www.google.com', 'http://www.google.com'],
  });
});

describe('Business Routes', () => {
  const bidness = {
    name: 'Iowa Brewing Companions',
    address: '1234 Iowa Blvd',
    hours: [{day: 'M-F', open: '9AM', close: '6pm'}],
    externalUrl: 'http://www.google.com',
    description: 'A test',
    bannerImage: 'http://www.google.com',
    gallery: ['http://www.google.com', 'http://www.google.com'],
  };

  let record;

  //TODO Add authorization (Admin)
  it('POST /business creates a new business', async () => {
    bidness.category = testCategory._id; //Setting it here, since it's undefined until this point.
    await mockRequest
      .post('/business')
      .send(bidness)
      .expect(201)
      .then(results => {
        record = results.body;
      });
  });

  it('GET /businesses returns all businesses', async () => {
    await mockRequest
      .get('/businesses')
      .expect(200)
      .then(results => {
        expect(results.body.count).toBe(3);
        let added;
        for (const result of results.body.results) {
          if (result.name === 'Iowa Brewing Companions') {
            added = result;
            break;
          }
        }
        expect(added).toBeTruthy();
        for (const key in bidness) {
          if (key === 'hours') {
            continue; // Hard to test hours, since they get a _id added to them
          }
          expect(JSON.stringify(added[key])).toBe(JSON.stringify(bidness[key]));
        }
      });
  });

  it('GET /business/:id returns a single business by id', async () => {
    expect(record._id).toBeTruthy();
    await mockRequest
      .get(`/business/${record._id}`)
      .expect(200)
      .then(results => {
        console.log(results.body);
        for (const key in bidness) {
          if (key === 'hours') {
            continue; // Hard to test hours, since they get a _id added to them
          }
          expect(JSON.stringify(results.body[key])).toBe(JSON.stringify(bidness[key]));
        }
      });
  });

  it('GET /businesses/:category returns all businesses under that category', async () => {
    await mockRequest
      .get(`/businesses/${testCategory._id}`)
      .expect(200)
      .then(results => {
        expect(results.body.length).toBe(2);
      });
  });

  //TODO Add authorization (Owner/Admin)
  it('PUT /business/:id updates a business', async () => {
    await mockRequest
      .put(`/business/${record._id}`)
      .send({description: 'Updated'})
      .expect(200)
      .then(results => {
        expect(results.body.description).toBe('Updated');
      });
  });

  //TODO Add authorization (Owner/Admin)
  it('DELETE /business/:id deletes a busines by id', async () => {
    await mockRequest
      .delete(`/business/${record._id}`)
      .expect(200)
      .then(async (results) => {
        const deleted = results.body;
        expect(deleted.name).toBe('Iowa Brewing Companions');
        expect(deleted._id).toBe(record._id);
        await mockRequest
          .get(`/business/${record._id}`)
          .expect(404);
      });
  });

  it('PUT /business/:id responds with 404 if business not found', async () => {
    await mockRequest
      .put(`/business/${record._id}`)
      .send({description: 'Updated'})
      .expect(404);
  });

  it('GET /business/:id responds with 404 if business not found', async () => {
    await mockRequest
      .get(`/business/${record._id}`)
      .expect(404);
  });

  it('DELETE /business/:id responds with 404 if business not found', async () => {
    await mockRequest
      .delete(`/business/${record._id}`)
      .expect(404);
  });
});