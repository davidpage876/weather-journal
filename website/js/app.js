
/**
 * Weather service for retrieving weather information from https://openweathermap.org/api.
 * @param {string} apiKey The API key.
 */
function OpenWeatherMap(apiKey) {
    this.baseUrl = '';

    /**
     * Retrieves weather information using the given service.
     * @returns {Promise<Object>} A promise that contains retrieved weather data when resolved.
     */
    this.getInfo = async() => { return ''; }
};

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





// Personal API Key for OpenWeatherMap API

// Event listener to add function to existing HTML DOM element

/* Function called by event listener */

/* Function to GET Web API Data*/

/* Function to POST data */


/* Function to GET Project Data */
