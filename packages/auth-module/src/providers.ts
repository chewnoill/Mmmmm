import { Injectable, ProviderScope } from "@graphql-modules/di";
import { ModuleSessionInfo } from "@graphql-modules/core";
import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";
import { Config, Context } from "./types";
import { User, UserProvider } from "db";

@Injectable({ scope: ProviderScope.Session })
export class GoogleProvider {
  _client: OAuth2Client;
  _user?: User;

  constructor(private userProvider: UserProvider) {}

  async onRequest(session: ModuleSessionInfo<Config, {}, Context>) {
    this._client = new google.auth.OAuth2(
      session.config.googleAuthId,
      session.config.googleAuthSecret,
      session.config.googleAuthCallback
    );
    this._user = session.context.user;
    if (this._user && this._user.refresh_token) {
      this._client.setCredentials({ refresh_token: this._user.refresh_token });
    }
  }

  getFromAuth(bearerAuth?: string) {
    if (!bearerAuth) return;

    const [, auth] = bearerAuth.split(" ");
    return this.userProvider.getUser(auth);
  }

  getUser() {
    return this._user;
  }

  getAuthURL() {
    return this._client.generateAuthUrl({
      access_type: "offline",
      scope: ["email"]
    });
  }

  async authorize(code: string) {
    const { tokens } = await this._client.getToken(code);

    this._client.setCredentials(tokens);

    const email = await this.getEmail();
    if (!email) {
      throw Error("Unauthorized");
    }

    const user = await this.userProvider.getUserByEmail(email);
    if (!user) {
      throw Error(`${email} Unauthorized`);
    }

    if (tokens.refresh_token) {
      await user.setRefreshToken(tokens.refresh_token);
    }

    return {
      authToken: user.id // generate auth header
    };
  }

  async getEmail() {
    const oauth = google.oauth2({ version: "v2", auth: this._client });
    const info = await oauth.userinfo.get({
      fields: "email"
    });
    return info.data.email;
  }
}
