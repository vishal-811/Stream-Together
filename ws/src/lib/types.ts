import WebSocket from "ws";

export interface UserType {
  ws: WebSocket;
  isAdmin: boolean;
}

export interface RoomDetails {
  videoId: string;
  users: UserType[];
}

export enum RoomEventType {
  Video_Paused,
  Video_Played,
  Seek_Video,
  Current_Video_Seconds,
}

export enum EventType {
  Join_Room = "Join_room",
  Leave_Room = "Leave_room",
  RoomEvent = "RoomEvent",
}

export interface MessageType {
  event: EventType;
  roomId: string;
  roomEvent: RoomEventType;
  videoSeconds?: string
}

export interface TokenDetailsType{
  isAdmin: boolean,
  roomId: string | null,
  videoId: string | null
}
