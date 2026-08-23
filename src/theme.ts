import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4F46E5" },
    secondary: { main: "#F43F5E" },
    error: { main: "#F43F5E" },
    background: { default: "#F6F7FB", paper: "#FFFFFF" },
    text: { primary: "#1B1D28", secondary: "#6B7280" },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    fontSize: 14,
  },
  shape: {
    borderRadius: 14,
  },
});
