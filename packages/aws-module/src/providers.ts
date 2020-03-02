import { Injectable, ProviderScope } from "@graphql-modules/di";
import { ModuleSessionInfo } from "@graphql-modules/core";
import { Config } from "./types";
import { S3, config } from "aws-sdk";
import { v4 as uuidV4 } from "uuid";

const s3 = new S3();

@Injectable({ scope: ProviderScope.Application })
export class AWSProvider {
  private bucketName: string;
  onInit({
    config: { accessKeyId, secretAccessKey, bucketName }
  }: ModuleSessionInfo<Config>) {
    this.bucketName = bucketName;
    config.update({ accessKeyId, secretAccessKey });
  }

  getPresignedPost(key: string) {
    return s3.createPresignedPost({
      Bucket: this.bucketName,
      Expires: 60,
      Fields: { key },
      Conditions: [
        ["starts-with", "$Content-Type", "image/"],
        ["content-length-range", 0, 10485760],
        { success_action_status: "201" }
      ]
    });
  }
}
