"use client";

import { VideoPlayer } from "@/components/videoPlayer";
import { SendMsg } from "../lib/wsUtils";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Base_url } from "@/lib";

interface RoomMetaDatatype {
  roomName: string;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export const Room = () => {
  const Socket = useRef<WebSocket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [roomInfo, setRoomInfo] = useState<RoomMetaDatatype | null>(null);
  const [data, setData] = useState();
  const [RoomEvent, setRoomEvent] = useState();
  const isAdmin = useRef<boolean>(false);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const emojiIdCounter = useRef(0);
  const [showExitModal, setShowExitModal] = useState(false);

  const token = Cookies.get("token");
  const { roomId } = useParams<string>();
  const [isRoomIdValid, setIsRoomIdValid] = useState(false);

  const navigate = useNavigate();

  if (!roomId) return;

  useEffect(() => {
    setIsRoomIdValid(!!roomId);
  }, [roomId]);

  useEffect(() => {
    if (!isRoomIdValid) return;

    if (!token) {
      console.log("No token found");
      return;
    }
    (async () => {
      const res = await axios.get(`${Base_url}/room/IsRoomExist/${roomId}`, {
        withCredentials: true,
      });
      try {
        if (res.status === 200) {
          const title = res.data.msg.title;
          setRoomInfo({
            roomName: title,
          });
        }
      } catch (error) {
        if (error instanceof Error) console.error(error.message);
      }
    })();
  }, [roomId, token, isRoomIdValid]);

  useEffect(() => {
    if (!isRoomIdValid) return;
    if (!token) return;

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
        const { msg, event, data } = parsedMessage;

        if (
          event &&
          event !== "Join_room_successfully" &&
          event !== "Leave_room_successfully" &&
          event !== "Emoji"
        ) {
          setRoomEvent(event);
          if (data) setData(data);
        }
        if (event === "Join_room_successfully") {
          toast.success(msg);
          isAdmin.current = data.admin;
          setData(data);
        }
        if (event === "Leave_room_successfully") {
          toast.success(msg);
        }
        if (event === "Emoji") {
          const { emoji, index } = data.emojiData;
          handleEmojiClick(emoji, index);
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      } finally {
        setLoading(false);
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
      confirmExit;
      ws.close();
    };
  }, [roomId, token, isRoomIdValid]);

  const handleEmojiClick = (emoji: string, index: number) => {
    const button = document.getElementById(`emoji-button-${index}`);
    if (!button) return;

    const rect = button.getBoundingClientRect();

    const newEmoji: FloatingEmoji = {
      id: emojiIdCounter.current++,
      emoji,
      x: rect.left + rect.width / 2,
      y: rect.top,
    };

    setFloatingEmojis((prev) => [...prev, newEmoji]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 2000);
  };

  const handleLeaveRoomEvent = async (roomId: string) => {
    const res = await axios.delete(`${Base_url}/room/leave-room/${roomId}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    try {
      if (res.status === 204) {
        console.log("Room metadata deleted successfully");
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const handleExitRoom = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    if (Socket.current) {
      if (isAdmin.current) handleLeaveRoomEvent(roomId);
      SendMsg(Socket.current, roomId, "Leave_room");
      Socket.current.close();
      Socket.current = null;
    }
    setShowExitModal(false);
    navigate("/");
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-black flex flex-col">
      {/* Exit Room Modal */}
      {showExitModal && (
        <ExitRoomModal onConfirm={confirmExit} onCancel={cancelExit} />
      )}

      <div className="fixed inset-0 pointer-events-none z-50">
        {floatingEmojis.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute text-3xl animate-float-emoji"
            style={{
              left: `${emoji.x}px`,
              top: `${emoji.y}px`,
              transform: `translateX(-50%)`,
              animation: `float-emoji 2s ease-out forwards, fade-emoji 2s ease-out forwards`,
            }}
          >
            {emoji.emoji}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            <p className="text-orange-400 mt-4 text-lg font-medium">
              Loading your experience...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="bg-black bg-opacity-70 px-4 py-3 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">
                  Room: {roomInfo?.roomName || `Room ${roomId}`}
                </h1>
                <p className="text-orange-400 text-sm flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Live now
                </p>
              </div>
              <button
                onClick={handleExitRoom}
                className="select-none bg-orange-500 text-white rounded-full py-2 px-6 text-sm font-bold relative overflow-hidden group border border-orange-500 transition-all duration-300 hover:shadow-[0_0_15px_#ff7f11]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-all duration-700 ease-in-out"></span>
                <span className="relative z-10 uppercase tracking-wide text-[13px] group-hover:tracking-widest transition-all duration-500">
                  exit-room
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Video section */}
            <div className="w-2/3 bg-black relative">
              <div className="absolute inset-0">
                <VideoPlayer
                  socket={Socket}
                  roomId={roomId}
                  data={data}
                  roomEvent={RoomEvent}
                  isAdmin={isAdmin}
                />
              </div>
            </div>

            {/* Chat and reactions section */}
            <div className="w-1/3 bg-gray-900 flex flex-col h-full">
              {/* Chat section */}
              <div className="flex-1 border-b border-gray-800 flex flex-col overflow-hidden">
                <div className="p-3 border-b border-gray-800">
                  <h2 className="text-white text-lg font-semibold flex items-center">
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
                    Live Chat
                  </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-center">
                      Chat with friends while watching
                      <br />
                      <span className="text-orange-400 text-sm mt-2 block">
                        Coming soon!
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-800">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      disabled
                      className="w-full bg-gray-700 text-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      disabled
                      className="absolute right-1 top-1 bg-orange-500 text-white rounded-full px-4 py-1 text-sm font-medium"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Reactions panel */}
              <div className="p-3 border-t border-gray-800 bg-gray-900">
                <h2 className="text-white font-semibold mb-3 flex items-center">
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
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Quick Reactions
                </h2>
                <div className="grid grid-cols-4 gap-2 select-none">
                  {["😂", "👍", "❤️", "😮", "😡", "👏", "🔥", "🎉"].map(
                    (emoji, index) => (
                      <button
                        id={`emoji-button-${index}`}
                        key={index}
                        className="emoji-button flex items-center justify-center h-12 bg-gray-800 rounded-lg text-2xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95"
                        onClick={() => {
                          Socket.current?.send(
                            JSON.stringify({
                              roomId: roomId,
                              event: "RoomEvent",
                              roomEvent: "Emoji",
                              emojiData: { emoji: emoji, index: index },
                            })
                          );
                          handleEmojiClick(emoji, index);
                        }}
                      >
                        {emoji}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ExitRoomModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ExitRoomModal = ({ onConfirm, onCancel }: ExitRoomModalProps) => {
  // Use useEffect to add a beforeunload event listener to prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to leave the room?");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Create a portal to render the modal at the document body level
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      <div className="relative z-10 bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden border border-gray-700 animate-fade-in-scale">
        <div className="p-5 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Exit Room</h3>
        </div>
        <div className="p-5">
          <p className="text-gray-300 mb-4">
            Are you sure you want to exit this room? You'll need to rejoin if
            you want to come back.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Exit Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
