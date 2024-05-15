import { useReducer, useCallback } from "react";
import { baseURL } from "../utils";
import { useSnackbar } from "notistack";

function reducer(state, action) {
  // console.log("ESTABLISHMENT_REDUCER", action.type, action);
  switch (action.type) {
    case "FETCHING_ESTABLISHMENTS":
      return { ...state, loading: true };
    case "SET_ESTABLISHMENTS":
      return { ...state, establishments: action.payload, loading: false };
    case "DELETE_ESTABLISHMENT":
      return {
        ...state,
        establishments: state.establishments.filter(
          (establishment) => establishment._id !== action.payload._id,
        ),
      };
    case "ADD_ESTABLISHMENT":
      return {
        ...state,
        establishments: [action.payload, ...state.establishments],
      };
    case "UPDATE_ESTABLISHMENT":
      return {
        ...state,
        establishments: state.establishments.map((establishment) =>
          establishment._id === action.payload._id
            ? action.payload
            : establishment,
        ),
      };
    default:
      throw new Error("Action inconnue " + action.type);
  }
}

export function useEstablishments() {
  const [state, dispatch] = useReducer(reducer, {
    establishments: null,
    loading: false,
  });

  const { enqueueSnackbar } = useSnackbar();

  return {
    establishments: state.establishments,
    fetchEstablishments: useCallback(
      function () {
        if (state.loading || state.establishments) {
          return;
        }

        dispatch({ type: "FETCHING_ESTABLISHMENTS" });
        fetch(`${baseURL}/establishment`)
          .then(async (res) => {
            const response = await res.json();
            if (res.ok) {
              return response;
            }
            dispatch({ type: "SET_ESTABLISHMENTS", payload: [] });
            throw new Error(response.message);
          })
          .then((data) =>
            dispatch({ type: "SET_ESTABLISHMENTS", payload: data }),
          )
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [state, enqueueSnackbar],
    ),
    deleteEstablishment: useCallback(
      function (establishment) {
        fetch(`${baseURL}/establishment/` + establishment._id, {
          method: "DELETE",
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
                type: "DELETE_ESTABLISHMENT",
                payload: establishment,
              }),
          )
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [enqueueSnackbar],
    ),
    updateEstablishment: useCallback(
      function (establishment) {
        const { _id, ...data } = establishment;
        fetch(`${baseURL}/establishment/` + _id, {
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
                type: "UPDATE_ESTABLISHMENT",
                payload: establishment,
              }),
          )
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [enqueueSnackbar],
    ),
    createEstablishment: useCallback(
      function (data) {
        fetch(`${baseURL}/establishment`, {
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
                type: "ADD_ESTABLISHMENT",
                payload: { _id: resp.insertedId, ...data, numberOfRooms: 0 },
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
