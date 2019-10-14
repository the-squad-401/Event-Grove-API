'use strict';
const { server } = require('../src/server');
const supergoose = require('./supergoose');
const mockRequest = supergoose(server);

const Businesses = require('../src/models/business/business');
let businesses = new Businesses();

describe('User models', () => {
  let business = {
    username: 'jacob8468',
    password: 'password',
    email: 'jacob.wendt@yahoo.com',
    phone: '319-693-9955', 
  };

  it('should save a user', async () => {
    let record = await businesses.post(business);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('username', 'jacob8468');
    expect(record).toHaveProperty('usertype', 'user');
  });
});