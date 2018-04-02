/**
* CommentRecord.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    imageUrl:{
      type: 'string'
    },
    comments:{
      type: 'text'
    },
    type:{
      type: 'string'
    },
    isApproved:{
      type: 'string',
      enum: ['created', 'approved','rejected'],
      defaultsTo: 'created'
    },
    isRemove:{
      type: 'string',
      enum: ['created', 'removed'],
      defaultsTo: 'created'
    },
    storeId: {
      model: "store"
    },
    storeNum: {
      type: "string"
    }
  }
};

