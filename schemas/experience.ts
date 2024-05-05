import * as Yup from 'yup';

export const CreateExperienceSchema = Yup.object().shape({
  company_id: Yup.string()
    .required('Required'),
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  started_at: Yup.string()
    .required('Required'),
  finished_at: Yup.string()
    .required('Required'),
});

export const EditExperienceSchema = Yup.object().shape({
  company_id: Yup.string()
    .required('Required'),
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  started_at: Yup.string()
    .required('Required'),
  finished_at: Yup.string()
    .required('Required'),
  is_active: Yup.boolean()
    .nullable(),
});
