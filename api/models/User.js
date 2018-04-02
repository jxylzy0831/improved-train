// api/models/User.js

var _ = require('lodash');
var _super = require('sails-permissions/api/models/User');

_.merge(exports, _super);
_.merge(exports, {

    // Extend with custom logic here by adding additional fields, methods, etc.
    attributes: {
        username: {
            type: 'string',
            size: 191,
            unique: true,
            index: true,
            notNull: true
        },
        email: {
            type: 'email',
            size: 191,
            index: true
        },
        name: {
            type: 'string'
        },
        sex: {
            type: 'string'
        },
        mobile: {
            type: 'string'
        },
        company: {
            type: 'string'
        },
        country: {
            type: 'string'
        },
        province: {
            type: 'string'
        },
        address: {
            type: 'string'
        },
        city: {
            type: 'string'
        },
        zipCode: {
            type: 'string'
        },
        headImg: {
            type: 'string'
        },
        disable: {
            type: 'boolean'
        },
        resetPasswordToken: {
            type: 'string'
        },
        resetPasswordExpires: {
            type: 'datetime'
        }
    }
});
