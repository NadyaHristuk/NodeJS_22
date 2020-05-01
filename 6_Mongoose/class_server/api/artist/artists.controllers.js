const artistModel = require('./artist.model');


// function artistsGet (req, res) {

    
// }

// 
// function artistsGetById (req, res) {
//     const artistFind = artistModel.findById({})
// }

async function addArtist (req, res){
    // const newArtist = new artistModel( {
    //     name:req.body.name,
    //     tel: req.body.telephone
    // });

    const newArtist = await artistModel.create({
        name:req.body.name,
        telephone: req.body.telephone
    });


    
        // newArtist.save((err) => {
        //     if (err) return handleError(err);
        //     // saved!
        //   });

          res.send(newArtist);
}

// artistsDel

// artistsPut

module.exports = addArtist;