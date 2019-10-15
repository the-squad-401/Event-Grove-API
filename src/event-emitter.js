'use strict';
require('dotenv').config();

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || 'abc.123@xyz.com';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Categories = require('./models/category/category');
const Businesses = require('./models/business/business');
const Users = require('./models/user/user');

const categories = new Categories();
const businesses = new Businesses();
const users = new Users();


async function emitNotifications(event) {
  const businessId = event.business;
  const categoryId = event.category;

  const business = await businesses.get(businessId);
  const category = await categories.get(categoryId);
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

function sendNotification(user, event) {
  user = users.get(user);
  sgMail.send(createEmail(user, event));
}

module.exports = emitNotifications;
