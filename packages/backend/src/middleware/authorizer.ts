import type middy from '@middy/core';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { Unauthorized } from 'http-errors';
import type { DecodedIdToken } from 'firebase-admin/auth';

interface AuthorizerEventTypes extends Omit<APIGatewayProxyEvent, 'body'> {
  body: { decodedIdToken: DecodedIdToken; [key: string]: any };
}

export const authorizer = (): middy.MiddlewareObj<
  AuthorizerEventTypes,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<
    AuthorizerEventTypes,
    APIGatewayProxyResult
  > = async (request) => {
    const { headers, httpMethod, body } = request.event;
    if (httpMethod === 'OPTIONS') {
      return;
    }
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
      const decodedIdToken = await firebaseAdmin.auth().verifyIdToken(idToken);
      request.event.body = { ...body, decodedIdToken };
    } catch (e) {
      throw new Unauthorized('Invalid token');
    }
  };
  return { before };
};
