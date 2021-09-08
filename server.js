require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser')

const dns = require('dns')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const shortNum = generateRandomInteger(100)
var originalUrl

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({
	extended: true
}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {

	originalUrl = req.body.url

	var protocol = originalUrl.split("://")

	const res1 = originalUrl.replace(protocol[0] + '://', '');
	dns.lookup(res1, (err, address, family) => {
		var jsons = {
			original_url: originalUrl,
			short_url: shortNum
		}

		if (err) {
			jsons = {
				error: 'invalid url'
			}
		}

		return res.json(jsons)
		
	})

	

	
})

app.get('/api/shorturl/:num', (req, res) => {
	res.writeHead(302, {Location: originalUrl})
	res.end()
})




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});


function generateRandomInteger(max) {
    return Math.floor(Math.random() * max) + 1;
}