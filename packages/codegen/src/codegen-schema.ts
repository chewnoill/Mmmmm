import "reflect-metadata";
import { App } from "app";

export default App.forRoot({
  DATABASE_URL: "",
  AWS_USER: "",
  AWS_PASSWORD: "",
  AWS_S3_BUCKET: "",
  GOOGLE_AUTH_ID: "",
  GOOGLE_AUTH_SECRET: "",
  GOOGLE_AUTH_CALLBACK: ""
}).typeDefs;
