import type { AWS } from '@serverless/typescript';
import handlers from 'src/handlers';

const serverlessConfiguration: AWS = {
  service: 'password-store-backend',
  frameworkVersion: '3',
  plugins: [
    'serverless-offline',
    'serverless-esbuild',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'ap-northeast-2',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
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
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    ['serverless-offline']: {
      httpPort: 8000,
      host: '0.0.0.0',
    },
  },
};

module.exports = serverlessConfiguration;
