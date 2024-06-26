/* eslint-disable import/no-extraneous-dependencies */
import { Construct } from "constructs";
import {
  Stack,
  StackProps,
  aws_s3_assets,
  aws_elasticbeanstalk,
  aws_iam,
  aws_rds,
  aws_ec2 as ec2
} from "aws-cdk-lib";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { envVars, solutionStackNameFile, sslArn } from "./variables";

export interface EBEnvProps extends StackProps {
  // Autoscaling group configuration
  minSize?: string;
  maxSize?: string;
  instanceTypes?: string;
  envName?: string;
  myRds: aws_rds.DatabaseInstance;
  dbUsername: string;
  dbPassword: string;
  webSecurityGroup: ec2.SecurityGroup;
  lbSecurityGroup: ec2.SecurityGroup;
  vpc: ec2.IVpc;
}

export class ElbStack extends Stack {
  constructor(scope: Construct, id: string, props?: EBEnvProps) {
    super(scope, id, props);

    const outputDirectory = "eb-bundle-output";

    // Step 1: Delete the directory if it exists
    if (fs.existsSync(outputDirectory)) {
      fs.rmdirSync(outputDirectory, { recursive: true });
    }

    // Step 2: Create a new directory named eb-bundle-output
    fs.mkdirSync(outputDirectory);

    // Step 3: Copy dist/, package.json, and node_modules/ into eb-bundle-output
    const itemsToCopy = ["index.js", "src", "package.json", "node_modules"];
    const commitHashOutputFilePath = path.resolve(
      __dirname,
      "..",
      outputDirectory,
      "COMMIT_HASH"
    );
    const latestCommitHash = execSync("git rev-parse HEAD")
      .toString()
      .trim();

    fs.writeFileSync(commitHashOutputFilePath, latestCommitHash);

    itemsToCopy.forEach(item => {
      const sourcePath = path.resolve(__dirname, "..", item);
      const destinationPath = path.resolve(
        __dirname,
        "..",
        outputDirectory,
        item
      );
      if (fs.existsSync(sourcePath)) {
        if (fs.lstatSync(sourcePath).isDirectory()) {
          fs.mkdirSync(destinationPath);
          fs.cpSync(sourcePath, destinationPath, { recursive: true });
        } else {
          fs.copyFileSync(sourcePath, destinationPath);
        }
      }
    });

    // Step 3: Delete dist/test and dist/stack
    const directoriesToDelete = ["test", "stack"];
    directoriesToDelete.forEach(dir => {
      const dirPath = path.resolve(
        __dirname,
        "..",
        outputDirectory,
        "dist",
        dir
      );
      if (fs.existsSync(dirPath)) {
        fs.rmdirSync(dirPath, { recursive: true });
      }
    });

    // Construct an S3 asset Zip from directory up.
    const webAppZipArchive = new aws_s3_assets.Asset(this, `${id}-archive`, {
      path: `${__dirname}/../${outputDirectory}`
    });

    // Create a ElasticBeanStalk app.
    const appName = `${id}`;
    const app = new aws_elasticbeanstalk.CfnApplication(
      this,
      `${id}-application`,
      {
        applicationName: appName
      }
    );

    // Create an app version from the S3 asset defined earlier
    const appVersionProps = new aws_elasticbeanstalk.CfnApplicationVersion(
      this,
      `${id}-app-version`,
      {
        applicationName: appName,
        sourceBundle: {
          s3Bucket: webAppZipArchive.s3BucketName,
          s3Key: webAppZipArchive.s3ObjectKey
        }
      }
    );

    // Make sure that Elastic Beanstalk app exists before creating an app version
    appVersionProps.addDependency(app);

    // Create role and instance profile
    const myRole = new aws_iam.Role(
      this,
      `${appName}-aws-elasticbeanstalk-ec2-role`,
      {
        assumedBy: new aws_iam.ServicePrincipal("ec2.amazonaws.com")
      }
    );

    const managedPolicy1 = aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
      "AWSElasticBeanstalkWebTier"
    );

