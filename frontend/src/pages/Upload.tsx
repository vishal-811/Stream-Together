import { useState, useRef } from "react";
import { ArrowRight, Image, Film, X } from "lucide-react";
import axios from "axios";
import { Base_url } from "@/lib";
import { toast } from "sonner";

export const UploadPage = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [videoPresignedUrl, setVideoPresignedUrl] = useState<string | null>(
    null
  );
  const [thumbnailPresignedUrl, setThumbnailPresignedUrl] = useState<
    string | null
  >(null);

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);
    }
  };

  const handleThumbnailChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreviewUrl(imageUrl);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreviewUrl(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreviewUrl(null);
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  const postPreSignedUrl = async (
    fileName: string,
    fileType: string
  ): Promise<string | null> => {
    try {
      const res = await axios.post(
        `${Base_url}/video/postPreSignedUrl`,
        {
          fileName: fileName,
          fileType: fileType,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        const url = res.data.msg.signedUrl;
        if (!url) throw new Error("Presigned url not found");
        return url;
      }
    } catch (error) {
      console.log(error);
      return null;
    }

    return null;
  };

  const UploadToS3 = async (
    file: File,
    fileType: string,
    preSignedUrl: string
  ) => {
    const fileBuffer = await file.arrayBuffer();
    
    if(fileType === "image/jpeg"){
      setThumbnailUrl(file.name);
    }
    if(fileType === "video/mp4"){
      setVideoUrl(file.name);
    }
    try {
      const s3Response = await axios.put(preSignedUrl, fileBuffer, {
        headers: { "Content-Type": fileType },
      });

      if (s3Response.status === 200) {
        console.log("the video and thumbnail uploaded");  
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      if (videoFile) {
        const url = await postPreSignedUrl(videoFile.name, videoFile.type);
        if (url) {
          setVideoPresignedUrl(url);
        }
      }

      if (thumbnailFile) {
        const url = await postPreSignedUrl(
          thumbnailFile.name,
          thumbnailFile.type
        );
        if (url) {
          setThumbnailPresignedUrl(url);
        }
      }

      await Promise.all([
        UploadToS3(videoFile!, videoFile!.type, videoPresignedUrl!),
        UploadToS3(thumbnailFile!, thumbnailFile!.type, thumbnailPresignedUrl!),
      ]);

      // Upload the metadata to the db.
      const res = await axios.post(
        `${Base_url}/video/upload`,
        {
          title: title,
          description: description,
          videoUrl: videoUrl,
          thumbnailUrl: thumbnailUrl,
        },
        { withCredentials: true },
      );

      if (res.status === 201) {
        toast.success(res.data.msg);
        setThumbnailFile(null);
        setVideoFile(null);
        setTitle("");
        setDescription("");

        // Navigate to user all videos page
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-zinc-950 relative overflow-hidden antialiased">
      {/* Gradient underlays */}
      <div className="fixed inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272711_1px,transparent_1px),linear-gradient(to_bottom,#27272711_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <main className="relative pt-12 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center gap-2 text-zinc-400">
                <span className="h-px w-6 bg-zinc-800" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Upload Content
                </span>
                <span className="h-px w-6 bg-zinc-800" />
              </div>
              <h1 className="text-4xl/tight sm:text-5xl/tight font-bold text-zinc-300">
                Share Your <span className="text-orange-500">Video</span>
              </h1>
            </div>

            <p className="text-zinc-400 text-lg/relaxed max-w-2xl mb-10">
              Upload your videos to share unforgettable moments with friends,
              family, or the world.✨ Add a video and stream together in real
              time!" 🚀
            </p>

            <form onSubmit={handleSubmit} className="w-full">
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-8 backdrop-blur-sm mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Video Upload Section */}
                  <div className="w-full">
                    <label className="block text-zinc-300 text-lg font-medium mb-3 text-left">
                      Video
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg ${
                        videoFile
                          ? "border-orange-500/50 bg-orange-500/5"
                          : "border-zinc-700 bg-zinc-800/20"
                      } p-4 text-center relative`}
                    >
                      {!videoFile ? (
                        <>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            ref={videoInputRef}
                          />
                          <div className="py-12 flex flex-col items-center">
                            <Film className="h-10 w-10 text-zinc-500 mb-2" />
                            <p className="text-zinc-400 mb-1">
                              Drag and drop your video
                            </p>
                            <p className="text-zinc-500 text-sm">
                              or click to browse files
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={handleRemoveVideo}
                            className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 text-zinc-400 hover:text-zinc-200 focus:outline-none"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <video
                            src={videoPreviewUrl!}
                            className="w-full h-40 object-cover rounded"
                            controls
                          />
                          <p className="mt-2 text-zinc-400 text-sm truncate">
                            {videoFile.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Upload Section */}
                  <div className="w-full">
                    <label className="block text-zinc-300 text-lg font-medium mb-3 text-left">
                      Thumbnail
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg ${
                        thumbnailFile
                          ? "border-orange-500/50 bg-orange-500/5"
                          : "border-zinc-700 bg-zinc-800/20"
                      } p-4 text-center relative`}
                    >
                      {!thumbnailFile ? (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            ref={thumbnailInputRef}
                          />
                          <div className="py-12 flex flex-col items-center">
                            <Image className="h-10 w-10 text-zinc-500 mb-2" />
                            <p className="text-zinc-400 mb-1">
                              Drag and drop your thumbnail
                            </p>
                            <p className="text-zinc-500 text-sm">
                              or click to browse files
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={handleRemoveThumbnail}
                            className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 text-zinc-400 hover:text-zinc-200 focus:outline-none"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <img
                            src={thumbnailPreviewUrl!}
                            alt="Thumbnail preview"
                            className="w-full h-40 object-cover rounded"
                          />
                          <p className="mt-2 text-zinc-400 text-sm truncate">
                            {thumbnailFile!.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Details Section */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-8 backdrop-blur-sm">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-zinc-300 text-lg font-medium mb-2 text-left"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Give your video a title"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-zinc-300 text-lg font-medium mb-2 text-left"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Describe your video"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  disabled={!videoFile || isUploading}
                  className="group bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 min-w-40"
                >
                  {isUploading ? "Uploading..." : "Upload Video"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
