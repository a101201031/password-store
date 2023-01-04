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

export const userPasswordUpdateSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
        confirmPassword: { type: 'string' },
      },
      required: ['currentPassword', 'newPassword', 'confirmPassword'],
    },
  },
} as const;
