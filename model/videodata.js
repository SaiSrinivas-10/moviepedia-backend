const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
    
  MovieName: {
    type: String,
  },

  YearOfRelease: {
    type: String,
  },

  Language: {
    type: String,
  },

  ThumbNailPath: {
    type: String,
  },

  VideoPath: {
    type: String,
  },
});

module.exports = mongoose.model("videodata", videoSchema);
