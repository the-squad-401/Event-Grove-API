'use strict';

const mongoose = require('mongoose');

const Users = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  usertype: { type: String, required: true, enum: ['user', 'admin'], default: 'user'},
});

module.exports = mongoose.model('Users ', Users);  
