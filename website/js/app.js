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

/** Returns temperature converted from Kelvin to Fahrenheit. */
function kelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 1.8) + 32;
}

/** Returns temperature converted from Kelvin to Celsius. */
function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
}

/**
 * Convert OpenWeatherMap weather icon codes to Weather Icons (by Erik Flowers, see https://erikflowers.github.io/weather-icons/).
 * @param {string} iconId Weather icon ID provided by OpenWeatherMap.
 * @returns {string} The corresponding class to use on elements which display Weather Icons.
 */
function getWeatherIconClass(iconId) {
    switch (iconId) {
        case '01d':
            return 'wi-day-sunny';
        case '01n':
            return 'wi-night-clear';
        case '02d':
            return 'wi-day-cloudy';
        case '02n':
            return 'wi-night-alt-cloudy';
        case '03d':
        case '03n':
            return 'wi-cloud';
        case '04d':
        case '04n':
            return 'wi-cloudy';
        case '09d':
            return 'wi-day-showers'
        case '09n':
            return 'wi-night-showers';
        case '10d':
            return 'wi-day-rain';
        case '10n':
            return 'wi-night-rain';
        case '11d':
            return 'wi-day-thunderstorm';
        case '11n':
            return 'wi-night-thunderstorm';
        case '13d':
            return 'wi-day-snow';
        case '13n':
            return 'wi-night-snow';
        case '50d':
            return 'wi-day-fog';
        case '50n':
            return 'wi-night-fog';
        default:
            return 'wi-cloud';
    }
}

/**
 * Remove all Wweather Icon classes.
 * @param {Element} element HTML element to remove icon classes from.
 */
function clearWeatherIconClasses(element) {
    element.classList.remove(
        'wi-day-sunny',
        'wi-night-clear',
        'wi-day-cloudy',
        'wi-night-alt-cloudy',
        'wi-cloud',
        'wi-cloudy',
        'wi-day-showers',
        'wi-night-showers',
        'wi-day-rain',
        'wi-night-rain',
        'wi-day-thunderstorm',
        'wi-night-thunderstorm',
        'wi-day-snow',
        'wi-night-snow',
        'wi-day-fog',
        'wi-night-fog');
}

// Set up page.
(() => {

    // Initialize weather service.
    const weatherService = new OpenWeatherMap;

    // Handle location submit event.
    const locInput = document.getElementById('zip');
    const locInputForm = document.getElementById('loc-input-form');
    const siteMain = document.getElementById('site-main');
    const journalEntryForm = document.getElementById('journal-entry__form');
    const locCountry = document.getElementById('loc-country');
    const zip = document.getElementById('zip');
    const locSubmitBtn = document.getElementById('loc-submit-btn');
    const submitLocation = event => {
        event.preventDefault();

        // Disable location input and show "loading" message.
        locCountry.disabled = true;
        zip.disabled = true;
        locSubmitBtn.disabled = true;
        siteMain.classList.add('loading--location');

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

                // Enable location input and hide "loading" message.
                locCountry.disabled = false;
                zip.disabled = false;
                locSubmitBtn.disabled = false;
                siteMain.classList.remove('loading--location');

                // Update weather panel UI.
                {
                    // Display 'Current Weather' in date field.
                    const date = document.getElementById('date');
                    date.innerHTML = 'Current Weather';

                    // Temperature.
                    const tempData = data.main.temp;
                    const tempF = document.getElementById('temp');
                    const tempC = document.getElementById('tempc');
                    tempF.innerHTML = Math.round(kelvinToFahrenheit(tempData));
                    tempC.innerHTML = Math.round(kelvinToCelsius(tempData));

                    // Weather description.
                    const descData = data.weather[0].description;
                    const desc = document.getElementById('weather-desc');
                    desc.innerHTML = descData;

                    // Weather icon.
                    const iconData = data.weather[0].icon;
                    const iconClass = getWeatherIconClass(iconData);
                    const icon = document.getElementById('weather-icon');
                    clearWeatherIconClasses(icon);
                    icon.dataset.iconClass = iconClass;
                    icon.classList.add(iconClass);

                    // Humidity.
                    const humid = document.getElementById('weather-humid');
                    humid.innerHTML = data.main.humidity;

                    // Wind speed.
                    const wind = document.getElementById('weather-wind');
                    wind.innerHTML = data.wind.speed;
                }

                // Reveal weather information and journal input panels.
                siteMain.classList.add('has-location');
                journalEntryForm.classList.remove('hidden');

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
    const generateEntry = () => {

        // Disable journal entry and location input.
        feelingsInput.disabled = true;
        generateBtn.disabled = true;
        locCountry.disabled = true;
        zip.disabled = true;
        locSubmitBtn.disabled = true;

        // Post entry data to server, then retrieve the posted data to update the UI with.
        const date = new Date().toLocaleString();
        const temp = document.getElementById('temp').innerHTML;
        const feelings = feelingsInput.value;
        const tempC = document.getElementById('tempc').innerHTML;
        const desc = document.getElementById('weather-desc').innerHTML;
        const icon = document.getElementById('weather-icon').dataset.iconClass;
        const humidity = document.getElementById('weather-humid').innerHTML;
        const wind = document.getElementById('weather-wind').innerHTML;

        const newData = {
            date, temp, content: feelings,
            tempC, desc, icon, humidity, wind };
        postData('/add-entry', newData)
        .then(() => {
            return getData('/all');
        })
        .then((data) => {
            const latest = data[data.length - 1];

            // Update UI.
            siteMain.classList.add('entry-posted');

            const entryBox = document.getElementById('journal-entry__box');
            entryBox.classList.replace('panel--light', 'panel--dark');

            const weatherInfoBox = document.getElementById('entry-holder');
            weatherInfoBox.classList.replace('panel--light', 'panel--dark');

            document.getElementById('content').innerHTML = latest.content;
            document.getElementById('temp').innerHTML = latest.temp;
            document.getElementById('date').innerHTML = latest.date;
            document.getElementById('tempc').innerHTML = latest.tempC;
            document.getElementById('weather-desc').innerHTML = latest.desc;

            const weatherIcon = document.getElementById('weather-icon');
            clearWeatherIconClasses(weatherIcon);
            weatherIcon.dataset.classList = latest.icon;
            weatherIcon.classList.add(latest.icon);

            document.getElementById('weather-humid').innerHTML = latest.humidity;
            document.getElementById('weather-wind').innerHTML = latest.wind;
        })
        .catch(error => {
            // TODO: Show error message to user.
            console.log(error);
        });
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
    let navOpen = false;
    navToggle.addEventListener('click', () => {
        navOpen = masthead.classList.toggle('menu-open');
        navToggle.innerHTML = navOpen ? 'close' : 'menu';
    }, false);

    // Close the nav menu if clicked outside of it.
    const primaryNav = document.getElementById('primary-nav');
    window.addEventListener('click', (e) => {
        if (navOpen && !primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
            masthead.classList.remove('menu-open');
            navToggle.innerHTML = 'menu';
            navOpen = false;
        }
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
