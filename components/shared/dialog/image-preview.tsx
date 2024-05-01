import React, { useState } from 'react';
import { Dialog, Avatar } from '@mui/material';
import Image from "next/image";

// Define type for image data
interface ImageData {
  name: string;
  image_url: string;
}

const useImagePreviewDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>('');

  const openDialog = (src: string) => {
    setImageSrc(src);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return {
    open,
    imageSrc,
    openDialog,
    closeDialog
  };
};

export const ImageAvatarPreview: React.FC<{ data: ImageData }> = ({ data }) => {
  const { open, imageSrc, openDialog, closeDialog } = useImagePreviewDialog();

  return (
    <div>
      <Avatar
        alt={data.name}
        onClick={() => openDialog(data.image_url)}
        src={data.image_url}
        sx={{ width: 150, height: 150 }}
      />

      <CustomDialog open={open} onClose={closeDialog} imageSrc={imageSrc} title={data.name} />
    </div>
  );
};

export const ImagePreview: React.FC<{ data: ImageData }> = ({ data }) => {
  const { open, imageSrc, openDialog, closeDialog } = useImagePreviewDialog();

  return (
    <div>
      <Image
        src={data.image_url}
        width={500}
        height={500}
        alt={data.name}
        id="imagePreview"
        layout="responsive"
        priority={true}
        onClick={() => openDialog(data.image_url)}
      />

      <CustomDialog open={open} onClose={closeDialog} imageSrc={imageSrc} title={data.name} />
    </div>
  );
};

const CustomDialog: React.FC<{ open: boolean; onClose: () => void; imageSrc: string; title: string }> = ({
  open,
  onClose,
  imageSrc,
  title
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <img src={imageSrc} alt={title} style={{ maxWidth: '100%', height: 'auto' }} />
    </Dialog>
  );
};
