// api/models/Passport.js

var _ = require('lodash');
var md5 = require('MD5');
var _super = require('sails-permissions/api/models/Passport');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  attributes: {
    password: { type: 'string', minLength: 6 },
    validatePassword: function (password, next) {
      var hash = md5(password);
      if (hash == this.password) {
        return next(null, true);
      } else {
        return next(null, false);
      }
    }
  },

  beforeCreate: function (passport, next) {
    if (passport.password) {
      passport.password = md5(passport.password);
      next(null, passport);
    }
    else {
      next(null, passport);
    }
  },

  /**
   * Callback to be run before updating a Passport.
   *
   * @param {Object}   passport Values to be updated
   * @param {Function} next
   */
  beforeUpdate: function (passport, next) {
    if (passport.password) {
      passport.password = md5(passport.password);
      next(null, passport);
    }
    else {
      next(null, passport);
    }
  }
});
