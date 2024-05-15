import { useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeContext } from "../../providers/colorModeProvider";

function NavBar({ navArrayLinks }) {
  const { mode, toggleTheme } = useContext(ThemeContext);
  return (
    <Box sx={{ display: "flex" }} justifyContent="space-between" spacing={2}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            color={"#FFF"}
            sx={{ px: 2, py: 1, mr: 4, border: 1, textDecoration: "none" }}
          >
            Room Booking
          </Typography>
          <Box>
            {navArrayLinks.map((item) => (
              <Button
                color="inherit"
                key={item.title}
                component={Link}
                to={item.path}
                sx={{ mr: 2 }}
              >
                {item.title}
              </Button>
            ))}
          </Box>
          <Box
            sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}
          >
            <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

NavBar.propTypes = {
  navArrayLinks: PropTypes.array.isRequired,
};

export default NavBar;
