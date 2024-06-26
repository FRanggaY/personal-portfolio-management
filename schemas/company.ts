import * as Yup from 'yup';

export const defaultFormCompany = {
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

export const CreateCompanySchema = Yup.object().shape({
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

export const EditCompanySchema = Yup.object().shape({
  code: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  name: Yup.string()
    .min(1, 'Too Short!')
    .max(36, 'Too Long!')
    .required('Required'),
  name_2nd: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
  address: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
  is_active: Yup.boolean()
    .nullable(),
});
