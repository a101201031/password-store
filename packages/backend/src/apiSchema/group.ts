export const groupCreateSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        group_name: { type: 'string' },
        member: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['group_name'],
    },
  },
} as const;

export const groupUpdateSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        gid: { type: 'string' },
        group_name: { type: 'string' },
        member: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['gid'],
    },
  },
} as const;

export const groupDeleteSchema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        gid: { type: 'string' },
      },
      required: ['gid'],
    },
  },
  required: ['queryStringParameters'],
} as const;
