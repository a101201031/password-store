import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { FromSchema } from 'json-schema-to-ts';

interface ValidatedAPIGatewayProxyEvent<T>
  extends Omit<APIGatewayProxyEvent, 'body'> {
  body: { decodedIdToken: DecodedIdToken } & FromSchema<T>;
}

export interface ValidatedEventAPIGatewayProxyEvent<T>
  extends Handler<ValidatedAPIGatewayProxyEvent<T>, APIGatewayProxyResult> {}

export interface AutorizedAPIGatewayProxyEvent
  extends Omit<APIGatewayProxyEvent, 'body'> {
  body: { decodedIdToken: DecodedIdToken; [key: string]: any };
}

export const formatJSONResponse = (response: Record<string, unknown>) => ({
  statusCode: 200,
  body: JSON.stringify(response),
});
