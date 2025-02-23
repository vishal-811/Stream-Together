import { useState, useEffect } from "react";
import { Play, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { Upload } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoggedIn = useAuth((state) => state.isLoggedin);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
                <button
                  onClick={() => {
                    navigate("/upload");
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-zinc-700 hover:border-zinc-600 flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </button>
              )}
            </div>

            <button
              className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {["Home", "Features", "About", "Contact"].map((item) => (
                <Link to={'#'}
                  key={item}
                  
                  className="text-zinc-400 hover:text-zinc-100 transition-colors text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
          <button
            onClick={() => {
              navigate("/signin");
              setIsMenuOpen(false);
            }}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-6 py-2 rounded-lg text-lg font-medium transition-colors border border-zinc-800 hover:border-zinc-700"
          >
            Sign In
          </button>
        </div>
      </div>
    </>
  );
};