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
  return arr[index];
}

//music query
//////////////////////////////

// beekeeper studio db
const { Pool } = require("pg");
//const pool = makeDBConnectionPool("QueenSongsDB");

function makeDBConnectionPool(dbName) {
  //Understanding the details is not important here.
  return new Pool({
    database: dbName,
  });
}

//////////////////////////////

//elephant sql db
const dotenv = require("dotenv");
dotenv.config(); // looks for env file with url
const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // keeps your password and url a secret!

async function dbDisplay() {
  const dbResult = await pool.query("select * from queen_songs limit 10");
  const songArray = dbResult.rows;
  return songArray;
}
//////////////////////////////

app.get("/songinfo", async (req, res) => {
  let result = await dbDisplay();

  res.render("songinfo", { songinfo: result });
});

//////////////////////////////

// middleware & static files
app.use(express.static("public")); // this allows files to be public

// route parameters
// 13.1 exercise (reverse)
app.get("/reverse/:word", (req, res) => {
  const givenWord = req.params.word;

  res.send(reverse(givenWord));
});

const reverse = (word) => {
  let reversedWord = word.split("").reverse().join("");
  return reversedWord;
};

// 13.2 exercise (remove vowels)
app.get("/removeVowels/:word", (req, res) => {
  const givenWord = req.params.word;
  res.send(removeVowels(givenWord));
});

const removeVowels = (word) => {
  const noVowels = word.replace(/[aeiou]/gi, "");
  return noVowels;
};

// 13.3 exercise (addition)
app.get("/add/:num1/:num2", (req, res) => {
  const strNum1 = req.params.num1;
  const strNum2 = req.params.num2;

  const firstNum = parseInt(strNum1);
  const secondNum = parseInt(strNum2);

  let sum = firstNum + secondNum;
  res.send(sum.toString());
});

// 13.4 exercise (find stuff on database)
app.get("/songinfo/:song_id", async (req, res) => {
  const dbSongID = req.params.song_id; //equals 1

  if (dbSongID > 0 && dbSongID <= 10) {
    const songResult = await pool.query(
      "select * from queen_songs where song_id = $1",
      [dbSongID]
    );

    res.send(songResult.rows);
  } else {
    res.send("Please choose a Song ID between 1 to 10");
  }
});

// 14.1 exercise (youtube form)
app.get("/youtube", (req, res) => {
  //https://www.youtube.com/watch?v=JksX4mN5H3w&t=343s
  res.render("youtube");
});

// 14.2 exercise (faves form)
app.get("/faves", (req, res) => {
  res.render("faves", { favsObj: req.query });
});

// 14.3 exercise (queen database)
app.get("/songsearch", async (req, res) => {
  const searchTerm = req.query.searchTerm;

  const value = [`%${searchTerm}%`];

  const searchResult = await pool.query(
    "select * from queen_songs where title ilike $1",
    value
  );

  let resultsObj = searchResult.rows;

  res.render("songsearch", { songObj: resultsObj });
});
