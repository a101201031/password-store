import * as Yup from 'yup';

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required(''),
  newPassword: Yup.string()
    .required('')
    .min(10)
    .max(32)
    .matches(/(?=.*[0-9])/, 'At least one digit.')
    .matches(/(?=.*[a-z])/, 'At least one lowercase character.')
    .matches(/(?=.*[A-Z])/, 'At least one uppercase character.')
    .matches(/(?=.*?[#?!@ $%^&*-])/, 'At least one special character'),
  confirmPassword: Yup.string()
    .required('')
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match'),
}).required();

export const userNameSchema = Yup.string()
  .min(6, `Username must be between 6 to 20.`)
  .max(20, `Username must be between 6 to 20.`)
  .matches(
    /[a-zA-Z0-9._]/,
    `Only contains alphanumeric characters, underscore and dot.`,
  )
  .matches(
    /^(?![_.])[a-zA-Z0-9._]+(?<![_.])$/,
    `The start and the end can only be alphanumeric characters.`,
  )
  .matches(
    /^((?![_.]{2}).)*$/,
    `Underscore or dot can't be next to each other.`,
  );

export const changeUserNameSchema = Yup.object({
  userName: userNameSchema.required(),
});
