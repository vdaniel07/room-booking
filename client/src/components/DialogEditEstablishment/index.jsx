import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { required } from "../../utils/validations";

export function DialogEditEstablishment({ onClose, open, item }) {
  const theme = useTheme();

  // Form state
  const [state, setState] = useState(item);

  // Errors managment
  const initErrors = {
    name: {
      error: false,
      errorText: "",
    },
  };
  const [errors, setErrors] = useState(initErrors);
  const allErrors = useMemo(
    () => !Object.values(errors).every((v) => v.error === false),
    [errors],
  );

  // Init state at open dialog
  useEffect(() => {
    setState(item);
  }, [item]);

  const handleCancel = () => {
    setErrors(initErrors);
    onClose(null);
  };
  const handleSave = () => {
    setErrors(initErrors);
    onClose(state);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
    const { error, errorText } = required("Name", value);
    setErrors((prevState) => ({ ...prevState, [name]: { error, errorText } }));
  };

  const title = item.name
    ? `Edit Establishment ${item.name}`
    : "Add Establishment";

  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle sx={{ background: theme.palette.primary.main }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 3, pb: 4 }}>
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            value={state.name || ""}
            onChange={handleChange}
            autoFocus
            required
            error={errors.name.error}
            helperText={errors.name.errorText || " "}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={allErrors || !state.name}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogEditEstablishment.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
};
