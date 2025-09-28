const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });


const dbcon = require('./mongo_setup/models/DbConnection');
dbcon.connect(); // Connect to MongoDB when starting the server.

const ExpressApp = require('./App');

ExpressApp.app.listen(process.env.PORT,process.env.HOSTNAME,function(){ // Listen to client requests in hostname:port
    console.log(`Server Running on ${process.env.HOSTNAME}:${process.env.PORT}...`);
});