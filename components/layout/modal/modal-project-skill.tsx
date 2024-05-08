import { CreateProjectSkillSchema, EditProjectSkillSchema, defaultFormProjectSkill } from "@/schemas/project-skill";
import { Modal, Box, Typography, Grid, IconButton, FormGroup, FormControlLabel, Button, LinearProgress, Switch, InputLabel, FormHelperText, MenuItem, Select, FormControl, TextField } from "@mui/material";
import { Formik, Form } from 'formik';
import { toast } from "sonner";
import { Skill } from "@/types/skill";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface ModalAddEditProps {
  openAddEdit: boolean;
  handleCloseAddEdit: () => void;
  forms: any;
  setForms: any;
  skills: Skill[] | null;
}

export const ModalAddEditProjectSkill: React.FC<ModalAddEditProps> = ({
  openAddEdit,
  handleCloseAddEdit,
  forms,
  setForms,
  skills,
}) => {

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(forms);
  };

  const handleChangeInput = (index: any, event: any) => {
    const values: any = [...forms];
    values[index][event.target.name] = event.target.value;
    setForms(values);
  };

  const handleChangeInputSelet = (index: any, event: any) => {
    const values: any = [...forms];
    values[index][event.target.name] = event.target.checked;
    setForms(values);
  };

  const handleAddFields = () => {
    setForms([...forms, defaultFormProjectSkill]);
  };

  const handleRemoveFields = (index: any) => {
    const values = [...forms];
    values.splice(index, 1);
    setForms(values);
  };

  return (
    <Modal
      open={openAddEdit}
      onClose={handleCloseAddEdit}
      aria-labelledby="modal-project-skill-title"
      aria-describedby="modal-project-skill-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-project-skill-title" variant="h6" component="h2">
          Project Skill
        </Typography>

        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
          {forms.map((inputField: any, index: any) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="select-skill_id-label">Skill</InputLabel>
                  <Select
                    labelId="select-skill_id-label"
                    id="select-skill_id"
                    value={inputField.skill_id}
                    label="Skill"
                    name="skill_id"
                    onChange={(event) => handleChangeInput(index, event)}
                  >
                    {
                      skills?.map((data: Skill) => {
                        return <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormGroup>
                  <FormControlLabel control={
                    <Switch
                      name="is_active"
                      value={inputField.is_active}
                      checked={inputField.is_active === true}
                      onChange={(event) => handleChangeInputSelet(index, event)}
                    />
                  } label="Active" />
                </FormGroup>
              </Grid>
              <Grid item xs={3}>
                <IconButton onClick={() => handleRemoveFields(index)}>
                  Hapus
                </IconButton>
              </Grid>
              <Grid item xs={3}>
                <IconButton onClick={() => handleAddFields()}>
                  Tambah
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <br />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={handleSubmit}
          >
            Send
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
