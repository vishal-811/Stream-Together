import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { EventType, MessageType, RoomDetails } from "./lib/types";
import {
  handleJoinRoomEvent,
  handleLeaveRoomEvent,
  handleRoomEvent,
} from "./lib/event";
import { SendMsg } from "./lib/utils";

const server = http.createServer(function (req, res) {
  res.end("hi");
});

const wss = new WebSocketServer({ server });

export const room = new Map<string, RoomDetails>();

function handleWebsocketMessageEvent(message: MessageType, ws: WebSocket) {
  const parsedMsg = JSON.parse(message.toString()) as MessageType;

  if (!parsedMsg) return;

  const { event, roomId, roomEvent } = parsedMsg;
  const videoId = parsedMsg.videoId;

  switch (event) {
    case EventType.Join_Room:
      handleJoinRoomEvent(roomId, videoId, ws);
      break;
    case EventType.Leave_Room:
      handleLeaveRoomEvent(roomId, ws);
      break;
    case EventType.RoomEvent:
      handleRoomEvent(roomId, ws, roomEvent);
      break;
    default:
      console.log("Wrong event");
  }
}

function handleWebsocketCloseEvent(ws: WebSocket) {}

wss.on("connection", (ws) => {
  SendMsg(ws, { msg: "Connected to the websocket server successfully" });
  ws.on("error", (error) => console.log(error));
  ws.on("message", (message: MessageType) => {
    handleWebsocketMessageEvent(message, ws);
  });
  ws.on("close", () => {
    handleWebsocketCloseEvent(ws);
  });
});

server.listen(8080, () => {
  console.log("Ws server is listening on port 8080");
});
