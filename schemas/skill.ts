import * as Yup from 'yup';

export const CreateSkillSchema = Yup.object().shape({
  code: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  category: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
  website_url: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
});

export const EditSkillSchema = Yup.object().shape({
  code: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  category: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
  is_active: Yup.boolean()
    .nullable(),
});
