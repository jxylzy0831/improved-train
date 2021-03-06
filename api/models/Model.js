// api/models/Model.js

var _ = require('lodash');
var _super = require('sails-permissions/api/models/Model');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  attributes: {
    name: {
      type: 'string',
      size: 191,
      notNull: true,
      unique: true
    }
  }
});
