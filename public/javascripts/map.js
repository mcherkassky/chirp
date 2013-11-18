var width = 1280,
    height = 660;

var projection = d3.geo.mercator()
    .scale(220)
    .translate([650,420])

var brands = {'adidas':'/images/adidas.gif',
              'nike': '/images/nike.gif',
              'audi': '/images/audi.gif',
              'mercedes': 'images/mercedes.gif',
              'coca cola': 'images/coke.gif',
              'mcdonalds': 'images/mcdonalds.gif',
              'burger king': 'images/burger_king.gif',
              'pepsi': 'images/pepsi.gif',
              'starbucks': 'images/starbucks.png',
              'disney': 'images/disney.png',
              'walmart': 'images/walmart.gif',
              'microsoft': 'images/microsoft.gif',
              'chipotle': 'images/chipotle.png',
              'bmw': 'images/bmw.png',
              'samsung': 'images/samsung.png',
              'gucci': 'images/gucci.gif',
              'ikea': 'images/ikea.jpg',
              'visa': 'images/visa.gif',
              'red bull': 'images/red bull.gif',
              'louis vuitton': 'images/louis vuitton.svg',
              'lululemon': 'images/lululemon.png',
              'armani': 'images/armani.png',
              'real madrid': 'images/real madrid.png',
              'manchester united': 'images/manchester united.gif',
              'godiva': 'images/godiva.gif',
              'amazon': 'images/amazon.gif',
              'jack daniels': 'images/jack daniels.gif',
              'sony': 'images/sony.gif',
              'victorias secret': 'images/victorias secret.gif',
              'facebook': 'images/facebook.gif',
              'google': 'images/google.png',
              'twitter': 'images/twitter.png',
              'snapchat': 'images/snapchat.png'
          }

var brand_keys = [];
for(var k in brands) brand_keys.push(k);
var match_brand = function(tweet, brands){
    matches = brands.map(function(w){
        if(tweet.indexOf(w) > -1){
            return w
        }
    })
    return matches.filter(function(e){return e})[0]
}

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg-map");

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");
d3.json("/components/topojson/world-110.json", function(error, topology) {
    svg.append("path")
      .datum(topojson.feature(topology, topology.objects.countries))
      .attr("d", d3.geo.path().projection(projection));
});

(function($) {
    $(document).ready(function() {
        // var $container = $('ul.tweets'),
        var socket = io.connect('http://localhost:3000')
            // template = $('#tweetTemplate');
            
 
        socket.on('twitter', function(data) {
            var coordinates = projection(data.geo);
            console.log(data.tweet)
            svg.append('image')
                .attr('id', data.user)
                .attr("xlink:href", brands[match_brand(data.tweet.toLowerCase(), brand_keys)])
                .attr('x', coordinates[0])
                .attr('y', coordinates[1])
                .attr('height', 50)
                .attr('width', 50)
                    // $container.append(template.render(data));
                setTimeout(function(){
                    $('#' + data.user).fadeOut(400);
                    $('#' + data.user).remove();
                },1000)
                
            });
    });
})(jQuery);