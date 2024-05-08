import * as Yup from 'yup';

export const defaultFormSchool = {
  id: '',
  code: '',
  name: '',
  name_2nd: '',
  logo: '',
  image: '',
  is_active: false,
  website_url: '',
  address: '',
  description: '',
}

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
