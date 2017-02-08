var Bot = require('./js/bot')
  , config1 = require('./js/config');

var bot = new Bot(config1);

var express = require('express')
var app = express();

console.log('Dropped iPad: Running.');

app.get('/', function(req, res){
    res.send('@iPad_on_my_face');
});
var port = process.env.PORT || 5000;
app.listen(port);

//get date string for today's date (e.g. '2011-01-01')
function datestring () {
  var d = new Date(Date.now() - 5*60*60*1000);  //est timezone
  return d.getUTCFullYear()   + '-'
     +  (d.getUTCMonth() + 1) + '-'
     +   d.getDate();
};

var tweetAndFollow = function() {

    var params = {
        q: 'dropped%2C%20ipad%20"%20"on%20my%20face""%20-almost%2C%20-"you%20-guys%20-I%20-dropped%20-an%20-iPad%20-on%20-my%20-face"%2C%20-"%40ArianaGrande"', 
        result_type: 'mixed',
        count: '50'
    };

    bot.twit.get('search/tweets', params, function (err, reply) {
        if(err) return handleError(err);

        var tweets = reply.statuses
        , i = tweets.length
        , tweetToRetweet = randIndex(tweets);

        bot.retweet(tweetToRetweet.id_str, function (err, reply) {
            
            if (err && err.statusCode == 403) { // If 403 error (usually means duplicate tweet)...
                console.log('Duplicate tweet found.')
            } else if(err) { // If non 403 error...
                return handleError(err);
            } else { // If original tweet found...
                console.log('\nTweet: ' + (reply ? reply.text : reply));

                bot.follow(tweetToRetweet.user.id, function (err, reply) {

                    if (err && err.statusCode == 403) { // If 403 error (usually means duplicate user)...
                        console.log('Duplicate user found.')
                    } else if(err) { // If non 403 error...
                        return handleError(err);
                    } else { // If unfollowed user found...
                        console.log('\nFollowed: ' + (reply.name));
                    }
                });
            }
        });        
    }); 
}

var time = 1000*60*5 //Attempts a retweet every 5 minutes

var init = function () {
    tweetAndFollow();
    clearInterval(interval);
    time = 1000*60*5;
    interval = setInterval(init, time);
}

tweetAndFollow();

var interval = setInterval(init, time);
  

function handleError(err) {
  console.error('response status:', err.statusCode);
  console.error('data:', err.data);
}

function randIndex (arr) {
  var index = Math.floor(arr.length*Math.random());
  return arr[index];
};

