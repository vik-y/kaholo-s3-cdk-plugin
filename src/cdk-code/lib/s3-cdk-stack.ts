import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";
import { Duration, RemovalPolicy } from "@aws-cdk/core";

export interface S3Params {
  BUCKET_NAME: string;
  REGION: string;
  NEW_USER_NAME: string;
  PUBLIC: boolean;
  ACCESS_KEY_ID: string;
  ACCESS_KEY_SECRET: string;
  VERSIONED: boolean;
}

export class S3CdkStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props?: cdk.StackProps,
    kaholoParams?: S3Params
  ) {
    super(scope, id, props);

    if (kaholoParams) {
      const qualifier = `${kaholoParams.BUCKET_NAME}-kaholo`;

      const bucket = new s3.Bucket(this, `${qualifier}-bucket`, {
        bucketName: kaholoParams.BUCKET_NAME,
        publicReadAccess: kaholoParams.PUBLIC,
        versioned: kaholoParams.VERSIONED,
        autoDeleteObjects: true, // For testing
        removalPolicy: RemovalPolicy.DESTROY, // For testing so we do cdk destroy to delete everything
      });

      // Create a new user if requested in params
      if (kaholoParams.NEW_USER_NAME) {
        const user = new iam.User(this, `${qualifier}-user`, {
          userName: kaholoParams.NEW_USER_NAME,
        });
        bucket.grantReadWrite(user);
      }
    } else {
      throw new Error("kaholoParams not present!");
    }
  }
}
