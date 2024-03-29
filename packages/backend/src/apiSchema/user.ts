export const userUpdateSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        user_name: { type: 'string' },
      },
      required: ['user_name'],
    },
  },
} as const;

export const userDeleteSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        password: { type: 'string' },
      },
      required: ['password'],
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
