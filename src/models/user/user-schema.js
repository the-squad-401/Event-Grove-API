'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '7d';
const SECRET = process.env.SECRET || '+m#XfN>!#8CZ/Z-5_YbGUpM&`2{WY"&J:N&#-XvPy#L3<?KSz%8>)5DqsDpd-5';


const Users = mongoose.Schema({
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  usertype: { type: String, required: true, enum: ['user', 'admin'], default: 'user'},
});

Users.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

Users.statics.authenticateBasic = function(auth) {
  let query = { username: auth.username };
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password))
    .catch( error => { throw error; });
};

Users.statics.authenticateToken = function(token) {
  try {
    let parsedToken = jwt.verify(token, SECRET);
    let query = { _id: parsedToken.id };
    return this.findOne(query);
  } catch (error) {
    throw new Error('Invalid Token');
  }
};

Users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null );
};

Users.methods.generateToken = function() {
  let token = {
    id: this._id,
    type: this.usertype || 'user',
  };
  let options = { expiresIn: TOKEN_EXPIRE };

  return jwt.sign(token, SECRET, options);
};





module.exports = mongoose.model('Users ', Users);  
