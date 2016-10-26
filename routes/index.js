var express = require('express');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();


/* GET Userlist page. */
router.get('/', function(req, res) {
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
router.get('/:id', function(req,res){
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


module.exports = router;
