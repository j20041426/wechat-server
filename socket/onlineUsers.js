var io = (function(){
  var onlineLists;
  
  return {
    add: function(user){
      if(!this.onlineLists){
        this.onlineLists = new Object();
      }
      if(!this.onlineLists.hasOwnProperty(user.userId)){
        this.onlineLists[user.userId] = user.socket;
      }
    },
    
    remove: function(socket){
      for(var l in this.onlineLists){
        if(this.onlineLists[l].id === socket.id){
          delete this.onlineLists[l];
        }
      }
    },
    
    getLists: function(){
      return this.onlineLists;
    },
    
    getSocketById: function(userId){
      if(this.onlineLists.hasOwnProperty(userId)){
        return this.onlineLists[userId];
      }else{
        return false;
      }
    }
  }
})();

module.exports = io;
