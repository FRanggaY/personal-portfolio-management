import { CreateSchoolSchema, EditSchoolSchema, defaultFormSchool } from "@/schemas/school";
import { Modal, Box, Typography, Grid, FormGroup, FormControlLabel, ButtonGroup, Button, Switch, Card, CardContent, Chip, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { toast } from "sonner";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { VisuallyHiddenInput } from '@/components/shared/button/button';
import Image from "next/image";
import { ImageAvatarPreview } from "@/components/shared/dialog/image-preview";
import siteMetadata from "@/lib/siteMetaData";

interface ModalAddEditProps {
  openAddEdit: boolean;
  handleCloseAddEdit: () => void;
  editId: string | null;
  editIdTranslation: string | null;
  params: any; // Type according to your needs
  modalStyle: any; // Type according to your needs
  form: typeof defaultFormSchool;
  editSchool: (id: string, data: FormData) => Promise<string>;
  editSchoolTranslation: (id: string, locale: string, data: FormData) => Promise<string>;
  addSchool: (data: FormData) => Promise<string>;
  addSchoolTranslation: (data: FormData) => Promise<string>;
  fetchSchools: (page: number, limit: number) => void;
  page: number;
  limit: number;
  imageUrl: string;
  logoUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setLogoUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalAddEditSchool: React.FC<ModalAddEditProps> = ({
  openAddEdit,
  handleCloseAddEdit,
  editId,
  editIdTranslation,
  params,
  modalStyle,
  form,
  editSchool,
  editSchoolTranslation,
  addSchool,
  addSchoolTranslation,
  fetchSchools,
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
      aria-labelledby="modal-school-title"
      aria-describedby="modal-school-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-school-title" variant="h6" component="h2">
          {editId ? 'Edit School' : 'Add School'}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Formik
            initialValues={form}
            validationSchema={editId ? EditSchoolSchema : CreateSchoolSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);

              const formData = new FormData();
              formData.append('code', `${values.code}`);
              formData.append('name', `${values.name}`);
              formData.append('website_url', `${values.website_url}`);
              formData.append('image', values.image);
              formData.append('logo', values.logo);

              if (editId) { // update school
                formData.append('is_active', `${values.is_active}`);

                const message = await editSchool(editId, formData);
                if (message === 'SUCCESS') {

                  // school translation
                  const formDataTranslation = new FormData();
                  formDataTranslation.append('name', `${values.name_2nd}`);
                  formDataTranslation.append('description', `${values.description}`);
                  formDataTranslation.append('address', `${values.address}`);

                  let message;
                  if (editIdTranslation) {
                    message = await editSchoolTranslation(editId, params.locale, formDataTranslation)
                  } else {
                    formDataTranslation.append('school_id', editId);
                    formDataTranslation.append('language_id', params.locale);
                    message = await addSchoolTranslation(formDataTranslation)
                  }

                  if (message === 'SUCCESS') {
                    fetchSchools(Number(page), Number(limit),);
                    toast.success('school updated successfully');
                    handleCloseAddEdit()
                  } else {
                    toast.error(message)
                  }
                } else {
                  toast.error(message);
                }

              } else { // create new school
                const message = await addSchool(formData);
                if (message === 'SUCCESS') {
                  fetchSchools(Number(page), Number(limit),);
                  handleCloseAddEdit()
                  toast.success('school created successfully');
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
                      id="schoolCodeInput"
                      component={TextField}
                      name="code"
                      type="text"
                      label="Code"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="schoolNameInput"
                      component={TextField}
                      name="name"
                      type="text"
                      label="Name"
                      fullWidth
                    />
                  </Grid>
                  {editId && <Grid item xs={12}>
                    <Field
                      id="schoolName2NdInput"
                      component={TextField}
                      name="name_2nd"
                      type="text"
                      label="Name_2nd"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="schoolDescriptionInput"
                      component={TextField}
                      name="description"
                      type="text"
                      label="Description"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="schoolAddressInput"
                      component={TextField}
                      name="address"
                      type="text"
                      label="Address"
                      fullWidth
                    />
                  </Grid>}
                  <Grid item xs={12}>
                    <Field
                      id="schoolNameWebsiteUrl"
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
                          src={siteMetadata.apiUrl + '/' + imageUrl}
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
                          src={siteMetadata.apiUrl + '/' + logoUrl}
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
  form: typeof defaultFormSchool;
  imageData: ImageDataProp,
}

export const ModalViewSchool: React.FC<ModalViewProps> = ({
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
      aria-labelledby="modal-view-school-title"
      aria-describedby="modal-view-school-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-view-school-title" variant="h6" component="h2">
          View School
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
              {form.name_2nd} {form.description} {form.address}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}
