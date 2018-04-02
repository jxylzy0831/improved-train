/**
 * CommentRecordController
 *
 * @description :: Server-side logic for managing Commentrecords
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var request = require('request');
var _ = require("lodash");
function random (low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = {
  search: function(req,res){
    // var condition = paginationService.getCondition(req);
    sails.log("req===",req.query);
    var condition = {};
    if (!_.isEmpty(req.query.filter)) {
      var filter = req.query.filter;

      if (req.query.filter.isRemove) {
        condition.isRemove = {'contains': req.query.filter.isRemove};
      }
      if (req.query.filter.comments) {
        condition.comments = {'contains': req.query.filter.comments};
      }
      if (req.query.filter.type) {
        condition.type = {'contains': req.query.filter.type};
      }
    }

    CommentRecord.find({
      where: condition,
      limit: req.query.count,
      skip: (req.query.page - 1) * req.query.count,
      sort: 'createdAt DESC'
    }).exec(function (err, items) {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        CommentRecord.count({
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
  getToken: function (req, res) {
    var prams = {
      url: req.query.url
    };
    sails.log("url is", req.query.url);
    if(sails.config.debug == 1){
      unirest.get(sails.config.jssdkUrlTest)
        .query(prams)
        .end(function (response) {
          sails.log("getToken1 response.body is ", response.body);
          var mes = JSON.parse(response.body);
          sails.log("mes  is ", mes.appid);
          return res.json(mes);
        });
    }else{
      unirest.get(sails.config.jssdkUrl)
        .query(prams)
        .end(function (response) {
          sails.log("getToken1 response.body is ", response.body);
          var mes = JSON.parse(response.body);
          sails.log("mes  is ", mes.appid);
          return res.json(mes);
        });
    }

  },
  getList: function(req, res){
    var response = {success: false};
    //先查询最新的12条记录
    CommentRecord.find({isApproved: "approved", sort: 'createdAt DESC',limit: 12}).exec(function(err, comments){
      sails.log("============length============", comments.length);
      if (err) return res.serverError(err);
      if(comments.length<12){
        response.data = comments;
        return res.json(response);
      }else{
        var ids = [];
        for(var i=0;i<12;i++){
          ids.push(comments[i].id);
        }
        //查询提出到已查出的最新的12条记录
        CommentRecord.find({isApproved: "approved",id: { '!' : ids }}).exec(function(err, othercomments){
          sails.log("============othercomments length============", othercomments.length);
          if (err) return res.serverError(err);
          if(othercomments.length == 0){
            response.data = comments;
            return res.json(response);
          }else{
            var result = [];
            result.push(comments[0],comments[1],comments[2],comments[3],comments[4],comments[5]);
            if(othercomments.length<=12){
              if(othercomments.length % 2 ==0){
                for(var i=0; i< othercomments.length/2; i++){
                  result.push(othercomments[i])
                }
                result.push(comments[6],comments[7],comments[8],comments[9],comments[10],comments[11]);
                for(var i=othercomments.length/2; i< othercomments.length; i++){
                  result.push(othercomments[i])
                }
              }else{
                for(var i=0; i< othercomments.length/2+1; i++){
                  result.push(othercomments[i])
                }
                result.push(comments[6],comments[7],comments[8],comments[9],comments[10],comments[11]);
                for(var i=othercomments.length/2+1; i< othercomments.length; i++){
                  result.push(othercomments[i])
                }
              }
            }else{
              for(var i=0;i<12;i++){
                var index = random(1, othercomments.length);
                var comment = othercomments[index-1];
                if(i<5){
                  result.push(comment);
                }else if(i==5){
                  result.push(comment);
                  result.push(comments[6],comments[7],comments[8],comments[9],comments[10],comments[11]);
                }else{
                  result.push(comment);
                }
                sails.log("============random record id============", comment.id);
                othercomments.splice(index-1,1);
              }
            }
            response.data = result;
            return res.json(response);
          }
        });
      }
    });
    //CommentRecord.find({isApproved: "approved",sort: 'createdAt DESC'}).exec(function(err, comments){
    //  sails.log("============find enrolled============", comments);
    //  if (err) return res.serverError(err);
    //  if(comments.length > 0){
    //    response.success = true;
    //    if(comments.length <= 24){
    //      response.data = comments;
    //    }else{
    //      var existed = [];
    //      var selected = [];
    //      var sorte1 = [];
    //      var sorte2 = [];
    //      for(var i=0; i<12; i++){
    //        var comment = comments[0];
    //        if(i<6){
    //          sorte1.push(comment);
    //        }else{
    //          sorte2.push(comment);
    //        }
    //        comments.splice(index-1,1);
    //      }
    //      for(var i=0; i<12; i++){
    //        var index = random(1, comments.length);
    //        var comment = comments[index-1];
    //        if(i<6){
    //          sorte1.push(comment);
    //        }else{
    //          sorte2.push(comment);
    //        }
    //        comments.splice(index-1,1);
    //      }
    //      for(var i=0;i<12;i++){
    //        sorte1.push(sorte2[i]);
    //      }
    //      response.data = sorte1;
    //      //for(var i=0; i<24; i++){
    //      //  var index = random(1, comments.length);
    //      //  var comment = comments[index-1];
    //      //  selected.push(comment);
    //      //  comments.splice(index-1,1);
    //      //}
    //      //response.data = selected;
    //    }
    //    return res.json(response);
    //  }else{
    //    response.success = true;
    //    response.data = [];
    //    return res.json(response);
    //  }
    //});
  }
};

