const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://austinmok915:a8080881@restaurant-381-as8sr.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
