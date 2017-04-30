const express  = require('express'),
_              = require('lodash'),
{User}         = require('./../models/user'),
passport       = require('passport');

// Retrieve Modules.
const router = express.Router();

// Public route for home page.
router.get('/', (req, res) => {
  //console.log(res.locals);
  res.render('home');
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
  { successRedirect: '/', 
    failureRedirect: '/login', 
    failureFlash: true
  }), 
  (req, res) => {
    res.redirect('/');
});

// GET /login-twitter to sign-in with Twitter account.
// router.get('/login-twitter', passport.authenticate('twitter', 
//   { successRedirect: '/', 
//     failureRedirect: '/login', 
//     failureFlash: true
//   }), 
//   (req, res) => {
//     res.redirect('/');
// });

router.get('/login-twitter',
  passport.authenticate('twitter'));

router.get('/login-twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
});

// Logout the user.
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Public route for 404 page.
router.get('*', (req, res) => {
  res.status(404).render('404', {
    error_msg: 'Page not found.'
  });
});

module.exports = router;