const { param } = require("express/lib/request");
const { getEnvironmentData } = require("worker_threads");

// Here are defined all the routes to the server
const jokeRoutes = (app, fs) => {
  // variables
  const dataPath = "./data/jokes.json";
  const querystring = require("querystring");

  //
  // START utilities
  // These are defined here to be reusable after in the code

  //This reads from the dataPath all records
  const readFile = (
    callback,
    returnJson = false,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }

      callback(returnJson ? JSON.parse(data) : data);
    });
  };

  //This writes on the dataPath all records
  const writeFile = (
    fileData,
    callback,
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  // Extremely simple fuction to search in our data array the first elements with given id
  const findJoke = (data, jokeId) => {
    for (const joke in data) {
      if (data[joke].id == jokeId) {
        return joke;
      }
    }
    return -1;
  };

  //
  // END utilities

  // CREATE
  app.post("/joke", (req, res) => {
    // Get the current data
    readFile((data) => {
      // TODO:
      // Would be nice to check format of the given data, and generate automatically an UUID if not given (maybe with crypto module)

      // Find the unique id given
      const jokeId = req.body.id;

      // Find the joke (if id is not given this check can be excluded)
      const index = findJoke(data, jokeId);
      if (index >= 0) {
        res.status(200).send(`There is already a joke with id:${jokeId}`);
      } else {
        // add the new joke
        data.push(req.body);
        // write the new data
        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send("your joke has been added");
        });
      }
    }, true);
  });

  // READ QUERY
  /*
    form expected is:
      /search/?query={stringToSearch1},{stringToSearch2},.....
    */
  app.get("/jokes/search/", (req, res) => {
    // Get the query string
    const query = req.query.query;
    // If the query string exists we can work
    if (typeof query !== "undefined" && query.length > 0) {
      // Split the query on comma, so multiple strings can be searched
      const params = query.split(",");
      // Check if query strings are too short
      if (
        params.some((param) => {
          return param.length < 3;
        })
      ) {
        // Exit if there are some
        res.status(200).send(`Expected query string longer than 2 characters`);
        res.end();
        return;
      }
      // Otherwise read the data
      readFile((data) => {
        // Find the jokes
        // filter function is pretty but does not scale well on big dataset
        const jokes = data.filter((joke) => {
          // find joke with query param in value
          for (var i = 0; i < params.length; i++) {
            if (joke.value.toLowerCase().includes(params[i].toLowerCase())) {
              return true;
            }
          }
          return false;
        });
        // Send the jokes found
        res.send(jokes);
      }, true);
    }
    // If there is no query string instruct the client
    else {
      res
        .status(200)
        .send(
          `Expected something like /search/?query={stringToSearch1},{stringToSearch2}`
        );
    }
  });

  // READ ALL
  // Just returns all the jokes in the dataset
  app.get("/jokes", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });

  // READ SINGLE
  // Note the route is different from the routes on multiple jokes (is <joke> and not <jokes>), maybe it's not too restful
  // Gets the id as the argument after joke
  app.get("/joke/:id", (req, res) => {
    // read the data first
    readFile((data) => {
      // get the id
      const jokeId = req.params["id"];

      // Find the joke, low memory effort
      const index = findJoke(data, jokeId);
      if (index >= 0) {
        res.send(data[index]);
      } else {
        res.status(200).send(`There is no joke with id:${jokeId}`);
      }
    }, true);
  });

  // UPDATE
  // Note the route is different from the routes on multiple jokes (is <joke> and not <jokes>), maybe it's not too restful
  // Gets the id as the argument after joke
  app.put("/joke/:id", (req, res) => {
    // TODO:
    // Would be nice to check the data given, matching it with a template format
    var joke = req.body;
    // Just check if present for now
    if (typeof joke === "undefined" || joke.length < 1) {
      res.status(200).send(`Expected a body like this: 
        {
          "id" : STRING, ID unique for each JOKE
          "icon_url" : STRING, URL of a valid web compatible image
          "url" : STRING, URL of the JOKE, if not provided the default value is [BASE_DOMAIN]/view/joke/[ID]
          "value" : STRING, the text of the JOKE
          "created_at": DATETIME, the creation date time
          "updated_at": DATETIME, the last updated date time
          "categories": STRING[], the list of categories for the JOKE
          }
        `);
      res.end();
      return;
    }
    // read the data first
    readFile((data) => {
      // get the id
      const jokeId = req.params["id"];
      // Find the joke
      const index = findJoke(data, jokeId);
      if (index >= 0) {
        // Keeping id as it was prior the update
        joke.id = data[index].id;
        // set the new data
        data[index] = joke;
        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send(`joke (id:${jokeId}) is updated`);
        });
      } else {
        res.status(200).send(`There is no joke with id:${jokeId}`);
      }
    }, true);
  });

  // DELETE
  // Note the route is different from the routes on multiple jokes (is <joke> and not <jokes>), maybe it's not too restful
  // Gets the id as the argument after joke
  app.delete("/joke/:id", (req, res) => {
    // read the data first
    readFile((data) => {
      // get the id
      const jokeId = req.params["id"];

      // Find the joke
      const index = findJoke(data, jokeId);
      if (index >= 0) {
        data.splice(index, 1);
        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send(`joke (id:${jokeId}) is removed`);
        });
      } else {
        res.status(200).send(`There is no joke with id:${jokeId}`);
      }
    }, true);
  });
};

module.exports = jokeRoutes;
