const Joi = require("joi");
const artistModel = require('./artist.model');
const { Types: { ObjectId } } = require('mongoose');


/**
   * returns an array of all artists in json format with a status of 200
   */
async function getAllArtists(req, res) {
    try {
        const artists = await artistModel.find();

        return res.status("200").json(artists);
      } catch {
        return res.status(400).send('can`t get artist from DB');
      }
}

/**
   * gets the 'artistId' parameter
   * if there is such an _id, returns a contact object in json format with a status 200
   * if there is no such _id, returns json with the key `{"message":"Not found"}` and status 404
   */
async function getArtistById(req, res) {
	try{
        const artist = await artistModel.findById(req.params.artistId);
        if(!artist) return  res.send('not found');

        return res.status("200").json(artist);
    }
    catch (error){
        res.status(400).send(error);
    } 
}

/**
   * gets the body in the format of `{name, telephone}`
   * if everything is fine with the body, adds a unique identifier to the contact object
   * the function returns the object with the added id `{_id, name, telephone}` and status 201
   */
async function postNewArtist(req, res) {
    try{
        const newArtist = await artistModel.create(req.body);
        
        return res.status(201).json(newArtist);
    } 
	catch (error){
        res.status(400).send(error);
    } 
}

/**
   * gets the body in json format with updating any fields of `name, telephone`
   * if body is not present, returns json with key `{"message":"missing fields"}` and status 400
   * the function returns an updated object with a artist and with a status of 200. 
   * Otherwise, it returns json with the key '{"message":"Not found"}'and status 404
   */
async function putArtistById(req, res) {
    try {
        const artistUpdated = await artistModel.findByIdAndUpdate(req.params.artistId, {$set: req.body}, {new:true});
        if (!artistUpdated) return res.status(404).json({ message: "Not found" });
  
        return res.status(200).json(artistUpdated);
    } 
    catch (error){
        res.status(400).send(error);
    } 
}

/**
   * gets the 'artistId' parameter
   * if there is such an id, returns json of the format `{"message":"artist deleted"}` and a status 200
   * if there is no such id, returns json with the key `{"message":"Not found"}` and status 404
   */
async function deleteArtistById(req, res) {
	try{
        const deletedArtist = await artistModel.findByIdAndRemove(req.params.artistId);

        if (!deletedArtist) return res.status(404).json({"message": "Not found"});

      return res.status(200).json({ "message": "artist deleted" });
    }
    catch(error) {
        res.status(400).send(error);
    }
}

/**
   * validation parameters ID of artist 
   */
async function validateId(req, res, next) {
    if (!ObjectId.isValid(req.params.artistId)) return res.status(400).json({message: "missing fields"});

    next();
}

/**
  * validation parameters new artist 
  * if the body does not have any required fields, returns json with the key `{"message":"missing required name field"}` and status 400
  */
async function validateNewArtist (req, res, next) {
    try {
        const schema = Joi.object({
          name: Joi.string().required(),
          telephone: Joi.string().required() //000-000-0000
        });
  
        await Joi.validate(req.body, schema);
  
        next();
    } 
    catch {
        res.status(400).json({"message":"missing required name field"});
    }
}

/**
   * validation artist parameters during update
   */
async function validateUpdatedArtist(req, res, next) {
    try {
      const schema = Joi.object({
        name: Joi.string(),
        telephone: Joi.string() //000-000-0000
        });

      await Joi.validate(req.body, schema);

      next();
    } catch {
      res.sendStatus(400);
    }
  }



module.exports = {
	getAllArtists,
    getArtistById,
    postNewArtist,
    putArtistById,
    deleteArtistById,
    validateId,
    validateNewArtist,
    validateUpdatedArtist
};


