import PropTypes from "prop-types";
import { DialogTitle, Dialog, DialogActions, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function DialogDelete({ onClose, open, item }) {
  const theme = useTheme();

  const handleCancel = () => {
    onClose(false);
  };
  const handleSave = () => {
    onClose(true);
  };

  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle
        sx={{ background: theme.palette.warning.main }}
      >{`Are you sure to delete: ${item} ?`}</DialogTitle>
      <DialogActions sx={{ mt: 4 }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogDelete.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  item: PropTypes.string.isRequired,
};
