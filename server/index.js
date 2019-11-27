const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", function(req, res) {
  res.sendfile("index.html", { root: "../public/" });
});

app.post("/", function(req, res) {
  let post = req.body;
  fs.writeFile(
    path.join(__dirname, "../cool.json"),
    JSON.stringify([post]),
    err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File has been created");
    }
  );
  res.send("ok");
});

app.listen(3030, () => console.log("server started"));
