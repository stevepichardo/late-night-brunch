var express = require('express');
var bodyParser = require('body-parser');
require('dotenv').config();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const yelp = require('yelp-fusion');
const client = yelp.client(process.env.CLIENT_API);

//set up template engine
app.set('view engine', 'pug');

//static files
app.use('/static', express.static('public'));

app.get('/', function (req,res){
  res.render('index', {title: 'Late Night Brunch'});
});

app.get('/search', function(req,res){

  var searchData;
  if (!req.query.latitude && !req.query.longitude){
    searchData = {
      term: req.query.healthSearch,
      price: req.query.priceRange,
      location: req.query.restaurantLocation,
      open_now: true
    };
  } else {
    searchData = {
      term: req.query.healthSearch,
      price: req.query.priceRange,
      latitude: parseFloat(req.query.latitude),
      longitude: parseFloat(req.query.longitude),
      open_now: true
    };
  }

client.search(searchData).then(response => {
  res.json(response.jsonBody.businesses);
  }).catch(e => {
    res.status(e.statusCode).json({e});
  });
});

//listen to port
app.listen(3000);
console.log("listening to port 3000");
