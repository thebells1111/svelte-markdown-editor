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
  let currentTime = new Date().getTime();
  const file = path.join(__dirname, "../src/_blog.json");

  const contents = JSON.parse(fs.readFileSync(file, "utf8"));

  let index;

  for (let i = 0; i < contents.length; i++) {
    if (contents[i].slug === post.slug) {
      post.timestamp = contents[i].timestamp;
      index = i;
      i = contents.length;
    }
  }

  if (index > -1) {
    post.updated = currentTime;
    contents[index] = post;
  } else {
    post.timestamp = currentTime;
    contents.push(post);
  }

  fs.writeFile(file, JSON.stringify(contents, null, 2), err => {
    if (err) {
      res.status(500).send("write_fail");
    }
    res.send("ok");
  });
});

app.listen(3030, () => console.log("server started"));
