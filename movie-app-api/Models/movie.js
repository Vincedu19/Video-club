const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  year: {type: String, required: true},
  director: {type: String, required: true},
  country: {type: String, required: true},
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" }
});

module.exports = mongoose.model('Movie', movieSchema);
