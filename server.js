const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json);

const cors = require('cors');
app.use(cors);

app.use(express.static('website'));

const port = 8000;
const server = app.listen(port, () => {
    console.log('Server running');
    console.log(`Running on localhost: ${port}`);
});