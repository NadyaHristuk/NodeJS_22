const express = require('express');
const dotenv = require('dotenv');
const node_fetch = require('node-fetch');
const Joi = require('joi');
const cors = require('cors');

const app = express();

app.use(cors());

// app.use(addAllowOriginHeader);
// app.options('*', addCorsHeaders);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const PORT = process.env.PORT;

// console.log(process.env);
// console.log(PORT);

app.post(
	'/weather/city',
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

app.get(
	'/weather/city',
	(req, res, next) => {
		const schema = Joi.object({
			city: Joi.string().required()
		});

		const result = Joi.validate(req.query, schema);
		console.log(req.body);
		if (result.error) {
			return res.status(400).send(result.error);
		}

		next();
	},
	async (req, res) => {
		// console.log(req.query.city); //localhost:3002/weather?city=kiev&days=5
		const { city } = req.query;

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

// const URL = `https://pixabay.com/api/?key=${IMAGE_KEY}&q=${cityName}`;

app.post(
	'/weather/images',
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
		const { city } = req.body;

		const response = await node_fetch(`https://pixabay.com/api/?key=${process.env.IMAGE_KEY}&q=${city}`);
		const resBody = await response.json();

		if (resBody.error) {
			return res.status(resBody.error.code).send(resBody.error);
		}

		return res.status(200).send(resBody);
	}
);

app.post(
	'/weather/imageweather',
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
		const { city } = req.body;

		const responseImg = await node_fetch(`https://pixabay.com/api/?key=${process.env.IMAGE_KEY}&q=${city}`);
		const responseWeath = await node_fetch(
			`http://api.weatherstack.com/forecast?access_key=${process.env.WEATHER_KEY}&query=${city}`
		);

		const resBodyImg = await responseImg.json();
		const resBodyWeath = await responseWeath.json();
		const Obj = [ resBodyWeath, resBodyImg ];

		if (Obj.error) {
			return res.status(resBody.error.code).send(resBody.error);
		}

		return res.status(200).send(Obj);
	}
);

app.post(
	'/weather/latlon',
	(req, res, next) => {
		const schema = Joi.object({
			lat: Joi.string().required(),
			lng: Joi.string().required()
		});

		const result = Joi.validate(req.body, schema);

		if (result.error) {
			res.status(400).send({ error: 'Validate failed!' });
		}

		next();
	},
	async (req, res) => {
		const { lat, lng } = req.body;

		const response = await node_fetch(
			`http://api.weatherstack.com/forecast?access_key=${process.env.WEATHER_KEY}&query=${lat},${lng}`
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
