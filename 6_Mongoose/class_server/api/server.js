const express = require('express');
const mongoose = require('mongoose');
const artistRoutrs= require ('./artist/artists.routers');

require('dotenv').config();

module.exports = class ArtistsServer {
    constructor(){
        this.server = null;
    }

    async start(){
        this.initServer();
        this.initMidelwares();
        this.initRouters();
        await this.initDatabase();
        this.startListening();
    }

    initServer(){
        this.server = express();
    }

    initMidelwares () {
        this.server.use(express.json());
        this.server.use(express.urlencoded({extended: true}));
    }

    initRouters() {
        // this.server.get('/', (req))
        this.server.use('/artists', artistRoutrs);
        // this.server.use('/posts', postsRouters);
    }

    async initDatabase() {
        await mongoose.connect(process.env.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    startListening () {
        const PORT = process.env.PORT;

        this.server.listen(PORT, () => {
            console.log('listening on port ' + PORT);
        })
    }
}
