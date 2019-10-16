'use strict';

require('../supergoose');
const auth = require('../../src/auth/auth-middleware');
const Users = require('../../src/models/user/user');

let users = {
  admin: {username: 'admin', password: 'password', email: 'admin@xyz.com', phone: '555-555-5555', usertype: 'admin'},
  user: {username: 'user', password: 'password', email: 'user@xyz.com', phone: '555-555-5555', usertype: 'user'},
};

beforeAll(async () => {
  const admin = await new Users(users.admin).save();
  const user = await new Users(users.user).save();
});

describe('Auth middleware', () => {

  // admin:foo: YWRtaW46Zm9v
  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // user:password: dXNlcjpwYXNzd29yZA==
  
  let errorMessage = 'Invalid Login Credentials';

  describe('user authentication', () => {
    let savedToken;

    it('fails for incorrect basic credentials', () => {
      let req = {
        headers: {
          authorization: 'Basic YWRtaW46Zm9v',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth();

      return middleware(req, res, next)
        .then(() => {
          expect(401);
        });
        
    });
  });
});