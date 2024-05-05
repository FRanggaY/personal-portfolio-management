import * as Yup from 'yup';

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
