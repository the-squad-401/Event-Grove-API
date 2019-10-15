'use strict';

require('dotenv').config();

// Start DB Server
const mongoose = require('mongoose');
const mongooseOptions = {
  useNewUrlParser:true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

let PORT = process.env.PORT || 3000;

require('./src/server').start(PORT);