import { useState, useEffect } from "react";
import Datatable from "../components/DataTable/DataTable";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { DialogEditRoom } from "../components/DialogEditRoom";
import { DialogDelete } from "../components/DialogDelete";
import { useRooms } from "../hooks/Room";
import { useEstablishments } from "../hooks/Establishment";

const userColumns = [
  {
    field: "establishmentName",
    headerName: "Establisment",
    align: "center",
    headerAlign: "center",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "name",
    headerName: "Name",
    align: "center",
    headerAlign: "center",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "patientName",
    headerName: "Patient",
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    renderCell: (params) => {
      return (
        <Box
          sx={
            !params.row.patientName
              ? {
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#00800096",
                  color: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }
              : null
          }
        >
          {params.row.patientName ? params.row.patientName : "Available"}
        </Box>
      );
    },
  },
];

export default function Rooms() {
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogdelete] = useState(false);
  const [item, setItem] = useState({});

  const { rooms, fetchRooms, createRoom, updateRoom, deleteRoom } = useRooms();
  const { establishments, fetchEstablishments } = useEstablishments();

  useEffect(() => {
    if (!rooms) {
      fetchRooms();
      fetchEstablishments();
    }
  }, [rooms, fetchRooms, fetchEstablishments]);

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
      const editItem = item.name ? true : false;
      if (editItem) {
        updateRoom(value);
      } else {
        const { name, establishment } = value;
        createRoom({
          name,
          establishmentId: establishment._id,
          establishmentName: establishment.name,
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
      deleteRoom(item);
    }
    setOpenDialogdelete(false);
  };

  return (
    <>
      <h1>Rooms list:</h1>
      <Datatable
        userColumns={userColumns}
        userRows={rooms || []}
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
      <DialogEditRoom
        open={openDialogEdit}
        onClose={handleCloseAdd}
        item={item}
        establishments={establishments || []}
      />
      <DialogDelete
        open={openDialogDelete}
        onClose={handleCloseDelete}
        item={item.name || ""}
      />
    </>
  );
}
