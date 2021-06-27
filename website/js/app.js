'use strict';

/**
 * Performs a general GET request for the specified url resource on the server.
 * See server.js for specific routes.
 * @param {string} url The url resource to request.
 * @returns {Promise<Object>} Returns a promise containing data from the server when fulfilled.
 */
const getData = async (url = '') => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

/**
 * Performs a general POST request for the specified url resource to the server.
 * See server.js for specific routes.
 * @param {string} url The url resource to post to.
 * @param {Object} data The data to post to the server.
 * @returns {Promise} Returns a promise containing data from the server (where relevant) when fulfilled.
 */
const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const receivedData = await response.json();
        return receivedData;
    } catch (error) {
        console.log('Error: ', error);
        throw error;
    }
}

/**
 * Weather service for retrieving weather information from https://openweathermap.org/api.
 */
 function OpenWeatherMap() {
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';

    // Retrieve API key from server.
    //
    // NOTE: Ideally we would do all API calls on the server,
    // but for the sake of the assessment I get the API key from the server.
    this.apiKey = getData('/api-key').then(data => { return data.apiKey; });

    /**
     * Retrieves weather information for the given zip code.
     * @param {string} zip Zip code to search for.
     * @param {string} country Country code to search for.
     * @returns {Promise<Object>} A promise that contains retrieved weather data when resolved.
     */
    this.getInfoForZip = async (zip, country) => {
        try {
            const apiKey = await this.apiKey;
            const apiUrl = `&appid=${apiKey}`;
            const zipUrl = `zip=${encodeURI(zip)},${encodeURI(country)}`;

            const url = BASE_URL + zipUrl + apiUrl;
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
            const apiKey = await this.apiKey;
            const apiUrl = `&appid=${apiKey}`;
            const cityUrl = `city=${encodeURI(city)}`;

            const url = BASE_URL + cityUrl + apiUrl;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error: ', error);
            return Promise.reject(error);
        }
    }
};

// Set up page.
(() => {

    // Initialize weather service.
    const weatherService = new OpenWeatherMap;

    // Handle location submit event.
    const locInput = document.getElementById('zip');
    const locInputForm = document.getElementById('loc-input-form');
    const submitLocation = event => {
        event.preventDefault();

        // Get zip code / city.
        const location = locInput.value;
        const country = document.getElementById('loc-country').value;

        // Determine if a zip code or city.
        const isZip = true; // TODO: Add support for city.

        // Retrieve weather info asynchronously.
        (async () => {
            try {
                let data = undefined;
                if (isZip && country) {
                    data = await weatherService.getInfoForZip(location, country);
                } else if (!isZip) {
                    data = await weatherService.getInfoForCity(city);
                } else {
                    throw new Error(`No valid location provided: (location = ${location}, country = ${country})`);
                }

                console.log(data);
                // TODO: Update UI.

            } catch (error) {
                console.log("Error", error);
                // TODO: Show error message to user.
            }
        })();
    };
    locInputForm.addEventListener('submit', submitLocation, false);

    // Handle journal entry submit event.
    const feelingsInput = document.getElementById('feelings');
    const generateBtn = document.getElementById('generate');
    const journalEntryForm = document.getElementById('journal-entry__form');
    const generateEntry = () => {

        // Post entry data to server, then retrieve the posted data to update the UI with.
        const feelings = feelingsInput.value;
        const newData = { data: '', temp: '', content: feelings };
        postData('/add-entry', newData)
        .then(() => {
            return getData('/all'); // TODO: Do I need to use GET route for assessment?
        })
        .then((data) => {
            // TODO: Update UI.
        })
        .catch(error => {
            // TODO: Show error message to user.
            console.log(error);
        });

        // TODO: Submit entry.
        console.log('Entry submitted');
    };
    generateBtn.addEventListener('click', event => {

        // Note: I'm required to use the click event for the project assessment criteria.
        // Prevents form submit event from also being fired.
        event.preventDefault();

        generateEntry();
    });
    journalEntryForm.addEventListener('submit', event => {

        // Prevent page refresh.
        event.preventDefault();

        generateEntry();
    });

    // Move location input label above it while it has focus or has content.
    const updateHasContent = () => {
        if (locInput.value === "") {
            locInputForm.classList.remove('has-content');
        } else {
            locInputForm.classList.add('has-content');
        }
    };
    locInput.addEventListener('focus', () => {
        locInputForm.classList.add('has-focus');
        updateHasContent();
    }, false);
    locInput.addEventListener('blur', () => {
        locInputForm.classList.remove('has-focus');
        updateHasContent();
    }, false);

    // Toggle nav menu on menu button pressed.
    const navToggle = document.getElementById('nav-toggle');
    const masthead = document.getElementById('masthead');
    navToggle.addEventListener('click', () => {
        const isOpen = masthead.classList.toggle('menu-open');
        navToggle.innerHTML = isOpen ? 'close' : 'menu';
    }, false);

    // Hide header bar background when at top of document.
    const updateHeaderBar = () => {
        if (window.scrollY === 0) {
            masthead.classList.add('at-top');
        } else {
            masthead.classList.remove('at-top');
        }
    };
    updateHeaderBar();

    // Handle scroll event.
    window.addEventListener('scroll', () => {

        updateHeaderBar();

    }, false);

})();
