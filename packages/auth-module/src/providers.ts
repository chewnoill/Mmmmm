import { Injectable, ProviderScope } from "@graphql-modules/di";
import { google } from "googleapis";
import { OAuth2Client } from "googleapis-common";
import { User, UserProvider } from "db";
import { getGoogleClient } from "./google";

@Injectable({ scope: ProviderScope.Session })
export class GoogleProvider {
  _client: OAuth2Client;

  constructor(private userProvider: UserProvider) {
    this._client = getGoogleClient();
  }

  getFromAuth(bearerAuth?: string) {
    if (!bearerAuth) return;

    const [, auth] = bearerAuth.split(" ");
    return this.userProvider.getUser(auth);
  }

  authorizeClient(user: User) {
    if (user.refresh_token) {
      this._client.setCredentials({ refresh_token: user.refresh_token });
    }
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
