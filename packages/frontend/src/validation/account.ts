import * as Yup from 'yup';

export const accountPasswordSchema = Yup.string()
  .min(10)
  .max(32)
  .matches(/(?=.*[0-9])/, 'At least one digit.')
  .matches(/(?=.*[a-z])/, 'At least one lowercase character.')
  .matches(/(?=.*[A-Z])/, 'At least one uppercase character.')
  .matches(/(?=.*?[#?!@ $%^&*-])/, 'At least one special character');

export const accountAddFormSchema = Yup.object({
  service_name: Yup.string().required(),
  service_account: Yup.string().required(),
  password: Yup.string().when('authentication', {
    is: (authentication: string) => authentication === 'standalone',
    then: Yup.string().required(),
  }),
  gid: Yup.string().required(),
  authentication: Yup.string().required(),
});
