import type { Theme } from "@mui/material";

export function ShowScoreButtonStyles() {
  return (theme: Theme) => ({
    borderColor: theme.palette.divider,
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
  });
}

export function PrimaryContainerStyles() {
  return {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    p: { xs: 2, sm: 3 },
  };
}
