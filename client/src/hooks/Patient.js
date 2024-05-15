import { useReducer, useCallback } from "react";
import { baseURL } from "../utils";
import { useSnackbar } from "notistack";

function reducer(state, action) {
  // console.log("PATIENT_REDUCER", action.type, action);
  switch (action.type) {
    case "FETCHING_PATIENTS":
      return { ...state, loading: true };
    case "SET_PATIENTS":
      return { ...state, patients: action.payload, loading: false };
    case "DELETE_PATIENT":
      return {
        ...state,
        patients: state.patients.filter(
          (patient) => patient._id !== action.payload._id,
        ),
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: [action.payload, ...state.patients],
      };
    case "UPDATE_PATIENT":
      return {
        ...state,
        patients: state.patients.map((patient) =>
          patient._id === action.payload._id ? action.payload : patient,
        ),
      };
    default:
      throw new Error("Action inconnue " + action.type);
  }
}

export function usePatients() {
  const [state, dispatch] = useReducer(reducer, {
    patients: null,
    loading: false,
  });

  const { enqueueSnackbar } = useSnackbar();

  return {
    patients: state.patients,
    fetchPatients: useCallback(
      function () {
        if (state.loading || state.patients) {
          return;
        }

        dispatch({ type: "FETCHING_PATIENTS" });
        fetch(`${baseURL}/patient`)
          .then(async (res) => {
            const response = await res.json();
            if (res.ok) {
              return response;
            }
            dispatch({ type: "SET_PATIENTS", payload: [] });
            throw new Error(response.message);
          })
          .then((data) => dispatch({ type: "SET_PATIENTS", payload: data }))
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [state, enqueueSnackbar],
    ),
    deletePatient: useCallback(
      function (patient) {
        fetch(`${baseURL}/patient/` + patient._id, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId: patient.roomId }),
        })
          .then(async (res) => {
            const response = await res.json();
            if (res.ok) {
              return response;
            }
            throw new Error(response.message);
          })
          .then(
            (resp) =>
              resp.acknowledged &&
              dispatch({
                type: "DELETE_PATIENT",
                payload: patient,
              }),
          )
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [enqueueSnackbar],
    ),
    updatePatient: useCallback(
      function (patient) {
        const { _id, ...rest } = patient;
        // Remove establishmentName for data request
        const data = { ...rest };
        delete data.roomName;
        fetch(`${baseURL}/patient/` + _id, {
          method: "PUT" /* or PATCH */,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then(async (res) => {
            const response = await res.json();
            if (res.ok) {
              return response;
            }
            throw new Error(response.message);
          })
          .then(
            (resp) =>
              resp.acknowledged &&
              dispatch({
                type: "UPDATE_PATIENT",
                payload: patient,
              }),
          )
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [enqueueSnackbar],
    ),
    createPatient: useCallback(
      function (patient) {
        // Remove establishmentName for data request
        const data = { ...patient };
        delete data.roomName;
        fetch(`${baseURL}/patient`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then(async (res) => {
            const response = await res.json();
            if (res.ok) {
              return response;
            }
            throw new Error(response.message);
          })
          .then(
            (resp) =>
              resp.acknowledged &&
              dispatch({
                type: "ADD_PATIENT",
                payload: { _id: resp.insertedId, ...patient },
              }),
          )
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [enqueueSnackbar],
    ),
  };
}
