const express = require("express");

// express app
const app = express();

// listen for requests
app.listen(3000);

//searches for files with ejs in it in 'views' folder
app.set("view engine", "ejs");

// first part
app.get("/", (req, res) => {
  res.render("index");
});

// middle part
app.get("/about", (req, res) => {
  res.render("about");
});

// end part
app.get("/finale", (req, res) => {
  res.render("finale");
});

// members
app.get("/members", (req, res) => {
  const members = [
    { name: "Freddie Mercury", instrument: "Vocalist" },
    { name: "Brian May", instrument: "Guitarist" },
    { name: "Roger Taylor", instrument: "Bass Guitarist" },
    { name: "John Deacon", instrument: "Drummer" },
  ];

  res.render("members", { members });
});

// other songs
app.get("/songs", (req, res) => {
  const songs = [
    "We Will Rock You",
    "Dont Stop Me Now",
    "We Are The Champions",
    "Bicycle Race",
    "Killer Queen",
  ];

  res.render("songs", { songs });
});

// lucky draw
app.get("/diceroll", (req, res) => {
  const dice = [1, 2, 3, 4, 5, 6];

  res.render("diceroll", { diceroll: roll(dice) });
});

function roll(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return "... and you have rolled a " + arr[index];
}

//music query
//////////////////////////////
const { Pool } = require("pg");
const pool = makeDBConnectionPool("QueenSongsDB");

function makeDBConnectionPool(dbName) {
  //Understanding the details is not important here.
  return new Pool({
    database: dbName,
  });
}

async function dbDisplay() {
  const dbResult = await pool.query("select * from queen_songs");
  const songArray = dbResult.rows;
  return songArray;
}
//////////////////////////////

app.get("/songinfo", async (req, res) => {
  let result = await dbDisplay();

  res.render("songinfo", { songinfo: result });
});
