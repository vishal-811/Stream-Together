import { useState } from "react";
import { ArrowRight, Users, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinRoomModal = ({ isOpen, onClose }: JoinRoomModalProps) => {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/room/${roomCode}`);
      onClose();
    }
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600" />

        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px 128px",
          }}
        />

        <button
          type="button"
          onClick={handleCloseClick}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-8 pb-8 relative">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 text-zinc-400 mb-2">
              <span className="h-px w-6 bg-zinc-800" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Join Session
              </span>
              <span className="h-px w-6 bg-zinc-800" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-200">Watch Together</h2>
            <p className="text-zinc-400 mt-2">
              Enter a room code to join your friends
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="roomCode"
                className="block text-sm font-medium text-zinc-400"
              >
                Room Code
              </label>
              <div className="relative">
                <input
                  id="roomCode"
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Enter room code"
                  className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full group bg-orange-500 hover:bg-orange-600 text-zinc-950 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 mt-6"
            >
              Join Room
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;
