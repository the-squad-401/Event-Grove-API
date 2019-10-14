'use strict';
const { server } = require('../src/server');
const supergoose = require('./supergoose');
const mockRequest = supergoose(server);

const Users = require('../src/models/user/user');
let users = new Users();

describe('User models', () => {
  let user = {
    username: 'jacob8468',
    password: 'password',
    email: 'jacob.wendt@yahoo.com',
    phone: '319-693-9955', 
  };

  it('should save a user', async () => {
    let record = await users.post(user);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('username', 'jacob8468');
    expect(record).toHaveProperty('usertype', 'user');
  });
});