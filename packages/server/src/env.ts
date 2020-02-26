import * as dotenv from "dotenv";

dotenv.config();

export const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL!;
export const SERVER_PORT = process.env.PORT!;
export const SERVER_BASE = process.env.SERVER_BASE!;
export const SERVER_GRAPHQL_ENDPOINT = process.env.SERVER_GRAPHQL_ENDPOINT!;
export const SERVER_BASE_URL = `${SERVER_BASE}:${SERVER_PORT}`;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const GOOGLE_AUTH_ID = process.env.GOOGLE_AUTH_ID!;
export const GOOGLE_AUTH_SECRET = process.env.GOOGLE_AUTH_SECRET!;
export const GOOGLE_AUTH_CALLBACK = process.env.GOOGLE_AUTH_CALLBACK!;
