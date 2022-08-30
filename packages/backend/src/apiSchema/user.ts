export const userUpdateSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        user_name: { type: 'string' },
      },
      required: ['email'],
    },
  },
} as const;
