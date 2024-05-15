import { useState, useEffect } from "react";
import Datatable from "../components/DataTable/DataTable";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { DialogEditEstablishment } from "../components/DialogEditEstablishment";
import { DialogDelete } from "../components/DialogDelete";
import { useEstablishments } from "../hooks/Establishment";
import { useNavigate } from "react-router-dom";

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
    field: "numberOfRooms",
    headerName: "Number Of Rooms",
    align: "center",
    headerAlign: "center",
    minWidth: 150,
    flex: 0.5,
  },
];

export default function Establishment() {
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogdelete] = useState(false);
  const [item, setItem] = useState({});

  const {
    establishments,
    fetchEstablishments,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment,
  } = useEstablishments();

  useEffect(() => {
    if (!establishments) {
      fetchEstablishments();
    }
  }, [establishments, fetchEstablishments]);

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
        updateEstablishment(value);
      } else {
        createEstablishment(value);
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
      deleteEstablishment(item);
    }
    setOpenDialogdelete(false);
  };

  // Navigate to establismentRooms page when clik on row
  const navigate = useNavigate();
  const handleClickDetails = (row) => {
    navigate(`${row._id}`);
  };

  return (
    <>
      <h1>Establishments list: </h1>
      <Datatable
        userColumns={userColumns}
        userRows={establishments || []}
        handleEdit={handleClickOpenEdit}
        handleDelete={handleClickOpenDelete}
        handleDetails={handleClickDetails}
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
      <DialogEditEstablishment
        open={openDialogEdit}
        onClose={handleCloseAdd}
        item={item}
      />
      <DialogDelete
        open={openDialogDelete}
        onClose={handleCloseDelete}
        item={item.name || ""}
      />
    </>
  );
}
