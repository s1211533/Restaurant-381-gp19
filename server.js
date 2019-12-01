const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb+srv://austinmok915:a8080881_B@restaurant-381-as8sr.gcp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'restaurant';

const client = new MongoClient(url);

client.connect((err) => {
   assert.equal(null,err);
   console.log("Connected successfully to server");

   const db = client.db(dbName);



   /*

   *  CRUD Operations

   */



   client.close();

});
