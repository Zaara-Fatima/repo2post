import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app.js";

describe("GET /", () => {
  it("should return API information", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Repo2Post API");
  });
});

describe("GET /api/health", () => {
  it("should return API information", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.message).toBe("Repo2Post API is running");
  });
});

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vitest User",
        email: `vitest-${Date.now()}@example.com`,
        password: "Test@12345",
      });
    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toContain("@example.com");
  });
});

describe("POST /api/auth/login", () => {
  it("should login an existing user", async () => {
    const email = `login-${Date.now()}@example.com`;
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Login Test",
        email,
        password: "Test@12345",
      });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "Test@12345",
    });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers["set-cookie"]).toBeDefined();

    const accessToken = response.body.accessToken
    const profileResponse = await request(app).get('/api/users/me').set("Authorization",`Bearer ${accessToken}`)
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user.email).toBe(email)
    
  });
});
