const url  = require('url');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const mongoDBurl = 'mongodb+srv://aaron:aaronso@aarondb-ep2mi.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 's381assignment';
const session = require('cookie-session');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var timestamp = null;

const SECRETKEY1 = 'I want to pass COMPS381F';
const SECRETKEY2 = 'Keep this to yourself';

app.set('view engine', 'ejs');

let sessionUser = null;

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
	const client = new MongoClient(mongoDBurl);
	client.connect(
		(err) => {
			assert.equal(null, err);
			console.log("Connected successfully to server");
			const db = client.db(dbName);
			const findUser = (db, callback) => { 
				let cursor = db.collection('user').find() 
				cursor.forEach((account) => { 
					if (account.name == req.body.name && account.password == req.body.password) {
						req.session.authenticated = true;
						req.session.username = account.name;
						res.redirect('/list');
					}
					else{
						res.status(200).render('fail');
						console.log('Invalid!');
					}
				}); 
				callback(); 
			}
			client.connect((err) => { 
				assert.equal(null,err); 
				console.log("Connected successfully to server");
				const db = client.db(dbName);
				findUser(db,() => { 
					client.close();
				});
			});

		}
	);
});



app.get('/list',(req, res) => {
	const username = req.session.username;
	res.status(200).render('restaurantList');
	
});

app.get('/logout', (req,res) => {
	req.session = null;
	res.redirect('/');
});


app.post('/register', (req,res) => {
	
	if (req.method == 'POST') {
		let data = '';  // message body data
		console.log("k");
		// process data in message body
		req.on('data', (payload) => {
		   data += payload;
		});

		req.on('end', () => {  
			let postdata = qs.parse(data);
			console.log("u");
			if (postdata.regpassword==postdata.confirmpassword){
			console.log("u");
			const client = new MongoClient(mongoDBurl);
			client.connect((err) => {
				assert.equal(null,err);
				console.log("Connected successfully to server");
				const db = client.db(dbName);
				try{
			temp = '{ "name" :  "'+ postdata.regid + '", "password" : "' + postdata.regpassword + '"}';
				obj ={};
				obj = JSON.parse(temp);
				} catch (err) {
					console.log('Invalid!');}

				db.collection('user').insertOne(obj,(err,result) => {
					res.writeHead(200, {'Content-Type': 'text/html'}); 
					 res.write('<html>')   
					 res.write('<br><a href="/">Register Success</a>')
					res.end('</html>') 					
					});
			});

			} else {
					res.writeHead(200, {'Content-Type': 'text/html'}); 
					res.write('<html>')   
					 res.write('<br><a href="/">Confirm password does not match!</a>')
					res.end('</html>') 
					}  
			 })
	} else {
		res.writeHead(404, {'Content-Type': 'text/plain'}); 
		res.end('Error.')
	}
});






app.listen(process.env.PORT || 8099);
