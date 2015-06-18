var express = require('express');
var router = express.Router();

/* Initialise User model */
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
	res.render('register', {
		'title': 'Register'
	});
});

router.get('/login', function(req, res, next) {
	res.render('login', {
		'title': 'Login'
	});
});

router.post('/register', function(req, res, next) {
	/* Get form values */
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	/* Check for image field */
	if (req.files.profileimage) {
		console.log('Uploading file...');

		/* Get file information */
		var profileImageOriginalName = req.files.profileimage.originalname;
		var profileImageName 		 = req.files.profileimage.name;
		var profileImageMime 		 = req.files.profileimage.mimetype;
		var profileImagePath 		 = req.files.profileimage.path;
		var profileImageExtension 	 = req.files.profileimage.extension;
		var profileImageSize 		 = req.files.profileimage.size;
	}
	else {
		/* Set a default image */
		var profileImageName = 'noimage.png';
	}

	/* Form validation */
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Valid email address required').isEmail();
	req.checkBody('username', 'Username field is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	/* Check for errors */
	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
	}
	else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileImage: profileImageName
		});

		/* Create user */
		User.createUser(newUser, function(err, user) {
			if (err) throw err;
			console.log(user);
		});

		/* Success message */
		req.flash('success','You are now a registered and may log in');

		/* Send user to homepage */
		res.location('/');
		res.redirect('/');
	}
});

module.exports = router;
