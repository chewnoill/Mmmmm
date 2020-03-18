import { setupConnection, getConnection } from "./typeorm";
import { DATABASE_URL } from "./env";
import { User } from ".";
import { Collection } from "./entities/collection";

(async () => {
  await setupConnection({
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    url: DATABASE_URL,
    logging: true
  });
  const connection = getConnection();
  const userId = "7b90168c-e1d8-43b0-85e1-189e87872b42";
  const collectionId = "cdf2c5dc-bdb6-4f85-b57b-08cbab37301d";
  const result = await connection.manager
    .createQueryBuilder()
    .select("collection")
    .from(Collection, "collection")
    .where("collection.id = :collectionId", { collectionId })
    .andWhere("user.id = :userId", { userId })
    .leftJoin("collection.users", "user")
    .getOne();

  console.log(result);

  await connection.close();
})();
