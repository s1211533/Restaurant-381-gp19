var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://austinmok915:a8080881_B@restaurant-381-as8sr.gcp.mongodb.net/test?retryWrites=true&w=majority';
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
   const db = client.db(dbName);
   /*

   *  CRUD Operations

   */

   client.close();
});
