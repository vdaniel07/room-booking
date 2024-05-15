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
import { required, emailFormat } from "../../utils/validations";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export function DialogEditPatient({ onClose, open, item, rooms = [] }) {
  const theme = useTheme();

  // Form state
  const [state, setState] = useState(item);

  // Errors managment
  const initErrors = {
    firstname: {
      error: false,
      errorText: "",
    },
    lastname: {
      error: false,
      errorText: "",
    },
    email: {
      error: false,
      errorText: "",
    },
    birthdate: {
      error: false,
      errorText: "",
    },
    room: {
      error: false,
      errorText: "",
    },
  };
  const [errors, setErrors] = useState(initErrors);
  const allErrors = useMemo(
    () => !Object.values(errors).every((v) => v.error === false),
    [errors],
  );
  const validField = useMemo(() => {
    return (
      !!state.firstname &&
      !!state.lastname &&
      !!state.email &&
      !!state.birthdate &&
      !!state.room?.name
    );
  }, [state]);

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
    let res = {};
    if (name === "firstname" || name === "lastname") {
      res = required(name, value);
    } else if (name === "room") {
      res = required("Room", value.name);
    } else if (name === "email") {
      res = emailFormat(value);
    }
    const { error, errorText } = res;
    setErrors((prevState) => ({ ...prevState, [name]: { error, errorText } }));
  };

  const handleChangeDate = (value) => {
    setState((prevState) => {
      return { ...prevState, birthdate: value };
    });
  };

  const handleChangeRoomName = () => {
    const stateTmp = { ...state };
    delete stateTmp.roomId;
    delete stateTmp.roomName;
    setState(stateTmp);
  };

  const title = item.name ? `Edit Patient ${item.name}` : "Add Patient";

  return (
    <Dialog onClose={handleCancel} open={open}>
      <DialogTitle sx={{ background: theme.palette.primary.main }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <Stack spacing={2}>
            <TextField
              name="firstname"
              label="First Name"
              variant="outlined"
              value={state.firstname || ""}
              onChange={handleChange}
              autoFocus
              required
              error={errors.firstname.error}
              helperText={errors.firstname.errorText || " "}
            />
            <TextField
              name="lastname"
              label="Last Name"
              variant="outlined"
              value={state.lastname || ""}
              onChange={handleChange}
              required
              error={errors.lastname.error}
              helperText={errors.lastname.errorText || " "}
            />
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              value={state.email || ""}
              onChange={handleChange}
              required
              error={errors.email.error}
              helperText={errors.email.errorText || " "}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="DD-MM-YYYY"
                value={
                  state.birthdate !== undefined ? dayjs(state.birthdate) : null
                }
                onChange={handleChangeDate}
              />
            </LocalizationProvider>
            {(state.roomName && (
              <FormControl>
                <InputLabel id="room-label">Room</InputLabel>
                <Select
                  name="roomName"
                  labelId="room-label"
                  label="Room"
                  value={state.roomName || ""}
                  onChange={handleChangeRoomName}
                >
                  <MenuItem value={state.roomName}>{state.roomName}</MenuItem>
                  <MenuItem value={null}>{"Change room"}</MenuItem>
                </Select>
              </FormControl>
            )) || (
              <FormControl>
                <InputLabel id="room-label">
                  {state.room ? "Room" : null}
                </InputLabel>
                <Select
                  name="room"
                  labelId="room-label"
                  label="Room"
                  required
                  displayEmpty
                  value={state.room || ""}
                  onChange={handleChange}
                  error={errors.room.error}
                  renderValue={(selected) => {
                    return selected.length === 0
                      ? "Select a room"
                      : `${selected.establishmentName} - ${selected.name}`;
                  }}
                >
                  {rooms.length === 0 && (
                    <MenuItem disabled>No room available</MenuItem>
                  )}
                  {rooms.map((item) => (
                    <MenuItem key={item._id} value={item}>
                      {`${item.establishmentName} - ${item.name}`}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={errors.room.error}>
                  {errors.room.errorText || " "}
                </FormHelperText>
              </FormControl>
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={allErrors || !validField}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogEditPatient.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  rooms: PropTypes.array,
};
