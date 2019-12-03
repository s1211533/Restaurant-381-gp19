const url  = require('url');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const mongoDBurl = 'mongodb+srv://aaron:aaronso@aarondb-ep2mi.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 's381assignment';
const session = require('cookie-session');
const qs = require ('querystring');
const formidable = require('formidable');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var timestamp = null;

const SECRETKEY1 = 'I want to pass COMPS381F';
const SECRETKEY2 = 'Keep this to yourself';

app.set('view engine', 'ejs');

app.use(session({
  	name: 'session',
	keys: [SECRETKEY1,SECRETKEY2]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const setCurrentTimestamp = (req, res, next) => {
	timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);
	next();
}

app.get('/', setCurrentTimestamp, (req, res) => {
	console.log(req.session);
	if (!req.session.authenticated) {
		res.redirect('/login');
	}
});


app.get('/login', (req,res) => {
	res.status(200).render('login');
});

app.post('/login', setCurrentTimestamp, (req, res) => {
	const data = req.body;
	const postdata = qs.parse(data);
	const client = new MongoClient(mongoDBurl);
	client.connect(
		(err) => {
			const userRecord = [];
			assert.equal(null, err);
			console.log("Connected successfully to server");
			const db = client.db(dbName);
				const findUser = (db, callback) => { 
					let cursor = db.collection('user').find() 
					cursor.forEach((doc) => { 
						userRecord = JSON.stringify(doc);
					}); 
					callback(); 
				};
				const client = new MongoClient(mongoDBurl); 
				client.connect((err) => { 
					assert.equal(null,err); 
					console.log("Connected successfully to server");
					const db = client.db(dbName);
					findUser(db,() => { 
						client.close();
					}) 
				})

			try{
				doc.forEach((user) => {
					if (user.name == req.body.logid && user.password == req.body.password) {
						req.session.authenticated = true;
						req.session.username = user.name;			
					}
				});
				res.redirect('/');
			} catch (err) {
				console.log('Invalid!');
			}
		}
	);
});

app.listen(process.env.PORT || 8099);

