import { Route, Routes } from "react-router-dom";
import { Container } from "@mui/material";
import NavBar from "./components/NavBar/NavBar";

import Home from "./pages/Home";
import Establishment from "./pages/Establishment";
import EstablishmentRooms from "./pages/EstablishmentRooms";
import Room from "./pages/Room";
import Patient from "./pages/Patient";
import Error from "./pages/Error";

import ApartmentIcon from "@mui/icons-material/Apartment";
import BedIcon from "@mui/icons-material/Bed";
import PersonIcon from "@mui/icons-material/Person";

const navArrayLinks = [
  {
    title: "Establishments",
    path: "/establishment",
    icon: (size) => <ApartmentIcon fontSize={size} />,
  },
  {
    title: "Rooms",
    path: "/room",
    icon: (size) => <BedIcon fontSize={size} />,
  },
  {
    title: "Patients",
    path: "/patient",
    icon: (size) => <PersonIcon fontSize={size} />,
  },
];

function App() {
  return (
    <>
      <NavBar navArrayLinks={navArrayLinks} />
      <Container sx={{ mt: 5 }}>
        <Routes>
          <Route path="/" element={<Home navArrayLinks={navArrayLinks} />} />
          <Route path="/establishment" element={<Establishment />} />
          <Route
            path="/establishment/:establishmentId"
            element={<EstablishmentRooms />}
          />
          <Route path="/room" element={<Room />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
