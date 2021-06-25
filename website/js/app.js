
/**
 * Weather service for retrieving weather information from https://openweathermap.org/api.
 * @param {string} apiKey The API key.
 */
function OpenWeatherMap(apiKey) {
    this.baseURL = 'api.openweathermap.org/data/2.5/weather?q=';
    this.apiURL = `&appid=${apiKey}`;

    /**
     * Retrieves weather information for the given zip code.
     * @param {string} zip Zip code to search for.
     * @returns {Promise<Object>} A promise that contains retrieved weather data when resolved.
     */
    this.getInfoForZip = async (zip) => {
        const url = this.baseURL + encodeURI(zip) + this.apiURL;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    /**
     * Retrieves weather information for the given city.
     * @param {string} city City to search for.
     * @returns {Promise<Object>} A promise that contains retrieved weather data when resolved.
     */
    this.getInfoForCity = async (city) => {
        const url = this.baseURL + encodeURI(city) + this.apiURL;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('Error: ', error);
        }
    }
};

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
                'Content Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const receivedData = await response.json();
        return receivedData;
    } catch (error) {
        console.log('Error: ', error);
    }
}

// Set up page.
(function setUpPage() {

    // Initialize weather service with API key.
    const weatherService = new OpenWeatherMap('934160ec155e854131d8994158596698');

    // Set up location input.
    const locInputForm = document.getElementById('loc-input-form');
    locInputForm.addEventListener('submit', onSubmit = event => {
        event.preventDefault();
    }, false);

    // Move location input label above it while it has focus or has content.
    const locInput = document.getElementById('loc-input');
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

    // Hide header bar background while near top of document.
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





// Event listener to add function to existing HTML DOM element

/* Function called by event listener */
