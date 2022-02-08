const jokeRoutes = (app, fs) => {
    // variables
    const dataPath = './data/jokes.json';
  
    // READ
    app.get('/jokes', (req, res) => {
      fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
          throw err;
        }
  
        res.send(JSON.parse(data));
      });
    });
  };
  
  module.exports = jokeRoutes;