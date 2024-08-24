'use client';

import { Button, Grid, InputLabel, FormControl, OutlinedInput, InputAdornment, IconButton, FormHelperText, CircularProgress } from "@mui/material";
import { Formik, Form } from 'formik';
import { toast } from 'sonner';
import { useState } from "react";
import { updateProfilePassword } from "@/actions/auth/auth-action";
import { AuthProfilePasswordSchema } from "@/schemas/auth";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SettingsAuthPasswordForm = () => {
  const [showPassword, setShowPassword] = useState({
    old_password: false,
    new_password: false,
    confirm_new_password: false
  });

  const handleClickShowPassword = (field: string) => {
    setShowPassword(prevState => ({
      ...prevState,
      [field]: !prevState[field as keyof typeof prevState]
    }));
  };


  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        old_password: '',
        new_password: '',
        confirm_new_password: '',
      }}
      validationSchema={AuthProfilePasswordSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        const message = await updateProfilePassword(values);
        if (message === 'SUCCESS') {
          toast.success('profile password updated successfully');
        } else {
          toast.error(message)
        }
        setSubmitting(false);
      }}
    >
      {({ submitForm, isSubmitting, setFieldValue, values, touched, errors }) => (
        <Form>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-old_password">Old Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-old_password"
                  type={showPassword.old_password ? 'text' : 'password'}
                  value={values.old_password}
                  name="old_password"
                  onChange={(event) => {
                    setFieldValue("old_password", event.target.value);
                  }}
                  error={touched.old_password && Boolean(errors.old_password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword('old_password')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword.old_password ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText>{touched.old_password && errors.old_password}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-new_password">New Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-new_password"
                  type={showPassword.new_password ? 'text' : 'password'}
                  value={values.new_password}
                  name="new_password"
                  onChange={(event) => {
                    setFieldValue("new_password", event.target.value);
                  }}
                  error={touched.new_password && Boolean(errors.new_password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword('new_password')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword.new_password ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText>{touched.new_password && errors.new_password}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-confirm_new_password">Confirm New Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirm_new_password"
                  type={showPassword.confirm_new_password ? 'text' : 'password'}
                  value={values.confirm_new_password}
                  name="confirm_new_password"
                  onChange={(event) => {
                    setFieldValue("confirm_new_password", event.target.value);
                  }}
                  error={touched.confirm_new_password && Boolean(errors.confirm_new_password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword('confirm_new_password')}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword.confirm_new_password ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText>{touched.confirm_new_password && errors.confirm_new_password}</FormHelperText>
              </FormControl>
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
            {isSubmitting ? <CircularProgress /> : 'Update Password'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default SettingsAuthPasswordForm
