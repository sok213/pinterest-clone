const express  = require('express'),
_              = require('lodash'),
{User}         = require('./../models/user'),
{TwitterUser}  = require('./../models/twitter-user'),
{RecentImages} = require('./../models/recent-images'),
passport       = require('passport');

// Retrieve Modules.
const router = express.Router();

// Public route for home page.
router.get('/', (req, res) => {
  // Retrieve 10 most recent images and display to home page.
  let findRecent20 = RecentImages.find({}).sort({$natural:-1}).limit(20);
  findRecent20.exec((err, images) => {
    res.render('home', {
      recentImages: images
    });
  });
});

// Public route for sign up.
router.get('/login', (req, res) => {
  res.render('login');
});

// Public route for sign up.
router.get('/signup', (req, res) => {
  res.render('sign-up');
});

// POST /login to sign-in existing users.
router.post('/login', passport.authenticate('local', 
  { successRedirect: '/users/myprofile', 
    failureRedirect: '/login', 
    failureFlash: true
  }));

// GET /login-twitter to sign-in with Twitter account.
router.get('/login-twitter',
  passport.authenticate('twitter'));

// Twitter authentication callback url.
router.get('/login-twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/users/myprofile');
});

// POST /view-profile/:id to view public profile of a user.
router.get('/view-profile/:id', (req, res) => {
  let userId = req.params.id;
  
  TwitterUser.findById(userId, (err, user) => {
    if(err) {
      return console.log(err);
    }
    
    if(user) {
      return res.render('public-profile', {
        someUser: user
      });
    }
    
    User.findById(userId, (err, userDoc) => {
      if(err) {
        return console.log(err);
      }
      return res.render('public-profile', {
        someUser: userDoc
      });
    });
  });
});

// Logout the user.
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;