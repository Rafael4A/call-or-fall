import { SOCKET_EVENTS, type SocketQuery } from "shared-code";
import type { Server, Socket } from "socket.io";
import { getRoomByIdWithUser } from "../state/rooms.js";

export function socketHandler(io: Server) {
  io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
    console.log("a user connected", socket.handshake.query);
    const query = socket.handshake.query as unknown as SocketQuery;
    const { roomId, playerId } = query;

    if (typeof roomId !== "string" || typeof playerId !== "string")
      return socket.disconnect();

    const room = getRoomByIdWithUser(roomId, playerId);

    if (!room) return socket.disconnect();

    socket.join(roomId);
    socket.to(roomId).emit(SOCKET_EVENTS.ROOM_UPDATE);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    //TODO REMOVER
    socket.onAny((eventName, ...args) => {
      console.log("# event received:");
      console.log(eventName); // 'hello'
      console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
    });
  });
}
