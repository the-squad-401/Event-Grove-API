'use-strict';
/**
 * Wraps a route callback with a try/catch, which passes on uncaught errors to be properly handled
 * @param {Function} route the route to be wrapped
 */
function wrap(route) {
  return async (req, res, next) => {
    try {
      await route(req, res, next);
    } catch (error) {
      if (error.status !== 404) console.error(error);
      next(error);
    }
  };
}

/**
 * Creates an error with a 404 status
 * @param {String} id the id of the record that could not be found.
 */
function get404(id) {
  const error = new Error(`No record found with id: ${id}`);
  error.status = 404;
  return error;
}

function get401() {
  const error = new Error('You are not authorized to do this action');
  error.status = 401;
  return error;
}

/**
 * Checks if the record was found, and throws a 404 error if not
 * @param {Object} record the record to verify
 * @param {String} id the id of the record (for the 404)
 */
function verifyExists(record, id) {
  if (!record) {
    throw get404(id);
  }
}

/**
 * Sends a record to a response, with a default status of 200
 * @param {Object} record the record
 * @param {Response} res the Express Response
 * @param {Number} status a status code (200 by default)
 */
function send(record, res, status = 200) {
  res.status(status).json(record);
}

module.exports = exports = { wrap, get404, get401, verifyExists, send };
