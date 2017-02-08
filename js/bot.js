//
//  Bot
//  class for performing various twitter actions
//
var Twit = require('../node_modules/twit/lib/twitter');

var Bot = module.exports = function(config) { 
  this.twit = new Twit(config);
};

//
//  post a tweet
//
Bot.prototype.tweet = function (status, callback) {
  if(typeof status !== 'string') {
    return callback(new Error('tweet must be of type String'));
  } else if(status.length > 140) {
    return callback(new Error('tweet is too long: ' + status.length));
  }
  this.twit.post('statuses/update', { status: status }, callback);
};

//
//  retweet a tweet with ID
//
Bot.prototype.retweet = function (id, callback) {
    var self = this;
    self.twit.post('statuses/retweet/:id', { id: id }, callback);
};

//
//  follow a user with ID
//
Bot.prototype.follow = function (id, callback) {
    var self = this;
    self.twit.post('friendships/create', { id: id }, callback); 
}


function randIndex (arr) {
  var index = Math.floor(arr.length*Math.random());
  return arr[index];
};