var online = require('./onlineUsers.js')
var AV = require('leancloud-storage');

var socket = {
  init: function(app){
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    
    //配置端口
    var port = process.env.PORT || 9999;
    
    //socket连接
    io.on("connection", function(socket){
      console.log('client connected.');
      socket.on('join',function(data){
        online.add({
          userId: data,
          socket: socket
        });
      });
      socket.on('send',function(data){
        var Msg = AV.Object.extend('wx_sessions');
        var msg = new Msg();
        msg.set('sessionId',data.session);
        msg.set('content',data.msg);
        msg.set('from',data.from);
        msg.set('type','msg');
        msg.save().then(function() {
          var query = new AV.Query('wx_session_lists');
          return query.get(data.session)
        }).then(function(results){
          for(var l in results.attributes.members){
            online.getSocketById(results.attributes.members[l]).emit('refresh');
          }
        });
      });
      socket.on('disconnect',function(){
        online.remove(socket);
      });
    });
    http.listen(port,function(){
      console.log('正在监听'+port+'端口');
    });
  }
}

module.exports = socket;
