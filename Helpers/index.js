const moviedata = require("../model/videodata");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer.from(bitmap).toString("base64");
}

const uploadMovie = (req, res) => {
  var tpath = req.files.thumbnail[0].path;
  var thumbnailpath = tpath.slice(tpath.search("uploads") + "uploads".length);
  var vpath = req.files.video[0].path;
  var videopath = vpath.slice(vpath.search("uploads") + "uploads".length);

  var document = new moviedata({
    MovieName: req.body.name,
    YearOfRelease: req.body.year,
    Language: req.body.language,
    ThumbNailPath: thumbnailpath,
    VideoPath: videopath,
  });
  document
    .save()
    .then(() => {
      res.send("Done");
    })
    .catch((err) => {
      console.log(err);
    });
};

const getList = (req, res) => {
  moviedata
    .find({})
    .exec()
    .then((movies) => {
      var data = [];
      movies.map((movie) => {
        var picture = base64_encode(`./uploads${movie.ThumbNailPath}`);
        var temp = {
          name: movie.MovieName,
          year: movie.YearOfRelease,
          language: movie.Language,
          thumbnail: picture,
        };
        data.push(temp);
      });
      res.send(data);
    })
    .catch((err) => console.log(err));
};

module.exports = { uploadMovie, getList };
