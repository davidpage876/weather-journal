
/**
 * Holds endpoint data about a user.
 * @constructor
 */
function UserData() {
    this._entryData = [];

    /** Returns all journal entries submitted by the user. */
    this.getAllEntries = () => {
        return _entryData;
    }

    /** Adds a journal entry to the user record. */
    this.addEntry = entry => {
        _entryData.push(entry);
    }
};

/**
 * Spin up the server.
 * @param {number} port Port to initialize the server on.
 * @param {string} staticDir Directory to load static resources from.
*/
(function runServer(port, staticDir) {
    const userData = new UserData;

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
    app.get('/all', (req, res) => {
        res.send(userData.getAllEntries());
    });

    app.post('/add-entry', (req, res) => {
        userData.addEntry(req.body);
        res.send(userData.getAllEntries());
    });

    // Run server.
    app.listen(port, () => {
        console.log('Server running');
        console.log(`Running on localhost: ${port}`);
    });

})({ port: 8000, staticDir: 'website' });
