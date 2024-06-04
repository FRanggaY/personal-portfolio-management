'use client';

import { Grid, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { useParams, usePathname, useRouter } from "next/navigation";

const EditLanguageForm = () => {
  const params = useParams<{ locale: string; }>();
  const router = useRouter();
  const pathName = usePathname();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="select-language-label">Language</InputLabel>
          <Select
            labelId="select-language-label"
            id="select-language"
            value={params.locale}
            onChange={(event) => {
              let replaceUrl = pathName.replace(params.locale, event.target.value);
              
              if(replaceUrl === '/'){
                replaceUrl = `/${event.target.value}`;
              }
              router.replace(replaceUrl);
            }}
          >
            <MenuItem value={'en'}>English</MenuItem>
            <MenuItem value={'id'}>Indonesia</MenuItem>
          </Select>
        </FormControl>
      </Grid>

    </Grid>
  )
}

export default EditLanguageForm
