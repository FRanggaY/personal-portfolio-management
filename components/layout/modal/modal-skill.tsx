import { CreateSkillSchema, EditSkillSchema, defaultFormSkill } from "@/schemas/skill";
import { Modal, Box, Typography, Grid, FormGroup, FormControlLabel, ButtonGroup, Button, LinearProgress, Switch, Card, CardContent, Chip } from "@mui/material";
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
  form: typeof defaultFormSkill;
  editSkill: (id: string, data: FormData) => Promise<string>;
  editSkillTranslation: (id: string, locale: string, data: FormData) => Promise<string>;
  addSkill: (data: FormData) => Promise<string>;
  addSkillTranslation: (data: FormData) => Promise<string>;
  fetchSkills: (page: number, limit: number) => void;
  page: number;
  limit: number;
  imageUrl: string;
  logoUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setLogoUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalAddEditSkill: React.FC<ModalAddEditProps> = ({
  openAddEdit,
  handleCloseAddEdit,
  editId,
  editIdTranslation,
  params,
  modalStyle,
  form,
  editSkill,
  editSkillTranslation,
  addSkill,
  addSkillTranslation,
  fetchSkills,
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
      aria-labelledby="modal-skill-title"
      aria-describedby="modal-skill-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-skill-title" variant="h6" component="h2">
          {editId ? 'Edit Skill' : 'Add Skill'}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Formik
            initialValues={form}
            validationSchema={editId ? EditSkillSchema : CreateSkillSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false);

              const formData = new FormData();
              formData.append('code', `${values.code}`);
              formData.append('name', `${values.name}`);
              formData.append('category', `${values.category}`);
              formData.append('website_url', `${values.website_url}`);
              formData.append('image', values.image);
              formData.append('logo', values.logo);

              if (editId) { // update skill
                formData.append('is_active', `${values.is_active}`);

                const message = await editSkill(editId, formData);
                if (message === 'SUCCESS') {

                  // skill translation
                  const formDataTranslation = new FormData();
                  formDataTranslation.append('name', `${values.name_2nd}`);
                  formDataTranslation.append('description', `${values.description}`);

                  let message;
                  if (editIdTranslation) {
                    message = await editSkillTranslation(editId, params.locale, formDataTranslation)
                  } else {
                    formDataTranslation.append('skill_id', editId);
                    formDataTranslation.append('language_id', params.locale);
                    message = await addSkillTranslation(formDataTranslation)
                  }

                  if (message === 'SUCCESS') {
                    fetchSkills(Number(page), Number(limit),);
                    toast.success('skill updated successfully');
                    handleCloseAddEdit()
                  } else {
                    toast.error(message)
                  }
                } else {
                  toast.error(message);
                }

              } else { // create new skill
                const message = await addSkill(formData);
                if (message === 'SUCCESS') {
                  fetchSkills(Number(page), Number(limit),);
                  handleCloseAddEdit()
                  toast.success('skill created successfully');
                } else {
                  toast.error(message)
                }
              }

            }}
          >
            {({ submitForm, isSubmitting, setFieldValue, values }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      id="skillCodeInput"
                      component={TextField}
                      name="code"
                      type="text"
                      label="Code"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="skillNameInput"
                      component={TextField}
                      name="name"
                      type="text"
                      label="Name"
                      fullWidth
                    />
                  </Grid>
                  {editId && <Grid item xs={12}>
                    <Field
                      id="skillName2NdInput"
                      component={TextField}
                      name="name_2nd"
                      type="text"
                      label="Name_2nd"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="skillDescriptionInput"
                      component={TextField}
                      name="description"
                      type="text"
                      label="Description"
                      fullWidth
                    />
                  </Grid>}
                  <Grid item xs={12}>
                    <Field
                      id="skillCategory"
                      component={TextField}
                      name="category"
                      label="Category"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="skillWebsiteUrl"
                      component={TextField}
                      name="website_url"
                      label="Website URL"
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
                  <Grid item xs={12} lg={6}>
                    {
                      imageUrl ?
                        <Image
                          src={imageUrl}
                          width={500}
                          height={500}
                          alt={values.name}
                          id="imagePreview"
                          layout="responsive"
                          priority={true}
                        /> : null
                    }
                    <ButtonGroup variant="contained">
                      <Button component="label" startIcon={<CloudUploadIcon />}>
                        Upload Image
                        <VisuallyHiddenInput type="file" onChange={(event) => {
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
                          alt={values.name}
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
                {isSubmitting && <LinearProgress />}
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  onClick={submitForm}
                >
                  Submit
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
  form: typeof defaultFormSkill;
  imageData: ImageDataProp,
}

export const ModalViewSkill: React.FC<ModalViewProps> = ({
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
      aria-labelledby="modal-view-skill-title"
      aria-describedby="modal-view-skill-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-view-skill-title" variant="h6" component="h2">
          View Skill
        </Typography>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            {
              imageData.image_url &&
              <ImageAvatarPreview
                data={imageData}
              />
            }
            <Typography sx={{ fontSize: 14, marginTop: '10px' }} color="text.secondary" gutterBottom>
              CODE ({form.code})
            </Typography>
            <Typography variant="h5" gutterBottom>
              {form.name} {
                form.is_active ?
                  <Chip label="active" color="success"></Chip> :
                  <Chip label="disabled" color="error"></Chip>
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {form.name_2nd} {form.category} {form.description}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}
