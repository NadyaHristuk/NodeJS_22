const express = require('express');
const cors = require('cors');

const artistRouter = require('./routers/artists.router');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => res.send('Hello from API'));

app.use('/artists', artistRouter);
// app.use('/posts', postsRouters);

app.listen(3001, () => {
	console.log('API app started!');
});
