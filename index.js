const express = require('express');
const api = require('./src/api');
const errorHandler = require("./src/middleware/errorHandler");
const dbErrorHandler = require("./src/middleware/dbErrorHandler");

const port=process.env.PORT || 8000;
const env = process.env.NODE_ENV || 'development'; //srodowisko uruchomieniowe
const app = express();
app.use(express.json());

app.use('/api', api);

app.use(dbErrorHandler);
app.use(errorHandler);

app.listen(port, '127.0.0.1', () =>{
    console.log("Listening on host http://127.0.0.1:" + port + " in " + env + " mode");
})