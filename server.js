const http = require('http');
const url  = require('url');
const fs = require('fs');
const formidable = require('formidable');
const qs = require ('querystring');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const mongoDBurl = 'mongodb+srv://aaron:aaronso@aarondb-ep2mi.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 's381assignment';


const server = http.createServer((req,res) => {
	let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);

	let parsedURL = url.parse(req.url,true); // true to get query as object 
	let max = (parsedURL.query.max) ? parsedURL.query.max : 20;

	switch(parsedURL.pathname) {
		case '/read':
			read_n_print(res,parseInt(max));
			break;
		case '/showdetails':
			showdetails(res,parsedURL.query._id);
			break;
		case '/search':
			read_n_print(res,parseInt(max),parsedURL.query.criteria);
			break;
		case '/create':
			const form = new formidable.IncomingForm();
    			form.parse(req, (err, fields, files) => {
				if (files.filetoupload.size == 0) {
       		 			console.log("1");
					res.writeHead(500,{"Content-Type":"text/plain"});
       					res.end("No file uploaded!");  
      				}
				const filename = files.filetoupload.path;
				let mimetype = "images/jpeg";
				let title = "untitled";
      				if (fields.name && fields.name.length > 0) {
        				console.log("1");
					name = fields.name;
      				}
				if (fields.borough && fields.borough.length > 0) {
        				console.log("2");
					borough = fields.borough;
      				}      
				if (fields.cuisine && fields.cuisine.length > 0) {
        				console.log("3");
					cuisine = fields.cuisine;
      				}      				
				if (fields.street && fields.street.length > 0) {
        				console.log("4");
					street = fields.street;
      				}      				
				if (fields.building && fields.building.length > 0) {
        				console.log("4");
					building = fields.building;
      				}      				
				if (fields.zipcode && fields.zipcode.length > 0) {
        				console.log("4");
					zipcode = fields.zipcode;
      				}      				
				if (fields.latitude && fields.latitude.length > 0) {
        				console.log("4");
					latitude = fields.latitude;
      				}
				if (fields.longitude && fields.longitude.length > 0) {
        				console.log("5");
					longitude = fields.longitude;
      				}
				if (fields.score && fields.score.length > 0) {
        				console.log("6");
					score = fields.score;
      				}
				if (files.filetoupload.type) {
					console.log("7");
					mimetype = files.filetoupload.type;
				}
				fs.readFile(files.filetoupload.path, (err,data) => {
        				console.log("8");
					let client = new MongoClient(mongoDBurl);
        				client.connect((err) => {
         					try {
              						assert.equal(err,null);
           				 	} catch (err) {
              						res.writeHead(500,{"Content-Type":"text/plain"});
              						res.end("MongoClient connect() failed!");
              						return(-1);
          					}
          					const db = client.db(dbName);
          					let new_r = {};
						new_r['name'] = name;
						console.log("9");
						new_r['borough'] = borough;
						console.log("0");
						new_r['cuisine'] = cuisine;
						new_r['address'] = {"street" : "'+ street + '", "building" : "' + building + '", 
								    "zipcode" : "' + zipcode + '", "latitude" : "' + latitude + '", 
								    "longitude" : "' + longitude '"};
						console.log("1");
						new_r['grades'] = {"user" : "'+ score + '", "score" : "' + score '"};
						new_r['owner'] = 'o'
						new_r['mimetype'] = mimetype;
         			 		new_r['image'] = new Buffer.from(data).toString('base64');
						insertPhoto(db,new_r,(result) => {
           						client.close();
            						res.writeHead(200, {"Content-Type": "text/html"});
            						res.write('<html><body>Photo was inserted into MongoDB!<br>');
            						res.end('<a href="/photos">Back</a></body></html>')
          					})
        				});
  				})
    			});
		break;
		case '/login':
				if (req.method == 'POST') {
					let data = '';  // message body data
			  
					// process data in message body
					req.on('data', (payload) => {
					   data += payload;
					});
			
					req.on('end', () => {  
						let postdata = qs.parse(data);
						
							const client = new MongoClient(mongoDBurl);
						client.connect((err) => {
							assert.equal(null,err);
							console.log("Connected successfully to server");
							const db = client.db(dbName);
							try{
							temp = '{ "name" :  "'+ postdata.logid + '", "password" : "' + postdata.password + '"}';
							obj ={};
							obj = JSON.parse(temp);
							} catch (err) {
								console.log('Invalid a!');
								}
							db.collection('user').insertOne(obj,(err,result) => {
								res.writeHead(200, {'Content-Type': 'text/html'}); 
         						res.write('<html>')        
         						res.write(`User Name = ${postdata.logid}`);
				        
         						res.write('<br>')
        						res.write(`Password = ${postdata.password}`);
        						res.end('</html>') 					
								});
						});								
					 })	
				} else {
					res.writeHead(404, {'Content-Type': 'text/plain'}); 
					res.end('I can only handle POST request!!! Sorry.')
				}
			
			break;
		
		case '/delete':
			deleteDoc(res,parsedURL.query.criteria);
			break;
		case '/insert':
			res.writeHead(200, {'Content-Type': 'text/html'});
    			res.write('<form action="/create" method="post" enctype="multipart/form-data">');
    			res.write('Name: <input type="text" name="name"><br>');
   			res.write('Borough: <input type="text" name="borough"><br>');
			res.write('Cuisine: <input type="text" name="cuisine"><br>');
			res.write('Street: <input type="text" name="street"><br>');
			res.write('Building: <input type="text" name="building"><br>');
			res.write('Zipcode: <input type="text" name="zipcode"><br>');
			res.write('Latitude: <input type="text" name="latitude"><br>');
			res.write('Longitude: <input type="text" name="longitude"><br>');
			res.write('Score: <input type="text" name="Score"><br>');
   			res.write('<input type="file" name="filetoupload"><br>');
			res.write('<input type="submit" value="Create">')
			res.end('</form></body></html>');
			break;
		case '/edit':
			res.writeHead(200,{"Content-Type": "text/html"});
			res.write('<html><body>');
			res.write('<form action="/update">');
			res.write(`<input type="text" name="name" value="${parsedURL.query.name}"><br>`);
			res.write(`<input type="text" name="borough" value="${parsedURL.query.borough}"><br>`);
			res.write(`<input type="text" name="cuisine" value="${parsedURL.query.cuisine}"><br>`);
			res.write(`<input type="hidden" name="_id" value="${parsedURL.query._id}"><br>`);
			res.write('<input type="submit" value="Update">')
			res.end('</form></body></html>');
			break;

		default:
			res.writeHead(200,{"Content-Type": "text/html"});
			res.write('<html><head>');
			res.write('<title>Login</title>');
			res.write('</head><body>');
        		res.write(' <header class="w3-container w3-teal">');
			res.write('<h1>Login/Register</h1>');
			res.write('</header>    ');  
        		res.write(' <h3>Login</h3>');
        		res.write(' <form action="/login" method="post" class="w3-container w3-card-2">');
			res.write('	 <p>');
			res.write(`	 Name:<br></br><input name="logid" class="w3-input" type="text" style="width:20%" required="">`);
			res.write('	  <p>');
			res.write(`	  Password:<br></br><input name="password" class="w3-input" type="password" style="width:20%">`)
			res.write('	 <p>');
			res.write(`	  <button class="w3-btn w3-section w3-teal w3-ripple"> Log in </button></p>`);
			res.write('	 </form><br></br><br></br>  ');        
            		res.write('      <h3>Register</h3>');
           		res.write('      <form action="/register" method="post" class="w3-container w3-card-2">');
            		res.write('         <p>');
            		res.write(`         Name:<br></br><input name="regid" class="w3-input" type="text" style="width:20%" required="">`);
            		res.write('         <p>');
            		res.write(`         Password:<br></br><input name="regpassword" class="w3-input" type="password" style="width:20%">`);
            		res.write('         </p>');
            		res.write('         <p>');
            		res.write('         <p>');
            		res.write(`         confirm password:<br></br><input name="confirmpassword" class="w3-input" type="password" style="width:20%">`)
           	 	res.write('         <p>   ');
            		res.write(`          <button class="w3-btn w3-section w3-teal w3-ripple"> Register </button></p>`);
            		res.write('      </form>');
            		res.write('</div> ');        
			res.end('</body></html>	');
	}
});



