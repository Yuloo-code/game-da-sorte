//  /api/v1/satus
import database from "../../../../infra/database.js";

async function status(request, response) {
  const result = await database.query("SELECT 1 + 1;");
  console.log(result.rows);
  response
    .status(200)
    .json({ affirmacao: "sou muito foda e em cima da média" });
}

export default status;
