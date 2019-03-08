const request = require("supertest");
const server = require("./server.js");
const Games = require("../data/model/gamesModel");
const db = require("../data/dbConfig");

//Basic server testing
describe("BASIC SERVER TESTING - GET '/'", () => {
  it("should return 200 OK", async () => {
    const res = await request(server).get("/");

    expect(res.status).toBe(200);
  });

  it("should return JSON", async () => {
    const res = await request(server).get("/");

    expect(res.type).toBe("application/json");
  });

  it('should return "Lambda Sprint Challenge - Testing"', async () => {
    const res = await request(server).get("/");

    expect(res.body).toEqual("Lambda Sprint Challenge - Testing");
  });
});

//testing all games endpoints
describe("GAMES ENDPOINTS TESTING", () => {
  //testing POST
  describe("POST '/games'", () => {
    afterEach(async () => {
      await db("games").truncate();
    });

    // testing response for POST
    it("should insert new game into the db", async () => {
      const res = await request(server)
        .post("/games")
        .send({
          title: "Pacman",
          genre: "Arcade",
          releaseYear: 1980
        });

      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Pacman");
    });

    // testing 201 HTTP status code for POST
    it("should return 201 when adding a new game ", async () => {
      const res = await request(server)
        .post("/games")
        .send({
          title: "Pacman",
          genre: "Arcade",
          releaseYear: 1980
        });

      expect(res.status).toBe(201);
    });

    //testing 400 HTTP status code for POST
    it("should return 400 when title and genre not provided", async () => {
      const res = await request(server)
        .post("/games")
        .send({
          title: "",
          genre: "",
          releaseYear: 1980
        });

      expect(res.status).toBe(400);
    });
  });
});
