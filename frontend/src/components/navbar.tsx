import { useState, useEffect } from "react";
import { Play, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  const isLoggedIn = useAuth((state) => state.isLoggedin);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 group">
              <Play className="text-orange-500 w-6 h-6 group-hover:text-orange-400 transition-colors" />
              <span className="text-lg font-semibold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
                StreamTogether
              </span>
            </div>
            <div>
              {!isLoggedIn ? (
                <button
                  onClick={() => navigate("/signin")}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-zinc-800 hover:border-zinc-700"
                >
                  Sign In
                </button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white hover:shadow-md hover:shadow-orange-500/20 transition-all">
                      <User className="w-4 h-4" />
                    </div>
                  </DropdownMenuTrigger>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
