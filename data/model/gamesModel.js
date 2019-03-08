const db = require("../dbConfig");

function getAll() {
  return db("games");
}

async function insert(game) {
  const [id] = await db("games").insert(game);

  return db("games")
    .where({ id })
    .first();
}

async function remove(id) {
  return db("games")
    .where({ id })
    .del();
}

function findById(id) {
  return db("games")
    .where({ id })
    .first();
}

module.exports = {
  getAll,
  insert,
  remove,
  findById
};
