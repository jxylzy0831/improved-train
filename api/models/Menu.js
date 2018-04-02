/**
* Menu.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    name : {
      type: 'string'
    },
    sortIndex: {
      type: 'integer',
      required: true
    },
    active: {
      type: 'boolean',
      defaultsTo: true
    },
    icon: {
      type: 'string',
      defaultsTo: ''
    },
    className: {
      type: 'string',
      defaultsTo: ''
    },
    action: {
      type: 'string',
      defaultsTo: ''
    },
    path: {
      type: 'string',
      defaultsTo: ''
    },
    parent:{
      model: 'menu'
    },
    children: {
      collection: 'menu',
      via: 'parent'
    },
    roles: {
      collection: 'role',
      via: 'menus'
    }
  }
};

