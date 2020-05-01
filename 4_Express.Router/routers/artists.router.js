const express = require('express');

const artistRouter = express.Router();

const artistsControllers = require('../controllers/artistControllers');

artistRouter.get('/', artistsControllers.artistsList);

artistRouter.get('/:id', artistsControllers.artistsByID);

artistRouter.post('/', artistsControllers.artistsPost);

artistRouter.put('/:id', artistsControllers.artistsUpdate);

artistRouter.delete('/:id', artistsControllers.artistsDel);

module.exports = artistRouter;
