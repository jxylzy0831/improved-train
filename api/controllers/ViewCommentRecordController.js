/**
 * ViewCommentRecordController
 *
 * @description :: Server-side logic for managing Viewcommentrecords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  search: function(req,res){
    // var condition = paginationService.getCondition(req);
    sails.log("req===",req.query);
    sails.log("req sorting===",req.query.sorting);
    var condition = {};
    if (!_.isEmpty(req.query.filter)) {
      var filter = req.query.filter;

      if (req.query.filter.isRemove) {
        condition.isRemove = {'contains': req.query.filter.isRemove};
      }
      if (req.query.filter.isApproved) {
        if(req.query.filter.isApproved == "All"){

        }else{
          condition.isApproved = {'contains': req.query.filter.isApproved};
        }
      }
      if (req.query.filter.comments) {
        condition.comments = {'contains': req.query.filter.comments};
      }
      if (req.query.filter.type) {
        condition.type = {'contains': req.query.filter.type};
      }

      if (req.query.filter.storeName) {
        condition.storeName = {'contains': req.query.filter.storeName};
      }
      if (req.query.filter.address) {
        condition.address = {'contains': req.query.filter.address};
      }
      if (req.query.filter.storeNumber) {
        condition.storeNumber = {'contains': req.query.filter.storeNumber};
      }
      if (req.query.filter.phone) {
        condition.phone = {'contains': req.query.filter.phone};
      }
      if (req.query.filter.deviceNoEDS) {
        condition.deviceNoEDS = {'contains': req.query.filter.deviceNoEDS};
      }
      if (req.query.filter.managementID) {
        condition.managementID = {'contains': req.query.filter.managementID};
      }

      if (req.query.filter.authorizationCode) {
        condition.authorizationCode = {'contains': req.query.filter.authorizationCode};
      }
      if (req.query.filter.city) {
        condition.city = {'contains': req.query.filter.city};
      }
    }
    var searchCondition = {};
    if(req.query.sorting == undefined){
      searchCondition = {where: condition,
        limit: req.query.count,
        skip: (req.query.page - 1) * req.query.count};
    }else{
      searchCondition = {where: condition,
        limit: req.query.count,
        skip: (req.query.page - 1) * req.query.count,
        sort: 'createdAt DESC'};
    }

    ViewCommentRecord.find(searchCondition).exec(function (err, items) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        ViewCommentRecord.count({
          where: condition
        }).exec(function countCB(err, found){
          if (err) {
            console.log(err);
            res.json(err);
          }else {
            res.json({
              result: items,
              total: found
            });
          }
        });
      }
    });
  }

};

