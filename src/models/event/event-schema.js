'use strict';

const mongoose = require('mongoose');

const events = mongoose.Schema({
  business: {type: mongoose.Schema.Types.ObjectId, ref: 'Businesses'},
  name: {type: String, required: true},
  description: {type: String, required: true},
  startDate: {type: Date, required: true},
  endDate: {type: Date, required: true},
  image: {type: String, required: false},
});

module.exports = mongoose.model('events ', events);
