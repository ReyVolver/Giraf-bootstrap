
module.exports = function(req, res, next) {
  if (!req.session.loggeduser || req.session.loggeduser.role != 2) {
    res.redirect('/');
  } else {
    next();
  }
}