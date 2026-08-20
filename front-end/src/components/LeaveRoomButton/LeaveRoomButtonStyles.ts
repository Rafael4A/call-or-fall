import type { Theme } from "@mui/material";

export function ButtonStyles() {
  return (theme: Theme) => ({
    alignSelf: "flex-start",
    borderColor: theme.palette.divider,
    backgroundColor: theme.palette.error.main,
  });
}
