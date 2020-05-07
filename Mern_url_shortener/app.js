const express = require('express');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const authRouters = require('./routes/auth.routers').router;
const app = express();

app.use(express.json({ extended: true }));

app.use('/api/auth', authRouters);
app.use('/api/link', require('./routes/link.routers'))
app.use('/t', require('./routes/redirect.router'))



if (process.env.NODE_ENV === 'production') {
	app.use('/', express.static(path.join(__dirname, 'client', 'build')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;

async function start() {
	try {
		await mongoose.connect(process.env.mongoUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
		});
		app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
	} catch (e) {
		console.log('Server Error', e.message);
		process.exit(1);
	}
}

start();
