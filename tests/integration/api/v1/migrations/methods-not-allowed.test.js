import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});
describe("Method Not Allowed to api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("Making a DELETE request", async () => {
      const responseDelete = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "DELETE",
        },
      );

      expect(responseDelete.status).toBe(405);
    });
    test("Making a PUT request", async () => {
      const responsePut = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "PUT",
        },
      );

      expect(responsePut.status).toBe(405);
    });
  });
});
