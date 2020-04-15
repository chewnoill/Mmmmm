import { Config } from "./types";
import { google } from "googleapis";

let global_config: Config | undefined;

export const setupGoogleClient = (config: Config) => {
  global_config = config;
};

export const getGoogleClient = () => {
  if (!global_config) throw Error("google not configured");
  return new google.auth.OAuth2(
    global_config.googleAuthId,
    global_config.googleAuthSecret,
    global_config.googleAuthCallback
  );
};
