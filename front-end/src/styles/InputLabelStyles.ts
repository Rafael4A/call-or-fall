import type { Theme } from "@mui/material";

export function InputLabelStyles() {
  return (theme: Theme) => ({
    color: theme.palette.text.secondary,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05rem",
    fontSize: "0.75rem",
  });
}
