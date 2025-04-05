import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import assert from 'assert';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

interface InfraStackProps extends cdk.StackProps {
  appName: string
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: InfraStackProps) {
    super(scope, id, props);

    assert(props?.appName, '');

    const {
      appName,
    } = props;

    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcName: 'vpc',
      region: this.region,
      ownerAccountId: this.account,
    });

    const subnetGroup = new rds.SubnetGroup(this, 'SubnetGroup', {
      vpc,
      subnetGroupName: `${appName}-subnet-group`,
      description: 'for Mastra PgVector',
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    const parameterGroup = new rds.ParameterGroup(this, 'ParameterGroup', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_16_6,
      })
    });

    new rds.DatabaseCluster(this, 'Cluster', {
      clusterIdentifier: `${appName}-vector-store`,
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_16_6 }),
      credentials: rds.Credentials.fromGeneratedSecret('root'),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      writer: rds.ClusterInstance.serverlessV2('writer'),
      serverlessV2MinCapacity: 0,
      serverlessV2MaxCapacity: 1,
      subnetGroup,
      vpc,
      parameterGroup,
    });
  }
}
