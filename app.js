const express = require("express");

// express app
const app = express();

// listen for requests
app.listen(3000);

//searches for files with ejs in it in 'views' folder
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/finale", (req, res) => {
  res.render("finale");
});

app.get("/diceroll", (req, res) => {
  const dice = [1, 2, 3, 4, 5, 6];

  res.render("diceroll", { diceroll: roll(dice) });
});

function roll(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return "... and you have rolled a " + arr[index];
}
