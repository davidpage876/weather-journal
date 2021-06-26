
// Dependencies.
const fetch = require('node-fetch');

/**
 * Holds endpoint data about a user.
 * @constructor
 */
function UserData() {
    this._entryData = [];

    /** Returns all journal entries submitted by the user. */
    this.getAllEntries = () => {
        return this._entryData;
    }

    /** Adds a journal entry to the user record. */
    this.addEntry = entry => {
        this._entryData.push(entry);
    }
};

/**
 * Weather service for retrieving weather information from https://openweathermap.org/api.
 * @param {string} apiKey The API key.
 * @param {string} baseUrl The base URL for API requests.
 */
 function OpenWeatherMap(apiKey, baseUrl) {
    this.baseUrl = baseUrl;
    this.apiUrl = `&appid=${apiKey}`;

    /**
     * Retrieves weather information for the given zip code.
     * @param {string} zip Zip code to search for.
     * @param {string} country Country code to search for.
     * @returns {Promise<Object>} A promise that contains retrieved weather data when resolved.
     */
    this.getInfoForZip = async (zip, country) => {
        try {
            const zipUrl = `zip=${encodeURI(zip)},${encodeURI(country)}`;
            const url = this.baseUrl + zipUrl + this.apiUrl;

            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error: ', error);
            return Promise.reject(error);
        }
    }

    /**
     * Retrieves weather information for the given city.
     * @param {string} city City to search for.
     * @returns {Promise<Object>} A promise that contains retrieved weather data when resolved.
     */
    this.getInfoForCity = async (city) => {
        try {
            const cityUrl = `city=${encodeURI(city)}`;
            const url = this.baseUrl + cityUrl + this.apiUrl;

            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error: ', error);
            return Promise.reject(error);
        }
    }
};

// Spin up the server on port 8000, with static resources loaded from folder 'website'.
(function spinUpServer(port = '8000', staticDir = 'website') {

    // Initialize user data endpoint.
    const userData = new UserData;

    // Get API key from server environment variable "API_KEY".
    const PLACEHOLDER = '********************************';
    const apiKey = process.env.API_KEY || PLACEHOLDER;

    // Initialize weather service with API key and base URL.
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';
    const weatherService = new OpenWeatherMap(apiKey, baseUrl);

    // Set up dependencies.
    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const path = require('path');

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.static(path.join(__dirname, staticDir)));

    // Set up routes.
    (function setUpRoutes() {

        // GET Route to get all journal entries logged.
        app.get('/all', (req, res) => {
            res.send(userData.getAllEntries());
        });

        // POST Route to add an entry to the journal.
        app.post('/add-entry', (req, res) => {
            userData.addEntry(req.body);
            res.send(userData.getAllEntries()); // TODO: Do I need to do this for assessment?
        });

        // POST Route to retrieve weather information from our weather service.
        // Expects POST body to contain an object with either { zip, country } or { city } properties.
        app.post('/get-weather', async (req, res, next) => {
            try {
                const data = req.body;
                const zip = data?.zip;
                const country = data?.country;
                const city = data?.city;

                // Retrieve weather info.
                let weatherInfo = undefined;
                if (zip !== undefined && country !== undefined) {
                    weatherInfo = await weatherService.getInfoForZip(zip, country);
                } else if (city !== undefined) {
                    weatherInfo = await weatherService.getInfoForCity(city);
                } else {
                    throw new Error('Calls to /get-weather must contain either { zip, country }, or { city } properties in the request body');
                }

                // Send weather info to the client.
                res.send(weatherInfo);
            } catch (error) {
                console.log("Error", error);
                next(error);
            }
        });
    })();

    // Run server.
    app.listen(port, () => {
        console.log('Server running');
        console.log(`Running on localhost: ${port}`);
    });

})();
