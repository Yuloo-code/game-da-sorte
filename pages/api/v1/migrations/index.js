import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const allowedMethod = ["GET", "POST"];
  if (!allowedMethod.includes(request.method)) {
    return response.status(405).json({
      error: `method ${request.method} not allowed`,
    });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const defaultMigrations = {
      dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrations);

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrations,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await dbClient.end();
  }
}
