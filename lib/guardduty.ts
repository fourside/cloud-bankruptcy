import { Construct } from "@aws-cdk/core";
import { CfnDetector } from "@aws-cdk/aws-guardduty";
import { Topic } from "@aws-cdk/aws-sns";
import { Rule } from "@aws-cdk/aws-events";
import { SnsTopic } from "@aws-cdk/aws-events-targets";

export function createGuardDuty(scope: Construct, name: string, topic: Topic): void {
  new CfnDetector(scope, `${name}-guardduty-detector`, {
    enable: true,
    findingPublishingFrequency: "SIX_HOURS",
  });

  const guardDutyRule = new Rule(scope, `${name}-guardduty-event-rule`, {
    eventPattern: {
      source: ["aws.guardduty"],
      detailType: ["GuardDuty Finding"],
    },
  });

  const snsTopicTarget = new SnsTopic(topic);
  guardDutyRule.addTarget(snsTopicTarget);
}