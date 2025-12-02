const { spawn, execSync } = require("node:child_process");
const services = spawn("npm", ["run", "services"]);

process.on("SIGINT", stopServices);

function stopServices() {
  execSync("npm run services:stop");
  process.exit(0);
}
services.stdout.on("data", (data) => {
  console.log(data.toString());
});

services.stderr.on("data", (data) => {
  console.log(data.toString());
});
