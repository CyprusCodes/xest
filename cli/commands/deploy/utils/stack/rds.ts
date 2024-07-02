/* eslint-disable import/no-extraneous-dependencies */
import { Construct } from "constructs";
import {
  Stack,
  StackProps,
  aws_ec2 as ec2,
  aws_secretsmanager,
  aws_ssm,
  aws_rds as rds
} from "aws-cdk-lib";
import { officeIpCode } from "./variables";

export interface RdsStackProps extends StackProps {
  myVpc: ec2.IVpc;
  dbSecurityGroup: ec2.ISecurityGroup;
}

const officeIp = officeIpCode;

export class RdsStack extends Stack {
  readonly myRdsInstance: rds.DatabaseInstance;

  readonly databaseCredentialsSecret: aws_secretsmanager.Secret;

  constructor(scope: Construct, id: string, props?: RdsStackProps) {
    super(scope, id, props);

    const databaseUsername = process.env.DB_USERNAME;

    this.databaseCredentialsSecret = new aws_secretsmanager.Secret(
      this,
      `${id}`,
      {
        secretName: `${id}-mysecret-db-credentials`,
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            username: databaseUsername
          }),
          excludePunctuation: true,
          includeSpace: false,
          generateStringKey: "password"
        }
      }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dbParams = new aws_ssm.StringParameter(this, `${id}-db-creds`, {
      parameterName: `${id}-db-connection-string`,
      stringValue: this.databaseCredentialsSecret.secretArn
    });

    this.myRdsInstance = new rds.DatabaseInstance(this, `${id}-db-instance`, {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3,
        ec2.InstanceSize.MICRO
      ),
      vpc: props?.myVpc as ec2.IVpc,
      securityGroups: [props?.dbSecurityGroup as ec2.ISecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC, // Specify the subnet type to public
      },
      allocatedStorage: 20,
      databaseName: "{{projectName}}_db",
      storageEncrypted: true,
      publiclyAccessible: true,
    });

    this.myRdsInstance.connections.allowFrom(
      ec2.Peer.ipv4(officeIp),
      ec2.Port.tcp(3306),
      "Allow inbound from office IP"
    );
  }
}
