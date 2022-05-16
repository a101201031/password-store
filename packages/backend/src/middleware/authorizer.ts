import middy from '@middy/core';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { Unauthorized } from 'http-errors';
export const authorizer = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = async (request) => {
    const { headers } = request.event;
    const authHeader = 'Authorization';
    if (!(authHeader in headers)) {
      throw new Unauthorized('Not found token');
    }
    const tokenParts = headers.Authorization.split(' ');
    const idToken = tokenParts[1];
    if (tokenParts[0] !== 'Bearer' || !idToken) {
      throw new Unauthorized('Invalid token');
    }

    try {
      await firebaseAdmin.auth().verifyIdToken(idToken);
    } catch (e) {
      throw new Unauthorized('Invalid token');
    }
  };
  return { before };
};
