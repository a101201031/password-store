export const accountCreateSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        gid: { type: 'string' },
        serviceName: { type: 'string' },
        authentication: { type: 'string' },
        serviceAccount: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['gid', 'serviceName', 'serviceAccount'],
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
