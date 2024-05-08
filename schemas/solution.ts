import * as Yup from 'yup';

export const defaultFormSolution = {
  id: '',
  title: '',
  title_2nd: '',
  logo: '',
  image: '',
  is_active: false,
  description: '',
}

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
  title_2nd: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
  is_active: Yup.boolean()
    .nullable(),
});
