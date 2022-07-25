export const groupSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        gid: { type: 'string' },
      },
      required: ['gid'],
    },
  },
} as const;

export const groupCreateSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        group_name: { type: 'string' },
      },
      required: ['group_name'],
    },
  },
} as const;
