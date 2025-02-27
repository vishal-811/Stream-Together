import { useState, useEffect } from "react";
import {
  FilmIcon,
  Edit,
  Plus,
  ArrowLeft,
  Loader2,
  X,
  Share2,
  Copy,
  Check,
  Link,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_url } from "@/lib";
import { VideoMetaDataType } from "@/lib/types";

const CreateRoom = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<VideoMetaDataType | null>(
    null
  );
  const [videos, setVideos] = useState<VideoMetaDataType[]>([]);
  const [isVideoSelectorOpen, setIsVideoSelectorOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchingVideos, setFetchingVideos] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setFetchingVideos(true);
        const response = await axios.get(`${Base_url}/video/all`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          const allvideos = response.data.msg.videoMetaData;
          if (allvideos.length > 0) {
            setVideos(allvideos);
          }
        }
      } catch (err) {
        setError("Failed to load videos. Please try again.");
      } finally {
        setFetchingVideos(false);
      }
    };

    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !selectedVideo) {
      if (!title.trim() && !selectedVideo) {
        setError("Please provide a title and select a video");
        return;
      }
      if (!title.trim()) setError("Please provide a title");
      if (!selectedVideo) setError("Please select a video");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const roomData = {
        title,
        description,
        videoId: selectedVideo.id,
      };

      const response = await axios.post(`${Base_url}/room/create`, roomData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        const roomId = response.data.msg.roomId;
        setCreatedRoomId(roomId);
        setIsShareModalOpen(true);
      }
    } catch (err) {
      setError("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyRoomLink = () => {
    if (!createdRoomId) return;

    const roomLink = `${window.location.origin}/room/${createdRoomId}`;
    navigator.clipboard
      .writeText(roomLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setError("Failed to copy link. Please try again.");
      });
  };

  const goToRoom = () => {
    if (createdRoomId) {
      navigate(`/room/${createdRoomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 pt-12 pb-16">
      <div
        className="max-w-3xl mx-auto px-6"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 10%, rgba(251, 146, 60, 0.05) 0%, transparent 60%)",
        }}
      >
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-orange-400 mb-4 text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
            Back to Rooms
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <FilmIcon className="w-5 h-5 text-orange-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300">
              Create New Room
            </h1>
          </div>
          <p className="text-zinc-400 mt-2 text-lg pl-1">
            Set up a space to watch and discuss videos together
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/50 text-red-200 px-5 py-4 rounded-lg mb-8 flex items-start animate-fadeIn backdrop-blur-sm">
            <div className="mr-3 mt-0.5 text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div>{error}</div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 backdrop-blur-sm bg-zinc-900/40 rounded-xl border border-zinc-800/80 p-6 shadow-xl overflow-hidden relative"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-zinc-800/50 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6 relative">
            <div>
              <label
                htmlFor="title"
                className="text-sm font-medium text-zinc-300 mb-2 flex items-center"
              >
                Room Title<span className="text-orange-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-800/80 border border-zinc-700/80 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:ring-orange-500/30 focus:ring-2 focus:outline-none transition-all backdrop-blur-sm"
                placeholder="Enter a catchy title for your room"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-zinc-300 mb-2 flex items-center"
              >
                Description{" "}
                <span className="text-zinc-500 font-normal">(Optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-zinc-800/80 border border-zinc-700/80 focus:border-orange-500 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:ring-orange-500/30 focus:ring-2 focus:outline-none transition-all backdrop-blur-sm"
                placeholder="Describe what viewers can expect in this room"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-6 relative">
            <label className="text-sm font-medium text-zinc-300 mb-3 flex items-center">
              <span>
                Select Video<span className="text-orange-500 ml-0.5">*</span>
              </span>
            </label>

            {selectedVideo ? (
              <div className="bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/70 rounded-lg overflow-hidden mb-3 hover:border-orange-500/30 transition-colors group">
                <div className="p-4 flex items-start gap-4">
                  <div className="flex-shrink-0 w-24 h-16 bg-zinc-700/70 rounded-md flex items-center justify-center overflow-hidden relative group-hover:ring-2 group-hover:ring-orange-500/20 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <FilmIcon className="text-zinc-500 w-8 h-8 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate group-hover:text-orange-400 transition-colors">
                      {selectedVideo.title}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 mt-1">
                      {selectedVideo.description || "No description available"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVideoSelectorOpen(true)}
                    className="flex-shrink-0 text-zinc-400 hover:text-orange-400 transition-colors p-2 hover:bg-zinc-700/30 rounded-full"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsVideoSelectorOpen(true)}
                className="w-full p-6 rounded-lg border-2 border-dashed border-zinc-700/60 hover:border-orange-500/50 bg-zinc-800/50 hover:bg-zinc-800/80 flex flex-col items-center justify-center gap-3 text-zinc-400 hover:text-orange-400 transition-all group backdrop-blur-sm"
              >
                <div className="w-14 h-14 rounded-full bg-zinc-800/80 flex items-center justify-center group-hover:bg-orange-500/10  group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-7 h-7 group-hover:scale-110  group-hover:rotate-90 transition-transform duration-300" />
                </div>
                <span className="font-medium">
                  Select a video for your room
                </span>
                <span className="text-sm text-zinc-500">
                  Choose from your uploaded videos
                </span>
              </button>
            )}
          </div>

          <div className="pt-5 flex gap-4 justify-end border-t border-zinc-800/80 relative">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-lg text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/80 transition-colors backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2 shadow-lg shadow-orange-900/20 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Room...</span>
                </>
              ) : (
                <>
                  <span>Create Room</span>
                  <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {isVideoSelectorOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsVideoSelectorOpen(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-zinc-900 to-zinc-800">
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <FilmIcon className="w-5 h-5 text-orange-400" />
                Select a Video
              </h2>
              <button
                type="button"
                onClick={() => setIsVideoSelectorOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh] p-3">
              {fetchingVideos ? (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                  <Loader2 className="w-10 h-10 mb-3 animate-spin text-orange-500" />
                  <p>Loading your videos...</p>
                </div>
              ) : videos.length > 0 ? (
                <div className="space-y-2">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => {
                        setSelectedVideo(video);
                        setIsVideoSelectorOpen(false);
                      }}
                      className={`p-4 rounded-lg cursor-pointer flex items-start gap-4 transition-all hover:transform hover:scale-[1.01] ${
                        selectedVideo?.id === video.id
                          ? "bg-orange-500/10 border border-orange-500/30"
                          : "hover:bg-zinc-800/70 border border-transparent hover:border-zinc-700/80"
                      }`}
                    >
                      <div className="flex-shrink-0 w-20 h-12 bg-zinc-800/80 rounded flex items-center justify-center">
                        <FilmIcon
                          className={`w-6 h-6 ${
                            selectedVideo?.id === video.id
                              ? "text-orange-400"
                              : "text-zinc-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            selectedVideo?.id === video.id
                              ? "text-orange-400"
                              : "text-white"
                          }`}
                        >
                          {video.title}
                        </h3>
                        <p className="text-sm text-zinc-400 line-clamp-2 mt-1">
                          {video.description || "No description available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                  <FilmIcon className="w-12 h-12 mb-3 opacity-30" />
                  <p className="mb-2">No videos available</p>
                  <a
                    href="/upload"
                    className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1"
                  >
                    Upload your first video <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isShareModalOpen && createdRoomId && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-lg animate-fadeIn"
          onClick={() => {
            setIsShareModalOpen(false);
            goToRoom();
          }}
        >
          <div
            className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-bounceIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                <Share2 className="w-8 h-8 text-orange-400" />
              </div>

              <h2 className="text-xl font-bold text-white mb-1 text-center">
                Room Created Successfully!
              </h2>
              <p className="text-zinc-400 text-center mb-6">
                Share this room with friends to watch together
              </p>

              <div className="w-full p-3 bg-zinc-800/70 rounded-lg mb-4 flex items-center">
                <Link className="text-orange-400 w-5 h-5 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={`${window.location.origin}/room/${createdRoomId}`}
                  className="bg-transparent border-none text-zinc-300 flex-1 outline-none"
                  readOnly
                />
                <button
                  onClick={copyRoomLink}
                  className="bg-zinc-700 hover:bg-zinc-600 rounded-md p-2 text-zinc-300 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={goToRoom}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium transition-all"
                >
                  Go to Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoom;
