'use strict';

const Business = 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const category = Schema({
  name: { type: String, required: true },
  businesses: [{ type: Schema.Types.ObjectId, }]
});
