'use strict';

const mongoose = require('mongoose');

const businesses = mongoose.Schema({
  name: { type: String, required: true },
  owners: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], default: []},
  address: { type: String, required: true },
  hours: { type: [{ day: { type: String, required: true}, open: { type: String, required: true}, close: { type: String, required: true } }], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },
  externalUrl: { type: String, required: false },
  description: { type: String, required: true },
  bannerImage: { type: String, required: true },
  gallery: { type: [{ type: String, required: true }], default: [] },
  subscribers: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], default: [] },
});

module.exports = mongoose.model('Businesses ', businesses);
