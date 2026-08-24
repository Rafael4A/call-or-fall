export function ModalBoxStyles() {
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
