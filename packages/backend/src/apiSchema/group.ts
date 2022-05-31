export const groupSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        groupName: { type: 'string' },
      },
      required: ['groupName'],
    },
  },
} as const;
