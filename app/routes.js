module.exports = function(app, passport) {
    var User       = require('../app/models/user');
// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

    app.post('/submit', function(req, res){
        var user = req.user;
                user.application.firstName = req.body.element_1_1;
                user.application.lastName = req.body.element_1_2;
                user.application.email = req.body.element_2;
                user.application.address.street = req.body.element_3_1;
                user.application.address.lineTwo = req.body.element_3_2;
                user.application.address.city = req.body.element_3_3;
                user.application.address.state = req.body.element_3_4;
                user.application.address.zipCode = req.body.element_3_5;
                user.application.address.country = req.body.element_3_6;
                user.application.county = req.body.element_10;
                user.application.dateOfBirth.month = req.body.element_4_1;
                user.application.dateOfBirth.day = req.body.element_4_2;
                user.application.dateOfBirth.year = req.body.element_4_3;
                user.application.phone.areaCode = req.body.element_5_1;
                user.application.phone.firstNumber = req.body.element_5_2;
                user.application.phone.secondNumber = req.body.element_5_3;
                user.application.school = req.body.element_6;
                user.application.graduationDate.month = req.body.element_7_1;
                user.application.graduationDate.day = req.body.element_7_2;
                user.application.graduationDate.year = req.body.element_7_3;
                user.application.GPA = req.body.element_8;
                user.application.essay = req.body.element_9;
                user.favorite = false;
                user.save(function(err) {
                    if (err)
                        throw err;
                    res.redirect('/profile');

                    })
    });
    app.get('/admin', function(req, res){
        res.render('adminHome.ejs');
    });
	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
        User.findOne({email: req.user.email}, function(err, user){
            if(err)
                console.log(err);
            if(user.type == "user")
                res.render('form.html');
            else
                res.redirect('/admin');
        });
	});

    app.post('/favorite', function(req, res){
        console.log("favoring " + req.body.email);
        User.findOne({email: req.body.email}, function(err, user){
            if(err)
                console.log(err)
            user.favorite = true;
            user.save(function(err) {
                if (err)
                    throw err;
                res.redirect('/admin');

            })
        })
    });
    app.post('/unfavorite', function(req, res){
        console.log("unfaving" + req.body.email);
        User.findOne({email: req.body.email}, function(err, user){
            if(err)
                console.log(err)
            user.favorite = false;
            user.save(function(err) {
                if (err)
                    throw err;
                res.redirect('/admin');

            })
        })
    });
    app.get('/userRetrieve', function(req, res){
        User.findOne({email: req.user.email}, function(err, user){
            if(err)
                console.log(err);
            if(user.application == undefined){
                //console.log("sending null");
                res.send(null);
            }
            else{
                //console.log("sending something");
                res.send(user.application);
            }
        });
    });
    app.get('/allRetrieve', function(req, res){
        User.find({favorite: false}, function(err, users){
            if(err)
                console.log(err);
            if(users == undefined){
               // console.log("sending null");
                res.send(null);
            }
            else{
               // console.log("sending something");
                res.send(users);
            }
        });
    });
    app.get('/favRetrieve', function(req, res){
        User.find({favorite: true}, function(err, users){
            if(err)
                console.log(err);
            if(users == undefined){
                console.log("sending null");
                res.send(null);
            }
            else{
                console.log("sending something");
                res.send(users);
            }
        });
    });
	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessagepoopoo') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}