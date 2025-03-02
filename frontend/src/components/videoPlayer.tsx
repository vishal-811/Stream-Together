import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

export const VideoPlayer = ({
  socket,
  roomId,
  data,
  roomEvent,
  isAdmin,
}: {
  socket: React.RefObject<WebSocket | null>;
  roomId: string;
  data: any;
  roomEvent: any;
  isAdmin: React.RefObject<boolean>;
}) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);

  useEffect(() => {
    if (!roomEvent) return;

    switch (roomEvent) {
      case "Current_Video_Seconds":
        if (data?.videoSeconds && playerRef.current) {
          const serverTime = parseFloat(data.videoSeconds);
          const playerTime = playerRef.current.getCurrentTime() || 0;

          if (Math.abs(serverTime - playerTime) > 0.5) {
            playerRef.current.seekTo(serverTime);
          }
        }
        break;
      case "Video_Played":
        setPlaying(true);
        break;
      case "Video_Paused":
        setPlaying(false);
        break;
    }
  }, [roomEvent, data]);

  useEffect(() => {
    if (isAdmin.current) {
      const syncInterval = setInterval(() => {
        if (
          socket?.current?.readyState === WebSocket.OPEN &&
          playerRef.current
        ) {
          const currentTime = playerRef.current.getCurrentTime();
          socket.current.send(
            JSON.stringify({
              roomId: roomId,
              event: "RoomEvent",
              roomEvent: "Current_Video_Seconds",
              videoSeconds: currentTime.toString(),
            })
          );
        }
      }, 2000);

      return () => clearInterval(syncInterval);
    }
  }, [socket, roomId, isAdmin]);

  const handlePlay = () => {
    setPlaying(true);
    if (isAdmin.current && socket?.current?.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          roomId: roomId,
          event: "RoomEvent",
          roomEvent: "Video_Played",
        })
      );
    }
  };

  const handlePause = () => {
    setPlaying(false);
    if (isAdmin.current && socket?.current?.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          roomId: roomId,
          event: "RoomEvent",
          roomEvent: "Video_Paused",
        })
      );
    }
  };

  const handleSeek = (seconds: number) => {
    if (isAdmin.current && socket?.current?.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          roomId,
          event: "RoomEvent",
          roomEvent: "Current_Video_Seconds",
          videoSeconds: seconds.toString(),
        })
      );
    }
  };

  return (
    <div className="w-full h-full">
      <ReactPlayer
        ref={playerRef}
        url=""
        width="100%"
        height="100%"
        playing={playing}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        controls={true}
      />
    </div>
  );
};
