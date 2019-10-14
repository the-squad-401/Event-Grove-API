'use strict';
const { server } = require('../src/server');
const supergoose = require('./supergoose');
const mockRequest = supergoose(server);


describe('API', () => {
  it('returns 404 for invalid route', () => {
    return mockRequest
      .get('/invalidRoute')
      .expect(404);
  });

  it('returns 200 for a valid route', () => {
    return mockRequest
      .get('/')
      .expect(200);
  });
});