// dotenv - loads environment variables from a .env file
const dotenv = require('dotenv');
dotenv.config();

// Require Express to run server and routes, and other dependencies
const express = require('express');
var path = require('path');

// const dataAPIResponse = require('./myData.js');
const bodyParser = require('body-parser');
const cors = require('cors');

// Require the Aylien npm package
const AYLIENTextAPI = require('aylien_textapi');

// Start up an instance of app
const app = express();

/* Middleware*/
// Cross-origin resource sharing
app.use(cors());

// to use url encoded values
app.use(bodyParser.urlencoded({ extended: true }));

// to use json
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static('dist'));

// My database
const dataAPIResponse = [];

// set aylien API credentias
const textapi = new AYLIENTextAPI({
  application_id: process.env.API_ID,
  application_key: process.env.API_KEY,
});

/* Routers*/
app.get('/', function (req, res) {
  res.sendFile('dist/index.html');
});

app.get('/apicall', async (req, res) => {
  // Function to check if string is an url
  const validURL = (str) => {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  };

  // Function to determine which configuration object to use
  const whatToQuery = () => {
    if (validURL(req.query.input)) {
      return {
        mode: 'document',
        url: req.query.input,
      };
    } else {
      return {
        mode: 'tweet',
        text: req.query.input,
      };
    }
  };

  // Calling Sentiment API endpoint
  await textapi.sentiment(whatToQuery(), (error, response) => {
    if (error) {
      res.send(response);
    } else {
      console.log(error);
    }
  });
});

// Post route
app.post('/database', (req, res) => {
  const {
    polarity,
    subjectivity,
    text,
    polarity_confidence,
    subjectivity_confidence,
  } = req.body;

  let newData = {};
  newData.polarity = polarity;
  newData.subjectivity = subjectivity;
  newData.text = text;
  newData.polarity_confidence = polarity_confidence;
  newData.subjectivity_confidence = subjectivity_confidence;

  // pushing data to the database variable
  dataAPIResponse.push(newData);

  res.send(dataAPIResponse);
});

// GET route that request all data from the database
app.get('/all', (req, res) => {
  console.log(dataAPIResponse);

  res.send(dataAPIResponse);
});

// Designates what port the app will listen to for incoming requests
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`'App running on port ${port}`);
});
