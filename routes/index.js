var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();
var passport = require('passport');
//Auth0
// var requireRole = require('../requireRole');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

// Get the user profile
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('user', { user: req.user });
});



//Auth0

var env = {
 AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
 AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
 AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};

/* GET Userlist page. */
router.get('/', ensureLoggedIn, function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('index', {
            "userlist" : docs
        });
    });
});

/* GET New User Page*/
router.get('/newuser',function(req,res){
	res.render('newuser',{ title:'Add New User'});
})


/* POST to Add User Service */
router.post('/adduser', function(req,res){
	//set our internal db variable
	var db = req.db;

	//get our form values, these rely on the "name attributes"
	var userName = req.body.username;
	var userEmail = req.body.useremail;
	var userComment = req.body.usercomment;

	//set our collection
	var collection = db.get('usercollection');

	//submit to the db
	collection.insert({
		"username" :userName,
		"email": userEmail,
		"comment": userComment

	}, function(err,doc){
		if(err){
			//if it failed, return error
			res.send("There was a problem adding the information to the database");
		}
		else{
			//ad forward to sucess page
			res.redirect("/");
		}
	});
});

//delete guest book entry
router.get('/delete/:id', function(req,res){
	var id = req.params.id;
	var objectId = new ObjectID(id);

	var db = req.db;
	var collection = db.get('usercollection');
	console.log(collection);
	collection.remove({_id: objectId});
	res.redirect('/');


});

router.get('/:id/usermessage', function(req,res){
	var id = req.params.id;
	var objectId = new ObjectID(id);

	var db = req.db;
	var collection = db.get('usercollection');
	console.log(collection);
	collection.find({_id: objectId}, function(err, result){

		if(err){
			res.send("there was an error");
		}
		else{
		res.render('message', {
				"usermessage" : result
			});
		//res.json(result);
		}
	});
});
//auth0
// Render the login template
router.get('/login',
  function(req, res, next){

    res.render('login', { env: env });
  });

// Perform session logout and redirect to homepage
router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/user'
router.get('/callback',
  passport.authenticate('auth0', {
     failureRedirect: '/login' ,
   }),
  function(req, res) {
    res.render('callback', {
      env:env,
      user: req.user,
    });
});
// router.get('/link',
// unsureLoggedIn,
// function(req, res) {
//   res.render('link', {env: env});
// });

// router.get('/admin',
//   requireRole('admin'),
//   function(req,res) {
//     res.render('admin');
// });

router.get('/unauthorized', function(req, res){
  res.render('unauthorized', {env:env});
});


  //auth0

module.exports = router;
