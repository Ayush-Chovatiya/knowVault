import { createTheme, alpha } from "@mui/material/styles";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#5C6BC0",
            light: "#8E99D6",
            dark: "#3F4FA0",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#7E57C2",
            light: "#A887D9",
            dark: "#5E3EA1",
          },
          background: {
            default: "#F8F9FC",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#1A1A2E",
            secondary: "#6B7280",
          },
          divider: "#E5E7EB",
          grey: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
          },
        }
      : {
          primary: {
            main: "#7C8BDA",
            light: "#A5B0E6",
            dark: "#5C6BC0",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#9575CD",
            light: "#B39DDB",
            dark: "#7E57C2",
          },
          background: {
            default: "#0F172A",
            paper: "#1E293B",
          },
          text: {
            primary: "#F1F5F9",
            secondary: "#94A3B8",
          },
          divider: "#334155",
          grey: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.05)",
    "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
    "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
    ...Array(18).fill("none"),
  ],
});

export const createAppTheme = (mode) => {
  const designTokens = getDesignTokens(mode);

  return createTheme({
    ...designTokens,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor:
              mode === "light" ? "#D1D5DB #F3F4F6" : "#475569 #1E293B",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: mode === "light" ? "#D1D5DB" : "#475569",
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              backgroundColor: mode === "light" ? "#F3F4F6" : "#1E293B",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: "0.875rem",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1)",
            },
          },
          contained: {
            "&:hover": {
              boxShadow: "0px 4px 6px -1px rgba(0, 0, 0, 0.1)",
            },
          },
          outlined: {
            borderWidth: 1.5,
            "&:hover": {
              borderWidth: 1.5,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              "0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)",
            border: `1px solid ${mode === "light" ? "#E5E7EB" : "#334155"}`,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow:
                "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transform: "translateY(-2px)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            fontSize: "0.75rem",
          },
          filled: {
            backgroundColor:
              mode === "light" ? alpha("#5C6BC0", 0.1) : alpha("#7C8BDA", 0.2),
            color: mode === "light" ? "#5C6BC0" : "#A5B0E6",
          },
          outlined: {
            borderColor: mode === "light" ? "#E5E7EB" : "#475569",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              "& fieldset": {
                borderColor: mode === "light" ? "#E5E7EB" : "#475569",
              },
              "&:hover fieldset": {
                borderColor: mode === "light" ? "#D1D5DB" : "#64748B",
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "light" ? "#5C6BC0" : "#7C8BDA",
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: "none",
            backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#FFFFFF" : "#1E293B",
            color: mode === "light" ? "#1A1A2E" : "#F1F5F9",
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
            borderBottom: `1px solid ${mode === "light" ? "#E5E7EB" : "#334155"}`,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            margin: "4px 8px",
            "&.Mui-selected": {
              backgroundColor:
                mode === "light"
                  ? alpha("#5C6BC0", 0.1)
                  : alpha("#7C8BDA", 0.15),
              "&:hover": {
                backgroundColor:
                  mode === "light"
                    ? alpha("#5C6BC0", 0.15)
                    : alpha("#7C8BDA", 0.2),
              },
            },
            "&:hover": {
              backgroundColor: mode === "light" ? "#F3F4F6" : "#334155",
            },
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? "#5C6BC0" : "#7C8BDA",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
    },
  });
};

export default createAppTheme;
