
const mongoose = require('mongoose');
const { Schema } = require('mongoose');


const artistSchema = new Schema ({
    name: {   type: String,
        required: true},
    telephone: {
        type: String,
        validate: {
          validator: function(v) {
            return /\d{3}-\d{3}-\d{4}/.test(v);
          }
        }
    }
});

const Artist = mongoose.model('Artist', artistSchema); 

module.exports = Artist;