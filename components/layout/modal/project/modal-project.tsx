import { CreateProjectSchema, EditProjectSchema, defaultFormProject } from "@/schemas/project/project";
import { Modal, Box, Typography, Grid, FormGroup, FormControlLabel, ButtonGroup, Button, Switch, Card, CardContent, Chip, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { toast } from "sonner";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { VisuallyHiddenInput } from '@/components/shared/button/button';
import Image from "next/image";
import { ImageAvatarPreview } from "@/components/shared/dialog/image-preview";

interface ModalAddEditProps {
  openAddEdit: boolean;
  handleCloseAddEdit: () => void;
  editId: string | null;
  editIdTranslation: string | null;
  params: any; // Type according to your needs
  modalStyle: any; // Type according to your needs
  form: typeof defaultFormProject;
  editProject: (id: string, data: FormData) => Promise<string>;
  editProjectTranslation: (id: string, locale: string, data: FormData) => Promise<string>;
  addProject: (data: FormData) => Promise<string>;
  addProjectTranslation: (data: FormData) => Promise<string>;
  fetchProjects: (page: number, limit: number) => void;
  page: number;
  limit: number;
  imageUrl: string;
  logoUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setLogoUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalAddEditProject: React.FC<ModalAddEditProps> = ({
  openAddEdit,
  handleCloseAddEdit,
  editId,
  editIdTranslation,
  params,
  modalStyle,
  form,
  editProject,
  editProjectTranslation,
  addProject,
  addProjectTranslation,
  fetchProjects,
  page,
  limit,
  imageUrl,
  logoUrl,
  setImageUrl,
  setLogoUrl,
}) => {
  return (
    <Modal
      open={openAddEdit}
      onClose={handleCloseAddEdit}
      aria-labelledby="modal-project-title"
      aria-describedby="modal-project-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-project-title" variant="h6" component="h2">
          {editId ? 'Edit Project' : 'Add Project'}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Formik
            initialValues={form}
            validationSchema={editId ? EditProjectSchema : CreateProjectSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              
              const formData = new FormData();
              formData.append('title', `${values.title}`);
              formData.append('slug', `${values.slug}`);
              formData.append('image', values.image);
              formData.append('logo', values.logo);

              if (editId) { // update project
                formData.append('is_active', `${values.is_active}`);
                
                const message = await editProject(editId, formData);
                if (message === 'SUCCESS') {
                  
                  // project translation
                  const formDataTranslation = new FormData();
                  formDataTranslation.append('title', `${values.title_2nd}`);
                  formDataTranslation.append('description', `${values.description}`);
                  
                  let message;
                  if (editIdTranslation) {
                    message = await editProjectTranslation(editId, params.locale, formDataTranslation)
                  } else {
                    formDataTranslation.append('project_id', editId);
                    formDataTranslation.append('language_id', params.locale);
                    message = await addProjectTranslation(formDataTranslation)
                  }
                  
                  if (message === 'SUCCESS') {
                    fetchProjects(Number(page), Number(limit),);
                    toast.success('project updated successfully');
                    handleCloseAddEdit()
                  } else {
                    toast.error(message)
                  }
                } else {
                  toast.error(message);
                }
                
              } else { // create new project
                const message = await addProject(formData);
                if (message === 'SUCCESS') {
                  fetchProjects(Number(page), Number(limit),);
                  handleCloseAddEdit()
                  toast.success('project created successfully');
                } else {
                  toast.error(message)
                }
              }
              
              setSubmitting(false);
            }}
            >
            {({ submitForm, isSubmitting, setFieldValue, values }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      id="projectTitleInput"
                      component={TextField}
                      name="title"
                      type="text"
                      label="Title"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="projectSlugInput"
                      component={TextField}
                      name="slug"
                      type="text"
                      label="Slug"
                      fullWidth
                    />
                  </Grid>
                  {editId && <Grid item xs={12}>
                    <Field
                      id="projectTitle2NdInput"
                      component={TextField}
                      name="title_2nd"
                      type="text"
                      label="Title_2nd"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="projectDescriptionInput"
                      component={TextField}
                      name="description"
                      type="text"
                      label="Description"
                      fullWidth
                    />
                  </Grid>}
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
                  <Grid item xs={12} lg={6}>
                    {
                      imageUrl ?
                        <Image
                          src={imageUrl}
                          width={500}
                          height={500}
                          alt={values.title}
                          id="imagePreview"
                          layout="responsive"
                          priority={true}
                        /> : null
                    }
                    <ButtonGroup variant="contained">
                      <Button component="label" startIcon={<CloudUploadIcon />}>
                        Upload Image
                        <VisuallyHiddenInput type="file" style={{ display: 'none' }} onChange={(event) => {
                          const file = event.target.files?.[0];
                          setFieldValue("image", file);
                          if (file) {
                            setImageUrl(URL.createObjectURL(file))
                          } else {
                            setImageUrl('')
                          }
                        }} />
                      </Button>
                    </ButtonGroup>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    {
                      logoUrl ?
                        <Image
                          src={logoUrl}
                          width={500}
                          height={500}
                          alt={values.title}
                          id="logoPreview"
                          layout="responsive"
                          priority={true}
                        /> : null
                    }
                    <ButtonGroup variant="contained">
                      <Button component="label" startIcon={<CloudUploadIcon />}>
                        Upload Logo
                        <VisuallyHiddenInput type="file" onChange={(event) => {
                          const file = event.target.files?.[0];
                          setFieldValue("logo", file);
                          if (file) {
                            setLogoUrl(URL.createObjectURL(file))
                          } else {
                            setLogoUrl('')
                          }
                        }} />
                      </Button>
                    </ButtonGroup>
                  </Grid>

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
  form: typeof defaultFormProject;
  imageData: ImageDataProp,
}

export const ModalViewProject: React.FC<ModalViewProps> = ({
  openView,
  handleCloseView,
  modalStyle,
  form,
  imageData,
}) => {
  return (
    <Modal
      open={openView}
      onClose={handleCloseView}
      aria-labelledby="modal-view-project-title"
      aria-describedby="modal-view-project-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-view-project-title" variant="h6" component="h2">
          View Project
        </Typography>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            {
              imageData.image_url &&
              <ImageAvatarPreview
                data={imageData}
              />
            }
            <Typography variant="h5" gutterBottom>
              {form.title} {
                form.is_active ?
                  <Chip label="active" color="success"></Chip> :
                  <Chip label="disabled" color="error"></Chip>
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {form.title_2nd} {form.description}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}
