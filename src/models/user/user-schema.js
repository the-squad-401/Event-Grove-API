'use strict';

const mongoose = require('mongoose');

const users = mongoose.schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  usertype: { type: Number, required: true },
});

module.exports = mongoose.model('users ', users);  
