import { useState, useEffect, useRef, AnyActionArg } from "react";
import ReactPlayer from "react-player";

export const VideoPlayer = ({
  socket,
  roomId,
  data,
  roomEvent,
}: {
  socket: React.RefObject<WebSocket | null>;
  roomId: string;
  data: any;
  roomEvent: any;
}) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  console.log("the roomEvent looks like", roomEvent);
  console.log("The data in the room looks like", data);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      if (socket?.current?.readyState === WebSocket.OPEN && playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        socket.current.send(
          JSON.stringify({
            roomId,
            event: "RoomEvent",
            roomEvent: "Current_Video_Seconds",
            data: currentTime.toString(),
          })
        );
      }
    }, 2000);

    return () => clearInterval(syncInterval);
  }, [socket, roomId]);

  // useEffect(() => {
  //   if (!socket?.current) return;

  //   const handleMessage = (event) => {
  //     try {
  //       const message = JSON.parse(event.data);

  //       switch (message.event) {
  //         case "Video_Paused":
  //           setPlaying(false);
  //           break;

  //         case "Video_Played":
  //           setPlaying(true);
  //           break;

  //         case "Seek_Video":
  //           const seekTime = parseFloat(message.data);
  //           playerRef.current?.seekTo(seekTime);
  //           break;

  //         case "Current_Video_Seconds":
  //           const serverTime = parseFloat(message.data);
  //           const playerTime = playerRef.current?.getCurrentTime() || 0;

  //           // Only sync if difference is more than 2 seconds
  //           if (Math.abs(serverTime - playerTime) > 2) {
  //             playerRef.current?.seekTo(serverTime);
  //           }
  //           break;
  //       }
  //     } catch (error) {
  //       console.error("Error parsing WebSocket message:", error);
  //     }
  //   };

  //   // socket.current.addEventListener("message", handleMessage);
  //   // return () => socket.current.removeEventListener("message", handleMessage);
  // }, [socket]);

  // Event handlers
  const handlePlay = () => {
    setPlaying(true);
    if (socket?.current?.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          roomId,
          event: "Video_Played",
          data: "",
        })
      );
    }
  };

  const handlePause = () => {
    setPlaying(false);
    if (socket?.current?.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          roomId,
          event: "Video_Paused",
          data: "",
        })
      );
    }
  };

  const handleSeek = (seconds) => {
    if (socket?.current?.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          roomId,
          event: "Seek_Video",
          data: seconds.toString(),
        })
      );
    }
  };

  return (
    <div className="relative w-full">
      <ReactPlayer
        ref={playerRef}
        url="https://www.youtube.com/watch?v=NDtyKKbRbjc"
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
