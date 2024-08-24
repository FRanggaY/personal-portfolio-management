import { CreateEducationSchema, EditEducationSchema, defaultFormEducation } from "@/schemas/education";
import { Modal, Box, Typography, Grid, FormGroup, FormControlLabel, Button, Switch, Card, CardContent, Chip, FormControl, InputLabel, Select, MenuItem, FormHelperText, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { toast } from "sonner";
import { School } from "@/types/school";

interface ModalAddEditProps {
  openAddEdit: boolean;
  handleCloseAddEdit: () => void;
  editId: string | null;
  editIdTranslation: string | null;
  params: any; // Type according to your needs
  modalStyle: any; // Type according to your needs
  form: typeof defaultFormEducation;
  editEducation: (id: string, data: FormData) => Promise<string>;
  editEducationTranslation: (id: string, locale: string, data: FormData) => Promise<string>;
  addEducation: (data: FormData) => Promise<string>;
  addEducationTranslation: (data: FormData) => Promise<string>;
  fetchEducations: (page: number, limit: number) => void;
  page: number;
  limit: number;
  schools: School[] | null;
}

export const ModalAddEditEducation: React.FC<ModalAddEditProps> = ({
  openAddEdit,
  handleCloseAddEdit,
  editId,
  editIdTranslation,
  params,
  modalStyle,
  form,
  editEducation,
  editEducationTranslation,
  addEducation,
  addEducationTranslation,
  fetchEducations,
  page,
  limit,
  schools,
}) => {
  return (
    <Modal
      open={openAddEdit}
      onClose={handleCloseAddEdit}
      aria-labelledby="modal-education-title"
      aria-describedby="modal-education-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-education-title" variant="h6" component="h2">
          {editId ? 'Edit Education' : 'Add Education'}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Formik
            initialValues={form}
            validationSchema={editId ? EditEducationSchema : CreateEducationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);

              const formData = new FormData();
              formData.append('school_id', `${values.school_id}`);
              formData.append('title', `${values.title}`);
              formData.append('started_at', `${values.started_at}`);
              formData.append('finished_at', `${values.finished_at}`);

              if (editId) { // update education
                formData.append('is_active', `${values.is_active}`);

                const message = await editEducation(editId, formData);
                if (message === 'SUCCESS') {

                  // education translation
                  const formDataTranslation = new FormData();
                  formDataTranslation.append('title', `${values.title_2nd}`);
                  formDataTranslation.append('degree', `${values.degree}`);
                  formDataTranslation.append('field_of_study', `${values.field_of_study}`);
                  formDataTranslation.append('description', `${values.description}`);

                  let message;
                  if (editIdTranslation) {
                    message = await editEducationTranslation(editId, params.locale, formDataTranslation)
                  } else {
                    formDataTranslation.append('education_id', editId);
                    formDataTranslation.append('language_id', params.locale);
                    message = await addEducationTranslation(formDataTranslation)
                  }

                  if (message === 'SUCCESS') {
                    fetchEducations(Number(page), Number(limit),);
                    toast.success('education updated successfully');
                    handleCloseAddEdit()
                  } else {
                    toast.error(message)
                  }
                } else {
                  toast.error(message);
                }

              } else { // create new education
                const message = await addEducation(formData);
                if (message === 'SUCCESS') {
                  fetchEducations(Number(page), Number(limit),);
                  handleCloseAddEdit()
                  toast.success('education created successfully');
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
                      <InputLabel id="select-school_id-label">School</InputLabel>
                      <Select
                        labelId="select-school_id-label"
                        id="select-school_id"
                        value={values.school_id}
                        label="School"
                        onChange={(event) => {
                          setFieldValue("school_id", event.target.value);
                        }}
                        error={touched.school_id && Boolean(errors.school_id)}
                      >
                        {
                          schools?.map((data: School) => {
                            return <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>
                          })
                        }
                      </Select>
                    </FormControl>
                    <FormHelperText>{touched.school_id && errors.school_id}</FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="educationTitleInput"
                      component={TextField}
                      name="title"
                      type="text"
                      label="Title"
                      fullWidth
                    />
                  </Grid>
                  {editId && <Grid item xs={12}>
                    <Field
                      id="educationTitle2NdInput"
                      component={TextField}
                      name="title_2nd"
                      type="text"
                      label="Title_2nd"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="educationDegreeInput"
                      component={TextField}
                      name="degree"
                      type="text"
                      label="Degree"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="educationFieldOfStudyInput"
                      component={TextField}
                      name="field_of_study"
                      type="text"
                      label="Field Of Study"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="educationDescriptionInput"
                      component={TextField}
                      name="description"
                      type="text"
                      label="Description"
                      fullWidth
                    />
                  </Grid>}
                  <Grid item xs={6}>
                    <Field
                      id="educationStartedAtInput"
                      component={TextField}
                      name="started_at"
                      type="date"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      id="educationfinishedAtInput"
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
  form: typeof defaultFormEducation;
}

export const ModalViewEducation: React.FC<ModalViewProps> = ({
  openView,
  handleCloseView,
  modalStyle,
  form,
}) => {
  return (
    <Modal
      open={openView}
      onClose={handleCloseView}
      aria-labelledby="modal-view-education-title"
      aria-describedby="modal-view-education-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-view-education-title" variant="h6" component="h2">
          View Education
        </Typography>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, marginTop: '10px' }} color="text.secondary" gutterBottom>
              {form.school.name} - ({form.started_at}) - ({form.finished_at})
            </Typography>
            <Typography variant="h5" gutterBottom>
              {form.title} {
                form.is_active ?
                  <Chip label="active" color="success"></Chip> :
                  <Chip label="disabled" color="error"></Chip>
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {form.title_2nd} {form.degree} {form.field_of_study} {form.description}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}
