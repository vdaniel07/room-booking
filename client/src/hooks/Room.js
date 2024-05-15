import { useReducer, useCallback, useState } from "react";
import { baseURL } from "../utils";
import { useSnackbar } from "notistack";

function reducer(state, action) {
  // console.log("ROOM_REDUCER", action.type, action);
  switch (action.type) {
    case "FETCHING_ROOMS":
      return { ...state, loading: true };
    case "SET_ROOMS":
      return { ...state, rooms: action.payload, loading: false };
    case "DELETE_ROOM":
      return {
        ...state,
        rooms: state.rooms.filter((room) => room._id !== action.payload._id),
      };
    case "ADD_ROOM":
      return {
        ...state,
        rooms: [action.payload, ...state.rooms],
      };
    case "UPDATE_ROOM":
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room._id === action.payload._id ? action.payload : room,
        ),
      };
    default:
      throw new Error("Action inconnue " + action.type);
  }
}

export function useRooms() {
  const [state, dispatch] = useReducer(reducer, {
    rooms: null,
    loading: false,
  });
  const [establishmentName, setEstablishmentName] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  return {
    rooms: state.rooms,
    establishmentName,
    fetchRooms: useCallback(
      function () {
        if (state.loading || state.rooms) {
          return;
        }

        dispatch({ type: "FETCHING_ROOMS" });
        fetch(`${baseURL}/room`)
          .then(async (res) => {
            const response = await res.json();
            if (res.ok) {
              return response;
            }
            dispatch({ type: "SET_ROOMS", payload: [] });
            throw new Error(response.message);
          })
          .then((data) => dispatch({ type: "SET_ROOMS", payload: data }))
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [state, enqueueSnackbar],
    ),
    fetchRoomsFromEstablishment: useCallback(
      function (establishmentId) {
        if (state.loading || state.rooms) {
          return;
        }

        dispatch({ type: "FETCHING_ROOMS" });
        fetch(`${baseURL}/establishment/` + establishmentId)
          .then(async (res) => {
            const response = await res.json();
            if (res.ok) {
              return response;
            }
            dispatch({ type: "SET_ROOMS", payload: [] });
            throw new Error(response.message);
          })
          .then((data) => {
            setEstablishmentName(data.name);
            dispatch({ type: "SET_ROOMS", payload: data.roomsDetails });
          })
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [state, enqueueSnackbar],
    ),
    deleteRoom: useCallback(
      function (room) {
        fetch(`${baseURL}/room/` + room._id, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            establishmentId: room.establishmentId,
            patientId: room.patientId,
          }),
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
              dispatch({ type: "DELETE_ROOM", payload: room }),
          )
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [enqueueSnackbar],
    ),
    updateRoom: useCallback(
      function (room) {
        const { _id, ...rest } = room;
        // Remove establishmentName for data request
        const data = { ...rest };
        delete data.establishmentName;
        fetch(`${baseURL}/room/` + _id, {
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
              dispatch({ type: "UPDATE_ROOM", payload: room }),
          )
          .catch((error) => {
            enqueueSnackbar(error.message, { variant: "warning" });
          });
      },
      [enqueueSnackbar],
    ),
    createRoom: useCallback(
      function (room) {
        // Remove establishmentName for data request
        const data = { ...room };
        delete data.establishmentName;
        fetch(`${baseURL}/room`, {
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
                type: "ADD_ROOM",
                payload: { _id: resp.insertedId, ...room },
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
