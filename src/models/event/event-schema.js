'use strict';

const mongoose = require('mongoose');

const events = mongoose.Schema({
  business: {type: mongoose.Schema.Types.ObjectId, ref: 'Businesses'},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Categories'},
  name: {type: String, required: true},
  description: {type: String, required: true},
  startDate: {type: Number, required: true}, // Epoch num
  endDate: {type: Number, required: true}, // Epoch num
  image: {type: String, required: false},
});

module.exports = mongoose.model('events ', events);
