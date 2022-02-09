// Importing crypto module
const crypto = require('crypto')

const jokeRoutes = (app, fs) => {
    // variables
    const dataPath = './data/jokes.json';

    // utilities
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

    // utilities
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

    
    // CREATE
    app.post('/jokes', (req, res) => {
      readFile(data => {
        // create a new UID
        const newJokeId = crypto.randomUUID();

        // add the new joke
        data[newJokeId] = req.body;

        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send('your joke has been added');
        });
      }, true);
    });
  
    // READ
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
        data[jokeId] = req.body;

        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send(`joke (id:${jokeId}) is updated`);
        });
      }, true);
    });

    // DELETE
    app.delete('/jokes/:id', (req, res) => {
      readFile(data => {
        // add the new user
        const jokeId = req.params['id'];
        delete data[jokeId];

        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send(`joke (id:${jokeId}) removed`);
        });
      }, true);
    });
  };
  
  module.exports = jokeRoutes;