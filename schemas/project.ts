import * as Yup from 'yup';

export const CreateProjectSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
});

export const EditProjectSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  is_active: Yup.boolean()
    .nullable(),
});
