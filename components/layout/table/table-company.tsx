"use client";

import React, { useEffect, useState } from 'react';
import { Button, TablePagination, Tooltip, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box, Typography, Grid, ButtonGroup, LinearProgress, FormGroup, FormControlLabel, Switch, CardContent, Card } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { deleteCompany, getCompanies, getCompanyResource, getCompany } from '@/data/repository/company/company-repository';
import { ResponseCompanies, Company } from '@/types/company';
import { TableDataNotFound, TableLoading } from '../../shared/table/table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Image from "next/image";
import { ModalConfirmation } from '@/components/shared/modal/modal';
import { toast } from 'sonner';
import { ResponseGeneralDynamicResource } from '@/types/general';
import { getAccessToken } from '@/actions/auth/auth-action';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SortableColumn } from '@/components/shared/table/column';
import { VisuallyHiddenInput } from '@/components/shared/button/button';
import { CreateCompanySchema, EditCompanySchema } from '@/schemas/company';
import { addCompany, editCompany } from '@/actions/company/company-action';
import { ImageAvatarPreview } from '@/components/shared/dialog/image-preview';
import { getCompanyTranslation } from '@/data/repository/company/company-translation-repository';
import { addCompanyTranslation, editCompanyTranslation } from '@/actions/company/company-translation-action';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const defaultForm = {
  id: '',
  code: '',
  name: '',
  name_2nd: '',
  logo: '',
  image: '',
  is_active: false,
  website_url: '',
  address: '',
  description: '',
}

