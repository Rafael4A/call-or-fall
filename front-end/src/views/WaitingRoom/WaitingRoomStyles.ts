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
