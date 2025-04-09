#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcrStack } from '../lib/ecr-stack';
import { AlbStack } from '../lib/alb-stack';
import { EcsStack } from '../lib/ecs-stack';
import { RdsStack } from '../lib/rds-stack';
import { NetworkStack } from '../lib/network-stack';

const app = new cdk.App();
const region = app.node.tryGetContext('region') ?? (process.env.AWS_REGION ?? 'us-west-2');
const account = app.node.tryGetContext('account');

const ecr = new EcrStack(app, 'mastra-rag-example-ecr-stack', {
  env: {
    region,
    account,
  },
});

const network = new NetworkStack(app, 'mastra-rag-example-netrowk-stack', {
  env: {
    region,
    account,
  },
});
network.addDependency(ecr);

const alb = new AlbStack(app, 'mastra-rag-example-alb-stack', {
  env: {
    region,
    account,
  },
  vpc: network.vpc,
  lbSg: network.lbSg,
  ecsSg: network.ecsSg,
  ecsApplicationPort: network.ecsApplicationPort,
});
alb.addDependency(network);

const rds = new RdsStack(app, 'mastra-rag-example-rds-stack', {
  env: {
    region,
    account,
  },
  vpc: network.vpc,
  dbSg: network.dbSg,
});
rds.addDependency(network);

const ecs = new EcsStack(app, 'mastra-rag-example-ecs-stack', {
  env: {
    region,
    account,
  },
  vpc: network.vpc,
  targetGroup: alb.targetGroup,
  dnsName: alb.dnsName,
  ecsSg: network.ecsSg,
  ecsApplicationPort: network.ecsApplicationPort,
  ecsHealthCheckConfig: network.ecsHealthCheckConfig,
  ecr: ecr.ecr,
  secret: rds.secret,

});
ecs.addDependency(rds);

const stacks = [ecr, network, alb, ecs, rds];
stacks.forEach((stack) => {
  cdk.Tags.of(stack).add('SubSystem', 'mastra-rag-example');
  cdk.RemovalPolicies.of(stack).destroy();
});
