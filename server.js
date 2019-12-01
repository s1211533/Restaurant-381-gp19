const http = require('http');
const url  = require('url');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const mongoDBurl = 'mongodb+srv://aaron:aaronso@aarondb-ep2mi.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'AaronDB';
var session = require('cookie-session');
var express = require('express');
const app = express();


app.use(session({
	name: 'session'
}));

app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer((req,res) => {
	let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);
	let parsedURL = url.parse(req.url,true); // true to get query as object 
	let max = (parsedURL.query.max) ? parsedURL.query.max : 20;   		 
	switch(parsedURL.pathname) {
		case '/':
			app.get('/', (req,res) => {
				console.log(req.session);
				if (!req.session.authenticated) {
					res.redirect('/login');
				}
			});
			app.get('/login', (req,res) => {
				res.status(200).sendFile(__dirname + '/login.html');
			
			});	
			break;	
		
		default:
			res.writeHead(404, {"Content-Type": "text/html"});
			res.write('<html><body>');
			res.write("404 Not Found\n");
			res.end('<br><a href=/read?max=5>Give this a try instead?</a>');

	}
});


