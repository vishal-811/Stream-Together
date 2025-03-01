import { VideoPlayer } from "@/components/videoPlayer";
import { SendMsg } from "../lib/wsUtils";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const Room = () => {
  const Socket = useRef<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [roomInfo, setRoomInfo] = useState(null);
  const [data, setData] = useState();
  const [RoomEvent, setRoomEvent] = useState();

  const token = Cookies.get("token");
  if (!token) {
    console.log("No token found");
    return;
  }

  const { roomId } = useParams();
  if (!roomId) return;

  useEffect(() => {
    if (Socket.current) {
      return;
    }

    setLoading(true);
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    Socket.current = ws;

    ws.onopen = () => {
      SendMsg(ws, roomId, "Join_room", "Current_Video_Seconds", "0:00");
    };

    ws.onmessage = (message: any) => {
      try {
        const parsedMessage = JSON.parse(message.data);

        console.log("The parsed message looks like", parsedMessage);
        const { msg, event, data } = parsedMessage;

        if (
          event &&
          event !== "Join_room_successfully" &&
          event !== "Leave_room_successfully"
        ) {
          setRoomEvent(event);
          if (data) setData(data);
        }
        if (event === "Join_room_successfully") {
          toast.success(msg);
          setData(data);
        }
        if (event === "Leave_room_successfully") {
          toast.success(msg);
        }

        setLoading(false);
        // Update room info if available
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    ws.onerror = (err) => {
      console.log("WebSocket Error", err);
      setLoading(false);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      ws.close();
    };
  }, [roomId, token]);

  return (
    <div className="min-h-screen bg-gray-900 px-3 py-6 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 sm:mb-6 bg-black bg-opacity-70 rounded-lg p-3 sm:p-4 border-l-4 border-orange-500">
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                {/* {roomInfo?.roomName || `Room ${roomId}`} */}
              </h1>
              <p className="text-orange-400 mt-1 text-sm sm:text-base">
                {/* {roomInfo?.viewers || 0} viewers watching now */}
              </p>
            </div>

            {/* Video player with improved size */}
            <div className="w-full">
              <VideoPlayer
                socket={Socket}
                roomId={roomId}
                data={data}
                roomEvent={RoomEvent}
              />
            </div>

            {/* Future features area */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-black bg-opacity-70 rounded-lg p-4 border-t-2 border-orange-500">
                <h2 className="text-white text-lg font-semibold mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Chat (Coming Soon)
                </h2>
                <div className="h-48 flex items-center justify-center border border-gray-800 rounded bg-gray-900 bg-opacity-50">
                  <p className="text-gray-500 text-center">
                    Chat with friends while watching
                    <br />
                    Coming soon!
                  </p>
                </div>
              </div>

              <div className="bg-black bg-opacity-70 rounded-lg p-4 border-t-2 border-orange-500">
                <h2 className="text-white text-lg font-semibold mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Video Call (Coming Soon)
                </h2>
                <div className="h-48 flex items-center justify-center border border-gray-800 rounded bg-gray-900 bg-opacity-50">
                  <p className="text-gray-500 text-center">
                    See your friends' reactions in real time
                    <br />
                    Coming soon!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
