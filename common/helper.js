/**
 * Contains generic helper methods
 */
'use strict';

const _ = require('underscore');
const co = require('co');
const util = require('util');
const config = require('config');
const NotFoundError = require('./errors').NotFoundError;

const bcrypt = require('bcryptjs');
global.Promise.promisifyAll(bcrypt);

/**
 * Wrap generator function to standard express function
 * @param {Function} fn the generator function
 * @returns {Function} the wrapped function
 */
function wrapExpress(fn) {
  return function (req, res, next) {
    co(fn(req, res, next)).catch(next);
  };
}

/**
 * Wrap all generators from object
 * @param obj the object (controller exports)
 * @returns {Object|Array} the wrapped object
 */
function autoWrapExpress(obj) {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress);
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'GeneratorFunction') {
      return wrapExpress(obj);
    }
    return obj;
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value);
  });
  return obj;
}

/**
 * Ensure entity exists for given criteria. Return error if no result.
 * @param {Object} Model the mongoose model to query
 * @param {Object|String|Number} criteria the criteria (if object) or id (if string/number)
 */
function* ensureExists(Model, criteria) {
  let query;
  let byId = true;
  if (_.isObject(criteria)) {
    byId = false;
    query = Model.findOne(criteria);
  } else {
    query = Model.findById(criteria);
  }
  const result = yield query;
  if (!result) {
    let msg;
    if (byId) {
      msg = util.format('%s not found with id: %s', Model.modelName, criteria);
    } else {
      msg = util.format('%s not found with criteria: %j', Model.modelName, criteria);
    }
    throw new NotFoundError(msg);
  }
  return result;
}

/**
 * Hash the given text.
 *
 * @param {String} text the text to hash
 */
function* hashString(text) {
  return yield bcrypt.hashAsync(text, config.PASSWORD_HASH_SALT_LENGTH);
}

/**
 * Validate that the hash is actually the hashed value of plain text
 *
 * @param {String} text   the text to validate
 * @param {String} hash   the hash to validate
 */
function* validateHash(text, hash) {
  return yield bcrypt.compareAsync(text, hash);
}

/**
 * Generate a random device id, in format like 1234-5678-9012-1234.
 *
 * @returns {String} the generated device id
 */
function generateDeviceId() {
  let res = '';
  let rnd = new Date().getTime() % 77557;
  for (let i = 0; i < 16; i++) {
    rnd = Math.ceil(rnd * Math.random() * 37 + 123) % 77557;
    res += (rnd % 10);
    if (i === 3 || i === 7 || i === 11) {
      res += '-';
    }
  }
  return res;
}

module.exports = {
  wrapExpress,
  autoWrapExpress,
  ensureExists,
  hashString,
  validateHash,
  generateDeviceId,
};
