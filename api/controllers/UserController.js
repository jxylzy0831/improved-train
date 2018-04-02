// api/controllers/UserController.js

var _ = require('lodash');
var uuid = require('node-uuid');
var _super = require('sails-auth/api/controllers/UserController');

_.merge(exports, _super);
_.merge(exports, {

  search: function (req, res) {

    var condition = {};
    if (!_.isEmpty(req.query.filter)) {
      var filter = req.query.filter;
      if (filter.username) {
        condition.username = {'contains': req.query.filter.username};
      }
      if (filter.email) {
        condition.email = {'contains': req.query.filter.email};
      }
      if (filter.mobile) {
        condition.mobile = {'contains': req.query.filter.mobile};
      }

      if (filter.name) {
        condition.name = {'contains': req.query.filter.name};
      }

      if (filter.disable) {
        condition.disable = req.query.filter.disable;
      }
    }

    User.find({
      where: condition,
      limit: req.query.count, skip: (req.query.page - 1) * req.query.count
    }).exec(function (err, items) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        User.count({
          where: condition
        }).exec(function countCB(err, found) {
          if (err) {
            console.log(err);
            res.json(err);
          } else {
            res.json({
              result: items,
              total: found
            });
          }
        });
      }
    });
  },
  csrSearch: function (req, res) {

    var condition = {};
    if (!_.isEmpty(req.query.filter)) {
      var filter = req.query.filter;
      if (filter.username) {
        condition.username = {'contains': req.query.filter.username};
      }
      if (filter.email) {
        condition.email = {'contains': req.query.filter.email};
      }
      if (filter.mobile) {
        condition.mobile = {'contains': req.query.filter.mobile};
      }

      if (filter.name) {
        condition.name = {'contains': req.query.filter.name};
      }

      if (filter.disable) {
        condition.disable = req.query.filter.disable;
      }
    }

    condition.groupKey = 'g_csr';
    User.find({
      where: condition,
      limit: req.query.count, skip: (req.query.page - 1) * req.query.count
    }).exec(function (err, items) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        User.count({
          where: condition
        }).exec(function countCB(err, found) {
          if (err) {
            console.log(err);
            res.json(err);
          } else {
            res.json({
              result: items,
              total: found
            });
          }
        });
      }
    });
  },
  clientSearch: function (req, res) {

    var condition = {};
    if (!_.isEmpty(req.query.filter)) {
      var filter = req.query.filter;
      if (filter.username) {
        condition.username = {'contains': req.query.filter.username};
      }
      if (filter.email) {
        condition.email = {'contains': req.query.filter.email};
      }
      if (filter.mobile) {
        condition.mobile = {'contains': req.query.filter.mobile};
      }

      if (filter.name) {
        condition.name = {'contains': req.query.filter.name};
      }

      if (filter.disable) {
        condition.disable = req.query.filter.disable;
      }
    }

    condition.groupKey = 'g_client';
    User.find({
      where: condition,
      limit: req.query.count, skip: (req.query.page - 1) * req.query.count
    }).exec(function (err, items) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        User.count({
          where: condition
        }).exec(function countCB(err, found) {
          if (err) {
            console.log(err);
            res.json(err);
          } else {
            res.json({
              result: items,
              total: found
            });
          }
        });
      }
    });
  },

  createClient: function (req, res) {
    req.body.groupKey = 'g_client';
    Role.findOne({name: 'client'}).exec(function (err, role) {
      if (err) return res.serverError(err);
      req.body.roles = [role.id];
      sails.services.passport.protocols.local.register(req.body, function (err, user) {
        if (err) return res.serverError(err);

        User.findOne(user.id).exec(function (err, user) {
          if (err) return res.serverError(err);

          return res.json({success: true, user: user, token: sailsTokenAuth.issueToken({sid: user.id})});
        });
      });
    })
  },
  createCSR: function (req, res) {
    sails.log("========req.body is:",req.body);
   // req.body.groupKey = 'g_csr';
    Role.findOne({name: 'csr'}).exec(function (err, role) {
      sails.log("========role is:",role);
      if (err) return res.serverError(err);
      req.body.roles = [role.id];
      sails.services.passport.protocols.local.register(req.body, function (err, user) {
        if (err) return res.serverError(err);

        User.findOne(user.id).exec(function (err, user) {
          if (err) return res.serverError(err);

          return res.json({success: true, user: user, token: sailsTokenAuth.issueToken({sid: user.id})});
        });
      });
    })
  },

  changePassword: function (req, res) {
    var identifier = req.body.identifier;
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    var isEmail = validateEmail(identifier)
      , query = {};

    if (isEmail) {
      query.email = identifier;
    }
    else {
      query.username = identifier;
    }

    var response = {success: false};

    if (_.isEmpty(newPassword)) {
      response.message = "Error.Passport.NewPassword.Empty";
      return res.json(response);
    }

    sails.models.user.findOne(query, function (err, user) {
      if (err) {
        response.message = err;
        return res.json(err);
      }

      if (!user) {
        if (isEmail) {
          response.message = "Error.Passport.Email.NotFound";
        } else {
          response.message = "Error.Passport.Username.NotFound";
        }

        return res.json(response);
      }

      sails.models.passport.findOne({
        protocol: 'local'
        , user: user.id
      }, function (err, passport) {
        if (passport) {
          passport.validatePassword(password, function (err, resp) {
            if (err) {
              response.message = err;
              return res.json(response);
            }


            if (!resp) {
              response.message = "Error.Passport.Password.Wrong";
              return res.json(response);
            } else {
              Passport.update({id: passport.id}, {'password': newPassword}, function (err, passport) {
                sails.log("in update passport");
                if (err) {
                  if (err.code === 'E_VALIDATION') {
                    response.message = "Error.Passport.Password.Invalid";
                    return res.json(response);
                  }
                  response.message = err;
                  return res.json(err);
                } else {
                  response.success = true;
                  return res.json(response);
                }
              });
            }
          });
        }
        else {
          response.message = "Error.Passport.Password.NotSet";
          return res.json(response);
        }
      });
    });
  },
  sendResetPasswordEmail: function (req, res) {
    var identifier = req.body.identifier;
    var isEmail = validateEmail(identifier)
      , query = {};

    if (isEmail) {
      query.email = identifier;
    }
    else {
      query.username = identifier;
    }

    var response = {success: false};

    sails.models.user.findOne(query, function (err, user) {
      if (err) {
        response.message = err;
        return res.json(err);
      }

      if (!user) {
        if (isEmail) {
          response.message = "Error.Passport.Email.NotFound";
        } else {
          response.message = "Error.Passport.Username.NotFound";
        }

        return res.json(response);
      }

      sails.models.passport.findOne({
        protocol: 'local'
        , user: user.id
      }).populateAll().exec(function (err, passport) {
        if (passport) {
          var token = uuid.v4();
          User.update(user.id, {
            'resetPasswordToken': token,
            'resetPasswordExpires': new Date(Date.now() + 3600000)
          }, function (err, passport) {
            sails.log("in update user");
            if (err) {
              sails.log("update user error is ", err);
              if (err.code === 'E_VALIDATION') {
                response.message = "Error.Passport.Password.Invalid";
                return res.json(response);
              }
              response.message = err;
              return res.json(err);
            } else {
              sails.hooks.email.send(
                "resetPassword",
                {
                  recipientName: user.username,
                  senderName: "Sue",
                  token: token
                },
                {
                  from: sails.config.email.from,
                  to: user.email,
                  subject: "Change Your Passwordf"
                },
                function (err) {
                  if (err) {
                    sails.log("send email error is", err);
                    response.message = err;
                    return res.json(response)
                  }
                  response.success = true;
                  return res.json(response)
                }
              );
            }
          });

        }
        else {
          response.message = "Error.Passport.Password.NotSet";
          return res.json(response);
        }
      });
    });
  },
  resetPassword: function (req, res) {
    if (!req.param('token')) {
      return res.render('resetPassword', {
        error: 'token cannot be empty.'
      });
    }
    User.findOne({
      resetPasswordToken: req.param('token'),
      resetPasswordExpires: {'>=': Date.now()}
    }, function (err, user) {
      if (!user) {
        res.render('resetPassword', {
          error: 'Password reset token is invalid or has expired.'
        });
      } else {
        res.render('resetPassword', {
          user: req.user, error: ''
        });
      }
    });
  },
  resetPasswordPost: function (req, res) {
    User.findOne({
      resetPasswordToken: req.param('token'),
      resetPasswordExpires: {'>=': Date.now()}
    }, function (err, user) {
      if (!user) {
        res.render('resetPassword', {
          error: 'Password reset token is invalid or has expired.'
        });
      }else {
        User.update(user.id, {
          'resetPasswordToken': '',
          'resetPasswordExpires': ''
        }, function (err, passport) {
          if (err)
            res.render('resetPassword', {
              error: err
            });
          else {
            sails.models.passport.findOne({
              protocol: 'local'
              , user: user.id
            }, function (err, passport) {
              if (passport) {
                Passport.update({id: passport.id}, {'password': req.body.password}, function (err, passport) {
                  sails.log("in update passport");
                  if (err) {
                    if (err.code === 'E_VALIDATION') {
                      return res.render('resetPassword', {
                        user: req.user, error: 'password invalid'
                      });
                    }
                    return res.render('resetPassword', {
                      user: req.user, error: err
                    });
                  } else {
                    return res.render('resetPassword', {
                      user: req.user, error: '修改成功'
                    });
                  }
                });
              }
              else {
                return res.render('resetPassword', {
                  user: req.user, error: 'password not set'
                });
              }
            });
          }
        });
      }
    });
  }
});

var EMAIL_REGEX = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

/**
 * Use validator module isEmail function
 *
 * @see <https://github.com/chriso/validator.js/blob/3.18.0/validator.js#L38>
 * @see <https://github.com/chriso/validator.js/blob/3.18.0/validator.js#L141-L143>
 */
function validateEmail(str) {
  return EMAIL_REGEX.test(str);
}
