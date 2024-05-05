"use client";

import React, { useEffect, useState } from 'react';
import { Button, TablePagination, Tooltip, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box, Typography, Grid, LinearProgress, FormGroup, FormControlLabel, Switch, CardContent, Card, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-mui';
import { deleteExperience, getExperiences, getExperienceResource, getExperience } from '@/data/repository/experience-repository';
import { ResponseExperiences, Experience } from '@/types/experience';
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
import { CreateExperienceSchema, EditExperienceSchema } from '@/schemas/experience';
import { addExperience, editExperience } from '@/actions/experience/experience-action';
import { Company, ResponseCompanies } from '@/types/company';
import { getCompanies } from '@/data/repository/company-repository';

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

const TableExperience = ({ itemsPerPage, itemsPerPageList }: { itemsPerPage: number, itemsPerPageList: number[] }) => {
  const [experiences, setExperiences] = useState<ResponseExperiences | null>(null);
  const [resource, setResource] = useState<ResponseGeneralDynamicResource | null>(null);
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState({
    id: '',
    show: false,
  });
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[] | null>(null);
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
    company_id: '',
    company: {
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
      company_id: '',
      company: {
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
      company_id: '',
      company: {
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

  const fetchCompaniesBatch = async (offset: number, size: number) => {
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data: ResponseCompanies = await getCompanies(accessToken.value, { offset, size, is_active: true });
        return data;
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error; // Propagate the error to the caller
    }
  };

  const fetchCompanies = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const companiesBatch = [];
      let currentOffset = offset;
      while (true) {
        const companiesData = await fetchCompaniesBatch(currentOffset, size);
        if (companiesData) {
          companiesBatch.push(companiesData.data);
          if (companiesData.meta.offset < size) {
            // Break the loop if fetched companies are less than requested size
            break;
          }
        } else {
          break;
        }
        currentOffset += size; // Increment offset for the next batch
      }
      const allCompanies = companiesBatch.flat(); // Flatten the array of batches
      if (allCompanies != null) {
        setCompanies(allCompanies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const experiencesData: ResponseExperiences = await getExperiences(accessToken.value, {
          offset: offset,
          size: size,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        setExperiences(experiencesData);
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
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
        const resourceData: ResponseGeneralDynamicResource = await getExperienceResource(accessToken.value);
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
  const handleEdit = (row: Experience) => {
    setForm({
      id: row.id,
      company_id: row.company.id,
      company: {
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
      const data = await getExperience(accessToken.value, id);
      if (Object.keys(data.data).length > 0) {
        const result = data.data;
        setForm({
          id: result.id,
          company_id: result.company.id,
          company: result.company,
          title: result.title,
          started_at: result.started_at,
          finished_at: result.finished_at,
          is_active: result.is_active ?? false,
        })
      }
      handleOpenView();
    }
  };

  const handleDeleteExperience = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data = await deleteExperience(accessToken.value, isModalConfirmDelete.id)
        if (data == 'SUCCESS') {
          toast.success('experience deleted successfully');

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
      console.error("Error deleting experience:", error);
      toast.error('experience deleted failed');
    }
  }

  useEffect(() => {
    fetchExperiences(Number(page), Number(limit),);
  }, [page, limit, sortBy, sortOrder]);

  useEffect(() => {
    fetchResource();
    fetchCompanies(1, 10);
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
        aria-labelledby="modal-experience-title"
        aria-describedby="modal-experience-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-experience-title" variant="h6" component="h2">
            {editId ? 'Edit Experience' : 'Add Experience'}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Formik
              initialValues={form}
              validationSchema={editId ? CreateExperienceSchema : EditExperienceSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(false);

                const formData = new FormData();
                formData.append('company_id', `${values.company_id}`);
                formData.append('title', `${values.title}`);
                formData.append('started_at', `${values.started_at}`);
                formData.append('finished_at', `${values.finished_at}`);
                if (editId) { // update experience
                  formData.append('is_active', `${values.is_active}`);

                  const message = await editExperience(editId, formData);
                  if (message === 'SUCCESS') {
                    fetchExperiences(Number(page), Number(limit),);
                    handleCloseAddEdit()
                    toast.success('experience updated successfully');
                  } else {
                    toast.error(message)
                  }
                } else { // create new experience
                  const message = await addExperience(formData);
                  if (message === 'SUCCESS') {
                    fetchExperiences(Number(page), Number(limit),);
                    handleCloseAddEdit()
                    toast.success('experience created successfully');
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
                        <InputLabel id="select-company_id-label">Company</InputLabel>
                        <Select
                          labelId="select-company_id-label"
                          id="select-company_id"
                          value={values.company_id}
                          label="Company"
                          onChange={(event) => {
                            setFieldValue("company_id", event.target.value);
                          }}
                          error={touched.company_id && Boolean(errors.company_id)}
                        >
                          {
                            companies?.map((data: Company) => {
                              return <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                      <FormHelperText>{touched.company_id && errors.company_id}</FormHelperText>
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        id="experienceTitleInput"
                        component={TextField}
                        name="title"
                        type="text"
                        label="Title"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="experienceStartedAtInput"
                        component={TextField}
                        name="started_at"
                        type="date"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="experiencefinishedAtInput"
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

  if (!experiences || experiences?.data?.length === 0) {
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

  const { data, meta } = experiences;

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
          aria-labelledby="modal-view-experience-title"
          aria-describedby="modal-view-experience-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-view-experience-title" variant="h6" component="h2">
              View Experience
            </Typography>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14, marginTop: '10px' }} color="text.secondary" gutterBottom>
                  {form.company.name} - ({form.started_at}) - ({form.finished_at})
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
              <SortableColumn columnKey="company_id" label="Company" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="started_at" label="Started At" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="finished_at" label="Finished At" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="is_active" label="STATUS" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row: Experience) => (
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
                <TableCell align="left">{row.company.name}</TableCell>
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
        onOk={handleDeleteExperience}
        loading={loading}
      />
    </>
  );
};

export default TableExperience;
