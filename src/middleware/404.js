'use strict';

module.exports = (req, res) => {
  let error = { error: 'Resource not found'};
  res.status(404).json(error);
};