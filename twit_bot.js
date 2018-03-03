var fs = require('fs');
var path = require('path');
var Twit = require('twit');
var giphyConfig = require('./config').Giphy;
var twitterConfig = require('./config').Twitter;
var T = new Twit(twitterConfig);
var giphy = require("giphy-api")(giphyConfig);



function search(params) {

	T.get('search/tweets', params, handleSearch);

	function handleSearch(err, data, response) {
		if (err) {
			console.log(err);
		}
	}
}



function tweet(text) {

	var params = {
		status: text,
	};

	T.post('statuses/update', params, handleTweet);

	function handleTweet(err, data, response) {
		if (err) {
			console.log(err);
		}
	}
}

function tweetPic(usr, str) {

	giphy.translate(str, function(err, res) {
		if (err) {
			console.log(err);
		};

		var gifUrl = res.data.bitly_url;

		tweet(usr.toString() + ' tweeted ' + str + ' ' + gifUrl);
	});



}

function message(id, text) {

	var params = {
		"event": {
			"type": "message_create",
			"message_create": {
				"target": {
					"recipient_id": id.toString(),
				},
				"message_data": {
					"text": text,
				}
			}
		}
	}

	T.post('direct_messages/events/new', params, handleDM);

	function handleDM(err, data, response) {
		if (err) {
			console.log(err);
		}
	}

}



function handleFollow(data) {

	message(data.source.id, 'Chirp Chirp!! Thanks for following me! Here\'s a hug to brighten your day!');
	giphy.translate('virtual hug', function(err, res) {
		if (err) {
			console.log(err);
		};

		var gifUrl = res.data.bitly_url;
		message(data.source.id, gifUrl)
	});

}

function handleMention(data) {
	var is_quote = data.is_quote_status;
	var text = data.text;
	var user = data.user.screen_name;

	console.log(data);

	if (user != "tweetygifbot"){
		console.log('yeeeeeeee');
		tweetPic(user, text);
	}
	

}

//starting a User Stream
var stream = T.stream('user');
var stream2 = T.stream('user');

stream.on('follow', handleFollow);
stream2.on('tweet', handleMention);