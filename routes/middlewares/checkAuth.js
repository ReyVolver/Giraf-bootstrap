var mongoose = require('mongoose'),
    User = mongoose.model('User');


module.exports = function(req, res, next) {
  if (!req.session.loggeduser) {
    res.redirect('/');
  } else {
  	res.locals.loggeduser = req.session.loggeduser;
    next();
  }
}