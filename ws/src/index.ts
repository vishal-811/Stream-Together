import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { EventType, MessageType, RoomDetails, RoomEventType, TokenDetailsType } from "./lib/types";
import {
  handleJoinRoomEvent,
  handleLeaveRoomEvent,
  handleRoomEvent,
} from "./lib/event";
import { SendMsg } from "./lib/utils";
import url from "url";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(function (req, res) {
  res.end("hi");
});

const wss = new WebSocketServer({ server });

export const room = new Map<string, RoomDetails>();
export let tokenDetails: TokenDetailsType = {isAdmin: false, roomId: null, videoId: null};

function handleWebsocketMessageEvent(message: MessageType, ws: WebSocket) {
  const parsedMsg = JSON.parse(message.toString()) as MessageType;

  if (!parsedMsg) return;

  const { event, roomId, roomEvent, videoSeconds } = parsedMsg;

  switch (event) {
    case EventType.Join_Room:
      handleJoinRoomEvent(roomId, ws, videoSeconds);
      break;
    case EventType.Leave_Room:
      handleLeaveRoomEvent(roomId, ws);
      break;
    case EventType.RoomEvent:
      handleRoomEvent(roomId, ws, roomEvent, videoSeconds);
      break;
    default:
      console.log("Wrong event");
  }
}

function handleWebsocketCloseEvent(ws: WebSocket) {}


wss.on("connection", (ws, req) => {
  // @ts-ignore
  const ParsedUrl = url.parse(req.url, true);
  const token = ParsedUrl.query.token as string;

  const isValidToken = jwt.verify(token, process.env.JWT_SECRET!);

  if(isValidToken){
    const decoded = jwt.decode(token) as TokenDetailsType;
    tokenDetails = {
       isAdmin: decoded.isAdmin,
       roomId: decoded.roomId,
       videoId: decoded.videoId
    }
  }
 
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
