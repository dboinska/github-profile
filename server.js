const path = require("path");
const fetch = require("node-fetch");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.set("view engine", "pug");

app.use("/assets", express.static(path.join(__dirname, "/src")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/user/:username", async function (req, res) {
  if (req.params.username) {
    try {
      const user = await getUser(req.params.username);
      const repos = await getRepos(req.params.username);
      const latestRepos = repos.slice(0, 8);
      console.log(user);
      const hasUser = isNotEmptyObject(user);
      const hasRepos = isNotEmptyObject(repos);
      res.render("index", { hasUser, user, hasRepos, repos: latestRepos });
    } catch (e) {
      console.error(e);
      const errorMessage = e.message;
      res.render("index", { errorMessage });
    }
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.use((req, res) => {
  res.status(404);
  res.render("404");
});

app.listen(process.env.PORT, process.env.IP, function () {
  console.log(`App started at ${process.env.PORT}`);
});

const API_URL = "https://api.github.com/users/";
async function getUser(username) {
  const response = await fetch(API_URL + username);
  const data = await response.json();
  // console.log(data);

  if (!response.ok) {
    console.error("User not found, try another");
  } else {
    return data;
  }
}

async function getRepos(username) {
  const response = await fetch(API_URL + username + "/repos");
  const data = await response.json();

  return data;
}

function isNotEmptyObject(obj) {
  return obj && Object.keys(obj).length > 0;
}

/*
    1. Kliknięcie w Search zmienia url na ./users/:userName +
    2. Obsługa błędu gdy nie znaleziono usera +
    3. Przenieść logikę wyświetlania szukanego usera z pliku functions.js do index.pug, lub do nowego pliku i wczytać za pomocą include

*/
