const { gql } = require('apollo-server-express');
const Movie = require('./models/movie');

const typeDefs = gql`
	type Movie {
		id: ID!
		name: String
		producer: String
		rating: Int
	}

	type Query {
		
		getMovie(id: ID!): Movie
	}

	type Mutation {
        getMovies: [Movie]
		addMovie(name: String, producer: String, rating: Int): Movie
		updateMovie(id: ID!, name: String, producer: String, rating: Int): Movie
		delMovie(id: ID!): Movie
	}
`;

const resolvers = {
	Query: {
		
		getMovie: (parent, args) => {
			return Movie.findById(args.id);
		}
	},
	Mutation: {
        getMovies: (parent, args) => {
			return Movie.find();
		},
		addMovie: (parent, args) => {
			let newMovie = new Movie({
				name: args.name,
				producer: args.producer,
				rating: args.rating
			});
			return newMovie.save();
		},
		updateMovie: (parent, args) => {
			return Movie.findByIdAndUpdate(
				{ id },
				{
					$set: {
						name: args.name,
						producer: args.producer,
						rating: args.rating
					}
				},
				{ new: true },
				(err, Movie) => {
					if (err) {
						console.log('Somsing broken in update movie');
					}
					return Movie;
				}
			);
		},
		delMovie: (parent, args) => {
			return Movie.findByIdAndRemove({ id });
		}
	}
};

module.exports = { typeDefs, resolvers };
