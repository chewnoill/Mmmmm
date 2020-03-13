import { createConnection } from "typeorm";
export { getConnection, Connection } from "typeorm";
import { Collection } from "./entities/collection";
import { Thing } from "./entities/thing";
import { User } from "./entities/user";

type Props = { url: string } & { [key: string]: any };

let setup = false;

export const setupConnection = async (props: Props) => {
  if (setup) return;
  setup = true;
  return await createConnection({
    type: "postgres",
    entities: [Collection, Thing, User],
    ...props
  });
};
