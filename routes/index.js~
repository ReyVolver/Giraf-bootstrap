
/*
 * GET home page.
 */

var index = require('../controllers/index'),
	users = require('../controllers/users'),
    checkAuth = require('./middlewares/checkAuth');

module.exports = function(app){
  
  	// Index routes
  	//  '/' when logged in will redirect to '/dashboard'
	app.get('/', index.index);
	app.get('/login', index.index);
	app.get('/signup', index.index);

	// Login and Signup
	app.post('/login', index.login);
	app.post('/signup', index.signup);

	// Logout
	app.get('/logout', function(req, res){
		delete req.session.loggeduser;
		res.redirect('/');
	});

	app.get('/dashboard', checkAuth, index.dashboard);
	
};