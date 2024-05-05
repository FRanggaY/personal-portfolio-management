import * as Yup from 'yup';

export const CreateEducationSchema = Yup.object().shape({
  school_id: Yup.string()
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

export const EditEducationSchema = Yup.object().shape({
  school_id: Yup.string()
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
