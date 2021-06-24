
/**
 * Holds endpoint data about a user.
 * @constructor
 */
(function UserData() {
    const entryData = [];
    return {

        /** Returns all journal entries submitted by the user. */
        getAllEntries: function() {
            return entryData;
        },

        /** Adds a journal entry to the user record. */
        addEntry: function(entry) {
            entryData.push(entry);
        },

    }
})();

/** Spin up the server. */
(function runServer() {
    const userData = new UserData;
})();

// Express to run server and routes

// Start up an instance of app

/* Dependencies */
/* Middleware*/

//Here we are configuring express to use body-parser as middle-ware.
// Cors for cross origin allowance

// Initialize the main project folder
//app.use(express.static('website'));

// Spin up the server
// Callback to debug

// Initialize all route with a callback function

// Callback function to complete GET '/all'

// Post Route
