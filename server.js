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
	else {
		res.redirect('/list');
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
				let cursor = db.collection('user').find();
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
	const client = new MongoClient(mongoDBurl);
	client.connect(
		(err) => {
			assert.equal(null, err);
			console.log("Connected successfully to server");
			const db = client.db(dbName);
			const findRestaurant = (db, callback) => { 
				let cursor2 = db.collection('restaurants').find() 
				cursor2.forEach((rname) => { 
					console.log(rname.name);
					res.status(200).render('restaurantList',{resname:rname.name});
				});
				callback();
			}
			client.connect((err) => { 
				assert.equal(null,err); 
				console.log("Connected successfully to server");
				const db = client.db(dbName);
				findRestaurant(db,() => { 
					client.close();
				});
			});
		}
	);
});


app.post('/list',(req, res) => {
	res.writeHead(200, {'Content-Type': 'text/html'}); 
	res.write('<html>')   
	res.write('<br><a href="/">Register Success</a>')
	res.end('</html>') 	
});


app.get('/logout', (req,res) => {
	req.session = null;
	res.redirect('/');
});


app.post('/register', (req,res) => {
	
	const client = new MongoClient(mongoDBurl);
	client.connect(
		(err) => {
			assert.equal(null, err);
			console.log("Connected successfully to server");
			const db = client.db(dbName);
			const regUser = (db, callback) => {
				if (req.body.repassword == req.body.password){
					obj = {};
					obj['name']=req.body.name;
					obj['password']=req.body.password;
					db.collection('user').insertOne(obj,(err,result) => { 
						res.redirect('/login');					
					});
					}else {
						res.status(200).render('fail reg');
						console.log('Invalid!');}

				callback(); 
			}
			client.connect((err) => { 
				assert.equal(null,err); 
				console.log("Connected successfully to server");
				const db = client.db(dbName);
				regUser(db,() => { 
					client.close();
				});
			});

		}
	);
});

app.get('/register', (req,res) => {
	res.status(200).render('register');
});

app.post('/delete', (req, res) => {
	const client = new MongoClient(mongoDBurl);
	client.connect(
		(err) => {
			assert.equal(null, err);
			console.log("Connected successfully to server");
			const db = client.db(dbName);
			const deleteRestaurants = (db, callback) => {
                        db.collection('restaurant').deleteOne(
                        {_id: ObjectId(_id)}, 
                        (err, results) => {
                        if (err) throw err;
                        console.log(results);
                        callback();
      }
   );
};
			client.connect((err) => { 
				assert.equal(null,err); 
				console.log("Connected successfully to server");
				const db = client.db(dbName);
				deleteRestaurants(db,() => { 
					client.close();
				});
			});
		}
	);
});



console.log(typeof a);





app.listen(process.env.PORT || 8099);
