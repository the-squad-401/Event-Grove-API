'use strict';
require('dotenv').config();

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'abc.123@xyz.com';
const TEXT_PROVIDER = process.env.TEXT_PROVIDER || '3333333333';

const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const Categories = require('./models/category/category');
const Businesses = require('./models/business/business');
const Users = require('./models/user/user');

const categories = new Categories();
const businesses = new Businesses();
const users = new Users();


async function emitNotifications(event) {
  const business = await businesses.get(event.business);
  const category = await categories.get(business.category);
  const visited = {};
  for (const userId of business.subscribers) {
    sendNotification(userId, event);
    visited[userId] = true;
  }
  for (const userId of category.subscribers) {
    if (userId in visited) {
      continue;
    }
    sendNotification(userId, event);
  }
}

function createEmail(user, event) {
  return {
    to: user.email,
    from: EMAIL_PROVIDER,
    subject: event.name,
    html: `${event.description}`,
  };
}
function createText(user,event){
  return {
    to: user.phone,
    from: TEXT_PROVIDER,
    body: `${event.description}`,
  };
}
async function sendNotification(user, event) {
  user = await users.get(user);
  sgMail.send(createEmail(user, event));
  client.messages.create(createText(user, event)).catch(console.error);
}

module.exports = emitNotifications;