const TableCompany = ({ itemsPerPage, itemsPerPageList }: { itemsPerPage: number, itemsPerPageList: number[] }) => {
  const [companies, setCompanies] = useState<ResponseCompanies | null>(null);
  const [resource, setResource] = useState<ResponseGeneralDynamicResource | null>(null);
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState({
    id: '',
    show: false,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ locale: string; }>();
  const page = searchParams.get('page') ?? 1;
  let limit = searchParams.get('limit') ?? itemsPerPage;
  const sortBy = searchParams.get('sort_by') ?? "name";
  const sortOrder = searchParams.get('sort_order') ?? "asc";
  // add and edit
  const [editId, setEditId] = useState('');
  const [editIdTranslation, setEditIdTranslation] = useState('');
  const [form, setForm] = useState(defaultForm);

  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const handleOpenAddEdit = () => setOpenAddEdit(true);
  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
    setEditId('');
    setEditIdTranslation('');
    setForm(defaultForm)
  };
  // view
  const [imageData, setImageData] = useState({
    name: '',
    image_url: '',
  })
  const [openView, setOpenView] = React.useState(false);
  const handleOpenView = () => setOpenView(true);
  const handleCloseView = () => {
    setOpenView(false);
    setForm(defaultForm)
    setImageData({
      name: '',
      image_url: '',
    });
  };

  const [imageUrl, setImageUrl] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');

  // put default to base limit if that outside range
  let parsedLimit = Number(limit);
  if (isNaN(parsedLimit) || !itemsPerPageList.includes(parsedLimit)) {
    limit = itemsPerPage;
  }

  const fetchCompanies = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const companiesData: ResponseCompanies = await getCompanies(accessToken.value, {
          offset: offset,
          size: size,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        setCompanies(companiesData);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      // reset
      setLoading(false);
    }
  };

  const fetchResource = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const resourceData: ResponseGeneralDynamicResource = await getCompanyResource(accessToken.value);
        setResource(resourceData);
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
    } finally {
      // reset
      setLoading(false);
    }
  };

  // handle edit
  const handleEdit = async (id: string) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await getCompany(accessToken.value, id);
      if (Object.keys(data.data).length > 0) {
        const result = data.data;
        setForm({
          id: result.id,
          name: result.name,
          code: result.code,
          is_active: result.is_active ?? false,
          image: '',
          logo: '',
          website_url: result.website_url ?? '',
          description: '',
          name_2nd: '',
          address: '',
        })
        setImageUrl(result.image_url);
        setLogoUrl(result.logo_url);
        setEditId(result.id);
      }

      const dataTranslation = await getCompanyTranslation(accessToken.value, id, params.locale);
      if (Object.keys(dataTranslation.data).length > 0) {
        const result = dataTranslation.data;
        setForm(prevForm => ({
          ...prevForm,
          description: result.description ?? '',
          name_2nd: result.name ?? '',
          address: result.address ?? '',
        }));
        setEditIdTranslation(result.id);
      } else {
        setEditIdTranslation('');
      }
      handleOpenAddEdit();
    }
  };

  // handle view
  const handleView = async (id: string) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await getCompany(accessToken.value, id);
      if (Object.keys(data.data).length > 0) {
        const result = data.data;
        setForm({
          id: result.id,
          name: result.name,
          code: result.code,
          is_active: result.is_active ?? false,
          image: '',
          logo: '',
          website_url: result.website_url ?? '',
          name_2nd: '',
          address: '',
          description: '',
        })
        setImageData({
          name: result.name,
          image_url: result.logo_url
        })

        const dataTranslation = await getCompanyTranslation(accessToken.value, id, params.locale);
        if (Object.keys(dataTranslation.data).length > 0) {
          const result = dataTranslation.data;
          setForm(prevForm => ({
            ...prevForm,
            description: result.description ?? '',
            name_2nd: result.name ?? '',
            address: result.address ?? '',
          }));
        }
      }
      handleOpenView();
    }
  };

  const handleDeleteCompany = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data = await deleteCompany(accessToken.value, isModalConfirmDelete.id)
        if (data == 'SUCCESS') {
          toast.success('company deleted successfully');

          const params = new URLSearchParams(searchParams);
          params.set("page", String(1));
          const updatedSearch = `?${params.toString()}`;
          const newPath = `${window.location.pathname}${updatedSearch}`;
          router.replace(newPath);
        } else {
          toast.error(data);
        }
      }
      // reset
      setIsModalConfirmDelete({
        id: '',
        show: false,
      })
      setLoading(false);
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error('company deleted failed');
    }
  }

  useEffect(() => {
    fetchCompanies(Number(page), Number(limit),);
  }, [page, limit, sortBy, sortOrder]);

  useEffect(() => {
    fetchResource();
  }, [])

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const offset = Number(page + 1);
    const params = new URLSearchParams(searchParams);
    params.set("page", offset.toString());
    const updatedSearch = `?${params.toString()}`;
    const newPath = `${window.location.pathname}${updatedSearch}`;
    router.push(newPath);
  };

  const handleChangeItemPerPageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const size = Number(event.target.value)
    const offset = 1;
    const params = new URLSearchParams(searchParams);
    params.set("limit", size.toString());
    params.set("page", offset.toString());
    const updatedSearch = `?${params.toString()}`;
    const newPath = `${window.location.pathname}${updatedSearch}`;
    router.push(newPath);
  };

  const ModalAddEdit = () => {
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
              validationSchema={editId ? CreateCompanySchema : EditCompanySchema}
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
    )
  }

  if (loading) {
    // Show skeleton loading while data is being fetched
    return (
      <TableLoading
        itemsPerPage={itemsPerPage}
        columsPerPage={6}
      />
    );
  }

  if (!companies || companies?.data?.length === 0) {
    return <>
      {
        resource?.data.includes('create') &&
        <Button
          variant="contained"
          onClick={() => {
            setImageUrl('');
            setLogoUrl('');
            handleOpenAddEdit();
          }}
          disabled={loading}
        >
          Create
        </Button>
      }
      <ModalAddEdit />
      <TableDataNotFound />
    </>;
  }

  const { data, meta } = companies;

  return (
    <>
      {/* create button */}
      {
        resource?.data.includes('create') &&
        <Button
          variant="contained"
          onClick={() => {
            setImageUrl('');
            setLogoUrl('');
            handleOpenAddEdit();
          }}
          disabled={loading}
        >
          Create
        </Button>
      }

      <ModalAddEdit />

      {/* modal view */}
      {resource?.data.includes('view') &&
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
      }


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ACTION</TableCell>
              <SortableColumn columnKey="code" label="CODE" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="name" label="NAME" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="is_active" label="STATUS" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row: Company) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">
                  {resource?.data.includes('view') &&
                    <Tooltip title="View">
                      <Button
                        color="info"
                        onClick={() => {
                          handleView(row.id);
                        }}
                      >
                        <VisibilityIcon />
                      </Button>
                    </Tooltip>
                  }
                  {resource?.data.includes('edit') &&
                    <Tooltip title="Edit">
                      <Button
                        color="warning"
                        onClick={() => {
                          handleEdit(row.id);
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                  }
                  {resource?.data.includes('delete') &&
                    <Tooltip title="Delete">
                      <Button
                        onClick={() => setIsModalConfirmDelete({
                          id: row.id,
                          show: true,
                        })}
                        color="error"
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  }
                </TableCell>
                <TableCell align="left">{row.code}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">
                  {
                    row.is_active ?
                      <Chip label="active" color="success"></Chip> :
                      <Chip label="disabled" color="error"></Chip>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={itemsPerPageList}
        component="div"
        count={meta?.total}
        rowsPerPage={meta?.size}
        page={meta?.offset - 1}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleChangeItemPerPageSelect}
      />



      {/* modal confirmation delete */}
      <ModalConfirmation
        title={'Delete Confirmation'}
        description={"Are you sure you want to delete?"}
        confirmationText={'Yes'}
        open={isModalConfirmDelete.show}
        onCancel={() => setIsModalConfirmDelete({
          id: '',
          show: false,
        })}
        onOk={handleDeleteCompany}
        loading={loading}
      />
    </>
  );
};

export default TableCompany;
