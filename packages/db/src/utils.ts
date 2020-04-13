import { find, propEq } from "ramda";

type ID = { id: string };

export const mapIds = <T extends ID>(ids: readonly string[]) => (
  data: Array<T>
): Array<T | undefined> =>
  ids.map<T | undefined>(id => find<T>(propEq("id", id))(data));
