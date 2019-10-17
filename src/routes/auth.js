'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('../models/user/user');
const auth = require('../auth/auth-middleware');

/**
 * @typedef NewUser
 * @property {string} username.required - Username
 * @property {string} password.required - Users Password
 * @property {string} email.required - Users Email
 * @property {string} phone.required - Users Phone Number
 * @property {string} usertype.required - User Type ('user' or 'admin')
 */

/**
 * Creates a new user
 * @route POST /signup
 * @param {NewUser.model} user.body.required - The user information
 * @returns {string} 200 - Bearer token used for authentication
 * @returns {Error} 500 - Error signing up
 */
authRouter.post('/signup', (req, res, next) => {
  let user = new User();
  user.post(req.body)
    .then((user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

/**
 * Logs in an existing user
 * @route POST /signin
 * @returns {string} 200 - Bearer token used for authentication
 * @returns {string} 401 - Invalid Login Credentials
 * @security Basic
 */
authRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

module.exports = authRouter;
