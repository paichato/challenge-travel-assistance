// app.test.js
const request = require("supertest");
const app = require("../index");

describe("POST /api/users/login", () => {
  test("should return 200 and login successful message with valid credentials", async () => {
    const response = await request(app).post("/api/users/login").send({
      username: "bento",
      password: "123456",
    });

    expect(response.status).toBe(200);
  });

  test("should return 400 and invalid credentials message with invalid credentials", async () => {
    const response = await request(app).post("/api/users/login").send({
      username: "beltrano",
      password: "123123",
    });

    expect(response.status).toBe(400);
    console.log(response.body);
    expect(response.error.text).toBe("Username or Password is incorrect");
  });

  test("should return 401 and Missing credentials message", async () => {
    const response = await request(app).post("/api/users/login").send({
      username: "beltrano",
    });

    expect(response.status).toBe(401);
    console.log(response.body);
    expect(response.error.text).toBe("Missing username or password");
  });

  // Add more test cases to cover edge cases and error handling
});

describe("POST /api/users/register", () => {
  test("should return 401 and invalid credentials message with invalid credentials", async () => {
    const response = await request(app).post("/api/users/register").send({
      username: "bas",
    });

    expect(response.status).toBe(401);
    console.log(response.body);
    expect(response.error.text).toBe("Missing username or password");
  });

  test("should return 401 and Missing credentials message", async () => {
    const response = await request(app).post("/api/users/register").send({
      username: "beltrano",
    });

    expect(response.status).toBe(401);
    console.log(response.body);
    expect(response.error.text).toBe("Missing username or password");
  });

  // Add more test cases to cover edge cases and error handling
});

describe("GET api/dashboard/travel/:city", () => {
  test("should return 200 and return correct data", async () => {
    const response = await request(app)
      .get("/api/dashboard/travel/maputo")
      .send();

    expect(response.status).toBe(200);
  });

  test("should return 400 and no country found message", async () => {
    const response = await request(app)
      .get("/api/dashboard/travel/abcd")
      .send();

    expect(response.status).toBe(400);
  });
});
