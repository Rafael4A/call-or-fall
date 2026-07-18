import { createTheme } from "@mui/material";

export const theme = createTheme({
  colorSchemes: {
    light: {
      // https://coolors.co/palette/22577a-38a3a5-57cc99-80ed99-c7f9cc
      palette: {
        background: { default: "#C7F9CC", paper: "#80ED99" },
        primary: { main: "#22577A" },
        secondary: { main: "#38A3A5" },
      },
    },
    dark: {
      // https://coolors.co/palette/233d4d-fe7f2d-fcca46-a1c181-619b8a
      palette: {
        background: { default: "#122D4D", paper: "#FE7F2D" },
        primary: { main: "#A1C181" },
        secondary: { main: "#619B8A" },
      },
    },
  },
});
