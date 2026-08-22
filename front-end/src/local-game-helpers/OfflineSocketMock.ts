import { SOCKET_EVENTS } from "shared-code";
import { OfflineBridge } from "./OfflineBridge";

export class OfflineSocketMock {
  private listeners: Record<string, ((...args: unknown[]) => unknown)[]> = {};
  private anyListeners: ((...args: unknown[]) => unknown)[] = [];
  private serverListener: (e: Event) => void;

  constructor() {
    console.log("[Mock Socket] Initialized and listening to window");
    this.serverListener = (e: Event) => {
      const { event, args } = (e as CustomEvent).detail;
      console.log(
        `[Mock Socket] Caught "${event}" from window. Active onAny listeners:`,
        this.anyListeners.length,
      );

      this.anyListeners.forEach((cb) => cb(event, ...args));

      if (this.listeners[event]) {
        console.log(
          `[Mock Socket] Found ${this.listeners[event].length} listeners for "${event}"`,
        );
        this.listeners[event].forEach((cb) => cb(...args));
      } else
        console.log(`[Mock Socket] No specific listeners found for "${event}"`);
    };

    window.addEventListener("offline-server-emit", this.serverListener);

    // Simulate immediate connection for the local bot match
    setTimeout(() => OfflineBridge.emitToServer(SOCKET_EVENTS.CONNECT));
  }

  on(event: string, callback: (...args: unknown[]) => unknown) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    console.log(`[Mock Socket] Registered listener for "${event}"`);
  }

  off(event: string) {
    // This is required for your SocketProvider's cleanup function
    delete this.listeners[event];
    console.log(`[Mock Socket] Removed listener for "${event}"`);
  }

  emit(event: string, ...args: unknown[]) {
    window.dispatchEvent(
      new CustomEvent("offline-client-emit", { detail: { event, args } }),
    );
    console.log("[Mock Socket] Registered onAny listener");
  }

  onAny(callback: (...args: unknown[]) => unknown) {
    this.anyListeners.push(callback);
    console.log("[Mock Socket] Registered onAny listener");
  }

  disconnect() {
    console.log("[Mock Socket] Disconnected and cleaned up");
    window.removeEventListener("offline-server-emit", this.serverListener);
    OfflineBridge.emitToServer(SOCKET_EVENTS.DISCONNECT);
    this.listeners = {};
    this.anyListeners = [];
  }
}