const findRestaurants = (db, max, criteria, callback) => {
	//console.log(`findRestaurants(), criteria = ${JSON.stringify(criteria)}`);
	let criteriaObj = {};
	try {
		criteriaObj = JSON.parse(criteria);
	} catch (err) {
		console.log('Invalid criteria!  Default to {}');
	}
	cursor = db.collection('restaurant').find(criteriaObj).sort({name: -1}).limit(max); 
	cursor.toArray((err,docs) => {
		assert.equal(err,null);
		//console.log(docs);
		callback(docs);
	});
}

const read_n_print = (res,max,criteria={}) => {
	const client = new MongoClient(mongoDBurl);
	client.connect((err) => {
		assert.equal(null,err);
		console.log("Connected successfully to server");
		
		const db = client.db(dbName);
		findRestaurants(db, max, criteria, (restaurants) => {
			client.close();
			console.log('Disconnected MongoDB');
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write('<html><head><title>Restaurant</title></head>');
			res.write('<body><H1>Restaurants</H1>');
			res.write('<H2>Showing '+restaurants.length+' document(s)</H2>');
			res.write('<ol>');
			for (r of restaurants) {
				//console.log(r._id);
				res.write(`<li><a href='/showdetails?_id=${r._id}'>${r.name}</a></li>`)
			}
			res.write('</ol>');
			res.write('<br><a href="/insert?">Insert</a>')
			res.end('</body></html>');
		});
	});
}

