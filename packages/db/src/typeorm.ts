import { createConnection } from "typeorm";
export { getConnection, Connection } from "typeorm";

type Props = { url: string } & { [key: string]: any };

export const setupConnection = async (props: Props) => {
  return await createConnection({
    type: "postgres",
    ...props
  });
};
