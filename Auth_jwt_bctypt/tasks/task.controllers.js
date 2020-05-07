const db = require('./db_function');

const getTasks = (req, res) => {
	db.gets().then((results) => res.json(results)).catch((err) => res.status(400).json({ err: err.message }));
};

const getTask = (req, res) => {
	db
		.getById(req.params.id)
		.then((results) => (results ? res.json(results) : res.status(404).json({ err: 'Cat not found' })))
		.catch((err) => res.status(400).json({ err: err.message }));
};

const addTask = (req, res) => {
	db
		.add(req.body)
		.then((results) => res.status(201).json(results))
		.catch((err) => res.status(400).json({ err: err.message }));
};

const editTask = (req, res) => {
	db
		.update(req.params.id, req.body)
		.then((results) => (results ? res.json(results) : res.status(400).json({ err: 'Cat not found' })))
		.catch((err) => res.status(400).json({ err: err.message }));
};

const deleteTask = (req, res) => {
	db
		.del(req.params.id)
		.then((results) => (results ? res.json(results) : res.status(400).json({ err: 'Cat not found' })))
		.catch((err) => res.status(400).json({ err: err.message }));
};

module.exports = {
	deleteTask,
	editTask,
	addTask,
	getTask,
	getTasks
};
