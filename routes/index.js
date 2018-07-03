const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Campground = require('../models/campground');

// Root Route
router.get('/', function(req, res) {
    res.render('landing')
});

// ====================
// AUTH ROUTES
// ====================

// show register form
router.get('/register', function(req, res) {
    res.render('register', { page: 'register' });
});

// handle sign up logic
router.post('/register', function(req, res) {
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });

    if (req.body.adminCode === 'contraCode') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function() {
            req.flash('success', 'Welcome to YelpCamp ' + user.username);
            res.redirect('/campgrounds');
        })
    });
});

// show login form
router.get('/login', function(req, res) {
    res.render('login', { page: 'login' });
});

// Handling login logic
router.post('/login', passport.authenticate('local', {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Welcome to YelpCamp!'
}), function(req, res) {});

// logout route logic
router.get('/logout', function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect('/campgrounds');
});

// USER PROFILE
router.get('/users/:id', function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            req.flash("error", "Something went wrong.");
            res.redirect("/");
        }
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
            if (err) {
                req.flash("error", "Something went wrong.");
                res.redirect("/");
            }
            res.render('users/show', { user: foundUser, campgrounds: campgrounds });
        });
    });
});

module.exports = router;