/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { Construct } from "constructs";
import { Stack, StackProps, aws_ec2 as ec2 } from "aws-cdk-lib";

const loadbalancerInboundCIDR = "0.0.0.0/0";
const loadbalancerOutboundCIDR = "0.0.0.0/0";
const webserverOutboundCIDR = "0.0.0.0/0";

export class VpcStack extends Stack {
  readonly myVpc: ec2.IVpc;

  readonly webSecurityGroup: ec2.SecurityGroup;

  readonly lbSecurityGroup: ec2.SecurityGroup;

  readonly dbSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.myVpc = new ec2.Vpc(this, `${id}-vpc`, {
      maxAzs: 2,
      natGateways: 1,
      cidr: "10.0.0.0/16",
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: "Public"
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          name: "Application"
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          name: "Database"
        }
      ]
    });

    this.myVpc.addGatewayEndpoint(`${id}-s3-gateway`, {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED
        }
      ]
    });

    // Create Security Group for load balancer
    this.lbSecurityGroup = new ec2.SecurityGroup(this, "LbSecurityGroup", {
      vpc: this.myVpc,
      description: "Security Group for the Load Balancer",
      securityGroupName: "lb-security-group-name",
      allowAllOutbound: false
    });

    // Determine if HTTP or HTTPS port should be used for LB
    const lbHTTPSEnabled = true;
    const lbPort = lbHTTPSEnabled === true ? 443 : 80;

    // Allow Security Group outbound traffic for load balancer
    this.lbSecurityGroup.addEgressRule(
      ec2.Peer.ipv4(loadbalancerOutboundCIDR),
      ec2.Port.tcp(lbPort),
      `Allow outgoing traffic over port ${lbPort}`
    );

    // Allow Security Group inbound traffic for load balancer
    this.lbSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(loadbalancerInboundCIDR),
      ec2.Port.tcp(lbPort),
      `Allow incoming traffic over port ${lbPort}`
    );

    // Create Security Group for web instances
    this.webSecurityGroup = new ec2.SecurityGroup(this, "WebSecurityGroup", {
      vpc: this.myVpc,
      description: "Security Group for the Web instances",
      securityGroupName: "web-security-group",
      allowAllOutbound: false
    });

    // Allow Security Group outbound traffic over port 80 instances
    this.webSecurityGroup.addEgressRule(
      ec2.Peer.ipv4(webserverOutboundCIDR),
      ec2.Port.tcp(80),
      "Allow outgoing traffic over port 80"
    );

    // Allow Security Group inbound traffic over port 80 from the Load Balancer security group
    this.webSecurityGroup.connections.allowFrom(
      new ec2.Connections({
        securityGroups: [this.lbSecurityGroup]
      }),
      ec2.Port.tcp(80)
    );

    // Create Security Group for Database (+ replica)
    this.dbSecurityGroup = new ec2.SecurityGroup(this, "DbSecurityGroup", {
      vpc: this.myVpc,
      description: "Security Group for the RDS instance",
      securityGroupName: "db-security-group",
      allowAllOutbound: false
    });

    // Allow inbound traffic on port 3306 from the web instances
    this.dbSecurityGroup.connections.allowFrom(
      new ec2.Connections({
        securityGroups: [this.webSecurityGroup]
      }),
      ec2.Port.tcp(3306)
    );
  }
}
