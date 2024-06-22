import * as Yup from 'yup';

export const defaultFormProjectSkill = {
  id: '',
  skill_id: '',
  skill: {
    id: '',
    name: '',
  },
  is_active: false,
}

export const CreateProjectSkillSchema = Yup.object().shape({
  skill_id: Yup.string()
    .required('Required'),
});

export const EditProjectSkillSchema = Yup.object().shape({
  skill_id: Yup.string()
    .required('Required'),
  is_active: Yup.boolean()
    .nullable(),
});
