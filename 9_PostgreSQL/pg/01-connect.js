const { Client } = require('pg');

const db = new Client('postgres://gokseqti:wmBDw8iAnDflpuyKP3LNlG2_3mjtw7Ua@balarama.db.elephantsql.com:5432/gokseqti');

db.connect();

db.query('SELECT * FROM students', (err, data) => {
	if (err) throw new Error(err);
	console.log(data.rows);
	db.end();
});
