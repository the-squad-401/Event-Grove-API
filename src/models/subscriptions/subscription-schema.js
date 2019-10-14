'use strict';

const mongoose = require('mongoose');

const subscriptions = mongoose.Schema({
  type: {type: String, required: true}, //Business, category
  users: [{type: String, required: true}],
  refId: {type: String, required: true}, //BusinessID or categoryID
});

module.exports = mongoose.model('subscriptions', subscriptions);
