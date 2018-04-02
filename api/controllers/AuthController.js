// api/controllers/AuthController.js

var _ = require('lodash');
var _super = require('sails-auth/api/controllers/AuthController');

_.merge(exports, _super);
_.merge(exports, {

  login: function (req, res) {
    res.redirect('/');
  },

  clientAuth: function (req, res) {
    function tryAgain(err) {

      // Only certain error messages are returned via req.flash('error', someError)
      // because we shouldn't expose internal authorization errors to the user.
      // We do return a generic error and the original request body.
      var flashError = req.flash('error')[0];
      if (err || flashError) {
        sails.log.warn(err);
        sails.log.warn(flashError);
      }

      if (err && !flashError) {
        req.flash('error', 'Error.Passport.Generic');
      }
      else if (flashError) {
        req.flash('error', flashError);
      }
      req.flash('form', req.body);

      // If an error was thrown, redirect the user to the
      // login, register or disconnect action initiator view.
      // These views should take care of rendering the error messages.
      var action = req.param('action');

      if (action === 'register') {
        res.redirect('/register');
      }
      else if (action === 'login') {
        res.redirect('/login');
      }
      else if (action === 'disconnect') {
        res.redirect('back');
      }
      else {
        // make sure the server always returns a response to the client
        // i.e passport-local bad username/email or password
        res.forbidden({
          message: sails.__({
            phrase: 'auth.error',
            locale: req.getLocale()
          })
        });
      }

    }

    sails.services.passport.callback(req, res, function (err, user) {

      if (err || !user) {
        sails.log.warn(err);
        return tryAgain();
      }

      req.login(user, function (err) {
        if (err) {
          sails.log.warn(err);
          return tryAgain();
        }

        Role.findOne({name: 'client'}).exec(function (err, role) {
          if (err) return res.serverError(err);
          User.findOne({id: user.id}).populate('roles')
            .exec(function (err, findUser) {
              var exist = false;
              _.forEach(findUser.roles, function (item) {
                if (item.id == role.id) {
                  req.session.authenticated = true;

                  sails.log.info('user', user, 'authenticated successfully');
                  exist = true;
                  return res.json({user: user, token: sailsTokenAuth.issueToken({sid: user.id})});
                }
              });

              if (!exist) res.forbidden({
                message: sails.__({
                  phrase: 'auth.error.permission',
                  locale: req.getLocale()
                })
              });
            });
        });

      });
    });
  },

  csrAuth: function (req, res) {
    function tryAgain(err) {

      // Only certain error messages are returned via req.flash('error', someError)
      // because we shouldn't expose internal authorization errors to the user.
      // We do return a generic error and the original request body.
      var flashError = req.flash('error')[0];
      if (err || flashError) {
        sails.log.warn(err);
        sails.log.warn(flashError);
      }

      if (err && !flashError) {
        req.flash('error', 'Error.Passport.Generic');
      }
      else if (flashError) {
        req.flash('error', flashError);
      }
      req.flash('form', req.body);

      // If an error was thrown, redirect the user to the
      // login, register or disconnect action initiator view.
      // These views should take care of rendering the error messages.
      var action = req.param('action');
      sails.log("ACTION IS ===",  action);
      if (action === 'register') {
        res.redirect('/register');
      }
      else if (action === 'login') {
        res.redirect('/login');
      }
      else if (action === 'disconnect') {
        res.redirect('back');
      }
      else {
        // make sure the server always returns a response to the client
        // i.e passport-local bad username/email or password
        res.forbidden({
          message: sails.__({
            phrase: 'auth.error',
            locale: req.getLocale()
          })
        });
      }

    }


    sails.services.passport.callback(req, res, function (err, user) {

      if (err || !user) {
        sails.log.warn(err);
        return tryAgain();
      }

      req.login(user, function (err) {
        if (err) {
          sails.log.warn(err);
          return tryAgain();
        }

        Role.findOne({name: 'csr'}).exec(function (err, role) {
          if (err) return res.serverError(err);
          User.findOne({id: user.id}).populate('roles')
            .exec(function (err, findUser) {
              var exist = false;
              _.forEach(findUser.roles, function (item) {
                if (item.id == role.id) {
                  req.session.authenticated = true;

                  sails.log.info('user', user, 'authenticated successfully');
                  exist = true;
                  user["roles"] = findUser.roles;
                  return res.json({user: findUser, token: sailsTokenAuth.issueToken({sid: user.id})});
                }
              });

              if (!exist) res.forbidden({
                message: sails.__({
                  phrase: 'auth.error.permission',
                  locale: req.getLocale()
                })
              });
            });
        });

      });
    });
  }
});
