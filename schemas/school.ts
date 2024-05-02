import * as Yup from 'yup';

export const CreateSchoolSchema = Yup.object().shape({
  code: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  website_url: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
});

export const EditSchoolSchema = Yup.object().shape({
  code: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  is_active: Yup.boolean()
    .nullable(),
});
