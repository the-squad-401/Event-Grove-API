'use strict';

module.exports = (req, res, next) => {
  let error = { error: 'Resource not found'};
  res.status(404).json(error);
};