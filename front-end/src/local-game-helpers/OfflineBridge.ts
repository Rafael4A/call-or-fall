export const OfflineBridge = {
  emitToClient: (event: string, ...args: unknown[]) => {
    window.dispatchEvent(
      new CustomEvent("offline-server-emit", { detail: { event, args } }),
    );
  },

  emitToServer: (event: string, ...args: unknown[]) => {
    window.dispatchEvent(
      new CustomEvent("offline-client-emit", { detail: { event, args } }),
    );
  },
};
