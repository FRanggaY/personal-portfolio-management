"use client";

import React, { useEffect, useState } from 'react';
import { Button, TablePagination, Tooltip, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box, Typography, Grid, LinearProgress, FormGroup, FormControlLabel, Switch, CardContent, Card, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { deleteEducation, getEducations, getEducationResource, getEducation } from '@/data/repository/education-repository';
import { ResponseEducations, Education } from '@/types/education';
import { TableDataNotFound, TableLoading } from '../../shared/table/table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ModalConfirmation } from '@/components/shared/modal/modal';
import { toast } from 'sonner';
import { ResponseGeneralDynamicResource } from '@/types/general';
import { getAccessToken } from '@/actions/auth/auth-action';
import { useRouter, useSearchParams } from 'next/navigation';
import { SortableColumn } from '@/components/shared/table/column';
import { CreateEducationSchema, EditEducationSchema } from '@/schemas/education';
import { addEducation, editEducation } from '@/actions/education/education-action';
import { School, ResponseSchools } from '@/types/school';
import { getSchools } from '@/data/repository/school-repository';

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

const TableEducation = ({ itemsPerPage, itemsPerPageList }: { itemsPerPage: number, itemsPerPageList: number[] }) => {
  const [educations, setEducations] = useState<ResponseEducations | null>(null);
  const [resource, setResource] = useState<ResponseGeneralDynamicResource | null>(null);
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState({
    id: '',
    show: false,
  });
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<School[] | null>(null);
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
    school_id: '',
    school: {
      id: '',
      name: '',
    },
    title: '',
    started_at: '',
    finished_at: '',
    is_active: false,
  })

  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const handleOpenAddEdit = () => setOpenAddEdit(true);
  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
    setEditId('');
    setForm({
      id: '',
      school_id: '',
      school: {
        id: '',
        name: '',
      },
      title: '',
      started_at: '',
      finished_at: '',
      is_active: false,
    })
  };
  // view
  const [openView, setOpenView] = React.useState(false);
  const handleOpenView = () => setOpenView(true);
  const handleCloseView = () => {
    setOpenView(false);
    setForm({
      id: '',
      school_id: '',
      school: {
        id: '',
        name: '',
      },
      title: '',
      started_at: '',
      finished_at: '',
      is_active: false,
    })
  };

  // put default to base limit if that outside range
  let parsedLimit = Number(limit);
  if (isNaN(parsedLimit) || !itemsPerPageList.includes(parsedLimit)) {
    limit = itemsPerPage;
  }

  const fetchSchoolsBatch = async (offset: number, size: number) => {
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data: ResponseSchools = await getSchools(accessToken.value, { offset, size, is_active: true });
        return data;
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
      throw error; // Propagate the error to the caller
    }
  };

  const fetchSchools = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const schoolsBatch = [];
      let currentOffset = offset;
      while (true) {
        const schoolsData = await fetchSchoolsBatch(currentOffset, size);
        if (schoolsData) {
          schoolsBatch.push(schoolsData.data);
          if (schoolsData.meta.offset < size) {
            // Break the loop if fetched schools are less than requested size
            break;
          }
        } else {
          break;
        }
        currentOffset += size; // Increment offset for the next batch
      }
      const allSchools = schoolsBatch.flat(); // Flatten the array of batches
      if (allSchools != null) {
        setSchools(allSchools);
      }
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEducations = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const educationsData: ResponseEducations = await getEducations(accessToken.value, {
          offset: offset,
          size: size,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        setEducations(educationsData);
      }
    } catch (error) {
      console.error("Error fetching educations:", error);
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
        const resourceData: ResponseGeneralDynamicResource = await getEducationResource(accessToken.value);
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
  const handleEdit = (row: Education) => {
    setForm({
      id: row.id,
      school_id: row.school.id,
      school: {
        id: '',
        name: '',
      },
      title: row.title,
      started_at: row.started_at,
      finished_at: row.finished_at,
      is_active: row.is_active ?? false,
    })
    setEditId(row.id);
    handleOpenAddEdit();
  };

  // handle view
  const handleView = async (id: string) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await getEducation(accessToken.value, id);
      if (Object.keys(data.data).length > 0) {
        const result = data.data;
        setForm({
          id: result.id,
          school_id: result.school.id,
          school: result.school,
          title: result.title,
          started_at: result.started_at,
          finished_at: result.finished_at,
          is_active: result.is_active ?? false,
        })
      }
      handleOpenView();
    }
  };

  const handleDeleteEducation = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data = await deleteEducation(accessToken.value, isModalConfirmDelete.id)
        if (data == 'SUCCESS') {
          toast.success('education deleted successfully');

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
      console.error("Error deleting education:", error);
      toast.error('education deleted failed');
    }
  }

  useEffect(() => {
    fetchEducations(Number(page), Number(limit),);
  }, [page, limit, sortBy, sortOrder]);

  useEffect(() => {
    fetchResource();
    fetchSchools(1, 10);
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
        aria-labelledby="modal-education-title"
        aria-describedby="modal-education-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-education-title" variant="h6" component="h2">
            {editId ? 'Edit Education' : 'Add Education'}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Formik
              initialValues={form}
              validationSchema={editId ? CreateEducationSchema : EditEducationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(false);

                const formData = new FormData();
                formData.append('school_id', `${values.school_id}`);
                formData.append('title', `${values.title}`);
                formData.append('started_at', `${values.started_at}`);
                formData.append('finished_at', `${values.finished_at}`);
                if (editId) { // update education
                  formData.append('is_active', `${values.is_active}`);

                  const message = await editEducation(editId, formData);
                  if (message === 'SUCCESS') {
                    fetchEducations(Number(page), Number(limit),);
                    handleCloseAddEdit()
                    toast.success('education updated successfully');
                  } else {
                    toast.error(message)
                  }
                } else { // create new education
                  const message = await addEducation(formData);
                  if (message === 'SUCCESS') {
                    fetchEducations(Number(page), Number(limit),);
                    handleCloseAddEdit()
                    toast.success('education created successfully');
                  } else {
                    toast.error(message)
                  }
                }

              }}
            >
              {({ submitForm, isSubmitting, setFieldValue, values, touched, errors }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="select-school_id-label">School</InputLabel>
                        <Select
                          labelId="select-school_id-label"
                          id="select-school_id"
                          value={values.school_id}
                          label="School"
                          onChange={(event) => {
                            setFieldValue("school_id", event.target.value);
                          }}
                          error={touched.school_id && Boolean(errors.school_id)}
                        >
                          {
                            schools?.map((data: School) => {
                              return <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                      <FormHelperText>{touched.school_id && errors.school_id}</FormHelperText>
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        id="educationTitleInput"
                        component={TextField}
                        name="title"
                        type="text"
                        label="Title"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="educationStartedAtInput"
                        component={TextField}
                        name="started_at"
                        type="date"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="educationfinishedAtInput"
                        component={TextField}
                        name="finished_at"
                        type="date"
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

  if (!educations || educations?.data?.length === 0) {
    return <>
      {
        resource?.data.includes('create') &&
        <Button
          variant="contained"
          onClick={() => {
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

  const { data, meta } = educations;

  return (
    <>
      {/* create button */}
      {
        resource?.data.includes('create') &&
        <Button
          variant="contained"
          onClick={() => {
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
          aria-labelledby="modal-view-education-title"
          aria-describedby="modal-view-education-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-view-education-title" variant="h6" component="h2">
              View Education
            </Typography>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14, marginTop: '10px' }} color="text.secondary" gutterBottom>
                  {form.school.name} - ({form.started_at}) - ({form.finished_at})
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {form.title} {
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
              <SortableColumn columnKey="title" label="Title" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="school_id" label="School" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="started_at" label="Started At" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="finished_at" label="Finished At" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="is_active" label="STATUS" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row: Education) => (
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
                <TableCell align="left">{row.title}</TableCell>
                <TableCell align="left">{row.school.name}</TableCell>
                <TableCell align="left">{row.started_at}</TableCell>
                <TableCell align="left">{row.finished_at}</TableCell>
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
        onOk={handleDeleteEducation}
        loading={loading}
      />
    </>
  );
};

export default TableEducation;
