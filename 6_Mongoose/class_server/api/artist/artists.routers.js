const {Router} = require('express');

const Routers = Router();

const addArtist = require('./artists.controllers');

// Routers.get('/', artistsControllers.artistsGet);
// Routers.get('/:id', artistsControllers.artistsGetById);
Routers.post('/', addArtist);
// Routers.delete('/:id', artistsControllers.artistsDel);
// Routers.put('/:id', artistsControllers.artistsPut);

module.exports = Routers;