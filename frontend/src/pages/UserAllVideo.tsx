import { useState, useEffect } from "react";
import {
  Film,
  Search,
  Grid3x3,
  Menu,
  ArrowUpRight,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Base_url } from "@/lib";
import { VideoMetaDataType } from "@/lib/types";
import { toast } from "sonner";

export const UserAllVideos = () => {
  const navigate = useNavigate();

  const [videos, setVideos] = useState<VideoMetaDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const getPresignedUrls = async (urls: string[]) => {
    const presignedUrl = await Promise.all(
      urls.map(async (url) => {
        const res = await axios.post(
          `${Base_url}/video/getPresignedUrl`,
          {
            thumbnailUrl: `uploads/thumbnail/${url}`,
          },
          { withCredentials: true }
        );

        if (res.status === 200) {
          console.log("the presigned url is", res);
          return res.data.msg.signedUrl;
        }
      })
    );
    return presignedUrl;
  };

  const fetchVideos = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get(`${Base_url}/video/all`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        const VideoMetaData = res.data.msg.videoMetaData as VideoMetaDataType[];
        setVideos(VideoMetaData);
        const urls = VideoMetaData.map((video) => {
          return video.thumbnailUrl;
        });
        const presignedUrls = await getPresignedUrls(urls);
        if (!presignedUrls) {
          console.log("No get presigned url fetched from the server");
        } else {
          setThumbnailUrls(presignedUrls);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVideoCardClick = (video: VideoMetaDataType) => {
    if (editingVideo !== video.id) {
      navigate(`/watch/${video.id}`);
    }
  };

  const handleCreateNewVideo = () => {
    navigate("/upload");
  };

  const toggleMenu = (videoId: string) => {
    if (showMenu === videoId) {
      setShowMenu(null);
    } else {
      setShowMenu(videoId);
    }
  };

  const handleEditStart = (e: React.MouseEvent, video: VideoMetaDataType) => {
    e.stopPropagation();
    setShowMenu(null);
    setEditingVideo(video.id);
    setEditData({
      title: video.title,
      description: video.description,
    });
  };

  const handleEditCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVideo(null);
  };

  const handleSaveChanges = async (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    setIsSaving(true);

    try {
      const res = await axios.patch(
        `${Base_url}/video/updateMetaData/${videoId}`,
        {
          title: editData.title,
          description: editData.description,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        const updatedVideos = videos.map((video) =>
          video.id === videoId
            ? {
                ...video,
                title: editData.title,
                description: editData.description,
              }
            : video
        );
        setVideos(updatedVideos);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to update video. Please try again.");
      }
    } finally {
      setEditingVideo(null);
      setIsSaving(false);
    }
  };

  const handleDeleteVideo = async (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    setShowMenu(null);

    if (
      confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      try {
        const res = await axios.delete(`${Base_url}/video/${videoId}`, {
          withCredentials: true,
        });

        if (res.status === 200) {
          setVideos(videos.filter((video) => video.id !== videoId));
          toast.success("Video deleted Successfully");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to delete video:", error.message);
          alert("Failed to delete video. Please try again.");
        }
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: "title" | "description"
  ) => {
    setEditData({
      ...editData,
      [field]: e.target.value,
    });
  };

  const renderGridItem = (video: VideoMetaDataType) => {
    const isEditing = editingVideo === video.id;

    return (
      <div
        key={video.id}
        onClick={() => handleVideoCardClick(video)}
        className={`group bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border ${
          isEditing
            ? "border-orange-500"
            : "border-zinc-800/50 hover:border-orange-500/30"
        } transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-orange-500/10 ${
          !isEditing ? "hover:-translate-y-1" : ""
        } cursor-pointer relative`}
      >
        <div className="aspect-video bg-black relative overflow-hidden">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`w-full h-full object-cover ${
              !isEditing ? "group-hover:scale-105" : ""
            } transition-transform duration-500`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4 relative">
          <div className="flex justify-between items-start">
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => handleInputChange(e, "title")}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-800 border border-orange-500/50 rounded px-3 py-2 text-white w-full mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Video title"
              />
            ) : (
              <h3 className="text-white font-bold mb-2 line-clamp-2 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-orange-600 transition-colors duration-300">
                {video.title}
              </h3>
            )}

            {!isEditing && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu(video.id);
                  }}
                  className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="5" cy="12" r="2" fill="currentColor" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <circle cx="19" cy="12" r="2" fill="currentColor" />
                  </svg>
                </button>

                {showMenu === video.id && (
                  <div className="absolute right-0 top-0 z-10 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl shadow-black/20 overflow-hidden min-w-36">
                    <button
                      onClick={(e) => handleEditStart(e, video)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 w-full text-left text-zinc-300 hover:text-white text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit video
                    </button>
                    <button
                      onClick={(e) => handleDeleteVideo(e, video.id)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-red-900/50 w-full text-left text-red-400 hover:text-red-300 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              value={editData.description}
              onChange={(e) => handleInputChange(e, "description")}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-800 border border-orange-500/50 rounded px-3 py-2 text-white w-full mb-4 min-h-20 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Video description"
            />
          ) : (
            <p className="text-zinc-400 text-sm mb-3 line-clamp-2 border-l border-orange-500/30 pl-2 italic transition-all group-hover:border-l-2 group-hover:border-orange-500/50">
              {video.description}
            </p>
          )}

          {isEditing ? (
            <div className="flex justify-end gap-2">
              <button
                onClick={handleEditCancel}
                className="flex items-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 text-sm"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Cancel
              </button>
              <button
                onClick={(e) => handleSaveChanges(e, video.id)}
                className="flex items-center rounded-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 text-sm"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving
                  </span>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-orange-500 text-xs font-medium flex items-center">
                  Watch <ArrowUpRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // List view item
  const renderListItem = (video: VideoMetaDataType) => {
    const isEditing = editingVideo === video.id;

    return (
      <div
        key={video.id}
        onClick={() => handleVideoCardClick(video)}
        className={`group bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden border ${
          isEditing
            ? "border-orange-500"
            : "border-zinc-800/50 hover:border-orange-500/30"
        } transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-orange-500/10 cursor-pointer relative flex flex-col sm:flex-row`}
      >
        <div className="sm:w-64 bg-black relative">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`w-full h-full object-cover aspect-video sm:aspect-auto ${
              !isEditing ? "group-hover:scale-105" : ""
            } transition-transform duration-500`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleInputChange(e, "title")}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-zinc-800 border border-orange-500/50 rounded px-3 py-2 text-white w-full mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Video title"
                />
              ) : (
                <h3 className="text-white font-bold mb-2 bg-gradient-to-r from-white to-orange-400 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-orange-600 transition-colors duration-300">
                  {video.title}
                </h3>
              )}

              {!isEditing && (
                <div className="relative ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(video.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="5" cy="12" r="2" fill="currentColor" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                      <circle cx="19" cy="12" r="2" fill="currentColor" />
                    </svg>
                  </button>

                  {showMenu === video.id && (
                    <div className="absolute right-0 top-full mt-1 z-10 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl shadow-black/20 overflow-hidden min-w-36 py-1">
                      <button
                        onClick={(e) => handleEditStart(e, video)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-800 w-full text-left text-zinc-300 hover:text-white text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit video
                      </button>
                      <button
                        onClick={(e) => handleDeleteVideo(e, video.id)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-red-900/50 w-full text-left text-red-400 hover:text-red-300 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => handleInputChange(e, "description")}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-800 border border-orange-500/50 rounded px-3 py-2 text-white w-full mb-4 min-h-20 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Video description"
              />
            ) : (
              <p className="text-zinc-400 text-sm mb-4 border-l border-orange-500/30 pl-2 italic transition-all group-hover:border-l-2 group-hover:border-orange-500/50">
                {video.description}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleEditCancel}
                  className="flex items-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 text-sm"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Cancel
                </button>
                <button
                  onClick={(e) => handleSaveChanges(e, video.id)}
                  className="flex items-center rounded-full bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 text-sm"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving
                    </span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 mr-1.5" />
                      Save
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-orange-500 text-sm font-medium flex items-center">
                  Watch now <ArrowUpRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600 animate-pulse">
                Your Videos
              </h1>
              <p className="text-zinc-400 max-w-2xl border-l-2 border-orange-500 pl-4 italic">
                Manage your content, track performance and share your videos
                with the StreamTogether community
              </p>
            </div>
            <button
              onClick={handleCreateNewVideo}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 flex items-center whitespace-nowrap"
            >
              <Film className="w-4 h-4 mr-2" />
              Create New Video
            </button>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your videos"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-800/70 border border-zinc-700/70 rounded-full pl-10 pr-4 py-2.5 w-full text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="bg-zinc-800/70 border border-zinc-700/70 rounded-full p-1 flex items-center">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-full ${
                    viewMode === "grid"
                      ? "bg-orange-500 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/70"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-full ${
                    viewMode === "list"
                      ? "bg-orange-500 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-700/70"
                  }`}
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className="bg-zinc-800/30 rounded-xl overflow-hidden animate-pulse"
              >
                <div className="aspect-video bg-zinc-800"></div>
                <div className="p-4">
                  <div className="h-6 bg-zinc-800 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/50 backdop-blur-sm">
            <div className="w-20 h-20 rounded-full bg-zinc-800/70 flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No videos found
            </h3>
            <p className="text-zinc-400 max-w-md mx-auto mb-8">
              {searchQuery
                ? "No videos match your search criteria. Try different keywords or clear your search."
                : "You haven't uploaded any videos yet. Start sharing your content with the StreamTogether community."}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNewVideo}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 flex items-center mx-auto"
              >
                <Film className="w-4 h-4 mr-2" />
                Upload Your First Video
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(renderGridItem)}
          </div>
        ) : (
          // List view
          <div className="space-y-4">{filteredVideos.map(renderListItem)}</div>
        )}
      </div>
    </div>
  );
};
