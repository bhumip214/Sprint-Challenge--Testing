const express = require("express");
const server = express();
const Games = require("../data/model/gamesModel");

server.use(express.json());

server.get("/", async (req, res) => {
  res.status(200).json("Lambda Sprint Challenge - Testing");
});

// GET all games request
server.get("/games", async (req, res) => {
  const games = await Games.getAll();

  res.status(200).json(games);
});

//GET by ID request
server.get("/games/:id", async (req, res) => {
  try {
    const game = await Games.findById(req.params.id);

    if (game) {
      res.status(200).json(game);
    } else {
      res.status(404).json({ message: "Game not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was an error retrieving the Game"
    });
  }
});

//POST a game request
server.post("/games", async (req, res) => {
  try {
    if (req.body.title && req.body.genre) {
      const game = await Games.insert(req.body);

      res.status(201).json(game);
    } else {
      res.status(422).json({
        errorMessage: "Please provide the title and genre of a game."
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error while adding a new game to the database"
    });
  }
});

//DELETE request
server.delete("/games/:id", async (req, res) => {
  try {
    const count = await Games.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: "Game has been removed" });
    } else {
      res.status(404).json({ message: "Game could not be found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error removing a game"
    });
  }
});

module.exports = server;
