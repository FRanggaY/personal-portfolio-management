"use client";

import React, { useEffect, useState } from 'react';
import { Button, TablePagination, Tooltip, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { deleteSkillMapping, getSkillMappings, getSkillMapping } from '@/data/repository/skill-mapping-repository';
import { getSkills, getSkillResource } from '@/data/repository/skill/skill-repository';
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
import { defaultFormSkillMapping } from '@/schemas/skill-mapping';
import { addSkillMapping, editSkillMapping } from '@/actions/skill-mapping/skill-mapping-action';
import { Skill, ResponseSkills } from '@/types/skill';
import { ModalAddEditSkillMapping, ModalViewSkillMapping } from '../modal/modal-skill-mapping';

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
  const [form, setForm] = useState(defaultFormSkillMapping)

  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const handleOpenAddEdit = () => setOpenAddEdit(true);
  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
    setEditId('');
    setForm(defaultFormSkillMapping)
  };
  // view
  const [openView, setOpenView] = React.useState(false);
  const handleOpenView = () => setOpenView(true);
  const handleCloseView = () => {
    setOpenView(false);
    setForm(defaultFormSkillMapping)
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
          fetchSkillMappings(Number(page), Number(limit),);

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
        resource?.data.includes('create_skill_mapping') &&
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

      <ModalAddEditSkillMapping
        openAddEdit={openAddEdit}
        handleCloseAddEdit={handleCloseAddEdit}
        editId={editId}
        modalStyle={modalStyle}
        form={form}
        editSkillMapping={editSkillMapping}
        addSkillMapping={addSkillMapping}
        fetchSkillMappings={fetchSkillMappings}
        page={Number(page)}
        limit={Number(limit)}
        skills={skills}
      />
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
        resource?.data.includes('create_skill_mapping') &&
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

      <ModalAddEditSkillMapping
        openAddEdit={openAddEdit}
        handleCloseAddEdit={handleCloseAddEdit}
        editId={editId}
        modalStyle={modalStyle}
        form={form}
        editSkillMapping={editSkillMapping}
        addSkillMapping={addSkillMapping}
        fetchSkillMappings={fetchSkillMappings}
        page={Number(page)}
        limit={Number(limit)}
        skills={skills}
      />

      {/* modal view */}
      {resource?.data.includes('view_skill_mapping') &&
        <ModalViewSkillMapping
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
              <SortableColumn columnKey="skill_id" label="Skill" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="is_active" label="STATUS" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row: SkillMapping) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">
                  {resource?.data.includes('view_skill_mapping') &&
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
                  {resource?.data.includes('edit_skill_mapping') &&
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
                  {resource?.data.includes('delete_skill_mapping') &&
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
