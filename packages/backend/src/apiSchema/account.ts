export const accountSchema = {
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
