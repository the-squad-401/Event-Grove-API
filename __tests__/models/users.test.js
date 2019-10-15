'use strict';
require('../supergoose');

const Users = require('../../src/models/user/user');
let users = new Users();

describe('User models', () => {
  let user1 = { username: 'jacob8468', password: 'password', email: 'jacob.wendt@yahoo.com', phone: '319-693-9955' };
  let user2 = { username: 'kevin8684', password: 'password', email: 'kevin.kent@yahoo.com', phone: '319-983-9755' };
  let user3 = { username: 'sally4868', password: 'password', email: 'sally.salmon@yahoo.com', phone: '319-793-9865' };

  let userId;

  it('should save a user', async () => {
    let record = await users.post(user1);
    userId = record._id;
    
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('username', 'jacob8468');
    expect(record).toHaveProperty('usertype', 'user');
  });

  it('should get a user by id', async () => {
    let record = await users.post(user2);
    let getById = await users.get(record._id);

    expect(getById).toHaveProperty('id');
  });

  it('should get all users if no id given', async () => {
    await users.post(user3);
    let get = await users.get();

    expect(get.count).toEqual(3);
  });

  it('should update a user', async () => {
    let lookup = await users.get(userId);

    expect(lookup).toHaveProperty('username', 'jacob8468');

    let updatedUser = {
      username: 'jake8468',
    };
    let update = await users.put(userId, updatedUser);

    expect(update).toHaveProperty('username', 'jake8468');  
  });
});