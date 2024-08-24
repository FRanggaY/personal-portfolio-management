import { CreateExperienceSchema, EditExperienceSchema, defaultFormExperience } from "@/schemas/experience";
import { Modal, Box, Typography, Grid, FormGroup, FormControlLabel, Button, Switch, Card, CardContent, Chip, FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { toast } from "sonner";
import { Company } from "@/types/company";

interface ModalAddEditProps {
  openAddEdit: boolean;
  handleCloseAddEdit: () => void;
  editId: string | null;
  editIdTranslation: string | null;
  params: any; // Type according to your needs
  modalStyle: any; // Type according to your needs
  form: typeof defaultFormExperience;
  editExperience: (id: string, data: FormData) => Promise<string>;
  editExperienceTranslation: (id: string, locale: string, data: FormData) => Promise<string>;
  addExperience: (data: FormData) => Promise<string>;
  addExperienceTranslation: (data: FormData) => Promise<string>;
  fetchExperiences: (page: number, limit: number) => void;
  page: number;
  limit: number;
  companies: Company[] | null;
}

export const ModalAddEditExperience: React.FC<ModalAddEditProps> = ({
  openAddEdit,
  handleCloseAddEdit,
  editId,
  editIdTranslation,
  params,
  modalStyle,
  form,
  editExperience,
  editExperienceTranslation,
  addExperience,
  addExperienceTranslation,
  fetchExperiences,
  page,
  limit,
  companies,
}) => {
  return (
    <Modal
      open={openAddEdit}
      onClose={handleCloseAddEdit}
      aria-labelledby="modal-experience-title"
      aria-describedby="modal-experience-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-experience-title" variant="h6" component="h2">
          {editId ? 'Edit Experience' : 'Add Experience'}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Formik
            initialValues={form}
            validationSchema={editId ? EditExperienceSchema : CreateExperienceSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);

              const formData = new FormData();
              formData.append('company_id', `${values.company_id}`);
              formData.append('title', `${values.title}`);
              formData.append('started_at', `${values.started_at}`);
              formData.append('finished_at', `${values.finished_at}`);

              if (editId) { // update experience
                formData.append('is_active', `${values.is_active}`);

                const message = await editExperience(editId, formData);
                if (message === 'SUCCESS') {

                  // experience translation
                  const formDataTranslation = new FormData();
                  formDataTranslation.append('title', `${values.title_2nd}`);
                  formDataTranslation.append('employee_type', `${values.employee_type}`);
                  formDataTranslation.append('location', `${values.location}`);
                  formDataTranslation.append('location_type', `${values.location_type}`);
                  formDataTranslation.append('description', `${values.description}`);

                  let message;
                  if (editIdTranslation) {
                    message = await editExperienceTranslation(editId, params.locale, formDataTranslation)
                  } else {
                    formDataTranslation.append('experience_id', editId);
                    formDataTranslation.append('language_id', params.locale);
                    message = await addExperienceTranslation(formDataTranslation)
                  }

                  if (message === 'SUCCESS') {
                    fetchExperiences(Number(page), Number(limit),);
                    toast.success('experience updated successfully');
                    handleCloseAddEdit()
                  } else {
                    toast.error(message)
                  }
                } else {
                  toast.error(message);
                }

              } else { // create new experience
                const message = await addExperience(formData);
                if (message === 'SUCCESS') {
                  fetchExperiences(Number(page), Number(limit),);
                  handleCloseAddEdit()
                  toast.success('experience created successfully');
                } else {
                  toast.error(message)
                }
              }

              setSubmitting(false);
            }}
          >
            {({ submitForm, isSubmitting, setFieldValue, values, touched, errors }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="select-company_id-label">Company</InputLabel>
                      <Select
                        labelId="select-company_id-label"
                        id="select-company_id"
                        value={values.company_id}
                        label="Company"
                        onChange={(event) => {
                          setFieldValue("company_id", event.target.value);
                        }}
                        error={touched.company_id && Boolean(errors.company_id)}
                      >
                        {
                          companies?.map((data: Company) => {
                            return <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>
                          })
                        }
                      </Select>
                    </FormControl>
                    <FormHelperText>{touched.company_id && errors.company_id}</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="experienceTitleInput"
                      component={TextField}
                      name="title"
                      type="text"
                      label="Title"
                      fullWidth
                    />
                  </Grid>
                  {editId && <Grid item xs={12}>
                    <Field
                      id="experienceTitle2NdInput"
                      component={TextField}
                      name="title_2nd"
                      type="text"
                      label="Title_2nd"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="experienceEmployeeTypeInput"
                      component={TextField}
                      name="employee_type"
                      type="text"
                      label="Employee Type"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="experienceLocationInput"
                      component={TextField}
                      name="location"
                      type="text"
                      label="Location"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="experienceLocationTypeInput"
                      component={TextField}
                      name="location_type"
                      type="text"
                      label="Location Type"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="experienceDescriptionInput"
                      component={TextField}
                      name="description"
                      type="text"
                      label="Description"
                      fullWidth
                    />
                  </Grid>}
                  <Grid item xs={6}>
                    <Field
                      id="experienceStartedAtInput"
                      component={TextField}
                      name="started_at"
                      type="date"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="experiencefinishedAtInput"
                      component={TextField}
                      name="finished_at"
                      type="date"
                      fullWidth
                    />
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

interface ImageDataProp {
  image_url: string;
  name: string;
}

interface ModalViewProps {
  openView: boolean;
  handleCloseView: () => void;
  modalStyle: any; // Type according to your needs
  form: typeof defaultFormExperience;
}

export const ModalViewExperience: React.FC<ModalViewProps> = ({
  openView,
  handleCloseView,
  modalStyle,
  form,
}) => {
  return (
    <Modal
      open={openView}
      onClose={handleCloseView}
      aria-labelledby="modal-view-experience-title"
      aria-describedby="modal-view-experience-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-view-experience-title" variant="h6" component="h2">
          View Experience
        </Typography>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, marginTop: '10px' }} color="text.secondary" gutterBottom>
              {form.company.name} - ({form.started_at}) - ({form.finished_at})
            </Typography>
            <Typography variant="h5" gutterBottom>
              {form.title} {
                form.is_active ?
                  <Chip label="active" color="success"></Chip> :
                  <Chip label="disabled" color="error"></Chip>
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {form.title_2nd} {form.location} {form.location_type} {form.description}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}