    // allows SSH access via AWS Console: AWS Systems Manager > Session Manager
    const managedPolicy2 = aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
      "AmazonSSMManagedInstanceCore"
    );
    myRole.addManagedPolicy(managedPolicy1);
    myRole.addManagedPolicy(managedPolicy2);

    // allows elasticbeanstalk to send logs to CloudWatch
    const inlinePolicy = new aws_iam.PolicyStatement({
      effect: aws_iam.Effect.ALLOW,
      actions: [
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ],
      resources: ["*"]
    });
    myRole.addToPolicy(inlinePolicy);

    const myProfileName = `${appName}-InstanceProfile`;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const instanceProfile = new aws_iam.CfnInstanceProfile(
      this,
      myProfileName,
      {
        instanceProfileName: myProfileName,
        roles: [myRole.roleName]
      }
    );

    // env Var was here

    // Get the public and private subnets to deploy Elastic Beanstalk ALB and web servers in.
    const publicSubnets = props?.vpc.selectSubnets({
      subnetType: ec2.SubnetType.PUBLIC
    }).subnets;
    const privateWebSubnets = props?.vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
    }).subnets;

    // A helper function to create a comma separated string from subnets ids
    const createCommaSeparatedList = function(subnets: ec2.ISubnet[]): string {
      return subnets.map((subnet: ec2.ISubnet) => subnet.subnetId).toString();
    };

    const webserverSubnets = createCommaSeparatedList(privateWebSubnets || []);
    const lbSubnets = createCommaSeparatedList(publicSubnets || []);

    // Example of some options which can be configured
    // https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
    // another good example here
    // // https://github.com/aws-samples/aws-elastic-beanstalk-hardened-security-cdk-sample/blob/main/lib/elastic_beanstalk_cdk_project-stack.ts
    const optionSettingProperties: aws_elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] =
      [
        {
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "SecurityGroups",
          value: props?.webSecurityGroup.securityGroupId,
        },
        {
          namespace: "aws:ec2:vpc",
          optionName: "VPCId",
          value: props?.vpc.vpcId,
        },
        {
          namespace: "aws:ec2:vpc",
          optionName: "Subnets",
          value: webserverSubnets,
        },
        {
          namespace: "aws:ec2:vpc",
          optionName: "ELBSubnets",
          value: lbSubnets,
        },
        {
          namespace: "aws:elbv2:loadbalancer",
          optionName: "SecurityGroups",
          value: props?.lbSecurityGroup.securityGroupId,
        },
        {
          namespace: "aws:autoscaling:launchconfiguration",
          optionName: "IamInstanceProfile",
          value: myProfileName,
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MinSize",
          value: props?.minSize ?? "1",
        },
        {
          namespace: "aws:autoscaling:asg",
          optionName: "MaxSize",
          value: props?.maxSize ?? "3",
        },
        {
          namespace: "aws:ec2:instances",
          optionName: "InstanceTypes",
          value: props?.instanceTypes ?? "t2.small",
        },
        // https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/AWSHowTo.cloudwatchlogs.html
        {
          namespace: "aws:elasticbeanstalk:cloudwatch:logs",
          optionName: "StreamLogs",
          value: "true",
        },
        {
          namespace: "aws:elasticbeanstalk:environment",
          optionName: "LoadBalancerType",
          value: "application",
        },
        {
          namespace: "aws:elbv2:listener:default",
          optionName: "ListenerEnabled",
          value: "false",
        },
        {
          namespace: "aws:elbv2:listener:443",
          optionName: "ListenerEnabled",
          value: "true",
        },
        {
          namespace: "aws:elbv2:listener:443",
          optionName: "SSLCertificateArns",
          value: sslArn,
        },
        {
          namespace: "aws:elbv2:listener:443",
          optionName: "Protocol",
          value: "HTTPS",
        },
        {
          namespace: "aws:elasticbeanstalk:environment:process:default",
          optionName: "Port",
          value: "80",
        },
        {
          namespace: "aws:elasticbeanstalk:environment:process:default",
          optionName: "HealthCheckPath",
          value: "/healthcheck",
        },
        {
          namespace: "aws:elasticbeanstalk:environment:process:default",
          optionName: "HealthCheckInterval",
          value: "60",
        },
        ...envVars.map(([namespace, optionName, value]) => ({
          namespace,
          optionName,
          value,
        })),
      ];

    // Create an Elastic Beanstalk environment to run the application
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const elbEnv = new aws_elasticbeanstalk.CfnEnvironment(
      this,
      "Environment",
      {
        environmentName: props?.envName ?? `${id}-eb-env`,
        applicationName: app.applicationName || appName,
        // solution stack https://docs.aws.amazon.com/elasticbeanstalk/latest/platforms/platform-history-nodejs.html
        solutionStackName: solutionStackNameFile,
        optionSettings: optionSettingProperties,
        versionLabel: appVersionProps.ref,
      }
    );
  }
}
