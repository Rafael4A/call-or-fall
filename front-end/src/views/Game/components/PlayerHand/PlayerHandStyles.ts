export function CardButtonStyles() {
  return {
    p: 0,
    minWidth: 100,
    minHeight: 140,
    borderRadius: 3,
    background: "transparent",
    boxShadow: "none",
    "&:hover": {
      background: "transparent",
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      transform: "translateY(-4px)",
    },
    "&:disabled": {
      cursor: "not-allowed",
      boxShadow: "none",
      background: "transparent",
      opacity: 0.4,
    },
    transition: "all 0.2s ease-in-out",
  };
}
