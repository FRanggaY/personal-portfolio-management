import { CreateSkillMappingSchema, EditSkillMappingSchema, defaultFormSkillMapping } from "@/schemas/skill/skill-mapping";
import { Modal, Box, Typography, Grid, FormGroup, FormControlLabel, Button, Switch, Card, CardContent, Chip, InputLabel, FormHelperText, MenuItem, Select, FormControl, CircularProgress } from "@mui/material";
import { Formik, Form } from 'formik';
import { toast } from "sonner";
import { Skill } from "@/types/skill/skill";

interface ModalAddEditProps {
  openAddEdit: boolean;
  handleCloseAddEdit: () => void;
  editId: string | null;
  modalStyle: any; // Type according to your needs
  form: typeof defaultFormSkillMapping;
  editSkillMapping: (id: string, data: FormData) => Promise<string>;
  addSkillMapping: (data: FormData) => Promise<string>;
  fetchSkillMappings: (page: number, limit: number) => void;
  page: number;
  limit: number;
  skills: Skill[] | null;
}

export const ModalAddEditSkillMapping: React.FC<ModalAddEditProps> = ({
  openAddEdit,
  handleCloseAddEdit,
  editId,
  modalStyle,
  form,
  editSkillMapping,
  addSkillMapping,
  fetchSkillMappings,
  page,
  limit,
  skills,
}) => {
  return (
    <Modal
      open={openAddEdit}
      onClose={handleCloseAddEdit}
      aria-labelledby="modal-skill-mapping-title"
      aria-describedby="modal-skill-mapping-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-skill-mapping-title" variant="h6" component="h2">
          {editId ? 'Edit SkillMapping' : 'Add SkillMapping'}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Formik
            initialValues={form}
            validationSchema={editId ? EditSkillMappingSchema : CreateSkillMappingSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);

              const formData = new FormData();
              formData.append('skill_id', `${values.skill_id}`);
              if (editId) { // update skillMapping
                formData.append('is_active', `${values.is_active}`);

                const message = await editSkillMapping(editId, formData);
                if (message === 'SUCCESS') {
                  fetchSkillMappings(Number(page), Number(limit),);
                  handleCloseAddEdit()
                  toast.success('skillMapping updated successfully');
                } else {
                  toast.error(message)
                }
              } else { // create new skillMapping
                const message = await addSkillMapping(formData);
                if (message === 'SUCCESS') {
                  fetchSkillMappings(Number(page), Number(limit),);
                  handleCloseAddEdit()
                  toast.success('skillMapping created successfully');
                } else {
                  toast.error(message)
                }
              }

              setSubmitting(false);
            }}
          >
            {({ submitForm, isSubmitting, setFieldValue, values, errors, touched }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="select-skill_id-label">Skill</InputLabel>
                      <Select
                        labelId="select-skill_id-label"
                        id="select-skill_id"
                        value={values.skill_id}
                        label="Skill"
                        onChange={(event) => {
                          setFieldValue("skill_id", event.target.value);
                        }}
                        error={touched.skill_id && Boolean(errors.skill_id)}
                      >
                        {
                          skills?.map((data: Skill) => {
                            return <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>
                          })
                        }
                      </Select>
                    </FormControl>
                    <FormHelperText>{touched.skill_id && errors.skill_id}</FormHelperText>
                  </Grid>
                  {editId && <Grid item xs={12}>
                    <FormGroup>
                      <FormControlLabel control={
                        <Switch
                          name="is_active"
                          value={values.is_active}
                          checked={values.is_active === true}
                          onChange={(event, checked) => {
                            setFieldValue("is_active", checked);
                          }}
                        />
                      } label="Active" />
                    </FormGroup>
                  </Grid>}
                </Grid>
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  {isSubmitting ? <CircularProgress /> : 'Submit'}
                </Button>
              </Form>
            )}
          </Formik>
        </Grid>
      </Box>
    </Modal>
  );
};

interface ModalViewProps {
  openView: boolean;
  handleCloseView: () => void;
  modalStyle: any; // Type according to your needs
  form: typeof defaultFormSkillMapping;
}

export const ModalViewSkillMapping: React.FC<ModalViewProps> = ({
  openView,
  handleCloseView,
  modalStyle,
  form,
}) => {
  return (
    <Modal
      open={openView}
      onClose={handleCloseView}
      aria-labelledby="modal-view-skill-mapping-title"
      aria-describedby="modal-view-skill-mapping-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-view-skillMapping-title" variant="h6" component="h2">
          View SkillMapping
        </Typography>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, marginTop: '10px' }} color="text.secondary" gutterBottom>
              {form.skill.name}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {
                form.is_active ?
                  <Chip label="active" color="success"></Chip> :
                  <Chip label="disabled" color="error"></Chip>
              }
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}
