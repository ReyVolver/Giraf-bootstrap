var mongoose = require('mongoose')
	crypto = require('crypto');
var User = mongoose.model('User'),
	Promotion = mongoose.model('Promotion');



exports.index = function(req, res){
	if (req.session.loggeduser)
		return res.redirect('/dashboard');
	User.find(function(err, users){
		res.render('login', {users: users});
	});
}

exports.login = function(req, res){

	if (!req.body.email || !req.body.password)
		return res.render('login', {flash: {message:'Please fill email and password', type:'warning'}});

	User.findOne({email: req.body.email}, function(err, user){
		if (err){
			console.log(err);
			return res.redirect('/');
		}

		if (user.authenticate(req.body.password)){
			(user.role == 2) ? user.admin = true : user.admin = false;
			req.session.loggeduser = user;
			return res.redirect('/dashboard');
		}
		else{
			return res.render('login', {flash: {message:'Unknow email or password', type:'warning'}});
		}

	});
}

exports.signup = function(req, res){
	req.assert('email', 'Enter email').notEmpty().isEmail();
	req.assert('lastname', 'Enter username').notEmpty().isAlphanumeric().len(3,30);
	req.assert('firstname', 'Enter username').notEmpty().isAlphanumeric().len(3,30);

	req.assert('password', 'Password must be at least 6 characters long').notEmpty().notContains(' ').len(6,20);
	req.assert('password', 'Password don\'t match').is(req.body.password2);
	req.assert('password2', 'Enter confirmation password').notEmpty().notContains(' ').len(6,20);

	res.locals.err = req.validationErrors(true);
	res.locals.user = req.body;
	if ( res.locals.err ) {
		return res.render('login', {user: req.body});
	}

	var user = new User(req.body);
	user.save(function(err){
		if (err){
			switch(err.code) {
				case 11001:
				case 11000:
					error = {type: 'error', message: "Email already exist"};
					break;
				default: 
					error = {type: 'error', message: "Please fill all the fields"};
			}
			console.log(err);
			return res.render('login', {flash: error});
		}
		return res.render('login', { flash: { type:'success', message: "You can now log-in" } });
		
	});
}

exports.dashboard = function(req, res){
	var user = req.session.loggeduser;

	console.log(res.locals);

	if (user.role == 2){
		Promotion.find().sort('-updated_at').exec(function(err, promos){
			if (err) console.log(err);

			User.find({role: 0}).sort('name').exec(function(err, users){
				if (err) console.log(err);

				User.find({role: 1}).sort('name').exec(function(err, profs){
					if (err) console.log(err);

					return res.render('dashboard/admin', {promos: promos, users: users, professors: profs, flash: req.flash()});
				});
				
			});
		});
		
		

		

	}
}










