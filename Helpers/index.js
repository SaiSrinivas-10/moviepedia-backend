const moviedata = require("../model/videodata");
const FormData = require("form-data");
const fs = require("fs");

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
        var formData = new FormData();
        formData.append("name", movie.MovieName);
        formData.append("year", movie.YearOfRelease);
        formData.append("language", movie.Language);
        formData.append("thumbnail", fs.createReadStream(`./uploads${movie.ThumbNailPath}`));
        data.push(formData);
      });
      res.send(data);
    })
    .catch((err) => console.log(err));
};

module.exports = { uploadMovie, getList };
