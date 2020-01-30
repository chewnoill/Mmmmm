import { setupConnection } from "./typeorm";
import { DATABASE_URL } from "./env";

(async () => {
  const connection = await setupConnection({
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    url: DATABASE_URL
  });

  await connection.runMigrations({
    transaction: "all"
  });
  await connection.close();
})();
