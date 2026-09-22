import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import app from "./app.js";
import { githubApi } from "./clients/github.client.js";
import Repository from "./models/Repository.js";
import jwt from "jsonwebtoken";
import { ai } from "./clients/ai.client.js";

let accessToken;

beforeAll(async () => {
  const email = `integration-${Date.now()}@example.com`;
  const registerResponse = await request(app).post("/api/auth/register").send({
    name: "Integration Test",
    email,
    password: "Test@12345",
  });

  expect(registerResponse.status).toBe(201);

  const loginResponse = await request(app).post("/api/auth/login").send({
    email,
    password: "Test@12345",
  });

  accessToken = loginResponse.body.accessToken;
  expect(accessToken).toBeDefined();
});

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
    await request(app).post("/api/auth/register").send({
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

    const accessToken = response.body.accessToken;
    const profileResponse = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.user.email).toBe(email);
  });
  it("should reject an incorrect password", async () => {
    const email = `wrong-password-${Date.now()}@example.com`;
    await request(app).post("/api/auth/register").send({
      name: "login test 2",
      email,
      password: "Test@12345",
    });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "WrongPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(" Invalid email or password");
  });
  it("should reject unauthenticated requests", async () => {
    const response = await request(app).get("/api/users/me");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("AUTHENTICATION REQUIRED");
  });
  it("should reject an invalid access token", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer invalid-token");
    expect(response.status).toBe(401);
  });
  it("should refresh the access token", async () => {
    const agent = request.agent(app);
    const email = `refresh-${Date.now()}@example.com`;
    await agent.post("/api/auth/register").send({
      name: "Refresh Test",
      email,
      password: "Test@12345",
    });
    const loginResponse = await agent.post("/api/auth/login").send({
      email,
      password: "Test@12345",
    });
    expect(loginResponse.status).toBe(200);
    const refreshResponse = await agent.post("/api/auth/refresh");
    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.accessToken).toBeDefined();
  });
  it("should logout the user", async () => {
    const agent = request.agent(app);
    const email = `logout-${Date.now()}@example.com`;
    await agent.post("/api/auth/register").send({
      name: "Logout test",
      email,
      password: "Test@12345",
    });
    const loginResponse = await agent.post("/api/auth/login").send({
      email,
      password: "Test@12345",
    });
    expect(loginResponse.status).toBe(200);
    const logoutResponse = await agent.post("/api/auth/logout");
    expect(logoutResponse.status).toBe(200);
    const refreshResponse = await agent.post("/api/auth/refresh");
    expect(refreshResponse.status).toBe(401);
  });
});

describe("POST /api/repositories/analyze", () => {
  it("should analyze a valid GitHub repository", async () => {
    const response = await request(app)
      .post("/api/repositories/analyze")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        url: "https://github.com/expressjs/express",
      });
    console.log(response.body);
    expect(response.status).toBe(201);
  });
  it("should reject a non-existent GitHub repository", async () => {
    const response = await request(app)
      .post("/api/repositories/analyze")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        url: "https://github.com/expressjs/this-repository-does-not-exist",
      });
    expect(response.status).toBe(404);
  });
  it("should reject invalid repository input", async () => {
    const response = await request(app)
      .post("/api/repositories/analyze")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        url: "not-a-github-url",
      });
    expect(response.status).toBe(400);
    console.log(response.body);
  });
  it("should handle GitHub server failure", async () => {
    const githubSpy = vi.spyOn(githubApi, "get").mockRejectedValue({
      response: {
        status: 500,
      },
    });
    const response = await request(app)
      .post("/api/repositories/analyze")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        url: "https://github.com/expressjs/express",
      });
    expect(response.status).toBe(503);
    githubSpy.mockRestore();
  });
});

