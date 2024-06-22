import * as Yup from 'yup';

export const defaultFormSkillMapping = {
  id: '',
  skill_id: '',
  skill: {
    id: '',
    name: '',
  },
  is_active: false,
}

export const CreateSkillMappingSchema = Yup.object().shape({
  skill_id: Yup.string()
    .required('Required'),
});

export const EditSkillMappingSchema = Yup.object().shape({
  skill_id: Yup.string()
    .required('Required'),
  is_active: Yup.boolean()
    .nullable(),
});
