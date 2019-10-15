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
let mockBusiness;
let mockCategory;

beforeAll(async () => {
  
});

describe('API', () => {
  it('can get business subscribers', () => {

  });

  it('can get category subscribers', () => {

  });
});