#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { S3CdkStack, S3Params } from "../lib/s3-cdk-stack";

import * as fs from "fs";

const app = new cdk.App({});

// Read the params created by kaholo plugin
const configData = JSON.parse(fs.readFileSync("params.json").toString());

const params: S3Params = <S3Params>configData;

// Generate env vars for CDK
const env = {
  region: params.REGION,
};

// This is where we create the cdk stack
new S3CdkStack(
  app,
  `${params.BUCKET_NAME}-stack`,
  {
    env: env,
  },
  params
);
