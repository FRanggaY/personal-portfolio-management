import * as Yup from 'yup';

export const CreateSolutionSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
});

export const EditSolutionSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  is_active: Yup.boolean()
    .nullable(),
});
