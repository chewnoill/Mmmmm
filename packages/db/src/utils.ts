import { find, propEq } from "ramda";

type ID = { id: string };

export const mapIds = <T extends ID>(ids: string[]) => (data: Array<T>): T[] =>
  ids.map(id => find(propEq("id", id))(data));
