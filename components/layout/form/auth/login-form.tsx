'use client';

import { Button, FormControl, Grid, IconButton, InputAdornment, InputLabel, LinearProgress, OutlinedInput } from "@mui/material";
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner';
import { CreateLoginSchema } from "@/schemas/auth";
import { getAccessToken, login } from "@/actions/auth/auth-action";
import { useEffect, useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginForm = () => {
  const params = useParams<{ locale: string; }>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  useEffect(() => {
    const handleLogin = async () => {
      const accessToken = await getAccessToken();
      if (accessToken) {
        router.push(`/${params.locale}/dashboard`); // Redirect if logged in
      }
    };

    handleLogin();
  }, []);

  return (
    <Formik
      initialValues={{
        username_or_email: '',
        password: '',
      }}
      validationSchema={CreateLoginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(false);
        const message = await login(values);
        if (message === 'SUCCESS') {
          router.push(`/${params.locale}/dashboard`);
          toast.success('login successfully');
        } else {
          toast.error(message)
        }
      }}
    >
      {({ submitForm, isSubmitting, setFieldValue, values, touched, errors }) => (
        <Form>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            <Grid item xs={12}>
              <Field
                id="userNameOrEmailInput"
                component={TextField}
                name="username_or_email"
                type="text"
                label="Username or Email"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onChange={(event) => {
                    setFieldValue("password", event.target.value);
                  }}
                  error={touched.password && Boolean(errors.password)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
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
            Login
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default LoginForm
