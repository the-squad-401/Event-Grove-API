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

let mockUser;
let mockUser2;
let mockUser3;
let mockBusiness;
let mockCategory;

beforeAll(async () => {
  mockUser = await users.post({
    username: 'jacob8468', 
    password: 'password', 
    email: 'jacob.wendt@yahoo.com',
    phone: '319-693-9955',
    usertype:'admin',
  });
  mockUser2 = await users.post({
    username: 'kevin8684', 
    password: 'password', 
    email: 'kevin.kent@yahoo.com', 
    phone: '319-983-9755',
    usertype:'user',
  });
  mockUser3 = await users.post({
    username: 'sally4868', 
    password: 'password', 
    email: 'sally.salmon@yahoo.com', 
    phone: '319-793-9865',
    usertype:'admin',
  });
  mockCategory = await categories.post({
    name: 'Test Category',
  });
  mockBusiness = await businesses.post({
    name: 'Iowa Brewing Companions',
    address: '1234 Iowa Blvd',
    hours: [{day: 'M-F', open: '9AM', close: '6pm'}],
    category: mockCategory._id,
    externalUrl: 'http://www.google.com',
    description: 'A test',
    bannerImage: 'http://www.google.com',
    gallery: ['http://www.google.com', 'http://www.google.com'],
  });

  await businesses.addSubscriber(mockBusiness._id, mockUser._id);
  await businesses.addSubscriber(mockBusiness._id, mockUser2._id);
  await categories.addSubscriber(mockCategory._id, mockUser._id);
  await categories.addSubscriber(mockCategory._id, mockUser2._id);
});

describe('API', () => {
  it('can get business subscribers', () => {
    return mockRequest
      .get(`/subscribers/business/${mockBusiness._id}`)
      .expect(200)
      .then( data => {
        expect(JSON.stringify(data.body)).toEqual(JSON.stringify([mockUser._id, mockUser2._id]));
      });
  });

  it('can get category subscribers', () => {
    return mockRequest
      .get(`/subscribers/category/${mockCategory._id}`)
      .expect(200)
      .then( data => {
        expect(JSON.stringify(data.body)).toEqual(JSON.stringify([mockUser._id, mockUser2._id]));
      });
  });

  it('can add a new subscriber to a business', async () => {
    await mockRequest
      .post(`/subscribers/business/${mockBusiness._id}`)
      .set('Authorization', `Bearer ${mockUser3.generateToken()}`)
      .expect(201)
      .expect(JSON.stringify([mockBusiness._id]));
  });

  it('can add a new subscriber to a category', async () => {
    await mockRequest
      .post(`/subscribers/category/${mockCategory._id}`)
      .set('Authorization', `Bearer ${mockUser3.generateToken()}`)
      .expect(201)
      .expect(JSON.stringify([mockUser._id, mockUser2._id, mockUser3._id]));
  });

  it('can remove a subscriber from a business', async () => {
    await mockRequest 
      .delete(`/subscribers/business/${mockBusiness._id}`)
      .set('Authorization', `Bearer ${mockUser3.generateToken()}`)
      .expect(200)
      .expect(JSON.stringify([]));
  });

  it('can remove a subscriber from a category', async () => {
    await mockRequest 
      .delete(`/subscribers/category/${mockCategory._id}`)
      .set('Authorization', `Bearer ${mockUser3.generateToken()}`)
      .expect(200)
      .expect(JSON.stringify([mockUser._id, mockUser2._id]));
  });
});