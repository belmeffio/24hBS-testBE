// load up our route for jokes
const jokeRoutes = require('./jokes');

const appRouter = (app, fs) => {
  // we've added in a default route here that handles empty routes
  // at the base API url
  app.get('/', (req, res) => {
    res.send('Chuck Norris does not get covid, it\'s covid that gets Chuck Norris');
  });

  // run our user route module here to complete the wire up
  jokeRoutes(app, fs);
};

module.exports = appRouter;