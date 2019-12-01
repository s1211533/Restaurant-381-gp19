const http = require('http');
const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');
var express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.get('/', (req,res) => {
	res.status(200).sendFile(__dirname + '/public/login.html');
});


