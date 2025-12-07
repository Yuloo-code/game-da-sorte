import crypto from "node:crypto";
import database from "infra/database.js";

const EXPIRATIO_IN_MILISECONDS = 60 * 60 * 24 * 30 * 1000; // 30 days

async function create(userId) {
  const token = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + EXPIRATIO_IN_MILISECONDS);

  const newSession = await runInsertQuery(token, userId, expiresAt);
  return newSession;

  async function runInsertQuery(token, userId, expiresAt) {
    const results = await database.query({
      text: `
            INSERT INTO
                sessions (token, user_id, expires_at)
            VALUES
                ($1, $2, $3)
            RETURNING
                *
        `,
      values: [token, userId, expiresAt],
    });
    return results.rows[0];
  }
}

async function findOneValidByToken(ProvidedSessionToken) {
  const sessionFound = await runInsertQuery(ProvidedSessionToken);
  return sessionFound;

  async function runInsertQuery(sessionToken) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          sessions
        WHERE
          token = $1
          AND expires_at > NOW()
        LIMIT
          1
      `,
      values: [sessionToken],
    });
    return results.rows[0];
  }
}

async function findOneById(id) {
  const userFound = await runSelectQuery(id);

  async function runSelectQuery(id) {
    const results = await database.query({
      text: `
        SELECT
            *
        FROM
            users
        WHERE
            id = $1
        LIMIT
            1
     ;`,
      values: [id],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O id informado não foi encontrado no sistema",
        action: "Verifique se o id está digitado corretamente.",
      });
    }
    return results.rows[0];
  }
  return userFound;
}

const session = {
  create,
  findOneValidByToken,
  findOneById,
  EXPIRATIO_IN_MILISECONDS,
};

export default session;
