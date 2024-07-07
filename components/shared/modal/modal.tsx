import { Dialog, DialogTitle, IconButton, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

export const ModalConfirmation = (
  { 
    title,
    description,
    confirmationText,
    open,
    onCancel,
    onYes,
    loading
  }: { 
    title: string, 
    description: string,
    confirmationText: string,
    open: boolean,
    onCancel: () => void,
    onYes: () => void,
    loading: boolean
  }) => {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        <span>{title}</span>
        <IconButton style={{ float: "right" }} onClick={onCancel}>
          <CloseIcon color="primary" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={onYes}
          disabled={loading}
        >
          {loading ? "Loading..." : confirmationText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
