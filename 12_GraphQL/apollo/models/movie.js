const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const movieSchema = new Schema(
	{
		name: String,
		rating: Number,
		producer: String
	},
	{
		timestamps: true
	}
);

const Movies = mongoose.model('Movie', movieSchema);

module.exports = Movies;
