import WebSocket from "ws";
import { EventType, RoomEventType, UserType } from "./types";
import { room, tokenDetails } from "..";
import { BroadCastMsg, SendMsg } from "./utils";

export function handleJoinRoomEvent(
  roomId: string,
  ws: WebSocket,
  videoSeconds?: string
) {

  const roomDetails = room.get(roomId);

  const { isAdmin, videoId } = tokenDetails;

  if (isAdmin) {
    if(!videoId){
      SendMsg(ws, {msg: "Please provide a video Id"})
      return;
    }

    room.set(roomId, {videoId: videoId, users: [{
      ws: ws,
      isAdmin: isAdmin,
    }]})
    SendMsg(ws, { msg: "Host joined the meeting successfully", event:"Join_room_successfully", data: { videoId: videoId, videoSeconds: videoSeconds } });
    return;
  }

  if(!roomDetails){
    SendMsg(ws, { msg: "Please wait for the host to join the room" });
    return;
  }

  if (roomDetails!.users.length > 0) {
    roomDetails?.users.push({
      ws: ws,
      isAdmin: false,
    } as UserType);

    SendMsg(ws, { msg: "You joined the room successfully", event:"Join_room_successfully", data: { videoId: videoId, videoSeconds: videoSeconds } });
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
      SendMsg(ws, { msg: "You left the room successfully", event:"Leave_room_successfully" });
      return false;
    }

    if (ws === user.ws && user.isAdmin) {
      BroadCastMsg(ws, roomId, { msg: "Host left the room" });
      SendMsg(ws, { msg: "You (Host) left the meeting successfully", event:"Leave_room_successfully" });
      return false;
    }

    return true;
  });
}

export function handleRoomEvent(
  roomId: string,
  ws: WebSocket,
  roomEvent: RoomEventType,
  data: string | undefined
) {
  const roomDetails = room.get(roomId);

  const users = roomDetails?.users;
  if (!users) {
    SendMsg(ws, { msg: "Room is empty" });
    return;
  }
  users?.map((user) => {
    if (!user.isAdmin) {
      SendMsg(ws, { msg: "You are not allowed to perform this action" });
      return;
    }
  });
  
  BroadCastMsg(ws, roomId, { event: roomEvent , data: {videoSeconds: data } });
  return;
}
