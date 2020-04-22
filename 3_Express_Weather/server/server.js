const express = require('express');
const dotenv = require('dotenv');
const node_fetch = require('node-fetch');
const Joi = require('joi');
const cors = require('cors');

const app = express();

app.use(cors());
// app.use(addAllowOriginHeader);
// app.options("*", addCorsHeaders);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const PORT = process.env.PORT;

// console.log(process.env);
// console.log(PORT);

app.post(
	'/weather',
	(req, res, next) => {
		const schema = Joi.object({
			city: Joi.string().required()
		});
		const result = Joi.validate(req.body, schema);

		if (result.error) {
			return res.status(400).send(result.error);
		}

		next();
	},
	async (req, res) => {
		// console.log(req.query.city); //localhost:3002/weather?city=kiev&days=5
		const { city } = req.body;

		const response = await node_fetch(
			`http://api.weatherstack.com/forecast?access_key=${process.env.WEATHER_KEY}&query=${city}`
		);

		const resBody = await response.json();

		if (resBody.error) {
			return res.status(resBody.error.code).send(resBody.error);
		}

		return res.status(200).send(resBody);
	}
);

function addAllowOriginHeader(req, res, next) {
	res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	next();
}

function addCorsHeaders(req, res, next) {
	res.set('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
	res.set('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);

	res.status(200).send();
}

app.listen(process.env.PORT, () => {
	console.log('Server is listening on ', PORT);
});
