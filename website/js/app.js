


(function setUpPage() {

    // Set up location input.
    const locInputForm = document.getElementById('loc-input-form');
    locInputForm.addEventListener('submit', onSubmit = event => {
        event.preventDefault();
    }, false);

    // Toggle nav menu on menu button pressed.
    const navToggle = document.getElementById('nav-toggle');
    const masthead = document.getElementById('masthead');
    navToggle.addEventListener('click', () => {
        masthead.classList.toggle('menu-open');
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
