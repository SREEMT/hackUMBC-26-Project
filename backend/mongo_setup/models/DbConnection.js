require('dotenv').config();
const mongoose = require('mongoose');

// Choose MONGO_URI first, fallback to DB_URI/TESTDB_URI for older env names
function getUri(where) {
    if (where === 'test' && process.env.TESTDB_URI) return process.env.TESTDB_URI;
    if (process.env.MONGO_URI) return process.env.MONGO_URI;
    if (process.env.DB_URI) return process.env.DB_URI;
    if (process.env.CI) return 'mongodb://adm:secret@localhost:27017';
    return null;
}

async function connect(where) {
    const uri = getUri(where);
    if (!uri) throw new Error('No MongoDB URI found in environment (MONGO_URI, DB_URI or TESTDB_URI)');

    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
    };

    try {
        await mongoose.connect(uri, opts);
        console.log('MongoDB connected to', mongoose.connection.name || uri);
        mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));
        return mongoose;
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        throw err;
    }
}

async function close() {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
}

module.exports = { connect, close, mongoose };