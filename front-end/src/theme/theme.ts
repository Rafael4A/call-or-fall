import type { Theme } from "@mui/material";
import { createTheme } from "@mui/material";

declare module "@mui/material" {
  interface Palette {
    table: Palette["primary"];
    card: Palette["primary"];
    cardHighlight: Palette["primary"];
    progressBar: Palette["primary"];
  }
  interface PaletteOptions {
    table: PaletteOptions["primary"];
    card: PaletteOptions["primary"];
    cardHighlight: PaletteOptions["primary"];
    progressBar: PaletteOptions["primary"];
  }

  interface TypeBackground {
    joinRoomButton: string;
    createRoomButton: string;
    playOfflineButton: string;
    tutorialButton: string;
    startGameButton: string;
    tableBackgroundImage: string;
    tableBackgroundColor: string;
    input: string;
  }
}

export const theme: Theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: "#52b85d",
          joinRoomButton: "linear-gradient(135deg, #22577A 0%, #297B89 100%)",
          createRoomButton: "linear-gradient(135deg, #297B89 0%, #38A3A5 100%)",
          playOfflineButton:
            "linear-gradient(135deg, #38A3A5 100%, #47B9A0 100%)",
          tutorialButton: "linear-gradient(135deg, #47B9A0 0%, #5ACE9C 100%)",
          startGameButton: "linear-gradient(135deg, #22577A 0%, #38A3A5 100%)",
          tableBackgroundColor: "#1B5E3B",
          tableBackgroundImage:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)",
          input: "white",
        },
        primary: { main: "#22577A" },
        secondary: { main: "#459699" },
        table: {
          main: "rgba(255,255,255,0.6)",
          light: "rgba(255,255,255,0.3)",
        },
        card: {
          main: "#8B1A1A",
          dark: "#5C1313",
          light: "#C62828",
        },
        cardHighlight: {
          main: "rgb(211, 179, 0)",
        },
        progressBar: {
          dark: "rgba(110, 110, 110, 0.15)",
          main: "rgba(47, 136, 142, 0.8)",
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: "#122D4D",
          joinRoomButton: "linear-gradient(135deg, #1B4931 0%, #255F42 100%)",
          createRoomButton: "linear-gradient(135deg, #255F42 0%, #307553 100%)",
          playOfflineButton:
            "linear-gradient(135deg, #307553 0%, #3D8B65 100%)",
          tutorialButton: "linear-gradient(135deg, #3D8B65 0%, #4D7C5B 100%)",
          startGameButton: "linear-gradient(135deg, #A1C181 0%, #619B8A 100%)",
          tableBackgroundColor: "#1B5E3B",
          tableBackgroundImage:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%)",
          input: "rgba(255,255,255,0.075)",
        },
        primary: { main: "#7ea359" },
        secondary: { main: "#459699" },
        table: {
          main: "rgba(255, 255, 255, 0.6)",
        },
        card: {
          main: "#7B1E1E",
          dark: "#4A1212",
          light: "#9B2C2C",
        },
        cardHighlight: {
          main: "#FFD700",
        },
        progressBar: {
          main: "rgba(255,255,255,0.6)",
          dark: "rgba(255,255,255,0.1)",
        },
        error: {
          main: "#D32F2F",
        },
      },
    },
  },
  typography: {
    fontFamily: "Roboto, system-ui, Helvetica, Arial, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "3rem",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          color:
            theme.palette.mode === "dark"
              ? theme.palette.text.primary
              : undefined,
          "&:hover": {
            filter: "brightness(0.9)",
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          borderRadius: 16,
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)"
              : "linear-gradient(135deg, #1a3a5c 0%, #163757 100%)",
          ...(theme.palette.mode === "dark" && {
            // Adds the subtle top boundary definition
            border: "1px solid rgba(255, 255, 255, 0.08)",
            // This ensures MUI's dynamic elevation props (like elevation={3})
            // still apply the correct shadow depth from the theme array
            boxShadow: theme.shadows[ownerState.elevation || 1],
          }),
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.palette.background.input,
          borderRadius: 8,
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        }),
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          "& .MuiModal-backdrop": {
            backdropFilter: "blur(4px)",
          },
        },
      },
    },
  },
});
