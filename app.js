/**
 * Module dependencies.
 */
var express = require('express')
  , io = require('socket.io')
  , http = require('http')
  , twitter = require('ntwitter')
  , cronJob = require('cron').CronJob
  , _ = require('underscore')
  , path = require('path')
  , $ = require('jquery')

//Create an express app
var app = express();

//Create the HTTP server with the express app as an argument
var server = http.createServer(app);


// Twitter symbols array
// var watchSymbols = ['coca cola', 'pepsi', 'nike', 'adidas', "mcdonald's",
//                    'burger king', 'mercedes', 'bmw', 'audi', 'gilette',
//                    'microsoft', 'visa', 'walmart', 'mastercard', 'disney',
//                    'samsung', 'louis vuitton', 'zara', 'hermes', 'starbucks',
//                    'h&m', 'siemens', 'ikea', 'target', 'red bull', 'nissan',
//                    'prada', 'abercrombie', 'j crew', 'lululemon', 'ugg',
//                    'armani', 'chipotle', 'the north face', 'real madrid',
//                    'godiva', "macy's", 'nordstrom', 'sears', 'sephora',
//                    'urban outfitters', 'vans', "victoria's secret",
//                    'victorinox', 'oakley', 'ray ban', 'madewell', 'lacoste',
//                    'lego', 'lenscrafters', "levi's", 'lindt', 'puma',
//                    'amazon', 'gucci', 'versace', 'ford', 'hyundai', 'sony',
//                    'nestle', 'cartier', 'porsche', 'kfc', 'sprite', 'mtv',
//                    'jack daniels', 'ralph lauren', 'smirnoff'];

var watchSymbols = ['adidas', 'nike', 'audi', 'mercedes', 'coca cola', 'mcdonalds',
                    'burger king', 'pepsi', 'starbucks', 'disney', 'walmart', 'amazon',
                    'chipotle', 'bmw', 'samsung', 'gucci', 'ikea', 'lululemon', 'snapchat']
                     // 'real madrid', 'amazon',  'sony', 'facebook', 'google', 'snapchat', 'twitter']

//This structure will keep the total number of tweets received and a map of all the symbols and how many tweets received of that symbol
var watchList = {
    total: 0,
    symbols: {}
};

//Set the watch symbols to zero.
_.each(watchSymbols, function(v) { watchList.symbols[v] = 0; });

//Generic Express setup
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//We're using bower components so add it to the path to make things easier
app.use('/components', express.static(path.join(__dirname, 'components')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Our only route! Render it with the current watchList
app.get('/', function(req, res) {
	res.render('index', { data: watchList });
});

//Start a Socket.IO listen
var sockets = io.listen(server);

//Set the sockets.io configuration.
//THIS IS NECESSARY ONLY FOR HEROKU!
sockets.configure(function() {
  sockets.set('transports', ['xhr-polling']);
  sockets.set('polling duration', 10);
});

//If the client just connected, give them fresh data!
// sockets.sockets.on('connection', function(socket) { 
//     socket.emit('data', watchList);
// });

//Instantiate the twitter component
//You will need to get your own key. Don't worry, it's free. But I cannot provide you one
//since it will instantiate a connection on my behalf and will drop all other streaming connections.
//Check out: https://dev.twitter.com/
var t = new twitter({
    consumer_key: '13wjAb9GLLP3O9onQuM1Ew',           // <--- FILL ME IN
    consumer_secret: 'agpSyJzyMnvIBEkfaCdGv2EoIKWVNo0qYkjuGoMbjjg',        // <--- FILL ME IN
    access_token_key: '1552105075-fDyEqGl2qTOgFzdfJZAOAkZwlXdq7AXRxs2OZm4',       // <--- FILL ME IN
    access_token_secret: 'hbEZp3o075kvf7DS2v3RGhE9CGAzjzIVnqLI16w5kDGvK'      // <--- FILL ME IN
});

// //Tell the twitter API to filter on the watchSymbols 
sockets.sockets.on('connection', function(socket){
  t.stream('statuses/filter', { track: watchSymbols }, function(stream) {
    stream.on('data', function(data){
      // console.log(data)
      if(data.text !== undefined){
        if(data.geo !== null){
          socket.emit('twitter',{tweet:data.text, geo: data.coordinates.coordinates, user: data.user.id});
          // console.log(data)
        }
        else if(data.user.location != ""){
           $.ajax({
            url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + data.user.location + '&sensor=true',
            success: function(gmap){
              if(gmap.results[0] != undefined){
                socket.emit('twitter',{tweet:data.text, 
                                       geo: [gmap.results[0].geometry.location.lng, gmap.results[0].geometry.location.lat], 
                                       user: data.user.id});
              }
            }
           });
        }
      }
    })
  })
});

//Create the server
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
