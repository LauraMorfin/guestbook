var express = require('express');
var router = express.Router();
//Auth0
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
//Auth0


// Get the user profile auth0
router.get('/', ensureLoggedIn, function(req, res, next) {
res.render('user', {
    user: req.user ,
    userProfile: JSON.stringify(req.user, null, '  ')
  });
});
//auth0

module.exports = router;
