/**
 * StoreController
 *
 * @description :: Server-side logic for managing Stores
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  search: function(req,res){
    // var condition = paginationService.getCondition(req);
    sails.log("req===",req.query);
    var condition = {};
    if (!_.isEmpty(req.query.filter)) {
      var filter = req.query.filter;

      if (req.query.filter.name) {
        condition.name = {'contains': req.query.filter.name};
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
      if (req.query.filter.managementID) {
        condition.managementID = {'contains': req.query.filter.managementID};
      }
      if (req.query.filter.authorizationCode) {
        condition.authorizationCode = {'contains': req.query.filter.authorizationCode};
      }
    }

    Store.find({
      where: condition,
      limit: req.query.count,
      skip: (req.query.page - 1) * req.query.count//,
      //sort: 'createdAt DESC'
    }).exec(function (err, items) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        Store.count({
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

