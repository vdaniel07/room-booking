import { useState, useEffect, useMemo } from "react";
import Datatable from "../components/DataTable/DataTable";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { DialogEditPatient } from "../components/DialogEditPatient";
import { DialogDelete } from "../components/DialogDelete";
import { usePatients } from "../hooks/Patient";
import { useRooms } from "../hooks/Room";
import dayjs from "dayjs";

const userColumns = [
  {
    field: "firstname",
    headerName: "First Name",
    align: "center",
    headerAlign: "center",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "lastname",
    headerName: "Last Name",
    align: "center",
    headerAlign: "center",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "birthdate",
    headerName: "BirthDate",
    align: "center",
    headerAlign: "center",
    minWidth: 200,
    flex: 1,
    renderCell: (params) => {
      return <div>{dayjs(params.row.birthdate).format("DD/MM/YYYY")}</div>;
    },
  },
  {
    field: "email",
    headerName: "Email",
    align: "center",
    headerAlign: "center",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "roomName",
    headerName: "Room",
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    flex: 0.5,
  },
];

export default function Patients() {
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogdelete] = useState(false);
  const [item, setItem] = useState({});

  const {
    patients,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  } = usePatients();
  const { rooms, fetchRooms } = useRooms();

  useEffect(() => {
    if (!patients) {
      fetchPatients();
      fetchRooms();
    }
  }, [patients, fetchPatients, fetchRooms]);

  const roomsAvailable = useMemo(
    () => rooms?.filter((room) => !room.patientId),
    [rooms],
  );

  const handleClickOpenAdd = () => {
    setItem({});
    setOpenDialogEdit(true);
  };
  const handleClickOpenEdit = (value) => {
    setItem(value);
    setOpenDialogEdit(true);
  };
  const handleCloseAdd = (value) => {
    if (value) {
      const editItem = item.firstname ? true : false;
      if (editItem) {
        if (value.roomName) {
          updatePatient(value);
        } else {
          const { room, ...rest } = value;
          updatePatient({
            ...rest,
            roomId: room._id,
            roomName: room.name,
          });
        }
      } else {
        const { room, ...rest } = value;
        createPatient({
          ...rest,
          roomId: room._id,
          roomName: room.name,
        });
      }
    }
    setOpenDialogEdit(false);
  };

  const handleClickOpenDelete = (value) => {
    setItem(value);
    setOpenDialogdelete(true);
  };
  const handleCloseDelete = (value) => {
    if (value) {
      deletePatient(item);
    }
    setOpenDialogdelete(false);
  };

  return (
    <>
      <h1>Patients list:</h1>
      <Datatable
        userColumns={userColumns}
        userRows={patients || []}
        details={false}
        handleEdit={handleClickOpenEdit}
        handleDelete={handleClickOpenDelete}
      />
      <Fab
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
        color="primary"
        aria-label="add"
        onClick={handleClickOpenAdd}
      >
        <AddIcon />
      </Fab>
      <DialogEditPatient
        open={openDialogEdit}
        onClose={handleCloseAdd}
        item={item}
        rooms={roomsAvailable || []}
      />
      <DialogDelete
        open={openDialogDelete}
        onClose={handleCloseDelete}
        item={item.name || ""}
      />
    </>
  );
}
