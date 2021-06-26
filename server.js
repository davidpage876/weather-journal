
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

// Spin up the server on port 8000, with static resources loaded from folder 'website'.
(function spinUpServer(port = '8000', staticDir = 'website') {

    // Initialize user data endpoint.
    const userData = new UserData;

    // Get API key from server environment variable "API_KEY".
    const PLACEHOLDER = '********************************';
    const apiKey = process.env.API_KEY || PLACEHOLDER;

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

        // GET Route to get the weather service API key.
        app.get('/api-key', (req, res) => {
            res.send({ apiKey });
        });

    })();

    // Run server.
    app.listen(port, () => {
        console.log('Server running');
        console.log(`Running on localhost: ${port}`);
    });

})();
