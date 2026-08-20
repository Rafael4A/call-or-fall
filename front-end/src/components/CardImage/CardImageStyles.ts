import type { Theme } from "@mui/material";
import type { CSSProperties } from "react";

export function ContainerStyles(highlight?: boolean) {
  return (theme: Theme) => ({
    width: 120,
    height: 168,
    borderRadius: 0.5,
    border: highlight ? "3px solid" : "none",
    borderColor: highlight ? theme.palette.cardHighlight.main : "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    position: "relative",

    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      boxShadow: highlight
        ? `inset 0 0 0 1px ${theme.palette.cardHighlight.main}`
        : "none",
      pointerEvents: "none",
    },
  });
}
export function ImageStyles(): CSSProperties {
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };
}
