import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST to api/v1/users", () => {
  describe("Anonymous user", () => {
    test("with unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Donerms",
          email: "donerms@dev.com",
          password: "abc123",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "Donerms",
        email: "donerms@dev.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("donerms");

      const correctPasswordMatch = await password.compare(
        "abc123",
        userInDatabase.password,
      );
      const incorrectPasswordMatch = await password.compare(
        "senhaErrada",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });

  test("with duplicated 'email'", async () => {
    const response1 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "emailduplicao1",
        email: "duplicado@dev.com",
        password: "abc123",
      }),
    });

    expect(response1.status).toBe(201);

    const response2 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "emailduplicado2",
        email: "Duplicado@dev.com",
        password: "abc123",
      }),
    });

    expect(response2.status).toBe(400);

    const response2Body = await response2.json();
    expect(response2Body).toEqual({
      name: "ValidationError",
      message: "O email informado já está sendo utilizado.",
      action: "Utilize outro email para realizar esta operação.",
      status_code: 400,
    });
  });

  test("with duplicated 'username'", async () => {
    const response1 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "usernameduplicado",
        email: "email1@dev.com",
        password: "abc123",
      }),
    });

    expect(response1.status).toBe(201);

    const response2 = await fetch("http://localhost:3000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "usernameduplicado",
        email: "email2@dev.com",
        password: "abc123",
      }),
    });

    expect(response2.status).toBe(400);

    const response2Body = await response2.json();
    expect(response2Body).toEqual({
      name: "ValidationError",
      message: "O username informado já está sendo utilizado.",
      action: "Utilize outro username para realizar esta operação.",
      status_code: 400,
    });
  });
});
