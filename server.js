'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.get('/', (request, response) => {
  response.status(200).send('Home Page!');
});
app.get('/bad', (request, response) => {
  throw new Error('oh nooooo!');
});

app.get('/location', (request, response) => {
  try {
    const geoData = require('./data/geo.json');
    const city = request.query.city;
    const locationData = new Location(city, geoData);
    response.status(200).json(locationData);
  } catch (error) {
    errorHandler(error, request, response);
  }
});

app.get('/weather', (request,response) => { 
    const weatherData = searchToWeather(request.query.data);
    response.send(weatherData);
  });
  
  function searchToWeather(query) {
    const weatherData = require('./data/darksky.json');
    const weatherArr = [];
    let weather = new Weather (weatherData.daily);
    weather.search_query = query;
    weatherArr.push(weather);
    return weatherArr;
  }

app.use('*', notFoundHandler);
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

function Weather(weatherData) {
    this.forecast = weatherData.summary;
    this.time = new Date(weatherData.data[0].time * 1000).toDateString();
  }


function notFoundHandler(request, response) {
  response.status(404).send('NOT FOUND!!');
}
function errorHandler(error, request, response) {
  response.status(500).send(error);
}
app.listen(PORT, () => console.log(`the server is up and running on ${PORT}`));