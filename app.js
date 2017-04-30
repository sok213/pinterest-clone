const express   = require('express'),
path            = require('path'),
mongoose        = require('mongoose'),
config          = require('./config'),
bodyParser      = require('body-parser'),
expressValid    = require('express-validator'),
app             = express(),
session         = require('express-session'),
cookieParser    = require('cookie-parser'),
passport        = require('passport'),
LocalStrategy   = require('passport-local').Strategy,
TwitterStrategy = require('passport-twitter').Strategy,
flash           = require('connect-flash'),
{User}          = require('./models/user'),
{TwitterUser}   = require('./models/twitter-user'),
{authenticate}  = require('./middleware/authenticate'),
{ObjectID}      = require('mongodb'),
handleBars      = require('express-handlebars'),
port            = process.env.PORT || 3000,
db              = mongoose.connect(config.getDbConnectionString());

// Retrieve TwitterStrategy config values.
const TWITTER_CONSUMER_SECRET = config.TWITTER_CONSUMER_SECRET,
TWITTER_CONSUMER_KEY          = config.TWITTER_CONSUMER_KEY;

// Retrieve initial route.
const indexRoute = require('./routes/index'),
userRoute = require('./routes/users');

// Set bodyParser and cookieParser module. 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); 

// Set views and view engine to handleBars.
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handleBars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// Set the assets folder.
app.use(express.static(path.join(__dirname, 'public')));

// Sets Bootstrap and jQuery.
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); 
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// Set module folder 
app.use('/font-awesome', express.static(__dirname + 
  '/node_modules/font-awesome'));
  
app.use('/masonry-layout', express.static(__dirname + 
  '/node_modules/masonry-layout'));

// Configure session module.
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Configure passport module.
app.use(passport.initialize());
app.use(passport.session());

// Set flash module.
app.use(flash());

// Sets local variables to be used with HandleBars views.
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || req.twitterUser || null;
  res.locals.title = 'Winterest';
  res.locals.getLength = (trades) => {
    return trades.length;
  };
  next();
});

// Configure express-validator module.
// NOTE** This code snippet is borrowed from the express-validator
// documentation from github.
app.use(expressValid({
  errorFormatter: (param, msg, value) => {
      let namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Configure the Passport LocalStrategy for email/password authentication.
passport.use(new LocalStrategy(
  {
    usernameField: 'email'
  },
  (email, password, done) => {
    
    // Invoke getUserByEmail function from './models/users.js'.
    User.getUserByEmail(email, (err, user) => {
      //If user not found, return done() method with message of 'Unknown User'.
      if(err) throw err;
      if(!user) {
        return done(null, false, {message: 'Unknown user'});
      }

      // If user found, run comparePassword() function 
      // from './models/users.js'.
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        
        // If provided password matches the hashed password, retrun done() with
        // user passes in as parameter. Else, return done() with 
        // 'Invalid password'.
        if(isMatch) {
          return done(null, user);
        }
        
        return done(null, false, {message: 'Invalid password'});
      });
    });
  }
));

// Configure the Passport TwitterStrategy for sign-in authentication.
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://localhost:3000/login-twitter/callback'
  },
  function(token, tokenSecret, profile, cb) {
    TwitterUser.findOrCreate(profile, function (err, user) {
      // If user twitter user does not exist, create a new doc.
      console.log("USER: ", user);
      if(!user[0]) {
        // Create new Twitter user instance.
        let twitterUser = new TwitterUser({
          username: profile.username,
          twitterId: profile.id
        });
        
        // Saves user.
        twitterUser.save();
        return cb(err, twitterUser);
      }
      return cb(err, user[0]);
    });
  }
));

// Serialize and deserialize user instances to and from the Passport session.
passport.serializeUser((user, done) => {
  done(null, user.id || user.twitterId);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    if(user) {
      return done(err, user);
    }
    
    TwitterUser.getUserById(id, (err, user) => {
      return done(err, user);
    });
  });
});

// Set routes.
app.use('/', indexRoute);
app.use('/users', userRoute);

// Public route for 404 page.
app.get('*', (req, res) => {
  res.status(404).render('404', {
    error_msg: 'Page not found.'
  });
});

app.listen(port, () => console.log('Listening on PORT: ', port));
