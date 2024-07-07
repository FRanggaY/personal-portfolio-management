"use client";

import React, { useEffect, useState } from 'react';
import { Button, TablePagination, Tooltip, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { deleteExperience, getExperiences, getExperienceResource, getExperience } from '@/data/repository/experience/experience-repository';
import { ResponseExperiences, Experience } from '@/types/experience';
import { TableDataNotFound, TableLoading } from '../../shared/table/table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ModalConfirmation } from '@/components/shared/modal/modal';
import { toast } from 'sonner';
import { ResponseGeneralDynamicResource } from '@/types/general';
import { getAccessToken } from '@/actions/auth/auth-action';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SortableColumn } from '@/components/shared/table/column';
import { defaultFormExperience } from '@/schemas/experience';
import { addExperience, editExperience } from '@/actions/experience/experience-action';
import { Company, ResponseCompanies } from '@/types/company';
import { getCompanies } from '@/data/repository/company/company-repository';
import { ModalAddEditExperience, ModalViewExperience } from '../modal/modal-experience';
import { addExperienceTranslation, editExperienceTranslation } from '@/actions/experience/experience-translation-action';
import { getExperienceTranslation } from '@/data/repository/experience/experience-translation-repository';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // default width for smaller screens
  maxWidth: 400, // maximum width for larger screens
  '@media (min-width:600px)': {
    width: '80%',
  },
  '@media (min-width:960px)': {
    width: '60%',
  },
  '@media (min-width:1280px)': {
    width: '50%',
  },
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
  const params = useParams<{ locale: string; }>();
  const page = searchParams.get('page') ?? 1;
  let limit = searchParams.get('limit') ?? itemsPerPage;
  const sortBy = searchParams.get('sort_by') ?? "name";
  const sortOrder = searchParams.get('sort_order') ?? "asc";
  // add and edit
  const [editId, setEditId] = useState('');
  const [editIdTranslation, setEditIdTranslation] = useState('');
  const [form, setForm] = useState(defaultFormExperience)

  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const handleOpenAddEdit = () => setOpenAddEdit(true);
  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
    setEditId('');
    setEditIdTranslation('');
    setForm(defaultFormExperience)
  };
  // view
  const [openView, setOpenView] = React.useState(false);
  const handleOpenView = () => setOpenView(true);
  const handleCloseView = () => {
    setOpenView(false);
    setForm(defaultFormExperience)
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
  const handleEdit = async (id: string) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await getExperience(accessToken.value, id);
      if (Object.keys(data.data).length > 0) {
        const result = data.data;
        setForm({
          id: result.id,
          company_id: result.company.id,
          company: {
            id: '',
            name: '',
          },
          title: result.title,
          title_2nd: '',
          started_at: result.started_at,
          finished_at: result.finished_at ?? '',
          is_active: result.is_active ?? false,
          employee_type: '',
          location: '',
          location_type: '',
          description: '',
        })
        setEditId(result.id);
      }

      const dataTranslation = await getExperienceTranslation(accessToken.value, id, params.locale);
      if (Object.keys(dataTranslation.data).length > 0) {
        const result = dataTranslation.data;
        setForm(prevForm => ({
          ...prevForm,
          description: result.description ?? '',
          title_2nd: result.title ?? '',
          employee_type: result.employee_type ?? '',
          location: result.location ?? '',
          location_type: result.location_type ?? '',
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
      const data = await getExperience(accessToken.value, id);
      if (Object.keys(data.data).length > 0) {
        const result = data.data;
        setForm({
          id: result.id,
          title_2nd: '',
          company_id: result.company.id,
          company: result.company,
          title: result.title,
          started_at: result.started_at,
          finished_at: result.finished_at,
          is_active: result.is_active ?? false,
          employee_type: '',
          location: '',
          location_type: '',
          description: '',
        })
      }
      const dataTranslation = await getExperienceTranslation(accessToken.value, id, params.locale);
      if (Object.keys(dataTranslation.data).length > 0) {
        const result = dataTranslation.data;
        setForm(prevForm => ({
          ...prevForm,
          description: result.description ?? '',
          title_2nd: result.title ?? '',
          employee_type: result.employee_type ?? '',
          location: result.location ?? '',
          location_type: result.location_type ?? '',
        }));
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
          fetchExperiences(Number(page), Number(limit),);

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
      <ModalAddEditExperience
        openAddEdit={openAddEdit}
        handleCloseAddEdit={handleCloseAddEdit}
        editId={editId}
        editIdTranslation={editIdTranslation}
        params={params}
        modalStyle={modalStyle}
        form={form}
        editExperience={editExperience}
        editExperienceTranslation={editExperienceTranslation}
        addExperience={addExperience}
        addExperienceTranslation={addExperienceTranslation}
        fetchExperiences={fetchExperiences}
        page={Number(page)}
        limit={Number(limit)}
        companies={companies}
      />
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

      <ModalAddEditExperience
        openAddEdit={openAddEdit}
        handleCloseAddEdit={handleCloseAddEdit}
        editId={editId}
        editIdTranslation={editIdTranslation}
        params={params}
        modalStyle={modalStyle}
        form={form}
        editExperience={editExperience}
        editExperienceTranslation={editExperienceTranslation}
        addExperience={addExperience}
        addExperienceTranslation={addExperienceTranslation}
        fetchExperiences={fetchExperiences}
        page={Number(page)}
        limit={Number(limit)}
        companies={companies}
      />

      {/* modal view */}
      {resource?.data.includes('view') &&
        <ModalViewExperience
          openView={openView}
          handleCloseView={handleCloseView}
          modalStyle={modalStyle}
          form={form}
        />
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
        onYes={handleDeleteExperience}
        loading={loading}
      />
    </>
  );
};

export default TableExperience;
