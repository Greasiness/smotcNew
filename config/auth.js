// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1499356953612509', // your App ID
		'clientSecret' 	: '6a69fb659829ca576e3e800266c1cc21', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'HJRL3YNUwivsj6dboS2vc6Jpy',
		'consumerSecret' 	: 'byCYImP4lVCpnuJHrdh6i9X3FkUXKMq18jGtnkUBxeoaYr5oWI',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '419858139583-mu662q2107r0vpuagu6cpqapiistl191.apps.googleusercontent.com',
		'clientSecret' 	: 'eTY9l1pRp5DALkjONfNh3hLz',
		'callbackURL' 	: 'http://127.0.0.1:8080/auth/google/callback'
	}

};