const {MongoClient} = require('mongodb');
require('dotenv').config();


// connection URL
const url = process.env.URL;
const client = new MongoClient(url);

// establish connection
async function connectToDB() {
    try {
        await client.connect();
        return 'Connected to MongoDB server';
    }
    catch (error) {
        console.log('Server connection issue', error);
        throw error;
    }
};

connectToDB().then(console.log).catch(console.error);


module.exports = client;