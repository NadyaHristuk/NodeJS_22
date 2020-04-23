const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const fileDB = path.join(__dirname, './', 'db', 'artists.js');

const artists = fs.readFileSync(fileDB, 'utf-8');

app.get('/', (req, res) => res.send('Hello from API'));

app.get('/artists', (req, res) => res.send(artists));

app.get('/artists/:id', (req, res) => {
	let artist = artists.find((artist) => artist.id == req.params.id);
	res.send(artist);
});

app.post('/artists', (req, res) => {
	let newArtist = {
		id: Date.now(),
		name: req.body.name
	};
	artists.push(newArtist);
	res.send(newArtist);
});

app.put('/artists/:id', (req, res) => {
	let artist = artists.find((artist) => artist.id == req.params.id);
	artist.name = req.body.name;
	// res.sendStatus(200);
	res.send(artist);
});

app.delete('/artists/:id', (req, res) => {
	artists = artists.filter((artist) => {
		artist.id !== Number(req.params.id);
	});
	res.sendStatus(200);
});

app.listen(3001, () => {
	console.log('API app started!');
});

//heroku cli
//heroku create
//
