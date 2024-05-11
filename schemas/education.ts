import * as Yup from 'yup';

export const defaultFormEducation = {
  id: '',
  school_id: '',
  school: {
    id: '',
    name: '',
  },
  title: '',
  title_2nd: '',
  started_at: '',
  finished_at: '',
  is_active: false,
  degree: '',
  field_of_study: '',
  description: '',
}

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
    .nullable(''),
});

export const EditEducationSchema = Yup.object().shape({
  school_id: Yup.string()
    .required('Required'),
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  title_2nd: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  started_at: Yup.string()
    .required('Required'),
  finished_at: Yup.string()
    .required('Required'),
  is_active: Yup.boolean()
    .nullable(),
  degree: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  field_of_study: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
});
