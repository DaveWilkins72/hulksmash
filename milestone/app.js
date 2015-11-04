var express =  require("express");
var exphbs = require('express-handlebars');
var request = require('request');
var path = require("path");

var app = express();
var ACCESS_TOKEN='your access token here';
var PORT = 3000

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){
  ACCESS_TOKEN = ''
  res.render('home', {layout: 'homepage'})
});

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
