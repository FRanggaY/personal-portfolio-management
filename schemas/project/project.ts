import * as Yup from 'yup';

export const defaultFormProject = {
  id: '',
  title: '',
  title_2nd: '',
  slug: '',
  logo: '',
  image: '',
  is_active: false,
  description: '',
}

export const CreateProjectSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  slug: Yup.string()
    .min(1, 'Too Short!')
    .max(256, 'Too Long!')
    .required('Required'),
});

export const EditProjectSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  title_2nd: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  slug: Yup.string()
    .min(1, 'Too Short!')
    .max(256, 'Too Long!')
    .required('Required'),
  is_active: Yup.boolean()
    .nullable(),
  description: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
});
