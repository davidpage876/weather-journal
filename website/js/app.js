
/**
 * Weather service for retrieving weather information from https://openweathermap.org/api.
 * @param {string} apiKey The API key.
 */
function OpenWeatherMap(apiKey) {
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather?';
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
            throw error;
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
            throw error;
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
                'Content Type': 'application/json'
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

// Set up page.
(function setUpPage() {

    // Initialize weather service with API key.
    const weatherService = new OpenWeatherMap('934160ec155e854131d8994158596698');

    // Handle location submit event.
    const locInput = document.getElementById('zip');
    const locInputForm = document.getElementById('loc-input-form');
    locInputForm.addEventListener('submit', onSubmitLoc = event => {
        event.preventDefault();

        // Get zip code.
        const zip = locInput.value;
        const country = document.getElementById('loc-country').value;

        // Retrieve weather information for location.
        weatherService.getInfoForZip(zip, country)
        .then(data => {
            console.log(data);
            // TODO: Update UI.
        })
        .catch(error => {
            // TODO: Show error message to user.
        });
    }, false);

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
    generateBtn.addEventListener('click', onGeneratePressed = event => {

        // Note: I'm required to use the click event for the project assessment criteria.
        // Prevents form submit event from also being fired.
        event.preventDefault();

        generateEntry();
    });
    journalEntryForm.addEventListener('submit', onEntryFormSubmit = event => {

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
