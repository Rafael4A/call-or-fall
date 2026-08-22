import type { Application } from "express";
import type { Server } from "socket.io";
import { SOCKETIO_STRING } from "../constants";

export function getSocketio(app: Application): Server {
  return app.get(SOCKETIO_STRING);
}
