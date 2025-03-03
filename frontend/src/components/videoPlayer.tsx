import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { AlertCircle, Loader2 } from "lucide-react";

export const VideoPlayer = ({
  socket,
  roomId,
  data,
  roomEvent,
  isAdmin,
  videoUrl,
}: {
  socket: React.RefObject<WebSocket | null>;
  roomId: string;
  data: any;
  roomEvent: any;
  isAdmin: React.RefObject<boolean>;
  videoUrl?: string | null;
}) => {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleReady = () => {
    setLoading(false);
    setError(null);
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-900 relative">
      {loading && videoUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-white text-lg">Loading video...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Video Error</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {videoUrl ? (
        <div className="w-full h-full">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            onReady={handleReady}
            controls={true}
            config={{
              file: {
                attributes: {
                  className: "w-full h-full object-contain",
                },
              },
            }}
            style={{ backgroundColor: "black" }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No Video Available
          </h3>
          <p className="text-gray-300">
            Please provide a valid video URL to start watching.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
