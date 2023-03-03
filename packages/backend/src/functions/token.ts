import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { APIGatewayProxyResult } from 'aws-lambda';

const validatorFunction = async (): Promise<APIGatewayProxyResult> =>
  formatJSONResponse({ message: 'success' });

export const validator = authMiddyfy({ handler: validatorFunction });
