const express = require('express');
const multer = require('multer');
const fs = require('fs');


const app = express();

const storage = multer.diskStorage({
	destination: 'uploads',
	filename: function(req, file, cb) {
		console.log('file', file);
		// const ext = path.parse(file.originalname).ext;
		// cb(null, Date.now() + ext);
		cb(null, Date.now() + file.originalname);
	}
});

const upload = multer({ storage });

const MongoClient = require('mongodb').MongoClient;
const myurl = 'mongodb+srv://user:123@cluster0-jkmtu.mongodb.net/test?retryWrites=true&w=majority';

MongoClient.connect(myurl, { useUnifiedTopology: true }, (err, client) => {
	if (err) return console.log(err);
	db = client.db('test');
	app.listen(3001, () => {
		console.log('listening on 3001');
	});
});

app.post('/upload', upload.single('avatar'), (req, res) => {
	var img = fs.readFileSync(req.file.path);
	var encode_image = img.toString('base64');
	// Define a JSONobject for the image attributes for saving to database

	const length = encode_image.length;

	const buf = Buffer.alloc(length, encode_image, 'base64');

	var finalImg = {
		contentType: req.file.mimetype,
		image: buf
	};
	db.collection('avatars').insertOne(finalImg, (err, result) => {
		// console.log(result);

		if (err) return console.log(err);

		console.log('saved to database');
		res.status(200).send(result);
	});
});

app.get('/avatar', (req, res) => {
	db.collection('avatars').find().toArray((err, result) => {
		const imgArray = result.map((element) => element._id);
		console.log(imgArray);

		if (err) return console.log(err);
		res.send(imgArray);
	});
});

app.get('/avatar/:id', (req, res) => {
	var filename = req.params.id;

	db.collection('avatar').findOne({ _id: ObjectId(filename) }, (err, result) => {
		if (err) return console.log(err);

		res.contentType('image/jpeg');
		res.send(result.image.buffer);
	});
});
