import { CreateProjectAttachmentSchema, EditProjectAttachmentSchema, defaultFormProjectAttachment } from "@/schemas/project/project-attachment";
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
  modalStyle: any; // Type according to your needs
  form: typeof defaultFormProjectAttachment;
  editProjectAttachment: (id: string, data: FormData) => Promise<string>;
  addProjectAttachment: (data: FormData) => Promise<string>;
  fetchProjectAttachments: (page: number, limit: number) => void;
  page: number;
  limit: number;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const ModalAddEditProjectAttachment: React.FC<ModalAddEditProps> = ({
  openAddEdit,
  handleCloseAddEdit,
  editId,
  modalStyle,
  form,
  editProjectAttachment,
  addProjectAttachment,
  fetchProjectAttachments,
  page,
  limit,
  imageUrl,
  setImageUrl,
}) => {
  return (
    <Modal
      open={openAddEdit}
      onClose={handleCloseAddEdit}
      aria-labelledby="modal-project-attachment-title"
      aria-describedby="modal-project-attachment-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-project-attachment-title" variant="h6" component="h2">
          {editId ? 'Edit ProjectAttachment' : 'Add ProjectAttachment'}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Formik
            initialValues={form}
            validationSchema={editId ? EditProjectAttachmentSchema : CreateProjectAttachmentSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false);

              const formData = new FormData();
              formData.append('project_id', `${values.project_id}`);
              formData.append('title', `${values.title}`);
              formData.append('description', `${values.description}`);
              formData.append('website_url', `${values.website_url}`);
              formData.append('category', `${values.category}`);
              formData.append('image', values.image);

              if (editId) { // update project-attachment
                formData.append('is_active', `${values.is_active}`);

                const message = await editProjectAttachment(editId, formData);
                if (message === 'SUCCESS') {
                  fetchProjectAttachments(Number(page), Number(limit),);
                  toast.success('project-attachment updated successfully');
                  handleCloseAddEdit();
                } else {
                  toast.error(message)
                }

              } else { // create new project-attachment
                const message = await addProjectAttachment(formData);
                if (message === 'SUCCESS') {
                  fetchProjectAttachments(Number(page), Number(limit),);
                  handleCloseAddEdit()
                  toast.success('project-attachment created successfully');
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
                      id="project-attachmentTitleInput"
                      component={TextField}
                      name="title"
                      type="text"
                      label="Title"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="project-attachmentDescriptionInput"
                      component={TextField}
                      name="description"
                      type="text"
                      label="Description"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="project-attachmentCategoryInput"
                      component={TextField}
                      name="category"
                      type="text"
                      label="Category"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="project-attachmentWebsiteUrl"
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
  form: typeof defaultFormProjectAttachment;
  imageData: ImageDataProp,
}

export const ModalViewProjectAttachment: React.FC<ModalViewProps> = ({
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
      aria-labelledby="modal-view-project-attachment-title"
      aria-describedby="modal-view-project-attachment-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-view-project-attachment-title" variant="h6" component="h2">
          View Project Attachment
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
              ({form.category})
            </Typography>
            <Typography variant="h5" gutterBottom>
              {form.title} {
                form.is_active ?
                  <Chip label="active" color="success"></Chip> :
                  <Chip label="disabled" color="error"></Chip>
              }
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {form.description} {form.website_url}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  )
}
