import { Navbar } from "@/components/navbar";
import { ArrowRight, Play } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StreamTogetherHero = () => {
  
  const navigate = useNavigate();
  
  useEffect(()=>{

  })

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden antialiased">
      {/* Gradient underlays */}
      <div className="fixed inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272711_1px,transparent_1px),linear-gradient(to_bottom,#27272711_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      <Navbar/>

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <main className="relative pt-32 lg:pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-center gap-2 text-zinc-400">
                <span className="h-px w-6 bg-zinc-800" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Introducing StreamTogether
                </span>
                <span className="h-px w-6 bg-zinc-800" />
              </div>
              <h1 className="text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight font-bold text-zinc-300">
                Watch Together,{" "}
                <span className="text-orange-500">Perfectly Synced</span>
              </h1>
            </div>

            <p className="text-zinc-400 text-lg/relaxed max-w-2xl mb-10">
              Experience seamless synchronized streaming with friends and family
              worldwide. Share reactions, create memories, and never miss a
              moment together.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <button
                onClick={() => navigate("/uservideos")}
                className="w-full sm:w-auto group bg-orange-500 hover:bg-orange-600 text-zinc-950 px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/upload")}
                className="w-full sm:w-auto group bg-zinc-900 hover:bg-zinc-800 text-zinc-100 px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border border-zinc-800 hover:border-zinc-700"
              >
                Upload Video
                <Play className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="mt-16 pt-16 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl">
              {[
                { label: "Active Users", value: "50K+" },
                { label: "Watch Time", value: "1M+ hrs" },
                { label: "Countries", value: "150+" },
                { label: "Satisfaction", value: "99.9%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-2xl font-bold text-zinc-100">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StreamTogetherHero;