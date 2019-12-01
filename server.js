const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine','ejs');
const SECRETKEY1 = 'I want to pass COMPS381F';
const SECRETKEY2 = 'Keep this to yourself';

const MongoClient = require('mongodb').MongoClient;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://austinmok915:a8080881_B@restaurant-381-as8sr.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("restaurant").collection("user");
  // perform actions on the collection object
  client.close();
});


app.set('view engine','ejs');


app.use(session({
  name: 'session',
  keys: [SECRETKEY1,SECRETKEY2]

}));



// support parsing of application/json type post data

app.use(bodyParser.json());

// support parsing of application/x-www-form-urlencoded post data

app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req,res) => {

	console.log(req.session);

	if (!req.session.authenticated) {

		res.redirect('/login');

	} else {

		res.status(200).render('secrets',{name:req.session.username});

	}

});



app.get('/login', (req,res) => {

	res.status(200).sendFile(__dirname + '/login.html');

});



app.post('/login', (req,res) => {
	users.forEach((user) => {
		if (user.name == req.body.username && user.password == req.body.password) {
			req.session.authenticated = true;
			req.session.username = user.username;			
		}
	});
	res.redirect('/');
});

app.get('/logout', (req,res) => {
	req.session = null;
	res.redirect('/');

});


app.listen(process.env.PORT || 8099);
