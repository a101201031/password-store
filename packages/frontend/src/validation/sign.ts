import * as yup from 'yup';
import { SignInInputTypes } from 'model';

export const signUpSchema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    password: yup
      .string()
      .required()
      .min(10)
      .max(32)
      .matches(/(?=.*[0-9])/),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('password')]),
    infoAgreement: yup.boolean().required().oneOf([true]),
  })
  .required();
