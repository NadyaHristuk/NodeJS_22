const express = require('express');
const multer = require('multer');
const path = require('path');

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

const PORT = 3001;

const app = express();

app.use(express.json());

// app.use(express.static('static'));

app.post('/upload', upload.single('avatar'), (req, res, next) => {
	// console.log('req.file', req.file);
	// console.log('req.query', req.query);

	res.status(200).send(req.file);
});

app.listen(PORT, () => {
	console.log('Server started listening on port', PORT);
});
