import { CreateCompanySchema, EditCompanySchema, defaultFormCompany } from "@/schemas/company";
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
  form: typeof defaultFormCompany;
  editCompany: (id: string, data: FormData) => Promise<string>;
  editCompanyTranslation: (id: string, locale: string, data: FormData) => Promise<string>;
  addCompany: (data: FormData) => Promise<string>;
  addCompanyTranslation: (data: FormData) => Promise<string>;
  fetchCompanies: (page: number, limit: number) => void;
  page: number;
  limit: number;
  imageUrl: string;
  logoUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
  setLogoUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalAddEditCompany: React.FC<ModalAddEditProps> = ({
  openAddEdit,
  handleCloseAddEdit,
  editId,
  editIdTranslation,
  params,
  modalStyle,
  form,
  editCompany,
  editCompanyTranslation,
  addCompany,
  addCompanyTranslation,
  fetchCompanies,
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
      aria-labelledby="modal-company-title"
      aria-describedby="modal-company-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-company-title" variant="h6" component="h2">
          {editId ? 'Edit Company' : 'Add Company'}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Formik
            initialValues={form}
            validationSchema={editId ? EditCompanySchema : CreateCompanySchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false);

              const formData = new FormData();
              formData.append('code', `${values.code}`);
              formData.append('name', `${values.name}`);
              formData.append('website_url', `${values.website_url}`);
              formData.append('image', values.image);
              formData.append('logo', values.logo);

              if (editId) { // update company
                formData.append('is_active', `${values.is_active}`);

                const message = await editCompany(editId, formData);
                if (message === 'SUCCESS') {

                  // company translation
                  const formDataTranslation = new FormData();
                  formDataTranslation.append('name', `${values.name_2nd}`);
                  formDataTranslation.append('description', `${values.description}`);
                  formDataTranslation.append('address', `${values.address}`);

                  let message;
                  if (editIdTranslation) {
                    message = await editCompanyTranslation(editId, params.locale, formDataTranslation)
                  } else {
                    formDataTranslation.append('company_id', editId);
                    formDataTranslation.append('language_id', params.locale);
                    message = await addCompanyTranslation(formDataTranslation)
                  }

                  if (message === 'SUCCESS') {
                    fetchCompanies(Number(page), Number(limit),);
                    toast.success('company updated successfully');
                    handleCloseAddEdit()
                  } else {
                    toast.error(message)
                  }
                } else {
                  toast.error(message);
                }

              } else { // create new company
                const message = await addCompany(formData);
                if (message === 'SUCCESS') {
                  fetchCompanies(Number(page), Number(limit),);
                  handleCloseAddEdit()
                  toast.success('company created successfully');
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
                      id="companyCodeInput"
                      component={TextField}
                      name="code"
                      type="text"
                      label="Code"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="companyNameInput"
                      component={TextField}
                      name="name"
                      type="text"
                      label="Name"
                      fullWidth
                    />
                  </Grid>
                  {editId && <Grid item xs={12}>
                    <Field
                      id="companyName2NdInput"
                      component={TextField}
                      name="name_2nd"
                      type="text"
                      label="Name_2nd"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="companyDescriptionInput"
                      component={TextField}
                      name="description"
                      type="text"
                      label="Description"
                      fullWidth
                    />
                  </Grid>}
                  {editId && <Grid item xs={12}>
                    <Field
                      id="companyAddressInput"
                      component={TextField}
                      name="address"
                      type="text"
                      label="Address"
                      fullWidth
                    />
                  </Grid>}
                  <Grid item xs={12}>
                    <Field
                      id="companyNameWebsiteUrl"
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
  form: typeof defaultFormCompany;
  imageData: ImageDataProp,
}

export const ModalViewCompany: React.FC<ModalViewProps> = ({
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
      aria-labelledby="modal-view-company-title"
      aria-describedby="modal-view-company-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-view-company-title" variant="h6" component="h2">
          View Company
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
