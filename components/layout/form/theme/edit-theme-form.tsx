'use client';

import { useAuthProfile } from "@/context/AuthProfileContext";
import { AuthProfile } from "@/types/auth";
import { Button, Grid, LinearProgress, MenuItem, Select, InputLabel, FormControl, Skeleton } from "@mui/material";
import { Formik, Form } from 'formik';
import { useState } from "react";
import { toast } from 'sonner';

interface FormValues {
  theme: string; // Adjust the type as needed
}

const EditThemeForm = () => {
  const data:AuthProfile = useAuthProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // set theme on local storage
      localStorage.setItem('theme', values.theme);
      toast.success(`Theme updated to ${values.theme}`);
      window.location.reload();
    } catch (error) {
      // Handle error
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!data.theme) {
    // Show skeleton loading while data is being fetched
    return (
      <Skeleton width={500} height={500} variant="rounded" />
    );
  }

  return (
    <Formik
      initialValues={{
        theme: data.theme,
      }}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ submitForm, setFieldValue, values }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-theme-label">Theme</InputLabel>
                <Select
                  labelId="select-theme-label"
                  id="select-theme"
                  value={values.theme}
                  onChange={(event) => {
                    setFieldValue("theme", event.target.value);
                  }}
                >
                  <MenuItem value={'light'}>Light</MenuItem>
                  <MenuItem value={'dark'}>Dark</MenuItem>
                </Select>
              </FormControl>
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
  )
}

export default EditThemeForm
