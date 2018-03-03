var Twit = require('twit');
var config = require('./config');
var T = new Twit(config);


var searchParams = {
	q: 'Lebron since:2017-07-11',
	count: 1
};

function search(params) {

	T.get('search/tweets', params, handleSearch);

	function handleSearch(err, data, response) {
		if (err) {
			console.log(err);
		} else {
			console.log(response);
		}
	}
}

var tweetParams = {
	status: 'Test Tweet'
};

function tweet(params) {


	T.post('statuses/update', params, handleTweet);

	function handleTweet(err, data, response) {
		if (err) {
			console.log(err);
		} else {
			console.log(response);
		}
	}
}

function message(id,text) {

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

	function handleDM(err,data,response){
		if(err){
			console.log(err);
		}
	}

}



function handleFollow(data) {
	console.log(data);
	//message(data.source.id,'Chirp Chirp!! Thanks for following me!');
}

//starting a User Stream
var stream = T.stream('user');

stream.on('follow', handleFollow);





















