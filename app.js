require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
// const Campground = require('./models/campground');
// const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds');
const port = process.env.PORT || 8000;

// Requiring Routes
var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    authRoutes = require('./routes/index')



mongoose.connect("mongodb://localhost/yelp_camp_final");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //seeds the database

app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Kpop girls are so hot!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware that puts currentUser in all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, () => console.log(`YelpCamp server is listening on port ${ port }`));