import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { required } from "../../utils/validations";

export function DialogEditRoom({ onClose, open, item, establishments = [] }) {
  const theme = useTheme();

  // Form state
  const [state, setState] = useState(item);

  // Errors managment
  const initErrors = {
    name: {
      error: false,
      errorText: "",
    },
    establishment: {
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
    const { error, errorText } =
      name === "name"
        ? required("Name", value)
        : required("Establishment", value.name);
    setErrors((prevState) => ({ ...prevState, [name]: { error, errorText } }));
  };

  const title = item.name ? `Edit Room ${item.name}` : "Add Room";

  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle sx={{ background: theme.palette.primary.main }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <Stack spacing={2}>
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
            />
            {(item.establishmentName && (
              <FormControl style={{ margin: "8px" }} disabled>
                <InputLabel id="establishment-label">Establishment</InputLabel>
                <Select
                  sx={{ ma: 2 }}
                  name="establishment"
                  labelId="establishment-label"
                  value={state.establishmentName || ""}
                  label="Establishment"
                  onChange={handleChange}
                >
                  <MenuItem value={state.establishmentName}>
                    {state.establishmentName}
                  </MenuItem>
                </Select>
              </FormControl>
            )) ||
              (establishments !== null && (
                <FormControl style={{ margin: "8px" }}>
                  <InputLabel id="establishment-label">
                    Establishment
                  </InputLabel>
                  <Select
                    name="establishment"
                    labelId="establishment-label"
                    value={state.establishment || ""}
                    label="Establishment"
                    onChange={handleChange}
                    required
                    error={errors.establishment.error}
                  >
                    {establishments.length === 0 && (
                      <MenuItem disabled>No establishment available</MenuItem>
                    )}
                    {establishments.map((item) => (
                      <MenuItem key={item._id} value={item}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error={errors.establishment.error}>
                    {errors.establishment.errorText || " "}
                  </FormHelperText>
                </FormControl>
              ))}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={
            allErrors ||
            !state.name ||
            !(state.establishment || state.establishmentName)
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogEditRoom.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  establishments: PropTypes.array,
};
