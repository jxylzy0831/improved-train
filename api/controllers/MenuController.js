/**
 * MenuController
 *
 * @description :: Server-side logic for managing Menus
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var _ = require('lodash');

module.exports = {
  search: function(req,res){
    // var condition = paginationService.getCondition(req);

    var condition = {};

    if (!_.isEmpty(req.query.filter)) {
      if(req.query.filter.name){
        condition.name = { 'contains': req.query.filter.name };
      }
    }


    Menu.find({
      where: condition,
      limit: req.query.count, skip: (req.query.page - 1) * req.query.count
    }).exec(function (err, items) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        Menu.count({
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
  },
  myMenu: function (req, res) {
    User.findOne(req.user.id).populate("roles").exec(function (err, user) {
      if (err) return res.serverError(err);
      var roleNames = _.map(user.roles, 'name');
      sails.log("roleNames is", roleNames);

      Menu.find({parent: null, sort: 'sortIndex ASC'}).populate("children")
        .populate('roles', {name: roleNames}).exec(function (err, menus) {
          if (err) res.serverError(err);

          var returnArr = _.filter(menus, function (o) {
            return o.roles.length > 0;
          });

          var children = _.map(returnArr, 'children');
          var ids = [];
          _.forEach(children, function (child) {
            sails.log("each child is", child);
            var getIds = _.map(child, 'id');
            ids = _.concat(ids, getIds);
          });

          sails.log("ids names is ", ids);

          Menu.find({id: ids, sort: 'sortIndex ASC'}).populate('roles', {name: roleNames}).exec(function (err, menus) {
            if (err) res.serverError(err);

            var returnMenu = _.filter(menus, function (o) {
              return o.roles.length > 0;
            });

            _.forEach(returnArr, function (arr) {
              arr.children = [];
              _.forEach(returnMenu, function (menu) {
                if (arr.id == menu.parent) {
                  arr.children.push(menu);
                }
              });
            });

            return res.json(returnArr);
          });

        })
    });
  }
};

