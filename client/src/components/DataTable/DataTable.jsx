import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoupeIcon from "@mui/icons-material/Loupe";

const Datatable = ({
  userColumns,
  userRows,
  details = true,
  handleEdit,
  handleDelete,
  handleDetails,
}) => {
  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      align: "center",
      headerAlign: "center",
      minWidth: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <Stack direction="row" justifyContent="center" spacing={1}>
            <Tooltip title="Edit" placement="top">
              <IconButton
                color="primary"
                onClick={() => handleEdit(params.row)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top">
              <IconButton
                color="primary"
                onClick={() => handleDelete(params.row)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            {details && (
              <Tooltip title="Details" placement="top">
                <IconButton
                  color="primary"
                  onClick={() => handleDetails(params.row)}
                >
                  <LoupeIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      <DataGrid
        rows={userRows}
        columns={userColumns.concat(actionColumn)}
        getRowId={(row) => row._id}
      />
    </>
  );
};

Datatable.propTypes = {
  userColumns: PropTypes.array.isRequired,
  userRows: PropTypes.array.isRequired,
  details: PropTypes.bool,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  handleDetails: PropTypes.func,
};

export default Datatable;
