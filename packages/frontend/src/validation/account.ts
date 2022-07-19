import * as Yup from 'yup';

export const accountPasswordSchema = Yup.string()
  .min(10)
  .max(32)
  .matches(/(?=.*[0-9])/, 'At least one digit.')
  .matches(/(?=.*[a-z])/, 'At least one lowercase character.')
  .matches(/(?=.*[A-Z])/, 'At least one uppercase character.')
  .matches(/(?=.*?[#?!@ $%^&*-])/, 'At least one special character');
