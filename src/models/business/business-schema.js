'use strict';

const mongoose = require('mongoose');

const businesses = mongoose.Schema({
  name: {type: String, required: true},
  owner: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
  address: {type: String, required: true},
  hours: [{day: String, start: String, close: String, required: true}],
  category: {type: Number, required: true},
  externalUrl: {type: String, required: false},
  description: {type: String, required: true},
  bannerImage: {type: String, required: true},
  gallery: [{type: String, required: true}],
  subscribers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
});

module.exports = mongoose.model('Businesses ', businesses);
