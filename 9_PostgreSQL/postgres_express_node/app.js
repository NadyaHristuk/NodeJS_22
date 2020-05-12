const express = require('express');
const logger = require('morgan');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./routers')(app);
app.get('*', (req, res) =>
	res.status(200).send({
  message: 'Welcome to the beginning of nothingness.',
	})
);


const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);


app.listen(port, () => {
  console.log(`The server is running at localhost:${port}`);
});
