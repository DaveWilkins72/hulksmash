var express =  require("express");
var exphbs = require('express-handlebars');
var request = require('request');
var path = require("path");
var querystring = require('querystring')
var cfg = require('./config')
var session = require('express-session')
var bodyParser = require('body-parser')
var name;
var router = express.Router();
var SEARCH_QUERY = ''
var app = express();
var PORT = 3000;

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  cookieName: 'session',
  secret: 'bcb',
  resave: false,
  saveUninitialized: true
}))

app.get("/", function(req, res){
  req.session.access_token = null
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

    name = data.user.full_name
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
      feed: feed.data,
      Username: name
    })
  })
});

app.get("/profile", function(req, res, next){
  var options = {
    url: 'https://api.instagram.com/v1/users/self?access_token=' + req.session.access_token
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
    res.render('profile', {
      feed: feed.data,
      Username: name
    })
  })

});

app.get("/savedSearch", function(req, res){
  res.render('savedSearch', {
    Username: name
  })
});


// SEARCH PAGE \\

app.get('/search', function(req, res, next) {
  if (req.session.access_token == null) {
    res.redirect('localhost:3000/')
  } else {

    if (SEARCH_QUERY == '') {
      res.render('search', {
          title: 'Search',
          feed: {},
          Username: name
        })
      }
     else {


      var options = {
        url: 'https://api.instagram.com/v1/tags/' + SEARCH_QUERY + '/media/recent?access_token=' + req.session.access_token + '&count=9'

      }
      console.log(options.url)

      request.get(options, function(error, response, body) {

        if (error) {
          console.log("error if 1")
          return next(error)
        }
        try {
          var feed = JSON.parse(body)
        } catch (err) {
          console.log("error if 2")
            // return error if what we get back is HTML code
          return next(err) // displays the error on the page
            // return res.reditect('/') // just redirects to homepage
        }

        if (feed.meta.code > 200) {
          console.log("error code above 200")
          return next(feed.meta.error_message)
        }

        res.render('search', {
          title: 'Search',
          feed: feed.data,
          Username: name
        })
      })
    }
  }
})

app.post('/search', function(req, res) {
  var query = req.body.query

  var options = {
    url: 'https://api.instagram.com/v1/tags/' + query +'/media/recent?access_token=' + req.session.access_token
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

    res.render('search', {
      feed: feed.data,
      Username: name
    })
  })

})

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err,
    error: {}
  })
})


// SEARCH PAGE END \\

app.listen(PORT);
