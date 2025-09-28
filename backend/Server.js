require('dotenv').config();

const dbcon = require('./model/DbConnection');
dbcon.connect(); // Connect to MongoDB when starting the server.

const ExpressApp = require('./App');

ExpressApp.app.listen(process.env.PORT,process.env.HOSTNAME,function(){ // Listen to client requests in hostname:port
    console.log(`Server Running on ${process.env.HOSTNAME}:${process.env.PORT}...`);
});