var express =  require("express");
var exphbs = require('express-handlebars');
var request = require('request');
var path = require("path");
var querystring = require('querystring')

var app = express();
var PORT = 3000;

var ACCESS_TOKEN='';
var CLIENT_ID = 'fec535d5d4744523b272cde10c533caa'
var CLIENT_SECRET = '7b0e709d6ec7426ba0a67a2184a4452f'
var REDIRECT_URI = 'http://127.0.0.1:3000/auth/finalize'

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));


app.get("/", function(req, res){
  ACCESS_TOKEN = ''
  res.render('home', {layout: 'homepage'})
});

app.get('/authorize', function(req, res){
  var qs = {
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code'
  }

  var query = querystring.stringify(qs)

  var url = 'https://api.instagram.com/oauth/authorize/?' + query

  res.redirect(url)
})

app.get('/auth/finalize', function(req, res){
var post_data = {
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  redirect_uri: REDIRECT_URI,
  grant_type: 'authorization_code',
  code: req.query.code
}

  var options = {
    url: 'https://api.instagram.com/oauth/access_token',
    form: post_data
  }

  request.post(options, function(error, response, body){
    var data = JSON.parse(body)
    ACCESS_TOKEN = data.access_token
    res.redirect('/dashboard')
  })
})

app.get("/dashboard", function(req, res){
  var options = {
    url: 'https://api.instagram.com/v1/users/self/feed?access_token=' + ACCESS_TOKEN
  }
    request.get(options, function(error, response, body){
    var feed = JSON.parse(body)
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

app.listen(PORT);
