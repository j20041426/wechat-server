var express = require('express');
var router = express.Router();
var AV = require('leancloud-storage');

router.post('/getContacts', function(req, res, next) {
  var query = new AV.Query('wx_users');
  query.notEqualTo('objectId', req.body.userId);
  query.find().then(function (results) {
    var resArr = [];
    for(var l in results){
      var response = {};
      response.userId = results[l].id;
      response.type = 'userinfo';
      response.userIcon = results[l].attributes.headimg;
      response.name = results[l].attributes.nickname;
      resArr.push(response);
    }
    res.send({
      type: 1,
      msg: '获取成功',
      data: resArr
    })
  });
});

router.post('/getContactInfo', function(req, res, next) {
  var query = new AV.Query('wx_users');
  query.get(req.body.userId).then(function (data) {
    res.send({
      type: 1,
      msg: '获取成功',
      data: {
        name: data.attributes.nickname,
        headimg: data.attributes.headimg,
      }
    })
  });
});

router.post('/sendMsg', function(req, res, next) {
  var query = new AV.Query('wx_session_lists');
  var members = [req.body.me,req.body.userId];
  query.containsAll('members', members);
  query.first().then(function (data) {
    if(data){
      res.send({
        type: 1,
        msg: '获取成功',
        data: data.id
      });
    }else{
      var Session = AV.Object.extend('wx_session_lists');
      var session = new Session();
      session.set('sessionType',0);
      session.set('members',members);
      session.save().then(function(newSession){
        res.send({
          type: 1,
          msg: '获取成功',
          data: newSession.id
        });
      });
    }
    /**/
  });
});

module.exports = router;
