import { useMemo, useState, createContext, useCallback } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import PropTypes from "prop-types";

const themeLight = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4485ba", // "#004d40",
    },
  },
});

const themeDark = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4485ba", // "#004d40",
    },
    background: {
      paper: "#424242",
      default: "#303030",
    },
  },
});

export const ThemeContext = createContext({
  mode: "Light",
  toggleTheme: () => {},
});

export const ColorContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);
  const value = useMemo(() => {
    return {
      mode: theme,
      toggleTheme,
    };
  }, [toggleTheme, theme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme === "light" ? themeLight : themeDark}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

ColorContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
