const jokeRoutes = (app, fs) => {
    // variables
    const dataPath = './data/jokes.json';

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

    
    // CREATE
    app.post('/jokes', (req, res) => {
      readFile(data => {
        const jokeId = req.body.id;
 
        // Find the joke
        const index = findJoke(data,jokeId);
        if(index >= 0) {
          res.status(200).send(`There is already a joke with id:${jokeId}`);
        }
        else {
          // add the new joke
          data.push(req.body);
          // write the new data
          writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send('your joke has been added');
          });
        }

      }, true);
    });

  
    // READ SINGLE
    app.get('/jokes/:id', (req, res) => {
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


    // READ ALL
    app.get('/jokes', (req, res) => {
      readFile(data => {
        res.send(data);
      }, true);
    });


    // UPDATE
    app.put('/jokes/:id', (req, res) => {
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
    app.delete('/jokes/:id', (req, res) => {
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