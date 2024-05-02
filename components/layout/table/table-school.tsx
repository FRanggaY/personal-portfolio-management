"use client";

import React, { useEffect, useState } from 'react';
import { Button, TablePagination, Tooltip, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box, Typography, Grid, ButtonGroup, LinearProgress, FormGroup, FormControlLabel, Switch, CardContent, Card } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { deleteSchool, getSchools, getSchoolResource, getSchool } from '@/data/repository/school-repository';
import { ResponseSchools, School } from '@/types/school';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { SortableColumn } from '@/components/shared/table/column';
import { VisuallyHiddenInput } from '@/components/shared/button/button';
import { CreateSchoolSchema, EditSchoolSchema } from '@/schemas/school';
import { addSchool, editSchool } from '@/actions/school/school-action';
import { ImageAvatarPreview } from '@/components/shared/dialog/image-preview';

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

const TableSchool = ({ itemsPerPage, itemsPerPageList }: { itemsPerPage: number, itemsPerPageList: number[] }) => {
  const [schools, setSchools] = useState<ResponseSchools | null>(null);
  const [resource, setResource] = useState<ResponseGeneralDynamicResource | null>(null);
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState({
    id: '',
    show: false,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? 1;
  let limit = searchParams.get('limit') ?? itemsPerPage;
  const sortBy = searchParams.get('sort_by') ?? "name";
  const sortOrder = searchParams.get('sort_order') ?? "asc";
  // add and edit
  const [editId, setEditId] = useState('');
  const [form, setForm] = useState({
    id: '',
    code: '',
    name: '',
    logo: '',
    image: '',
    is_active: false,
    website_url: '',
  })

  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const handleOpenAddEdit = () => setOpenAddEdit(true);
  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
    setEditId('');
    setForm({
      id: '',
      code: '',
      name: '',
      logo: '',
      image: '',
      website_url: '',
      is_active: false,
    })
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
    setForm({
      id: '',
      code: '',
      name: '',
      logo: '',
      image: '',
      website_url: '',
      is_active: false,
    })
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

  const fetchSchools = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const schoolsData: ResponseSchools = await getSchools(accessToken.value, {
          offset: offset,
          size: size,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        setSchools(schoolsData);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
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
        const resourceData: ResponseGeneralDynamicResource = await getSchoolResource(accessToken.value);
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
  const handleEdit = (row: School) => {
    setForm({
      id: row.id,
      name: row.name,
      code: row.code,
      is_active: row.is_active ?? false,
      image: '',
      logo: '',
      website_url: row.website_url ?? '',
    })
    setImageUrl(row.image_url);
    setLogoUrl(row.logo_url);
    setEditId(row.id);
    handleOpenAddEdit();
  };

  // handle view
  const handleView = async (id: string) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await getSchool(accessToken.value, id);
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
        })
        setImageData({
          name: result.name,
          image_url: result.logo_url
        })
      }
      handleOpenView();
    }
  };

  const handleDeleteSchool = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data = await deleteSchool(accessToken.value, isModalConfirmDelete.id)
        if (data == 'SUCCESS') {
          toast.success('school deleted successfully');

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
      console.error("Error deleting school:", error);
      toast.error('school deleted failed');
    }
  }

  useEffect(() => {
    fetchSchools(Number(page), Number(limit),);
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
              validationSchema={editId ? CreateSchoolSchema : EditSchoolSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(false);

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
                    fetchSchools(Number(page), Number(limit),);
                    handleCloseAddEdit()
                    toast.success('school updated successfully');
                  } else {
                    toast.error(message)
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

  if (!schools || schools?.data?.length === 0) {
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

  const { data, meta } = schools;

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
            {data?.map((row: School) => (
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
                          handleEdit(row);
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
        onOk={handleDeleteSchool}
        loading={loading}
      />
    </>
  );
};

export default TableSchool;
