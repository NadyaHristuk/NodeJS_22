const express = require('express');
const mongoose = require('mongoose');

const schema = require('./schema');

const { ApolloServer } = require('apollo-server-express');

const url = 'mongodb+srv://user:123@cluster0-jkmtu.mongodb.net/test?retryWrites=true&w=majority';
const connect = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
connect.then(
	(db) => {
		console.log('Connected correctly to server!');
	},
	(err) => {
		console.log(err);
	}
);
const server = new ApolloServer({
	typeDefs: schema.typeDefs,
	resolvers: schema.resolvers
});

const app = express();
app.use(express.json());

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
