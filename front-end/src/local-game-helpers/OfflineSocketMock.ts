import { SOCKET_EVENTS } from "shared-code";
import { OfflineBridge } from "./OfflineBridge";

export class OfflineSocketMock {
  private listeners: Record<string, ((...args: unknown[]) => unknown)[]> = {};
  private anyListeners: ((...args: unknown[]) => unknown)[] = [];
  private serverListener: (e: Event) => void;

  constructor() {
    this.serverListener = (e: Event) => {
      const { event, args } = (e as CustomEvent).detail;

      this.anyListeners.forEach((cb) => cb(event, ...args));

      if (this.listeners[event]) {
        this.listeners[event].forEach((cb) => cb(...args));
      }
    };

    window.addEventListener("offline-server-emit", this.serverListener);

    // Simulate immediate connection for the local bot match
    setTimeout(() => OfflineBridge.emitToServer(SOCKET_EVENTS.CONNECT));
  }

  on(event: string, callback: (...args: unknown[]) => unknown) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event: string) {
    // Required for SocketProvider's cleanup function
    delete this.listeners[event];
  }

  emit(event: string, ...args: unknown[]) {
    window.dispatchEvent(
      new CustomEvent("offline-client-emit", { detail: { event, args } }),
    );
  }

  onAny(callback: (...args: unknown[]) => unknown) {
    this.anyListeners.push(callback);
  }

  disconnect() {
    window.removeEventListener("offline-server-emit", this.serverListener);
    OfflineBridge.emitToServer(SOCKET_EVENTS.DISCONNECT);
    this.listeners = {};
    this.anyListeners = [];
  }
}
