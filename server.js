const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json);

app.use(cors());

app.use(express.static('website'));

const port = 8000;
const server = app.listen(port, () => {
    console.log('Server running');
    console.log(`Running on localhost: ${port}`);
});