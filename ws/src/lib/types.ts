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
  Join_Room,
  Leave_Room,
  RoomEvent,
}

export interface MessageType {
  event: EventType;
  roomId: string;
  videoId?: string;
  roomEvent: RoomEventType;
}
