import { useState, useEffect } from "react";
import { Play, User, Plus, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import Cookies from "js-cookie";
import { Button } from "./ui/button";
import JoinRoomModal from "./joinRoomModal";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
  const username = useAuth((state) => state.userName);

  const setIsLoggedIn = useAuth((state) => state.setIsLoggedin);
  const isLoggedIn = useAuth((state) => state.isLoggedin);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  function handleJoinRoom() {
    setIsJoinRoomModalOpen(true);
  }

  function handleCreateRoom() {
    navigate("/createRoom");
  }

  function handleSignOut() {
    Cookies.remove("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/signin");
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Play className="text-orange-500 w-6 h-6 group-hover:text-orange-400 transition-colors" />
              <span className="text-lg font-semibold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
                StreamTogether
              </span>
            </div>
            <div className="relative">
              {!isLoggedIn ? (
                <button
                  onClick={() => navigate("/signin")}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-zinc-800 hover:border-zinc-700"
                >
                  Sign In
                </button>
              ) : (
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 relative px-4 hover:bg-zinc-800/50 focus:bg-zinc-800/50 text-zinc-100 border-none"
                      >
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                          <User className="h-4 w-4" />
                        </div>
                        {username ? (
                          <span className="font-medium">Hi, {username}</span>
                        ) : (
                          <span className="font-medium">Hi, profile</span>
                        )}
                        <svg
                          className="w-4 h-4 transition-transform duration-200 dropdown-arrow text-zinc-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      side="bottom"
                      sideOffset={8}
                      className="w-56 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg shadow-black/20 text-zinc-100 overflow-hidden z-50"
                      style={{
                        position: "absolute",
                        right: 0,
                        transform: "translateX(0)",
                      }}
                    >
                      <DropdownMenuLabel className="font-normal px-4 py-2 text-zinc-400 border-b border-zinc-800">
                        <span className="text-sm font-medium">Profile</span>
                      </DropdownMenuLabel>

                      <div className="py-1">
                        <DropdownMenuItem
                          onClick={handleJoinRoom}
                          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-zinc-100 hover:bg-zinc-800 focus:bg-zinc-800 transition-colors outline-none"
                        >
                          <Users className="h-4 w-4 text-zinc-400" />
                          <span>Join Room</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={handleCreateRoom}
                          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-zinc-100 hover:bg-zinc-800 focus:bg-zinc-800 transition-colors outline-none"
                        >
                          <Plus className="h-4 w-4 text-zinc-400" />
                          <span>Create Room</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="h-px bg-zinc-800 my-1" />

                        <DropdownMenuItem
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer  hover:bg-zinc-800 focus:bg-zinc-800 transition-colors outline-none text-orange-400 hover:text-orange-300"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Join Room Modal */}
      <JoinRoomModal
        isOpen={isJoinRoomModalOpen}
        onClose={() => setIsJoinRoomModalOpen(false)}
      />
    </>
  );
};
