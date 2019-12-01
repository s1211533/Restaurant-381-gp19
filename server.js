const http = require('http');
const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');
var express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.get('/',function(req, res)
	{
		res.sendfile('login.html');
	})


