'use strict';

/**
 * Holds endpoint data about a user.
 * @constructor
 */
function UserData() {
    this._entryData = [];

    /**
     * Returns the latest journal entry submitted by the user
     * Returns undefined if there were none.
     */
    this.getLatestEntry = () => {
        const length = this._entryData.length;
        return length > 0 ? this._entryData[length - 1] : undefined;
    };

    /** Returns all journal entries submitted by the user. */
    this.getAllEntries = () => {
        return this._entryData;
    };

    /** Adds a journal entry to the user record. */
    this.addEntry = entry => {
        this._entryData.push(entry);
    };
};

// Spin up the server on port 8000.
(() => {
    const port = '8000';

    // Initialize user data endpoint.
    const userData = new UserData;

    // Get API key from server environment variable "API_KEY".
    const PLACEHOLDER = '********************************'; // Replace with an API Key to test.
    const apiKey = process.env.API_KEY || PLACEHOLDER;

    // Create express app.
    const express = require('express');
    const app = express();

    // Set up middleware.
    {
        const express = require('express');
        const bodyParser = require('body-parser');
        const cors = require('cors');
        const path = require('path');
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(cors());
        app.use(express.static(path.join(__dirname, 'website')));
    }

    // Set up routes.
    {
        // GET Route to get all journal entries logged.
        app.get('/all', (req, res) => {
            res.send(userData.getAllEntries());
        });

        // POST Route to add an entry to the journal. Responds with the entry added.
        app.post('/add-entry', (req, res) => {
            userData.addEntry(req.body);
            console.log(userData._entryData);
            res.send(userData.getLatestEntry());
        });

        // GET Route to get the weather service API key.
        app.get('/api-key', (req, res) => {
            res.send({ apiKey });
        });
    }

    // Run server.
    app.listen(port, () => {
        console.log('Server running');
        console.log(`Running on localhost: ${port}`);
    });
})();
