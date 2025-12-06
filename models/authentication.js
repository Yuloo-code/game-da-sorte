/* eslint-disable no-inner-declarations*/
import user from "models/user.js";
import password from "models/password.js";
import { NotFoundError, UnauthorizedError } from "infra/errors/index.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    async function findUserByEmail() {
      let storedUser;
      try {
        storedUser = await user.findOneByEmail(providedEmail);
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw new UnauthorizedError({
            message: "Email não confere",
            action: "Verfique se este dado esta correto.",
          });
        }
        throw error;
      }
      return storedUser;
    }

    async function validatePassword(providedPassword, storedPassword) {
      const correctPasswordMatch = await password.compare(
        providedPassword,
        storedPassword,
      );
      if (!correctPasswordMatch) {
        throw new UnauthorizedError({
          message: "Senha não confere",
          action: "Verfique se este dado esta correto.",
        });
      }
    }

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verfique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
