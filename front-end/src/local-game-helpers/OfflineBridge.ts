export const OfflineBridge = {
  emitToClient: (event: string, ...args: unknown[]) => {
    console.log(`[Bridge] Emitting TO client: "${event}"`, args);
    window.dispatchEvent(
      new CustomEvent("offline-server-emit", { detail: { event, args } }),
    );
  },

  emitToServer: (event: string, ...args: unknown[]) => {
    console.log(`[Bridge] Emitting TO server: "${event}"`, args);
    window.dispatchEvent(
      new CustomEvent("offline-client-emit", { detail: { event, args } }),
    );
  },
};
