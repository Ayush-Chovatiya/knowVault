import { createContext, useState, useCallback, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";

export const SnackbarContext = createContext({
  showSnackbar: () => {},
});

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = useCallback((message, severity = "info") => {
    // Handle case where message is an object (e.g., Zod validation errors)
    let displayMessage = message;
    if (typeof message === "object" && message !== null) {
      // Convert object to readable string
      displayMessage = Object.values(message).flat().join(", ");
    }
    setSnackbar({ open: true, message: displayMessage, severity });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const contextValue = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
