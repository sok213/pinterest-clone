// Default Modules.
const express  = require('express'),
mongoose       = require('mongoose'),
_              = require('lodash'),
{User}         = require('./../models/user'),
{TwitterUser}  = require('./../models/twitter-user'),
{authenticate} = require('./../middleware/authenticate');

// Retrieve Modules.
const router = express.Router();

// Private route for user profile.
router.get('/myprofile', authenticate, (req, res) => {
  res.render('myprofile', {
    helpers: {
      convertjson: function(context) {
        return JSON.stringify(context);
      } 
    }
  });
});

// POST /add-image-link for adding image links to profile.
router.post('/add-image-link', authenticate, (req, res) => {
  let user = res.locals.user;
  let imageURL = req.body.imageLink;
  
  if(user.twitterId) {
    TwitterUser.findByIdAndUpdate(user._id, 
      { $push: { images: { 
        imageURL,
        imageId: mongoose.Types.ObjectId()
      }} }, 
      (err, user) => { 
        // Callback that does nothing 
      });
    
    return res.redirect('/users/myprofile');
  }
  
  User.findByIdAndUpdate(user._id, 
    { $push: { images: { 
      imageURL,
      imageId: mongoose.Types.ObjectId()
    }} }, 
    (err, user) => {
      // Callback that does nothing 
    });
  
  return res.redirect('/users/myprofile');
});

// POST /remove-image for removing image from profile.
router.post('/remove-image', authenticate, (req, res) => {
  let user = res.locals.user;
  let imageId = req.body.imageId;
  
  if(user.twitterId) {
    TwitterUser.findByIdAndUpdate(user._id, 
      { $pull: { images: { imageId: mongoose.Types.ObjectId(imageId) }} }, 
      (err, user) => {
        if(err) { return console.log(err); }
        console.log('Removed image.');
    });
    
  } else {
    User.findByIdAndUpdate(user._id, 
      { $pull: { images: { imageId: mongoose.Types.ObjectId(imageId) }} }, 
      (err, user) => {
        if(err) { return console.log(err); }
        console.log('Removed image.');
    });
  }
});

// POST /users/register for users to create a new account.
router.post('/register', (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'username']);  
  let user = new User(body);
  
  // Checks if form was properly filled out (validation).
  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match')
    .equals(req.body.password);
    
  // If form was incorrectly filled out, store the errors in 
  // variable errors.
  let errors = req.validationErrors();
  
  if(errors) {
    return res.render('sign-up', { errors });
  }
  
  // Check if user name already exists.
  User.find({username: body.username}, (err, result) => {
    if(err) throw err;
    if(result[0]) {
      return res.render('sign-up', {
        errors: [{msg: 'Username already exists!'}]
      });
    }
  
    // Creates a new user instance.
    let user = new User(body);
    
    // Saves user.
    user.save().then(() => {
      
      // After new user is created and saved to database, show a success 
      // message via flash() method.
      req.flash('success_msg', 'You are registered and can now login.');
      
      // Send back the user document after new user is saved.
      res.redirect('/login');
    }).catch((err) => {
      res.render('sign-up', {
        errors: [{msg: 'Email already exists!'}]
      });
    });
  });
});

// Public route for 404 page.
router.get('*', (req, res) => {
  res.status(404).render('404', {
    error_msg: 'Page not found.'
  });
});

// Export the router methods.
module.exports = router;
