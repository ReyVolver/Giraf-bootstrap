var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Promotion = mongoose.model('Promotion'),
	Class = mongoose.model('Class');

// function userMenu(user){
// 	var menu = {promotions: []};

// 	Promotion.find({users.email: user.email}, function(err, promos){
// 		menu.promotions.push()


// 	});
// }


module.exports = function(req, res, next) {
  if (!req.session.loggeduser) {
    res.redirect('/');
  } else {
  	res.locals.loggeduser = req.session.loggeduser;
    // res.locals.usermenu = uesrMenu(res.locals.loggeduser);
    next();
  }
}