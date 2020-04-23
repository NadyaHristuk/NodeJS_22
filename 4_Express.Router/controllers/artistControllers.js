const fs = require('fs');
const path = require('path');

const fileDB = path.join(__dirname, '../', 'db', 'artists.json');

const artists = fs.readFileSync(fileDB, 'utf-8');
const artistArr = JSON.parse(artists);

function artistsList(req, res) {
	res.send(artistArr);
}

function artistsByID(req, res) {
	let artist = artistArr.find((artist) => artist.id == Number(req.params.id));
	res.send(artist);
	// res.send('get by id');
}

function artistsPost(req, res) {
	let newArtist = {
		id: Date.now(),
		name: req.body.name
	};
	const artistaUpd = JSON.stringify([ ...artistArr, newArtist ]);
	fs.writeFile(fileDB, artistaUpd, function(err) {
		if (err) return res.send(err);
		res.send(newArtist);
	});
	// res.send('post a new user');
}

function artistsUpdate(req, res) {
	const artist = artistArr.find((artist) => artist.id == Number(req.params.id));
	artist.name = req.body.name;
	res.send(artist);
	// res.send('artist was update');
}

function artistsDel(req, res) {
	const artists = artistArr.filter((artist) => artist.id !== Number(req.params.id));

	fs.writeFile(fileDB, JSON.stringify(artists), function(err) {
		if (err) return res.send(err);
		res.send(artists);
	});
}

module.exports = {
	artistsList,
	artistsByID,
	artistsPost,
	artistsUpdate,
	artistsDel
};
