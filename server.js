const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb+srv://austinmok915:97253438@restaurant-381-as8sr.gcp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'restaurant';

const findRestaurants = (db, callback) => {
   let cursor = db.collection('user').find({"username": "demo" }).limit(10);
   cursor.forEach((doc) => {
      console.log(JSON.stringify(doc));
   });
   callback();
};

const client = new MongoClient(url);
client.connect((err) => {
   assert.equal(null,err);
   console.log("Connected successfully to server");
   const db = client.db(dbName);
   findRestaurants(db,() => {
      client.close();
   })
