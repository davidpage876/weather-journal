
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

// Spin up the server on port 8000, with static resources loaded from folder 'website'.
(function spinUpServer(port = '8000', staticDir = 'website') {
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
        res.send(userData.getAllEntries()); // TODO: Do I need to do this for assessment?
    });

    // Run server.
    app.listen(port, () => {
        console.log('Server running');
        console.log(`Running on localhost: ${port}`);
    });

})();
