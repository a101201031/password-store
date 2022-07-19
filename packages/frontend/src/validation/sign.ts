import * as Yup from 'yup';

export const signUpSchema = Yup.object({
  name: Yup.string().required(),
  email: Yup.string().required().email(),
  password: Yup.string()
    .required()
    .min(10)
    .max(32)
    .matches(/(?=.*[0-9])/, 'At least one digit.')
    .matches(/(?=.*[a-z])/, 'At least one lowercase character.')
    .matches(/(?=.*[A-Z])/, 'At least one uppercase character.')
    .matches(/(?=.*?[#?!@ $%^&*-])/, 'At least one special character'),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password')]),
  infoAgreement: Yup.boolean().required().oneOf([true]),
}).required();
