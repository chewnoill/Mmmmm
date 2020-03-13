import { setupConnection, getConnection } from "./typeorm";
import { DATABASE_URL } from "./env";

(async () => {
  await setupConnection({
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    url: DATABASE_URL
  });
  const connection = getConnection();

  await connection.runMigrations({
    transaction: "all"
  });
  await connection.close();
})();
