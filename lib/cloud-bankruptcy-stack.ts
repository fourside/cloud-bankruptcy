import { Stack, Construct, StackProps } from "@aws-cdk/core";
import { createS3Bucket } from "./s3";
import { createCloudTrail } from "./cloudtrail";
import { createConfig } from "./config";
import { createSnsTopic, createSubscription } from "./sns";
import { createGuardDuty } from "./guardduty";
import { createAccessAnalyzer } from "./access-analyzer";
import { createSecurityHub } from "./security-hub";

export class CloudBankruptcyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const myIpAddress = process.env.MY_IP;
    if (!myIpAddress) {
      throw new Error("set your ip address to env `MY_IP`");
    }

    const cloudtrailLogBucket = createS3Bucket(this, "fourside-cloudtrail-log");
    createCloudTrail(this, "cloud-bankruptcy", cloudtrailLogBucket);

    const awsConfigBucket = createS3Bucket(this, "fourside-config-log");
    createConfig(this, "cloud-bankruptcy", awsConfigBucket);

    const snsTopic = createSnsTopic(this, "cloud-bankruptcy-topic");
    createSubscription(this, "cloud-bankruptcy-subscription", snsTopic, "fourside@gmail.com");

    createGuardDuty(this, "cloud-bankruptcy-guardduty", snsTopic);
    createAccessAnalyzer(this, "cloud-bankruptcy", snsTopic);
    createSecurityHub(this, "cloud-bankruptcy");
  }
}