describe("POST /api/posts/generate", () => {
  it("should generate a valid post", async () => {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const repository = await Repository.create({
      userId: decoded.sub,
      name: "test-repository",
      owner: "test-owner",
      description: "A repository for AI testing",
      stars: 10,
      topics: ["react", "node"],
      languages: {
        JavaScript: 5000,
        HTML: 1000,
      },
      readme: "This is a test README",
      files: ["package.json", "src/index.js"],
      url: "https://github.com/test-owner/test-repository",
    });
    const aiSpy = vi.spyOn(ai.models, "generateContent").mockResolvedValue({
      text: JSON.stringify({
        hook: "I built a project with React and Node.js",
        content: "This is my test project.",
        hashtags: ["#React", "#NodeJS"],
        cta: "What do you think?",
      }),
    });
    const response = await request(app)
      .post("/api/posts/generate")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        repositoryId: repository._id,
      });
    expect(response.status).toBe(201);
    expect(response.body.post).toBeDefined();
    expect(response.body.post.hook).toBe(
      "I built a project with React and Node.js",
    );
    aiSpy.mockRestore();
  });
  it("should respond with ai failiure", async () => {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const repository = await Repository.create({
      userId: decoded.sub,
      name: "ai-failure-test-repository",
      owner: "vitest-user",
      description: "A mock repository for testing AI failures",
      stars: 5,
      topics: ["testing", "vitest", "nodejs"],
      languages: {
        JavaScript: 3000,
        HTML: 500,
      },
      readme: "Mock README used for testing AI service failure handling.",
      files: ["package.json", "src/app.js"],
      url: "https://github.com/vitest-user/ai-failure-test-repository",
    });
    const aiSpy = vi.spyOn(ai.models, "generateContent").mockRejectedValue({
      response: {
        status: 500,
      },
    });
    const response = await request(app)
      .post("/api/posts/generate")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        repositoryId: repository._id,
      });
    expect(response.status).toBe(503);
    expect(response.body.message).toBe("AI service is temporarily unavailable");
    aiSpy.mockRestore();
  });
  it("shoud throw a timeout Error", async () => {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const repository = await Repository.create({
      userId: decoded.sub,
      name: "ai-timeout-test-repository",
      owner: "vitest-userTimeout",
      description: "A mock repository for testing AI timeouts",
      stars: 5,
      topics: ["testing", "vitest", "nodejs"],
      languages: {
        JavaScript: 3000,
        HTML: 500,
      },
      readme: "Mock README used for testing AI service timeout handling.",
      files: ["package.json", "src/app.js"],
      url: "https://github.com/vitest-user/ai-timeout-test-repository",
    });
    const aiSpy = vi.spyOn(ai.models, "generateContent").mockRejectedValue(
      Object.assign(new Error("The operation was aborted"), {
        name: "AbortError",
      }),
    );
    const response = await request(app).post("/api/posts/generate").set("Authorization", `Bearer ${accessToken}`).send({
      repositoryId: repository._id,
    });
    expect(response.status).toBe(504);
    expect(response.body.message).toBe("AI request timed out");
    aiSpy.mockRestore()
  });
  it("should return 500 when Gemini returns invalid JSON", async () => {
     const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    const repository = await Repository.create({
      userId: decoded.sub,
      name: "ai-invalidJson-test-repository",
      owner: "vitest-userinvalidJson",
      description: "A mock repository for testing AI invalidJsons",
      stars: 5,
      topics: ["testing", "vitest", "nodejs"],
      languages: {
        JavaScript: 3000,
        HTML: 500,
      },
      readme: "Mock README used for testing AI service invalidJson handling.",
      files: ["package.json", "src/app.js"],
      url: "https://github.com/vitest-user/ai-invalidJson-test-repository",
    });
    const aiSpy = vi.spyOn(ai.models,'generateContent').mockResolvedValue({
      text: "this is not valid JSON",
    })

    const response = await request(app).post('/api/posts/generate').set("Authorization", `Bearer ${accessToken}`).send({
      repositoryId: repository._id
    })
    expect(response.status).toBe(500);
expect(response.body.status).toBe("error");
  })
});
