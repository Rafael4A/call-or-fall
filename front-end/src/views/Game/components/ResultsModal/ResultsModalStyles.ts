import type { Theme } from "@mui/material";

export function ContainerStyles() {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "calc(100% - 32px)", sm: 520 },
    maxWidth: 520,
    maxHeight: "80vh",
    overflow: "auto",
  };
}

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
