// api/controllers/RoleController.js

var _ = require('lodash');
var _super = require('sails-permissions/api/controllers/RoleController');

_.merge(exports, _super);
_.merge(exports, {

  // Extend with custom logic here by adding additional fields, methods, etc.
  search: function(req,res){
    // var condition = paginationService.getCondition(req);

    var condition = {};
    if (!_.isEmpty(req.query.filter)) {
      var filter = req.query.filter;
      if (filter.name) {
        condition.name = {'contains': req.query.filter.name};
      }
    }

    Role.find({
      where: condition,
      limit: req.query.count, skip: (req.query.page - 1) * req.query.count
    }).exec(function (err, items) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        Role.count({
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
});
