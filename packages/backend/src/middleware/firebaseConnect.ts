import type middy from '@middy/core';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { cert, getApps, initializeApp } from 'firebase-admin/app';

export const firebaseConnect = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult
  > = () => {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert(JSON.parse(process.env.GOOGLE_CREDENTIALS)),
      });
    }
  };
  return { before };
};
