'use strict';
require('../supergoose');

const Users = require('../../src/models/user/user');
let users = new Users();

describe('User models', () => {
  let user1 = { username: 'jacob8468', password: 'password', email: 'jacob.wendt@yahoo.com', phone: '319-693-9955', };
  let user2 = { username: 'kevin8684', password: 'password', email: 'kevin.kent@yahoo.com', phone: '319-983-9755', };
  let user3 = { username: 'sally4868', password: 'password', email: 'sally.salmon@yahoo.com', phone: '319-793-9865', };

  it('should save a user', async () => {
    let record = await users.post(user1);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('username', 'jacob8468');
    expect(record).toHaveProperty('usertype', 'user');
  });
});