const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const md5 = require("md5");
const fs = require("fs");
const app = express();
var multer = require("multer");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Importing Functions
const functions = require("./Helpers");

// Mongoose connect
var mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(
  "mongodb+srv://admin:admin@123@movie.vmqtp.mongodb.net/Videodatabase?retryWrites=true&w=majority",
  mongooseOptions
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("mongodb connection established");
});

//Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let hashValue = md5(file.originalname + Date.now());
    pathValue = path.join(
      __dirname,
      "./uploads",
      hashValue.slice(0, 1),
      hashValue.slice(0, 2)
    );

    var stat = null;
    try {
      stat = fs.statSync(pathValue);
    } catch (err) {
      fs.mkdirSync(pathValue, { recursive: true });
    }
    if (stat && !stat.isDirectory()) {
      throw new Error(
        'Directory cannot be created because an inode of a different type exists at "' +
          pathValue +
          '"'
      );
    }
    cb(null, pathValue);
  },
  filename: function (req, file, cb) {
    console.log(file);
    fileName =
      md5(file.fieldname + String(Date.now()) + file.originalname) +
      "." +
      file.mimetype.slice(6);
    return cb(null, fileName);
  },
});

var upload = multer({
  storage: storage,
  limits: { fieldSize: 2 * 1024 * 1024 },
});

app.get("/", (req, res) => res.send("Hello"));
app.post(
  "/uploadmovie",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  functions.uploadMovie
);

app.get("/getmovies",functions.getList)
app.listen(3000, () => console.log("Listening to port"));
