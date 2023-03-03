import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { query } from '@util/mysql';
import type { APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

const helloFunction = async (): Promise<APIGatewayProxyResult> => {
  await query({
    sql: `
    SELECT
      *
    FROM user
    `,
  });

  await axios.get('http://worldtimeapi.org/api/timezone/Asia/Seoul');

  return formatJSONResponse({
    message: 'success',
    result: {
      message: 'hello!',
    },
  });
};

export const hello = middyfy({ handler: helloFunction });
