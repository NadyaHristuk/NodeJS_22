const express = require('express');
const multer = require('multer');

const app = express();

app.use(express.json());

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads');
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});

var upload = multer({ storage: storage }).array('userPhoto', 2);

app.post('/api/photo', function(req, res) {
	upload(req, res, function(err) {
		console.log(req.body);
		console.log(req.files);
		if (err) {
			return res.end('Error uploading file.');
		}
		res.end('File is uploaded');
	});
});

app.listen(3000, function() {
	console.log('Working on port 3000');
});
