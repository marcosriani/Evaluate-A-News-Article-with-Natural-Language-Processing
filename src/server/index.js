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

app.get('/apicall', (req, res) => {
  textapi.sentiment(
    {
      mode: 'document',
      text: req.query.input,
    },
    function (error, response) {
      if (error === null) {
        res.send(response);
      } else {
        console.log(error);
      }
    }
  );
});

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

  dataAPIResponse.push(newData);

  // dataAPIResponse.polarity = polarity;
  // dataAPIResponse.subjectivity = subjectivity;
  // dataAPIResponse.text = text;
  // dataAPIResponse.polarity_confidence = polarity_confidence;
  // dataAPIResponse.subjectivity_confidence = subjectivity_confidence;

  res.send(dataAPIResponse);
});

app.get('/all', (req, res) => {
  console.log(dataAPIResponse);

  res.send(dataAPIResponse);
});

// designates what port the app will listen to for incoming requests
const port = 3000;

app.listen(port, () => {
  console.log(`'App running on port ${port}`);
});
