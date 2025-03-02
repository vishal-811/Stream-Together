export function SendMsg(
  ws: WebSocket,
  roomId: string,
  event_Type: string,
  roomEvent?: string,
  videoSeconds?: string
) {
  ws.send(
    JSON.stringify({
      event: event_Type,
      roomId: roomId,
      roomEvent: roomEvent,
      videoSeconds: videoSeconds,
    })
  );
}
