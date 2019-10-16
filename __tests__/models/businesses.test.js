'use strict';

require('../supergoose');

const Businesses = require('../../src/models/business/business');
const Categories = require('../../src/models/category/category');
const Users = require('../../src/models/user/user');

let businesses = new Businesses();
let categories = new Categories();
let users = new Users();

let testCategory;
let testUser;

beforeAll(async () => {
  testCategory = await categories.post({
    name: 'Test',
  });
  testUser = await users.post({ username: 'jacob8468', password: 'password', email: 'jacob.wendt@yahoo.com', phone: '319-693-9955'});
});

describe('Business models', () => {
  let record;
  it('can post() a business', async () => {
    let business = {
      name: 'Iowa Brewing Companions',
      address: '1234 Iowa Blvd',
      hours: [{day: 'M-F', open: '9AM', close: '6pm'}],
      category: testCategory._id,
      externalUrl: 'http://www.google.com',
      description: 'A test',
      bannerImage: 'http://www.google.com',
      gallery: ['http://www.google.com', 'http://www.google.com'],
    };
    record = await businesses.post(business);
    expect(record).toHaveProperty('_id');
    expect(record).toHaveProperty('subscribers');
    for (const key in business) {
      expect(record).toHaveProperty(key);
    }
  });

  it('can get() all businesses by omitting the _id', async () => {
    let gotten = await businesses.get();
    expect(gotten.count).toBe(1);
    expect(gotten.results[0].toObject()).toEqual(record.toObject());
  });

  it('can get() a business', async () => {
    expect(record).toHaveProperty('_id');
    let gotten = await businesses.get(record._id);
    expect(record.toObject()).toStrictEqual(gotten.toObject());
  });

  it('can getByName() a business', async () => {
    let gotten = await businesses.getByName('Iowa Brewing Companions');
    expect(record.toObject()).toStrictEqual(gotten.toObject());
  });

  it('can put() a business (update)', async () => {
    expect(record).toHaveProperty('_id');
    let updated = await businesses.put(record._id, {description: 'Updated'});
    expect(updated.description).toBe('Updated');
  });

  it('can addSubscriber() a business', async () => {
    expect(record).toHaveProperty('_id');
    expect(testUser).toHaveProperty('_id');
    await businesses.addSubscriber(record._id, testUser._id);
    let gotten = await businesses.get(record._id);
    expect([...gotten.subscribers]).toStrictEqual([testUser._id]);
  });

  it('cannot addSubscriber() the same id twice', async () => {
    expect(record).toHaveProperty('_id');
    expect(testUser).toHaveProperty('_id');
    await businesses.addSubscriber(record._id, testUser._id);
    let gotten = await businesses.get(record._id);
    expect([...gotten.subscribers]).toStrictEqual([testUser._id]);
  });

  it('can removeSubscriber() a business', async () => {
    expect(record).toHaveProperty('_id');
    expect(testUser).toHaveProperty('_id');
    await businesses.removeSubscriber(record._id, testUser._id);
    let gotten = await businesses.get(record._id);
    expect([...gotten.subscribers]).toStrictEqual([]);
  });

  it('cannot removeSubscriber() the same id twice', async () => {
    expect(record).toHaveProperty('_id');
    expect(testUser).toHaveProperty('_id');
    await businesses.removeSubscriber(record._id, testUser._id);
    let gotten = await businesses.get(record._id);
    expect([...gotten.subscribers]).toStrictEqual([]);
  });

  it('can addOwner() a business', async () => {
    expect(record).toHaveProperty('_id');
    expect(testUser).toHaveProperty('_id');
    await businesses.addOwner(record._id, testUser._id);
    let gotten = await businesses.get(record._id);
    expect([...gotten.owners]).toStrictEqual([testUser._id]);
  });

  it('cannot addOwner() the same id twice', async () => {
    expect(record).toHaveProperty('_id');
    expect(testUser).toHaveProperty('_id');
    await businesses.addOwner(record._id, testUser._id);
    let gotten = await businesses.get(record._id);
    expect([...gotten.owners]).toStrictEqual([testUser._id]);
  });

  it('can removeOwner() a business', async () => {
    expect(record).toHaveProperty('_id');
    expect(testUser).toHaveProperty('_id');
    await businesses.removeOwner(record._id, testUser._id);
    let gotten = await businesses.get(record._id);
    expect([...gotten.owners]).toStrictEqual([]);
  });

  it('cannot removeOwner() the same id twice', async () => {
    expect(record).toHaveProperty('_id');
    expect(testUser).toHaveProperty('_id');
    await businesses.removeOwner(record._id, testUser._id);
    let gotten = await businesses.get(record._id);
    expect([...gotten.owners]).toStrictEqual([]);
  });

  it('can delete() a business', async () => {
    expect(record).toHaveProperty('_id');
    await businesses.delete(record._id);
    let deleted = await businesses.get(record._id);
    expect(deleted).toBeFalsy();
  });
  
});