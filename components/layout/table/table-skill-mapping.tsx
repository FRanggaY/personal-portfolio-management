"use client";

import React, { useEffect, useState } from 'react';
import { Button, TablePagination, Tooltip, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box, Typography, Grid, LinearProgress, FormGroup, FormControlLabel, Switch, CardContent, Card, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Formik, Form } from 'formik';
import { deleteSkillMapping, getSkillMappings, getSkillMapping } from '@/data/repository/skill-mapping-repository';
import { getSkills, getSkillResource } from '@/data/repository/skill-repository';
import { ResponseSkillMappings, SkillMapping } from '@/types/skill-mapping';
import { TableDataNotFound, TableLoading } from '../../shared/table/table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ModalConfirmation } from '@/components/shared/modal/modal';
import { toast } from 'sonner';
import { ResponseGeneralDynamicResource } from '@/types/general';
import { getAccessToken } from '@/actions/auth/auth-action';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { SortableColumn } from '@/components/shared/table/column';
import { CreateSkillMappingSchema, EditSkillMappingSchema } from '@/schemas/skill-mapping';
import { addSkillMapping, editSkillMapping } from '@/actions/skill-mapping/skill-mapping-action';
import { Skill, ResponseSkills } from '@/types/skill';

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

const TableSkillMapping = ({ itemsPerPage, itemsPerPageList }: { itemsPerPage: number, itemsPerPageList: number[] }) => {
  const [skillMappings, setSkillMappings] = useState<ResponseSkillMappings | null>(null);
  const [resource, setResource] = useState<ResponseGeneralDynamicResource | null>(null);
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState({
    id: '',
    show: false,
  });
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const router = useRouter();
  const params = useParams<{ locale: string; }>();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') ?? 1;
  let limit = searchParams.get('limit') ?? itemsPerPage;
  const sortBy = searchParams.get('sort_by') ?? "name";
  const sortOrder = searchParams.get('sort_order') ?? "asc";
  // add and edit
  const [editId, setEditId] = useState('');
  const [form, setForm] = useState({
    id: '',
    skill_id: '',
    skill: {
      id: '',
      name: '',
    },
    is_active: false,
  })

  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const handleOpenAddEdit = () => setOpenAddEdit(true);
  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
    setEditId('');
    setForm({
      id: '',
      skill_id: '',
      skill: {
        id: '',
        name: '',
      },
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
      skill_id: '',
      skill: {
        id: '',
        name: '',
      },
      is_active: false,
    })
  };

  // put default to base limit if that outside range
  let parsedLimit = Number(limit);
  if (isNaN(parsedLimit) || !itemsPerPageList.includes(parsedLimit)) {
    limit = itemsPerPage;
  }

  const fetchSkillsBatch = async (offset: number, size: number) => {
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data: ResponseSkills = await getSkills(accessToken.value, { offset, size, is_active: true });
        return data;
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw error; // Propagate the error to the caller
    }
  };

  const fetchSkills = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const skillsBatch = [];
      let currentOffset = offset;
      while (true) {
        const skillsData = await fetchSkillsBatch(currentOffset, size);
        if (skillsData) {
          skillsBatch.push(skillsData.data);
          if (skillsData.meta.offset < size) {
            // Break the loop if fetched skills are less than requested size
            break;
          }
        } else {
          break;
        }
        currentOffset += size; // Increment offset for the next batch
      }
      const allSkills = skillsBatch.flat(); // Flatten the array of batches
      if (allSkills != null) {
        setSkills(allSkills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillMappings = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const skillMappingsData: ResponseSkillMappings = await getSkillMappings(accessToken.value, {
          offset: offset,
          size: size,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        setSkillMappings(skillMappingsData);
      }
    } catch (error) {
      console.error("Error fetching skillMappings:", error);
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
        const resourceData: ResponseGeneralDynamicResource = await getSkillResource(accessToken.value);
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
  const handleEdit = (row: SkillMapping) => {
    setForm({
      id: row.id,
      skill_id: row.skill.id,
      skill: {
        id: '',
        name: '',
      },
      is_active: row.is_active ?? false,
    })
    setEditId(row.id);
    handleOpenAddEdit();
  };

  // handle view
  const handleView = async (id: string) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await getSkillMapping(accessToken.value, id);
      if (Object.keys(data.data).length > 0) {
        const result = data.data;
        setForm({
          id: result.id,
          skill_id: result.skill.id,
          skill: result.skill,
          is_active: result.is_active ?? false,
        })
      }
      handleOpenView();
    }
  };

  const handleDeleteSkillMapping = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data = await deleteSkillMapping(accessToken.value, isModalConfirmDelete.id)
        if (data == 'SUCCESS') {
          toast.success('skillMapping deleted successfully');

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
      console.error("Error deleting skillMapping:", error);
      toast.error('skillMapping deleted failed');
    }
  }

  useEffect(() => {
    fetchSkillMappings(Number(page), Number(limit),);
  }, [page, limit, sortBy, sortOrder]);

  useEffect(() => {
    fetchResource();
    fetchSkills(1, 10);
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
        aria-labelledby="modal-skillMapping-title"
        aria-describedby="modal-skillMapping-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-skillMapping-title" variant="h6" component="h2">
            {editId ? 'Edit SkillMapping' : 'Add SkillMapping'}
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Formik
              initialValues={form}
              validationSchema={editId ? CreateSkillMappingSchema : EditSkillMappingSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(false);

                const formData = new FormData();
                formData.append('skill_id', `${values.skill_id}`);
                if (editId) { // update skillMapping
                  formData.append('is_active', `${values.is_active}`);

                  const message = await editSkillMapping(editId, formData);
                  if (message === 'SUCCESS') {
                    fetchSkillMappings(Number(page), Number(limit),);
                    handleCloseAddEdit()
                    toast.success('skillMapping updated successfully');
                  } else {
                    toast.error(message)
                  }
                } else { // create new skillMapping
                  const message = await addSkillMapping(formData);
                  if (message === 'SUCCESS') {
                    fetchSkillMappings(Number(page), Number(limit),);
                    handleCloseAddEdit()
                    toast.success('skillMapping created successfully');
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
                        <InputLabel id="select-skill_id-label">Skill</InputLabel>
                        <Select
                          labelId="select-skill_id-label"
                          id="select-skill_id"
                          value={values.skill_id}
                          label="Skill"
                          onChange={(event) => {
                            setFieldValue("skill_id", event.target.value);
                          }}
                          error={touched.skill_id && Boolean(errors.skill_id)}
                        >
                          {
                            skills?.map((data: Skill) => {
                              return <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                      <FormHelperText>{touched.skill_id && errors.skill_id}</FormHelperText>
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

  if (!skillMappings || skillMappings?.data?.length === 0) {
    return <>
      <Button
        variant="contained"
        href={`/${params.locale}/panel/skill`}
      >
        Back
      </Button>
      {
        resource?.data.includes('create_skill') &&
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
      <ModalAddEdit />
      <TableDataNotFound />
    </>;
  }

  const { data, meta } = skillMappings;

  return (
    <>
      {/* create button */}
      <Button
        variant="contained"
        href={`/${params.locale}/panel/skill`}
      >
        Back
      </Button>
      {
        resource?.data.includes('create_skill') &&
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
      {resource?.data.includes('view_skill') &&
        <Modal
          open={openView}
          onClose={handleCloseView}
          aria-labelledby="modal-view-skillMapping-title"
          aria-describedby="modal-view-skillMapping-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-view-skillMapping-title" variant="h6" component="h2">
              View SkillMapping
            </Typography>
            <Card sx={{ mt: 1 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14, marginTop: '10px' }} color="text.secondary" gutterBottom>
                  {form.skill.name}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {
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
              <SortableColumn columnKey="skill_id" label="Skill" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="is_active" label="STATUS" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row: SkillMapping) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">
                  {resource?.data.includes('view_skill') &&
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
                  {resource?.data.includes('edit_skill') &&
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
                  {resource?.data.includes('delete_skill') &&
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
                <TableCell align="left">{row.skill.name}</TableCell>
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
        onOk={handleDeleteSkillMapping}
        loading={loading}
      />
    </>
  );
};

export default TableSkillMapping;
