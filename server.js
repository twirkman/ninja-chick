var express = require('express');
var path = require('path');

var app = express();

app.use('/static', express.static(path.join(__dirname, 'client/src')));

app.all('/*', function(req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, 'client/src')});
})

app.listen(3000, function() {
  console.log('Server listening on port 3000.');
})
