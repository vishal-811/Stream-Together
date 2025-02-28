import WebSocket from "ws";
import { room } from "..";

export function SendMsg(ws: WebSocket, data: object) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ msg: data }));
    return;
  }
}

export function BroadCastMsg(ws: WebSocket, roomId: string, data: object) {
  const users = room.get(roomId)?.users;
  if (!users) return;

  users.map((user) => {
    if (ws !== user.ws) {
      SendMsg(ws, data);
    }
  });
  return;
}
