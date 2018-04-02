// api/models/RequestLog.js

var _ = require('lodash');
var _super = require('sails-permissions/api/models/RequestLog');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  autoPK: true,

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true
    },
    requestId: {
      type: 'string'
    },
    ipAddress: {
      type: 'string'
    },
    method: {
      type: 'string'
    },
    url: {
      type: 'string',
      url: true
    },
    body: {
      type: 'json'
    },
    user: {
      model: 'User'
    },
    model: {
      type: 'string'
    }
  }
});
