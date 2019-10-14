'use strict';

const mongoose = require('mongoose');

const category = mongoose.Schema({
  name: { type: String, required: true },
  businesses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Businesses'}],
  subscribers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
});
