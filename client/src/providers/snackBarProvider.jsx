import { SnackbarProvider } from "notistack";
import PropTypes from "prop-types";
import "./snackBarProvider.css";

export function SnackBarProvider({ children }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      {children}
    </SnackbarProvider>
  );
}

SnackBarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
