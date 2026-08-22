import type { Theme } from "@mui/material";

export function ContainerStyles() {
  return {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 64px)",
    py: 4,
  };
}

export function SubtitleStyles() {
  return (theme: Theme) => ({
    color: theme.palette.text.secondary,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05rem",
    fontSize: "0.75rem",
  });
}

export function ShareRoomButtonStyles() {
  return (theme: Theme) => ({
    color: theme.palette.primary.main,
    background: theme.palette.background.paper,
    letterSpacing: "0.25rem",
    fontWeight: 700,
    fontSize: "1.75rem",
    px: 3,
    py: 1.5,
    elevation: 2,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    gap: 1,
  });
}
