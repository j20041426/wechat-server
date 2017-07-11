var express = require('express');
var router = express.Router();
var AV = require('leancloud-storage');

router.post('/getSessions', function(req, res, next) {
  var query = new AV.Query('wx_session_lists');
  var myself = req.body.userId;
  query.equalTo('members', myself);
  query.find().then(function (results) {
    if(results.length > 0){
      var resArr = [];
      function *action() {
        for(var l in results){
          if(results[l].attributes.sessionType==0){
            var userId = '';
            for(var j in results[l].attributes.members){
              if(results[l].attributes.members[j] != myself){
                userId = results[l].attributes.members[j];
                break;
              }
            }
            (function(l){
              new Promise(function(resolve, reject){
                var response = {};
                var query = new AV.Query('wx_users');
                query.get(userId).then(function (data) {
                  var sessionId = results[l].id;
                  
                  response.userIcon = data.attributes.headimg;
                  response.name = data.attributes.nickname;
                  response.sessionId = sessionId;
      
                  var query1 = new AV.Query('wx_sessions');
                  query1.equalTo('sessionId', sessionId);
                  query1.descending('createdAt');
                  return query1.first();
                }).then(function(data){
                  if(data){
                    response.content = data.attributes.content;
                    response.timer = data.createdAt;
                  }else{
                    response.content = '';
                    response.timer = '';
                  }
                  resolve(response);
                });
              }).then(function(response){
                resArr.push(response);
                it.next();
              });
            })(l);
            yield;
          }else{}
        }
        
        res.send({
          type: 1,
          msg: '获取成功',
          data: resArr
        })
      }
      var it = action();
      it.next();
    }else{
      res.send({
        type: 0,
        msg: '没有聊天记录',
        data: {}
      })
    }
  });
});

router.post('/getSessionById', function(req, res, next) {
  var userInfo = [];
  new Promise(function(resolve,reject){
    var query = new AV.Query('wx_session_lists');
    query.get(req.body.sessionId).then(function(data){
      var memberLength = data.attributes.members.length;
      for(var l in data.attributes.members){
        var query1 = new AV.Query('wx_users');
        query1.get(data.attributes.members[l]).then(function(data){
          userInfo.push({userId:data.id,headimg:data.attributes.headimg});
          if(userInfo.length == memberLength){
            resolve();
          }
        });
      }
    });
  }).then(function(){
    var query = new AV.Query('wx_sessions');
    query.equalTo('sessionId', req.body.sessionId);
    query.ascending('createdAt');
    query.find().then(function (results) {
      if(results.length>0){
        var resArr = [];
        for(var l in results){
          var response = {};
          response.type = results[l].attributes.type;
          response.content = results[l].attributes.content;
          response.timer = results[l].createdAt;
          response.from = results[l].attributes.from;
          if(response.type == 'msg'){
            for(var j in userInfo){
              if(userInfo[j].userId == response.from){
                response.userIcon = userInfo[j].headimg;
              }
            }
          }else{
            
          }
          resArr.push(response)
        }
        res.send({
          type: 1,
          msg: '获取成功',
          data: resArr
        })
      }else{
        res.send({
          type: 1,
          msg: '获取成功',
          data: []
        })
      }
    });
  });
});

module.exports = router;
