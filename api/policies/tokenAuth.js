var localProtocol = require('../services/protocols/local');

module.exports = function (req, res, next) {
    var auth = req.headers.authorization;
    // if (!auth || auth.search('Bearer ') !== 0) {
    //   return next();
    // }
    var token = "";

    if (req.headers && req.headers.authorization) {
        var parts = req.headers.authorization.split(' ');
        if (parts.length == 2) {
            var scheme = parts[0],
                credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }

            if (/^Image$/i.test(scheme)) {
                if (credentials == sails.config.ImageTokenKey) {
                    return next();
                }
            }
        } else {
            req.flash('error', 'Error.Authorization.Token.Bearer');
            next();
            // return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
        }
    } else if (req.param('token')) {
        token = req.param('token');
        // We delete the token from param to not mess with blueprints
        delete req.query.token;
    } else {
        req.flash('error', 'Error.Authorization.Header.NotFound');
        next();
        // return res.json(401, {err: 'No Authorization header was found'});
    }

    if (token != "") {
        sailsTokenAuth.verifyToken(token, function (err, token) {
            if (err) {
                req.flash('error', 'Error.Authorization.Token.InValid')
            } else {
                req.token = token;

                sails.log("token is ", token);

                //var playload = sailsTokenAuth.decode(token, {});

                sails.models.user.findOne(token.sid, function (err, user) {
                    if (err) {
                        return next(err);
                    }

                    if (!user) {
                        if (isEmail) {
                            req.flash('error', 'Error.Passport.Email.NotFound');
                        } else {
                            req.flash('error', 'Error.Passport.Username.NotFound');
                        }

                        return next(null, false);
                    }

                    Passport.findOne({
                        protocol: 'local'
                        , user: token.sid
                    }, function (err, passport) {
                        if (passport) {
                            req.user = user;
                            req.session.authenticated = true;
                            req.session.passport = passport;

                            return next(null, user, passport);
                        }
                        else {
                            req.flash('error', 'Error.Passport.Password.NotSet');
                            return next(null, false);
                        }

                        next();
                    });
                });
            }
        });
    } else {
        return res.send(401);
    }
};
