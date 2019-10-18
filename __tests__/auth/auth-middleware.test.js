'use strict';

require('../supergoose');
const auth = require('../../src/auth/auth-middleware');
const Users = require('../../src/models/user/user');
const usersModel = new Users();

let users = {
  admin: {username: 'admin', password: 'password', email: 'admin@xyz.com', phone: '555-555-5555', usertype: 'admin'},
  user: {username: 'user', password: 'password', email: 'user@xyz.com', phone: '555-555-5555', usertype: 'user'},
};

beforeAll(async () => {
  await usersModel.post(users.admin);
  await usersModel.post(users.user);
});

describe('Auth middleware', () => {

  //Invalid Login - admin:foo: YWRtaW46Zm9v
  //Valid Login - admin:password: YWRtaW46cGFzc3dvcmQ=
  //Valid Login - user:password: dXNlcjpwYXNzd29yZA==

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
      let middleware = auth;

      return middleware(req, res, next)
        .then(() => {
          expect(401);
        }).catch(console.error);
        
    });

    it('logs in user with correct basic credentials', () => {
      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth;

      return middleware(req, res, next)
        .then( () => {
          savedToken = req.token;
          expect(next).toHaveBeenCalledWith();
        });

    });

    it('fails for incorrect bearer token', async () => {
      let req = {
        headers: {
          authorization: 'Bearer foo',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth;

      await middleware(req, res, next);
      expect(next).toHaveBeenCalledWith({ status: 401, message: 'Invalid Login Credentials' });
    });

    it('logs in with correct bearer token', async () => {
      let req = {
        headers: {
          authorization: `Bearer ${savedToken}`,
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth;

      await middleware(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });



  });
});