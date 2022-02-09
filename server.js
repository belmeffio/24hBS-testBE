
// load up the express framework and body-parser helper
const express = require('express');
const bodyParser = require('body-parser');

// create an instance of express to serve our end points
const app = express();

// let's start without serverless approach, we'll read from a file the data
const fs = require('fs');

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is where we'll handle our various routes from
const routes = require('./routes/routes.js')(app, fs);

// the environment variable is necessary to heroku deployment
const port = process.env.PORT || 3001;
// finally, launch our server.
const server = app.listen(port, () => {
  console.log('listening on port %s...', server.address().port);
});