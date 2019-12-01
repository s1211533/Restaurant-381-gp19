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

const server = http.createServer((req,res) => {
	let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	let parsedURL = url.parse(req.url,true); // true to get query as object 
	let max = (parsedURL.query.max) ? parsedURL.query.max : 20;   		 

	switch(parsedURL.pathname) {
		case '/':
			res.writeHead(200,{"Content-Type": "text/html"});
			res.write('<html><head>');
			res.write('<title>Login</title>');
			res.write('<meta name="viewport" content="width=device-width, initial-scale=1">');
			res.write(' <link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">');
			res.write('</head><body>');
        	res.write(' <header class="w3-container w3-teal">');
			res.write('<h1>Login/Register</h1>');
			res.write('</header>    ');     
        	res.write(' <div class="w3-container w3-half w3-margin-top">');
        	res.write(' <h3>Login</h3>');
        	res.write(' <form action="/login" method="post" class="w3-container w3-card-2">');
			res.write('	 <p>');
			res.write(`	 <input name="logid" class="w3-input" type="text" style="width:90%" required="">`);
			res.write('	 <label class="w3-label w3-validate">Name</label></p>');
			res.write('	  <p>');
			res.write(`	  <input name="password" class="w3-input" type="password" style="width:90%">`);
			res.write('	 <label class="w3-label w3-validate">Password</label></p>');
			res.write('	 <p>');
			res.write(`	  <button class="w3-btn w3-section w3-teal w3-ripple"> Log in </button></p>`);
			res.write('	 </form>	</div>   ');        
            res.write('	<div class="w3-container w3-half w3-margin-top">');
            res.write('      <h3>Register</h3>');
            res.write('      <form action="/register" method="post" class="w3-container w3-card-2">');
            res.write('         <p>');
            res.write(`         <input name="regid" class="w3-input" type="text" style="width:90%" required="">`);
            res.write('         <label class="w3-label w3-validate">Name</label></p>');
            res.write('         <p>');
            res.write(`         <input name="repassword" class="w3-input" type="password" style="width:90%">`);
            res.write('         <label class="w3-label w3-validate">Password</label></p>');
            res.write('         <p>');
            res.write('         <p>');
            res.write(`         <input name="confirmpassword" class="w3-input" type="password" style="width:90%">`);
            res.write('         <label class="w3-label w3-validate">Confirm Password</label></p>');
            res.write('         <p>   ');
            res.write(`         <button class="w3-btn w3-section w3-teal w3-ripple"> Register </button></p>`);
            res.write('      </form>');
            res.write('</div> ');        
			res.end('</body></html>	');
			break;
		
		default:
			res.writeHead(404, {"Content-Type": "text/html"});
			res.write('<html><body>');
			res.write("404 Not Found\n");
			res.end('<br><a href=/read?max=5>Give this a try instead?</a>');

	}
});

server.listen(process.env.PORT || 8099);
