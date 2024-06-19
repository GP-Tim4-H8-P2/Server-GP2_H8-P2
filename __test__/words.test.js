const request = require("supertest");
const app = require("../app");
const { Word, sequelize } = require("../models/index");

describe("GET /word", () => {
  beforeAll(async () => {
    await sequelize.sync();
    await Word.bulkCreate([
      { words: "apple", hint: "A fruit" },
      { words: "car", hint: "A vehicle" },
    ]);
  });

  afterAll(async () => {
    await Word.destroy({ where: {} });
    await sequelize.close();
  });

  it("should return a random word and hint", async () => {
    const response = await request(app).get("/word");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("word");
    expect(response.body).toHaveProperty("hint");
  });
});
