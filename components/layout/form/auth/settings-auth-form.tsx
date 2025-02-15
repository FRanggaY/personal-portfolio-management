'use client';

import { Button, Grid, ButtonGroup, Skeleton, Typography, MenuItem, Select, InputLabel, FormControl, FormHelperText, Avatar, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { toast } from 'sonner';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect, useState } from "react";
import { VisuallyHiddenInput } from "@/components/shared/button/button";
import { useAuthProfile } from "@/context/AuthProfileContext";
import { AuthProfile } from "@/types/auth";
import { updateProfile } from "@/actions/auth/auth-action";
import { AuthProfileSchema } from "@/schemas/auth";
import siteMetadata from "@/lib/siteMetaData";

const SettingsAuthForm = () => {
  const data: AuthProfile = useAuthProfile();
  const [imageUrl, setImageUrl] = useState<string>(data?.profile?.image_url);

  function readyProfile() {
    if (data.profile) {
      setImageUrl(data.profile.image_url);
    }
  }

  useEffect(() => {
    readyProfile();
  }, [data])

  if (!data.profile) {
    // Show skeleton loading while data is being fetched
    return (
      <Skeleton width={500} height={500} variant="rounded" />
    );
  }

  return (
    <Formik
      initialValues={{
        username: data.profile.username,
        email: data.profile.email,
        name: data.profile.name,
        no_handphone: data.profile.no_handphone ?? '',
        gender: data.profile.gender,
        image: '',
      }}
      validationSchema={AuthProfileSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        const formData = new FormData();
        formData.append('username', `${values.username}`);
        formData.append('email', `${values.email}`);
        formData.append('name', `${values.name}`);
        formData.append('no_handphone', `${values.no_handphone}`);
        formData.append('image', `${values.image}`);
        formData.append('gender', `${values.gender}`);

        const message = await updateProfile(formData);
        if (message === 'SUCCESS') {
          data.refresh();
          toast.success('profile updated successfully');
        } else {
          toast.error(message)
        }
        setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting, setFieldValue, values, touched, errors }) => (
        <Form>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    id="usernameInput"
                    component={TextField}
                    name="username"
                    type="text"
                    label="Username"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    id="emailInput"
                    component={TextField}
                    name="email"
                    type="text"
                    label="Email"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    id="nameInput"
                    component={TextField}
                    name="name"
                    type="text"
                    label="Name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="select-gender-label">Gender</InputLabel>
                    <Select
                      labelId="select-gender-label"
                      id="select-gender"
                      value={values.gender}
                      label="Gender"
                      onChange={(event) => {
                        setFieldValue("gender", event.target.value);
                      }}
                      error={touched.gender && Boolean(errors.gender)}
                    >
                      <MenuItem value={'female'}>Female</MenuItem>
                      <MenuItem value={'male'}>Male</MenuItem>
                    </Select>
                  </FormControl>
                  <FormHelperText>{touched.gender && errors.gender}</FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    id="no_handphoneInput"
                    component={TextField}
                    name="no_handphone"
                    type="text"
                    label="NO Handphone"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Typography variant="h6">Picture</Typography>
              {
                imageUrl ?
                  <Avatar alt={data.profile.name} src={siteMetadata.apiUrl + '/' + imageUrl} sx={{ width: 200, height: 200 }} />
                  : null
              }
              <ButtonGroup variant="contained" sx={{ marginTop: '10px' }}>
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
          </Grid>
          <br />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            onClick={submitForm}
          >
            {isSubmitting ? <CircularProgress /> : 'Update Profile'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default SettingsAuthForm
