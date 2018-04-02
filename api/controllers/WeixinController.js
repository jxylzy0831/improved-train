/**
 * WeixinController
 *
 * @description :: Server-side logic for managing weixins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var sign = require("../controllers/sign");
var unirest = require("unirest");
var jsonfile = require('jsonfile');
var tokenJsonFile = sails.config.appPath + "/assets/weixinToken.json";

module.exports = {

  getToken: function (req, res) {
    jsonfile.readFile(tokenJsonFile, function(err, obj) {
      if (obj && obj.timestamp > 0) {
        var nowTimestamp = Math.round(new Date().getTime()/1000);
        if (nowTimestamp - obj.timestamp > 7200) {
          return res.json(getSignByNewToken(req.query.returnUrl));
        }else {
          var returnJ = sign(obj.ticket, req.query.returnUrl);
		  sails.log("return Json is");
          sails.log(returnJ);
          return res.json(returnJ);
        }
      }else {
		  sails.log("in get new token function");
        return res.json(getSignByNewToken());
      }
    });
  },

    getUser: function (req, res) {
        var code = req.query.code;
        client.getAccessToken(code, function (err, result) {
            if (err) {
                sails.log('报错了');
            } else {
                var accessToken = result.data.access_token;
                var openid = result.data.openid;
                client.getUser(openid, function (err, result) {
                    return res.json(result);
                });
            }
        })
    }
};


function getSignByNewToken(url) {
  unirest.get('https://api.weixin.qq.com/cgi-bin/token')
    .query({grant_type: 'client_credential', appid: 'wx3458b20f9e5ab406', secret: '0327970b6dc6ff7d776e177cec1b9460'})
    .end(function (response) {
      sails.log("access token response is ", response);

      if (response.body) {
        if (!response.body.errcode) {
          var saveJson = {
            token: response.body.access_token,
            timestamp: Math.round(new Date().getTime()/1000),
          };

          unirest.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket')
            .query({access_token: saveJson.token, type: 'jsapi'})
            .end(function (response) {
              sails.log("api ticket response is ",response.body);

              if (response.body) {
                if (response.body.errcode == 0) {
                  saveJson.ticket = response.body.ticket;

                  jsonfile.writeFile(tokenJsonFile, saveJson, function (err) {
                    var returnJ = sign(saveJson.ticket, url);
                    sails.log(returnJ);
                    return returnJ;
                  });
                }
              }
            });
        } else {
          return {success: false, message: response.body.errmsg};
        }
      }

    });
}

