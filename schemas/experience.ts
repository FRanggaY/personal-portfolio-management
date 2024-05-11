import * as Yup from 'yup';

export const defaultFormExperience = {
  id: '',
  company_id: '',
  company: {
    id: '',
    name: '',
  },
  title: '',
  title_2nd: '',
  started_at: '',
  finished_at: '',
  is_active: false,
  employee_type: '',
  location: '',
  location_type: '',
  description: '',
}

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
    .nullable(''),
});

export const EditExperienceSchema = Yup.object().shape({
  company_id: Yup.string()
    .required('Required'),
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  title_2nd: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  employee_type: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  location: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  location_type: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  started_at: Yup.string()
    .required('Required'),
  finished_at: Yup.string()
    .nullable(''),
  is_active: Yup.boolean()
    .nullable(),
  description: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
});
