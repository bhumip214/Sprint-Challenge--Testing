const request = require("supertest");
const server = require("./server.js");
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
  //testing GET
  describe("GET '/games'", () => {
    //testing 200 HTTP status code
    it("should return 200 OK", async () => {
      const res = await request(server).get("/games");

      expect(res.status).toBe(200);
    });

    //testing the format of the data
    it("should return JSON", async () => {
      const res = await request(server).get("/games");

      expect(res.type).toBe("application/json");
    });

    //testing response of GET
    it("should return all games", async () => {
      const res = await request(server).get("/games");
      expect(res.body).toEqual([]);
    });
  });

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

    // testing 201 HTTP status code  when received correct game data
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

    //testing 422 HTTP status code when received incorrect game data
    it("should return 422 when title and genre are not provided", async () => {
      const res = await request(server)
        .post("/games")
        .send({ title: "", genre: "", releaseYear: 1980 });

      expect(res.status).toBe(422);
    });
  });

  //testing DELETE
  describe("DELETE '/games/:id'", () => {
    // testing 200 HTTP status code
    it("should return 200 when a game is deleted", async () => {
      const { body } = await request(server)
        .post("/games")
        .send({ title: "Mario", genre: "Platform", releaseYear: 1985 });

      const res = await request(server).delete(`/games/${body.id}`);
      expect(res.status).toBe(200);
    });

    it("should return JSON", async () => {
      const res = await request(server).delete("/games/:id");

      expect(res.type).toEqual("application/json");
    });
  });
});
