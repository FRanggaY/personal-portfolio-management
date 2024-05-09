import * as Yup from 'yup';

export const defaultFormProjectAttachment = {
  id: '',
  project_id: '',
  title: '',
  description: '',
  website_url: '',
  category: '',
  is_active: false,
  image: '',
}

export const CreateProjectAttachmentSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  category: Yup.string()
    .min(1, 'Too Short!')
    .max(512, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
  website_url: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
});

export const EditProjectAttachmentSchema = Yup.object().shape({
  title: Yup.string()
    .min(1, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required'),
  category: Yup.string()
    .min(1, 'Too Short!')
    .max(512, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
  website_url: Yup.string()
    .max(512, 'Too Long!')
    .nullable(),
});
