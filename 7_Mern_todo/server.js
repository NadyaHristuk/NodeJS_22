const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const todoRouters = require('./api/routes/todo_routes');

const app = express();


app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/tasks', todoRouters);

app.use((req, res) => res.status(404).json({ err: '404' }));
app.use((err, req, res) => {
	console.log(err.stack);
	res.status(500).json({ err: '500' });
});

mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('DB is connect'));

app.listen(process.env.PORT, () => console.log('Server is Running'));
