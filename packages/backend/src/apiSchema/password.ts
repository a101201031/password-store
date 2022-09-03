export const passwordReadSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        aid: { type: 'string' },
      },
      required: ['aid'],
    },
  },
  required: ['pathParameters'],
} as const;
