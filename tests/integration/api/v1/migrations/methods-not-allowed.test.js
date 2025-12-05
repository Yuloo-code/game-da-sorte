import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});
describe("Method Not Allowed to api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Making a DELETE request", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "DELETE",
      });

      expect(response.status).toBe(405);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "methodNotAllowedError",
        message: "Método não permitido para este endpoint",
        action:
          "Verifique se o método HTTP enviado é válido para este endpoint",
        status_code: 405,
      });
    });
    test("Making a PUT request", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "PUT",
      });

      expect(response.status).toBe(405);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "methodNotAllowedError",
        message: "Método não permitido para este endpoint",
        action:
          "Verifique se o método HTTP enviado é válido para este endpoint",
        status_code: 405,
      });
    });
  });
});
