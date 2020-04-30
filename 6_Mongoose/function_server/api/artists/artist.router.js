const { Router } = require("express");
const artistRouter = Router();

const {
    getAllArtists,
    getArtistById,
    postNewArtist,
    putArtistById,
    deleteArtistById,
    validateId,
    validateNewArtist,
    validateUpdatedArtist
  } = require('./artist.controllers');

artistRouter.get('/', getAllArtists);
artistRouter.get('/:artistId', validateId, getArtistById);
artistRouter.post('/', validateNewArtist, postNewArtist);
artistRouter.put('/:artistId', validateId, validateUpdatedArtist, putArtistById);
artistRouter.delete('/:artistId', validateId, deleteArtistById);

module.exports = artistRouter;
