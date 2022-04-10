import * as yup from 'yup';

export const signUpSchema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup
      .string()
      .required()
      .min(10)
      .max(32)
      .matches(/(?=.*[0-9])/, 'At least one digit.')
      .matches(/(?=.*[a-z])/, 'At least one lowercase character.')
      .matches(/(?=.*[A-Z])/, 'At least one uppercase character.')
      .matches(/(?=.*?[#?!@ $%^&*-])/, 'At least one special character'),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('password')]),
    infoAgreement: yup.boolean().required().oneOf([true]),
  })
  .required();
