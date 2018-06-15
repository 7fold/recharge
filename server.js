const express = require('express');
var request = require('request');
const app = express();
const port = process.env.PORT || 5000;
// app.use('/api/hello', function (req, res) {
//     let url = "https://chargehub.azure-api.net/locationsdemo/"
//     req.headers['Ocp-Apim-Subscription-Key'] = 'f53eee3a65f342e08e8ba7a453d95cce'
//     req.pipe(request(url)).pipe(res)
// });

var options = {
    url: 'https://chargehub.azure-api.net/locationsdemo/',
    headers: {
      'Ocp-Apim-Subscription-Key': 'f53eee3a65f342e08e8ba7a453d95cce'
    }
  };

app.get('/api/hello', function(req, res) {
    request(options, function(error, response, body) {
        res.json(body)
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));