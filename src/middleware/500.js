'use strict';

module.exports = (err, req, res) => {
  let error = { error: err.message || err };
  res.status(err.status || 500).json(error);
};