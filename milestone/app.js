var express =  require("express");
var exphbs = require('express-handlebars');
var request = require('request');
var path = require("path");

var app = express();
var PORT = 3000

app.engine('handlebars', exphbs({defaultLayout: 'base'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res){

  res.render('home', {})
});

app.get("/dashboard", function(req, res){

  res.render('dashboard', {})
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
