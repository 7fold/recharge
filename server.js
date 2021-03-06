const express = require('express');
var request = require('request');
var url = require('url');
const app = express();
const port = process.env.PORT || 5000;


// var options = {
//     url: 'https://chargehub.azure-api.net/locationsdemo/',
//     headers: {
//       'Ocp-Apim-Subscription-Key': 'f53eee3a65f342e08e8ba7a453d95cce'
//     }
//   };
var ip_options = {
    url: 'http://ip-api.com/json/'
};



// app.get('/api/hello', function(req, res) {
//     request(options, function(error, response, body) {
//         res.json(body)
//     });
// });




app.get('/api/ip', function(req, res) {
    request(ip_options, function(error, response, body) {
        res.json(body)
    });
});

// app.get('/api/geo/', function(req, res) {
//     var geo = {
//         url: 'https://yuriy.ca/recharge/?api_key='+api_key+'&lat='+lat+'&lng='+lng
//     };
//     var api_key = req.query.api_key;
//     var lat = req.query.lat;
//     var lng = req.query.lng;
//     request(geo, function(error, response, body) {
//         res.json(body)
//     });
// });

app.listen(port, () => console.log(`Listening on port ${port}`));