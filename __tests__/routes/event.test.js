'use strict';

const {server} = require('../../src/server');
const supergoose = require('../supergoose');
const mockRequest = supergoose(server);

const Businesses = require('../../src/models/business/business');
const Categories = require('../../src/models/category/category');

let businesses = new Businesses();
let categories = new Categories();

let mockBiz;
let mockCategory;

beforeAll(async () => {
  mockCategory = await categories.post({
    name: 'Test',
  });
  mockBiz = await businesses.post({
    name: 'Bobs Building Company',
    address: '666 no st.',
    hours: [{day: 'M-T', open: '1AM', close: '130AM'}],
    category: mockCategory._id,
    externalUrl: 'http://www.askjeeves.com',
    description: 'Can we build it? Perhaps.',
    bannerImage: 'http://www.christianmingle.com',
    gallery: ['http://www.hellokitty.org', 'http://www.mario.com'],
  });
});

describe('event route', () => {
  let event;
  let record;
  it('POST /events creates a new event', async () => {
    event = {
      business: mockBiz._id,
      category: mockCategory._id,
      name: 'test name',
      description: 'description',
      startDate: Date.now(), // Epoch num
      endDate: Date.now(), // Epoch num
      image: 'cornyimg.com',
    };
    await mockRequest
      .post('/events')
      .send(event)
      .expect(201)
      .then(results => {
        record = results.body;
        expect(results.body).toHaveProperty('_id');
      });
  });
  it('GET /events returns all events', async () => {
    await mockRequest
      .get('/events')
      .expect(200)
      .then(results => {
        expect(results.body.count).toBe(1);
        for (const key in event) {
          expect(JSON.stringify(results.body.results[0][key])).toBe(JSON.stringify(event[key]));
        }
      });
  });
  it('GET /events/:id returns an event, given an id', async () => {
    await mockRequest
      .get(`/events/${record._id}`)
      .expect(200)
      .then(results => {
        expect(results.body._id).toBe(record._id);
        for (const key in event) {
          expect(JSON.stringify(results.body[key])).toBe(JSON.stringify(event[key]));
        } 
      });
  });
  it('PUT /events/:id updates an existing event', async () => {
    await mockRequest
      .put(`/events/${record._id}`)
      .send({description: 'updated'})
      .expect(200)
      .then(results => {
        expect(results.body.description).toBe('updated');
      });
  });
  it('DELETE /events/:id deletes an event', async () => {
    event.description = 'updated';
    await mockRequest
      .delete(`/events/${record._id}`)
      .then(async (results) => {
        expect(results.body._id).toBe(record._id);
        for (const key in event) {
          expect(JSON.stringify(results.body[key])).toBe(JSON.stringify(event[key]));
        }
      });
  });
  it('GET /events/:id throws 404 if ID not found', async () => {
    await mockRequest
      .get(`/events/${record._id}`)
      .expect(404);
  });
  it('DELETE /events/:id throws 404 if ID not found', async () => {
    await mockRequest
      .delete(`/events/${record._id}`)
      .expect(404);
  });
  
  it('/PUT /events/:id will respond with a 404 if ID not found', async () => {
    await mockRequest
      .put(`/events/${record._id}`)
      .expect(404);
  });
});
