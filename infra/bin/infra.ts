#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();

const region = app.node.tryGetContext('region') ?? (process.env.AWS_REGION ?? 'us-west-2');
const account = app.node.tryGetContext('account');

const stack = new InfraStack(app, 'mastra-rag-example-infra', {
  env: {
    region,
    account,
  },
  appName: 'mastra-rag-example',
});

cdk.RemovalPolicies.of(stack).destroy();
