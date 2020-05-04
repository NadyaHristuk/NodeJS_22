const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todo_item = new Schema(
	{
		task: {
			type: String,
			mach: /\+w/,
			require: [ true, 'Укажите задачу' ]
		},
		isActive: { type: Boolean, default: false }
	},
	{ timestamps: { createdAt: 'created_at' } }
);

const ToDo = mongoose.model('todo', todo_item);
module.exports = ToDo;
