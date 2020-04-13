import { Injectable, ProviderScope } from "@graphql-modules/di";
import { ModuleSessionInfo } from "@graphql-modules/core";
import { Config } from "./types";
import { S3, Config as AwsConfig } from "aws-sdk";

@Injectable({ scope: ProviderScope.Application })
export class AWSProvider {
  private bucketName: string;
  private s3: S3;
  onInit({
    config: { accessKeyId, secretAccessKey, bucketName }
  }: ModuleSessionInfo<Config>) {
    this.bucketName = bucketName;
    const config = new AwsConfig({ accessKeyId, secretAccessKey });
    this.s3 = new S3(config);
  }

  getPresignedGet(key: string) {
    return this.s3.getSignedUrl("getObject", {
      Bucket: this.bucketName,
      Expires: 60,
      Key: key
    });
  }

  getPresignedPost(key: string) {
    return this.s3.createPresignedPost({
      Bucket: this.bucketName,
      Expires: 60,
      Fields: { key },
      Conditions: [
        ["starts-with", "$Content-Type", ""],
        ["content-length-range", 0, 10485760],
        { success_action_status: "201" }
      ]
    });
  }
}
