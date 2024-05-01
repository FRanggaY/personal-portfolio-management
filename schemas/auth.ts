import * as Yup from 'yup';

export const CreateLoginSchema = Yup.object().shape({
  username_or_email: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(1, 'Too Short!')
    .max(512, 'Too Long!')
    .required('Required')
});

export const AuthProfileSchema = Yup.object().shape({
  username: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  no_handphone: Yup.string()
    .max(256, 'Too Long!')
    .nullable(),
  gender: Yup.string()
    .required('Required')
    .matches(/^(female|male)$/, 'Gender must be either "female" or "male"'),
});

export const AuthProfilePasswordSchema = Yup.object().shape({
  old_password: Yup.string()
    .min(1, 'Too Short!')
    .max(512, 'Too Long!')
    .required('Required'),
  new_password: Yup.string()
    .min(1, 'Too Short!')
    .max(512, 'Too Long!')
    .required('Required'),
  confirm_new_password: Yup.string()
    .min(1, 'Too Short!')
    .max(512, 'Too Long!')
    .required('Required'),
});
