import { User } from "db";

export interface Config {
  googleAuthId: string;
  googleAuthSecret: string;
  googleAuthCallback: string;
}

export interface Context {
  user?: User;
}
