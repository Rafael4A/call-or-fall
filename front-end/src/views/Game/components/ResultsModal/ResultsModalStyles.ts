import type { Theme } from "@mui/material";

export function SubtitleStyles() {
  return (theme: Theme) => ({
    color: theme.palette.text.secondary,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontSize: "0.75rem",
  });
}
export function ItemPaperStyles() {
  return {
    px: 2,
    py: 1.25,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
}
