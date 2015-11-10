var express =  require("express");
var exphbs = require('express-handlebars');
var request = require('request');
var path = require("path");
var querystring = require('querystring')
var cfg = require('./config')
var session = require('express-session')

var app = express();
var PORT = 3000;

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName: 'session',
  secret: 'bcb',
  resave: false,
  saveUninitialized: true
}))

app.get("/", function(req, res){
  req.session.access_token = ''
  res.render('home', {layout: 'homepage'})
});

app.get('/authorize', function(req, res){
  var qs = {
    client_id: cfg.client_id,
    redirect_uri: cfg.redirect_uri,
    response_type: 'code'
  }

  var query = querystring.stringify(qs)

  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

app.get('/auth/finalize', function(req, res, next){
  if (req.query.error == 'access_denied') {
      return res.redirect('/')
  }

  var post_data = {
    client_id: cfg.client_id,
    client_secret: cfg.client_secret,
    redirect_uri: cfg.redirect_uri,
    grant_type: 'authorization_code',
    code: req.query.code
  }

  var options = {
    url: 'https://api.instagram.com/oauth/access_token',
    form: post_data
  }

  request.post(options, function(error, response, body){
    try {
      var data = JSON.parse(body)
    }
    catch(err) {
      return next(err)
    }

    req.session.access_token = data.access_token
    res.redirect('/dashboard')
  })
})

app.get("/dashboard", function(req, res, next){
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + req.session.access_token
  }
    request.get(options, function(error, response, body){
    try {
      var feed = JSON.parse(body)
      if (feed.meta.code > 200) {
        return next(feed.meta.error_message)
      }
    }
    catch(err) {
      return next(err)
    }

    res.render('dashboard', {
      feed: feed.data
    })
  })
});

app.get("/profile", function(req, res){
  res.render('profile', {})
});

app.get("/search", function(req, res){
  res.render('search', {})
});

app.get("/savedSearch", function(req, res){
  res.render('savedSearch', {})
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err,
    error: {}
  })
})

app.listen(PORT);
