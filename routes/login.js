var express = require('express');
var router = express.Router();
var AV = require('leancloud-storage');

/* GET users listing. */
router.post('/', function(req, res, next) {
  var query = new AV.Query('wx_users');
  query.equalTo('username', req.body.username);
  query.find().then(function (results) {
    if(results.length > 0){
      res.send({
        type: 1,
        msg: '登录成功',
        data: {
          userId: results[0].id,
          info: results[0].attributes
        }
      })
    }else{
      res.send({
        type: 0,
        msg: '该微信号不存在',
        data: {}
      })
    }
  });
});

module.exports = router;
