import { Collection } from "../entities/collection";
import { Thing } from "../entities/thing";
import { Injectable, ProviderScope } from "@graphql-modules/di";
import { getConnection, Connection as dbConnection } from "../typeorm";
import { SelectQueryBuilder } from "typeorm";

interface DecodedCursor {
  skip: number;
}

type Cursor = string;

interface Edge<T> {
  cursor: Cursor;
  edge: T;
}

interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface PageArgs {
  first: number;
  after: Cursor;
}
export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

const encodeCursor = (args: DecodedCursor) =>
  Buffer.from(JSON.stringify(args)).toString("base64");

const decodeCursor = (cursor: Cursor): DecodedCursor =>
  JSON.parse(Buffer.from(cursor, "base64").toString());

export const paginate = async <T>(
  query: SelectQueryBuilder<T>,
  args?: PageArgs | null
): Promise<Connection<T>> => {
  const take = args && args.first ? args.first : 100;
  const cursorData = args && args.after && decodeCursor(args.after);
  const skip = (cursorData && cursorData.skip) || 0;
  const edgeItems: T[] = await query
    .take(take + 1)
    .skip(skip)
    .getMany();

  const pageInfo = {
    hasPreviousPage: skip > 0,
    hasNextPage: edgeItems.length > take
  };

  return {
    edges: edgeItems.slice(0, take).map((item, i) => ({
      edge: item,
      cursor: encodeCursor({ skip: skip + i + 1 })
    })),
    pageInfo
  };
};

@Injectable({ scope: ProviderScope.Session })
export class PaginationProvider {
  connection: dbConnection;
  constructor() {
    this.connection = getConnection();
  }

  paginateCollectionThings(collectionId: string, args?: PageArgs) {
    const query = this.connection.manager
      .createQueryBuilder()
      .select("thing.id")
      .from(Thing, "thing")
      .where("collection.id = :id", { id: collectionId })
      .leftJoin("thing.collection", "collection");
    return paginate(query, args);
  }

  paginateUserCollections(userId: string, args?: PageArgs) {
    const query = this.connection.manager
      .createQueryBuilder()
      .select("collection.id")
      .from(Collection, "collection")
      .where("user.id = :id", { id: userId })
      .leftJoin("collection.users", "user");
    return paginate(query, args);
  }
}
