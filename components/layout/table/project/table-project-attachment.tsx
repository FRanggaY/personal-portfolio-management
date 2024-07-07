"use client";

import React, { useEffect, useState } from 'react';
import { Button, TablePagination, Tooltip, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { deleteProjectAttachment, getProjectAttachments, getProjectAttachment } from '@/data/repository/project/project-attachment-repository';
import { ResponseProjectAttachments, ProjectAttachment } from '@/types/project/project-attachment';
import { TableDataNotFound, TableLoading } from '../../../shared/table/table';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ModalConfirmation } from '@/components/shared/modal/modal';
import { toast } from 'sonner';
import { ResponseGeneralDynamicResource } from '@/types/general';
import { getAccessToken } from '@/actions/auth/auth-action';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { SortableColumn } from '@/components/shared/table/column';
import { defaultFormProjectAttachment } from '@/schemas/project/project-attachment';
import { addProjectAttachment, editProjectAttachment } from '@/actions/project/project-attachment-action';
import { ModalAddEditProjectAttachment, ModalViewProjectAttachment } from '../../modal/project/modal-project-attachment';
import { getProjectResource } from '@/data/repository/project/project-repository';

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

const TableProjectAttachment = ({ itemsPerPage, itemsPerPageList }: { itemsPerPage: number, itemsPerPageList: number[] }) => {
  const [projectAttachments, setProjectAttachments] = useState<ResponseProjectAttachments | null>(null);
  const [resource, setResource] = useState<ResponseGeneralDynamicResource | null>(null);
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState({
    id: '',
    show: false,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ locale: string; id: string }>();
  const page = searchParams.get('page') ?? 1;
  let limit = searchParams.get('limit') ?? itemsPerPage;
  const sortBy = searchParams.get('sort_by') ?? "name";
  const sortOrder = searchParams.get('sort_order') ?? "asc";
  // add and edit
  const [editId, setEditId] = useState('');
  const [form, setForm] = useState(defaultFormProjectAttachment);

  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const handleOpenAddEdit = () => setOpenAddEdit(true);
  const handleCloseAddEdit = () => {
    setOpenAddEdit(false);
    setEditId('');
    setForm(defaultFormProjectAttachment);
    setForm(defaultFormProjectAttachment => ({
      ...defaultFormProjectAttachment,
      project_id: params.id,
    }));
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
    setForm(defaultFormProjectAttachment);
    setForm(defaultFormProjectAttachment => ({
      ...defaultFormProjectAttachment,
      project_id: params.id,
    }));
    setImageData({
      name: '',
      image_url: '',
    });
  };

  const [imageUrl, setImageUrl] = useState<string>('');

  // put default to base limit if that outside range
  let parsedLimit = Number(limit);
  if (isNaN(parsedLimit) || !itemsPerPageList.includes(parsedLimit)) {
    limit = itemsPerPage;
  }

  const fetchProjectAttachments = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const projectAttachmentsData: ResponseProjectAttachments = await getProjectAttachments(accessToken.value, {
          project_id: params.id,
          offset: offset,
          size: size,
          sort_by: sortBy,
          sort_order: sortOrder,
        });
        setProjectAttachments(projectAttachmentsData);
      }
      setForm(defaultFormProjectAttachment => ({
        ...defaultFormProjectAttachment,
        project_id: params.id,
      }));
    } catch (error) {
      console.error("Error fetching projectAttachments:", error);
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
        const resourceData: ResponseGeneralDynamicResource = await getProjectResource(accessToken.value);
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
      const data = await getProjectAttachment(accessToken.value, id);
      if (Object.keys(data.data).length > 0) {
        const result = data.data;
        setForm({
          id: result.id,
          project_id: params.id,
          title: result.title,
          description: result.description ?? '',
          is_active: result.is_active ?? false,
          category: result.category,
          website_url: result.website_url ?? '',
          image: '',
        })
        setImageUrl(result.image_url);
        setEditId(result.id);
      }

      handleOpenAddEdit();
    }
  };

  // handle view
  const handleView = async (id: string) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const data = await getProjectAttachment(accessToken.value, id);
      if (Object.keys(data.data).length > 0) {
        const result = data.data;
        setForm({
          id: result.id,
          project_id: params.id,
          title: result.title,
          description: result.description ?? '',
          is_active: result.is_active ?? false,
          category: result.category,
          website_url: result.website_url ?? '',
          image: '',
        })
        setImageData({
          name: result.name,
          image_url: result.image_url
        })
        handleOpenView();
      }
    }
  };

  const handleDeleteProjectAttachment = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data = await deleteProjectAttachment(accessToken.value, isModalConfirmDelete.id)
        if (data == 'SUCCESS') {
          toast.success('project-attachment deleted successfully');
          fetchProjectAttachments(Number(page), Number(limit),);

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
      console.error("Error deleting project-attachment:", error);
      toast.error('project-attachment deleted failed');
    }
  }

  useEffect(() => {
    fetchProjectAttachments(Number(page), Number(limit),);
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

  if (loading) {
    // Show skeleton loading while data is being fetched
    return (
      <TableLoading
        itemsPerPage={itemsPerPage}
        columsPerPage={6}
      />
    );
  }

  if (!projectAttachments || projectAttachments?.data?.length === 0) {
    return <>
      {
        resource?.data.includes('create') &&
        <Button
          variant="contained"
          onClick={() => {
            setImageUrl('');
            handleOpenAddEdit();
          }}
          disabled={loading}
        >
          Create
        </Button>
      }
      <ModalAddEditProjectAttachment
        openAddEdit={openAddEdit}
        handleCloseAddEdit={handleCloseAddEdit}
        editId={editId}
        modalStyle={modalStyle}
        form={form}
        editProjectAttachment={editProjectAttachment}
        addProjectAttachment={addProjectAttachment}
        fetchProjectAttachments={fetchProjectAttachments}
        page={Number(page)}
        limit={Number(limit)}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
      />
      <TableDataNotFound />
    </>;
  }

  const { data, meta } = projectAttachments;

  return (
    <>
      {/* create button */}
      {
        resource?.data.includes('create') &&
        <Button
          variant="contained"
          onClick={() => {
            setImageUrl('');
            handleOpenAddEdit();
          }}
          disabled={loading}
        >
          Create
        </Button>
      }

      <ModalAddEditProjectAttachment
        openAddEdit={openAddEdit}
        handleCloseAddEdit={handleCloseAddEdit}
        editId={editId}
        modalStyle={modalStyle}
        form={form}
        editProjectAttachment={editProjectAttachment}
        addProjectAttachment={addProjectAttachment}
        fetchProjectAttachments={fetchProjectAttachments}
        page={Number(page)}
        limit={Number(limit)}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
      />

      {/* modal view */}
      {resource?.data.includes('view') &&
        <ModalViewProjectAttachment
          openView={openView}
          handleCloseView={handleCloseView}
          modalStyle={modalStyle}
          form={form}
          imageData={imageData}
        />
      }


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ACTION</TableCell>
              <SortableColumn columnKey="title" label="TITLE" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="description" label="DESCRIPTION" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="category" label="CATEGORY" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
              <SortableColumn columnKey="is_active" label="STATUS" sortBy={sortBy} sortOrder={sortOrder} router={router} searchParams={searchParams} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row: ProjectAttachment) => (
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
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">{row.category}</TableCell>
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
        onYes={handleDeleteProjectAttachment}
        loading={loading}
      />
    </>
  );
};

export default TableProjectAttachment;
