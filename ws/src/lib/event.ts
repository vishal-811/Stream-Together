import WebSocket from "ws";
import { RoomEventType, UserType } from "./types";
import { room } from "..";
import { BroadCastMsg, SendMsg } from "./utils";

export function handleJoinRoomEvent(
  roomId: string,
  videoId: string | undefined,
  ws: WebSocket
) {
  const roomDetails = room.get(roomId);

  if (roomDetails?.users.length === 0 && !videoId) {
    SendMsg(ws, { msg: "Please wait for the host to join the room" });
    return;
  }

  if (roomDetails?.users.length === 0 && videoId) {
    roomDetails.videoId = videoId;
    roomDetails.users.push({
      ws: ws,
      isAdmin: true,
    } as UserType);

    SendMsg(ws, { msg: "Host joined the meeting successfully" });
    return;
  }

  if (roomDetails!.users.length > 0) {
    roomDetails?.users.push({
      ws: ws,
      isAdmin: false,
    } as UserType);

    SendMsg(ws, { msg: "You joined the room successfully", videoId: videoId });
    return;
  }
}

export function handleLeaveRoomEvent(roomId: string, ws: WebSocket) {
  const roomDetails = room.get(roomId);

  if (!roomDetails) {
    SendMsg(ws, { msg: "No room Exist with this roomId" });
    return;
  }

  let users = roomDetails?.users;

  if (!users) {
    SendMsg(ws, { msg: "Room is empty" });
    return;
  }
  users = users.filter((user) => {
    if (ws === user.ws && !user.isAdmin) {
      SendMsg(ws, { msg: "You left the room successfully" });
      return false;
    }

    if (ws === user.ws && user.isAdmin) {
      BroadCastMsg(ws, roomId, { msg: "Host left the room" });
      SendMsg(ws, { msg: "You (Host) left the meeting successfully" });
      return false;
    }

    return true;
  });
}

export function handleRoomEvent(
  roomId: string,
  ws: WebSocket,
  roomEvent: RoomEventType
) {}
