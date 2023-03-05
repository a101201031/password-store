/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import handlers from 'src/handlers';
import { config } from 'dotenv';

config();

const serverlessConfiguration: AWS = {
  service: 'password-store-server',
  frameworkVersion: '3',
  plugins: [
    'serverless-offline',
    'serverless-esbuild',
    'serverless-dotenv-plugin',
    'serverless-domain-manager',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'ap-northeast-2',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      RDS_INSTANCE_ENDPOINT: {
        'Fn::GetAtt': ['DBConnection', 'Endpoint.Address'],
      },
    },
  },
  functions: handlers,
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      httpPort: 8000,
      host: '0.0.0.0',
    },
    customDomain: {
      domainName: process.env.SERVER_DOMAIN_NAME,
      certificateName: process.env.SERVER_CRTIFICATE_NAME,
      createRoute53Record: true,
      createRoute53IPv6Record: true,
      endpointType: 'regional',
      securityPolicy: 'tls_1_2',
      apiType: 'rest',
      autoDomain: true,
    },
  },
  resources: {
    Resources: {
      VPC: {
        Type: 'AWS::EC2::VPC',
        Properties: {
          CidrBlock: '172.64.0.0/16',
          EnableDnsSupport: 'true',
          EnableDnsHostnames: 'true',
          Tags: [
            { Key: 'stack', Value: 'production' },
            { Key: 'Name', Value: 'password-store-vpc' },
          ],
        },
      },
      PublicSubnetA: {
        Type: 'AWS::EC2::Subnet',
        Properties: {
          VpcId: { Ref: 'VPC' },
          CidrBlock: '172.64.0.0/18',
          AvailabilityZone: {
            'Fn::Select': [
              0,
              {
                'Fn::GetAZs': '',
              },
            ],
          },
          Tags: [
            { Key: 'stack', Value: 'production' },
            { Key: 'Name', Value: 'password-store-public-a' },
          ],
        },
      },
      PublicSubnetB: {
        Type: 'AWS::EC2::Subnet',
        Properties: {
          VpcId: { Ref: 'VPC' },
          CidrBlock: '172.64.64.0/18',
          AvailabilityZone: {
            'Fn::Select': [
              1,
              {
                'Fn::GetAZs': '',
              },
            ],
          },
          Tags: [
            { Key: 'stack', Value: 'production' },
            { Key: 'Name', Value: 'password-store-public-b' },
          ],
        },
      },
      PrivateSubnetA: {
        Type: 'AWS::EC2::Subnet',
        Properties: {
          VpcId: { Ref: 'VPC' },
          CidrBlock: '172.64.128.0/18',
          AvailabilityZone: {
            'Fn::Select': [
              0,
              {
                'Fn::GetAZs': '',
              },
            ],
          },
          Tags: [
            { Key: 'stack', Value: 'production' },
            { Key: 'Name', Value: 'password-store-private-a' },
          ],
        },
      },
      PrivateSubnetB: {
        Type: 'AWS::EC2::Subnet',
        Properties: {
          VpcId: { Ref: 'VPC' },
          CidrBlock: '172.64.192.0/18',
          AvailabilityZone: {
            'Fn::Select': [
              1,
              {
                'Fn::GetAZs': '',
              },
            ],
          },
          Tags: [
            { Key: 'stack', Value: 'production' },
            { Key: 'Name', Value: 'password-store-private-b' },
          ],
        },
      },
      InternetGateway: {
        Type: 'AWS::EC2::InternetGateway',
        Properties: {
          Tags: [
            { Key: 'stack', Value: 'production' },
            { Key: 'Name', Value: 'password-store-igw' },
          ],
        },
      },
      InternetGatewayAttachment: {
        Type: 'AWS::EC2::VPCGatewayAttachment',
        Properties: {
          InternetGatewayId: { Ref: 'InternetGateway' },
          VpcId: { Ref: 'VPC' },
        },
      },
      PublicRouteTable: {
        Type: 'AWS::EC2::RouteTable',
        Properties: {
          VpcId: { Ref: 'VPC' },
          Tags: [
            { Key: 'stack', Value: 'production' },
            { Key: 'Name', Value: 'password-store-public-rtb' },
          ],
        },
      },
      PrivateRouteTableA: {
        Type: 'AWS::EC2::RouteTable',
        Properties: {
          VpcId: { Ref: 'VPC' },
          Tags: [
            { Key: 'stack', Value: 'production' },
            { Key: 'Name', Value: 'password-store-private-rtb-a' },
          ],
        },
      },
      PrivateRouteTableB: {
        Type: 'AWS::EC2::RouteTable',
        Properties: {
          VpcId: { Ref: 'VPC' },
          Tags: [
            { Key: 'stack', Value: 'production' },
            { Key: 'Name', Value: 'password-store-private-rtb-b' },
          ],
        },
      },
      PublicRoute: {
        Type: 'AWS::EC2::Route',
        Properties: {
          RouteTableId: { Ref: 'PublicRouteTable' },
          DestinationCidrBlock: '0.0.0.0/0',
          GatewayId: { Ref: 'InternetGateway' },
        },
      },
      PublicAssociationA: {
        Type: 'AWS::EC2::SubnetRouteTableAssociation',
        Properties: {
          SubnetId: { Ref: 'PublicSubnetA' },
          RouteTableId: { Ref: 'PublicRouteTable' },
        },
      },
      PublicAssociationB: {
        Type: 'AWS::EC2::SubnetRouteTableAssociation',
        Properties: {
          SubnetId: { Ref: 'PublicSubnetB' },
          RouteTableId: { Ref: 'PublicRouteTable' },
        },
      },
      PrivateAssociationA: {
        Type: 'AWS::EC2::SubnetRouteTableAssociation',
        Properties: {
          SubnetId: { Ref: 'PrivateSubnetA' },
          RouteTableId: { Ref: 'PrivateRouteTableA' },
        },
      },
      PrivateAssociationB: {
        Type: 'AWS::EC2::SubnetRouteTableAssociation',
        Properties: {
          SubnetId: { Ref: 'PrivateSubnetB' },
          RouteTableId: { Ref: 'PrivateRouteTableB' },
        },
      },
      SecurityGroup: {
        Type: 'AWS::EC2::SecurityGroup',
        Properties: {
          GroupDescription: 'allow tcp to production db',
          VpcId: { Ref: 'VPC' },
          SecurityGroupIngress: [
            {
              IpProtocol: 'tcp',
              FromPort: 3306,
              ToPort: 3306,
              CidrIp: '0.0.0.0/0',
            },
          ],
          SecurityGroupEgress: [
            {
              IpProtocol: '-1',
              CidrIp: '0.0.0.0/0',
            },
          ],
        },
      },
      DBSubnetGroup: {
        Type: 'AWS::RDS::DBSubnetGroup',
        Properties: {
          DBSubnetGroupName: 'password-store-prod',
          DBSubnetGroupDescription: 'password-store-production-subnet-group',
          SubnetIds: [{ Ref: 'PublicSubnetA' }, { Ref: 'PublicSubnetB' }],
        },
      },
      DBConnection: {
        Type: 'AWS::RDS::DBInstance',
        DeletionPolicy: 'Retain',
        Properties: {
          DBInstanceIdentifier: 'passsword-store-prod',
          AllocatedStorage: '20',
          DBInstanceClass: 'db.t4g.micro',
          Engine: 'MySQL',
          MasterUsername: process.env.MYSQL_USERNAME,
          MasterUserPassword: process.env.MYSQL_PASSWORD,
          DBName: process.env.MYSQL_DATABASE,
          DBSubnetGroupName: { Ref: 'DBSubnetGroup' },
          VPCSecurityGroups: [{ 'Fn::GetAtt': ['SecurityGroup', 'GroupId'] }],
        },
      },
    },
  },
  outputs: {
    RDSInstanceEndpoint: {
      value: { 'Fn::GetAtt': ['DBConnection', 'Endpoint.Address'] },
    },
  },
};

module.exports = serverlessConfiguration;
