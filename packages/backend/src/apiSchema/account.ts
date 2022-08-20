export const accountCreateSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        gid: { type: 'string' },
        service_name: { type: 'string' },
        authentication: { type: 'string' },
        service_account: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['gid', 'service_name', 'service_account'],
    },
  },
} as const;

export const accountUpdateSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        aid: { type: 'string' },
        gid: { type: 'string' },
        authentication: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['aid'],
    },
  },
} as const;

export const accountDeleteSchema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        aid: { type: 'string' },
      },
      required: ['aid'],
    },
  },
  required: ['queryStringParameters'],
} as const;
