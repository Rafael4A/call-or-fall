import type { Theme } from "@mui/material";

export function ContainerStyles() {
  return (theme: Theme) => ({
    p: 3,
    minHeight: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.background.tableBackgroundColor,
    border: `3px solid ${theme.palette.table.dark}`,
    borderRadius: 4,
    position: "relative",
    backgroundImage: theme.palette.background.tableBackgroundImage,
  });
}
