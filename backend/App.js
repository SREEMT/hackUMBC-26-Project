const express = require('express'); // import express server
const morgan = require('morgan'); // import morgan for logging
const session = require('express-session'); // generic session handling for express
const cors = require('cors'); // to avoid cors errors with react
const memorystore = require('memorystore')(session);

const app = express(); // creates a new Express Application
app.use(morgan('dev')); // For better logging, we use morgan
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(session({
    secret: 'Pineapple - Guava - Orange',
    cookie: { maxAge: 86400000 }, // 1000*60*60*24 = 24 hours
    store: new memorystore({ checkPeriod: 86400000 }),
    resave: false,
    saveUninitialized: true
}));

// Serve static files (React build or public_html)
app.use(express.static('public_html'));

// User Actions
const UserCont = require("./mongo_setup/controller/UserController");
app.post('/user', UserCont.postCreateOrUpdate); // register new user
app.get('/user', UserCont.getAll);
app.post('/loginuser', UserCont.login); // login user
app.get('/loggeduser', UserCont.loggedUser); // fetches logged user (or null)
app.get('/logout', UserCont.logout);
app.get('/deluser/:id', UserCont.deleteOne); // deletes user

// Example Actions
// const exCont = require("./controller/ExampleController");
// app.get('/example', exCont.getAll);

exports.app = app;
