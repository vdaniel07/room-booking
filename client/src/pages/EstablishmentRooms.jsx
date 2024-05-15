import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Datatable from "../components/DataTable/DataTable";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { DialogEditRoom } from "../components/DialogEditRoom";
import { DialogDelete } from "../components/DialogDelete";
import { useRooms } from "../hooks/Room";

const userColumns = [
  {
    field: "name",
    headerName: "Name",
    align: "center",
    headerAlign: "center",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "patientId",
    headerName: "Available",
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    flex: 0.5,
    renderCell: (params) => {
      return (
        <Box
          sx={
            !params.row.patientId
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
          {params.row.patientId ? "" : "Available"}
        </Box>
      );
    },
  },
];

export default function EstablishmentRooms() {
  const { establishmentId } = useParams();

  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogdelete] = useState(false);
  const [item, setItem] = useState({});

  const {
    rooms,
    establishmentName,
    fetchRoomsFromEstablishment,
    createRoom,
    updateRoom,
    deleteRoom,
  } = useRooms();

  useEffect(() => {
    if (!rooms) {
      fetchRoomsFromEstablishment(establishmentId);
    }
  }, [rooms, fetchRoomsFromEstablishment, establishmentId]);

  const handleClickOpenAdd = () => {
    setItem({ establishmentName });
    setOpenDialogEdit(true);
  };
  const handleClickOpenEdit = (value) => {
    setItem({ ...value, establishmentName });
    setOpenDialogEdit(true);
  };
  const handleCloseAdd = (value) => {
    if (value) {
      const editItem = item.name ? true : false;
      if (editItem) {
        updateRoom(value);
      } else {
        createRoom({ establishmentId, ...value });
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
      deleteRoom({ ...item });
    }
    setOpenDialogdelete(false);
  };

  return (
    <>
      <h1>Rooms list for establishment: {establishmentName}</h1>
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
        establishments={null}
      />
      <DialogDelete
        open={openDialogDelete}
        onClose={handleCloseDelete}
        item={item.name || ""}
      />
    </>
  );
}
