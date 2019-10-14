'use strict';

const mongoose = require('mongoose');

const category = mongoose.Schema({
  name: { type: String, required: true },
  subscribers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users', unique: true, dropDups: true}],
});

module.exports = mongoose.model('Categories', category);