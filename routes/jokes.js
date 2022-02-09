const jokeRoutes = (app, fs) => {
    // variables
    const dataPath = './data/jokes.json';
    const querystring = require('querystring');

    //
    // START utilities

    //Standard read file function
    const readFile = (
      callback,
      returnJson = false,
      filePath = dataPath,
      encoding = 'utf8'
    ) => {
      fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
          throw err;
        }

        callback(returnJson ? JSON.parse(data) : data);
      });
    };

    //Standard write file function
    const writeFile = (
      fileData,
      callback,
      filePath = dataPath,
      encoding = 'utf8'
    ) => {
      fs.writeFile(filePath, fileData, encoding, err => {
        if (err) {
          throw err;
        }

        callback();
      });
    };

    const findJoke = (data,jokeId) => {
      for (const joke in data) {
        if (data[joke].id  == jokeId) {
          return joke;
        }
      }
      return -1;
    }

    //
    // END utilities
  

    // READ QUERY
    app.get('/jokes/search/', (req, res) => {
      const query = req.query.query;
      
      if (query.length > 0) {
        const params = query.split(',');
        readFile(data => {
          // Find the jokes
          const jokes = data.filter(
            (joke) => {
              for (var i = 0; i < params.length; i++) {
                if (joke.value.toLowerCase().includes(params[i].toLowerCase())) {
                  return true;
                }
              }
              return false;
            }
          );
          res.send(jokes);
        }, true);
      }
      else {
        res.status(200).send(`Expected something like /search/?query={stringToSearch1}&{stringToSearch2}`);
      }
    });
    

    // READ ALL
    app.get('/jokes', (req, res) => {
      readFile(data => {
        res.send(data);
      }, true);
    });

  
    // READ SINGLE
    app.get('/joke/:id', (req, res) => {
      readFile(data => {
        const jokeId = req.params['id'];

        // Find the joke
        const index = findJoke(data,jokeId);
        if(index >= 0) {
          res.send(data[index]);
        }
        else {
          res.status(200).send(`There is no joke with id:${jokeId}`);
        }
      }, true);
    });


    // UPDATE
    app.put('/joke/:id', (req, res) => {
      readFile(data => {
        // add the new joke
        const jokeId = req.params['id'];
       
        // Find the joke
        const index = findJoke(data,jokeId);
        if(index >= 0) {
          data[index] = req.body;
          writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`joke (id:${jokeId}) is updated`);
          });
        }
        else {
          res.status(200).send(`There is no joke with id:${jokeId}`);
        }
      }, true);
    });

    // DELETE
    app.delete('/joke/:id', (req, res) => {
      readFile(data => {
        // add the new user
        const jokeId = req.params['id'];

        // Find the joke
        const index = findJoke(data,jokeId);
        if(index >= 0) {
          data.splice(index,1);
          writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send(`joke (id:${jokeId}) is removed`);
          });
        }
        else {
          res.status(200).send(`There is no joke with id:${jokeId}`);
        }
      }, true);
    });
  };
  
  module.exports = jokeRoutes;