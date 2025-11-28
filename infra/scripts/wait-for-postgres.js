const { exec } = require("node:child_process");

function checkPostgresConnections() {
  exec("docker exec postgres-dev pg_isready", handleReturn);
}

function handleReturn(error, stdout) {
  if (stdout.search("accepting connections") === -1) {
    process.stdout.write(".");
    checkPostgresConnections();
    return;
  }
  process.stdout.write("✅ Postgres is accepting connections");
}

process.stdout.write("\n🚦 Waiting Postgres  connections\n");
checkPostgresConnections();