const showdetails = (res,_id) => {
	const client = new MongoClient(mongoDBurl);
	client.connect((err) => {
		assert.equal(null,err);
		console.log("Connected successfully to server");
		
		const db = client.db(dbName);

		cursor = db.collection('restaurant').find({_id: ObjectId(_id)});
		cursor.toArray((err,docs) => {
			assert.equal(err,null);
			client.close();
			console.log('Disconnected MongoDB');
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write(`<html><head><title>${docs[0].name}</title></head>`);
			res.write('<h3>')
			res.write(`<p>Name: ${docs[0].name}</p>`);
			res.write(`<p>Location: ${docs[0].borough}</p>`);
			res.write(`<p>Cuisine: ${docs[0].cuisine}</p>`);
			res.write('</h3>')
			res.write(`<br><a href="/edit?_id=${_id}&name=${docs[0].name}&borough=${docs[0].borough}&cuisine=${docs[0].cuisine}">Edit</a>`)
			res.write('<br>')
			res.write('<br><a href="/read?max=20">Home</a>')
			res.end('</body></html>');
		});
	});
}
const deleteDoc = (res,criteria) => {
	let criteriaObj = {};
	try {
		criteriaObj = JSON.parse(criteria);
	} catch (err) {
		console.log(`${criteria} : Invalid criteria!`);
	}
	if (Object.keys(criteriaObj).length > 0) {
		const client = new MongoClient(mongoDBurl);
		client.connect((err) => {
			assert.equal(null,err);
			console.log("Connected successfully to server");
			const db = client.db(dbName);
			db.collection('restaurant').deleteOne(criteriaObj,(err,result) => {
				console.log(result);
				assert.equal(err,null);
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write('<html><body>');
				res.write(`Deleted ${result.deletedCount} document(s)\n`);
				res.end('<br><a href=/read?max=20>Home</a>');					
			});
		});
	} else {
		res.writeHead(404, {"Content-Type": "text/html"});
		res.write('<html><body>');
		res.write("Invalid criteria!\n");
		res.write(criteria);
		res.end('<br><a href=/read?max=20>Home</a>');	
	}
}

const updateDoc = (res,newDoc) => {
	console.log(`updateDoc() - ${JSON.stringify(newDoc)}`);
	if (Object.keys(newDoc).length > 0) {
		const client = new MongoClient(mongoDBurl);
		client.connect((err) => {
			assert.equal(null,err);
			console.log("Connected successfully to server");
			const db = client.db(dbName);
			let criteria = {};
			criteria['_id'] = ObjectId(newDoc._id);
			delete newDoc._id;
			db.collection('restaurant').replaceOne(criteria,newDoc,(err,result) => {
				assert.equal(err,null);
				console.log(JSON.stringify(result));
				res.writeHead(200, {"Content-Type": "text/html"});
				res.write('<html><body>');
				res.write(`Updated ${result.modifiedCount} document(s).\n`);
				res.end('<br><a href=/read?max=20>Home</a>');				
			});
		});
	} else {
		res.writeHead(404, {"Content-Type": "text/html"});
		res.write('<html><body>');
		res.write("Updated failed!\n");
		res.write(newDoc);
		res.end('<br><a href=/read?max=20>Home</a>');	
	}
}
server.listen(process.env.PORT || 8099);

