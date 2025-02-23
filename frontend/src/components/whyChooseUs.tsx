import { Shield, Users, Globe, Zap, Heart, Video, MessageCircle, Share2 } from 'lucide-react';

export const WhyChooseUs = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "Watch Together",
      description: "Experience real-time synchronized streaming with friends and family, no matter where they are in the world.",
      gradient: "from-orange-500/20 to-transparent"
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "Perfect Sync",
      description: "Our advanced technology ensures everyone stays perfectly synchronized, down to the millisecond.",
      gradient: "from-blue-500/20 to-transparent"
    },
    {
      icon: <Shield className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "Secure & Private",
      description: "End-to-end encryption and private rooms ensure your watching experience remains safe and intimate.",
      gradient: "from-green-500/20 to-transparent"
    },
    {
      icon: <Heart className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "Interactive Experience",
      description: "React, chat, and share moments in real-time with built-in social features that bring people together.",
      gradient: "from-red-500/20 to-transparent"
    },
    {
      icon: <Video className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "HD Streaming",
      description: "Enjoy high-quality video streaming with adaptive bitrate technology for smooth playback.",
      gradient: "from-purple-500/20 to-transparent"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "Live Chat",
      description: "Built-in chat system lets you share reactions and discussions without leaving the viewing experience.",
      gradient: "from-teal-500/20 to-transparent"
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "Global Access",
      description: "Connect with viewers from over 150 countries, breaking down geographical barriers.",
      gradient: "from-indigo-500/20 to-transparent"
    },
    {
      icon: <Share2 className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform duration-300" />,
      title: "Easy Sharing",
      description: "Share your favorite content with one click and invite friends to join your viewing party instantly.",
      gradient: "from-pink-500/20 to-transparent"
    }
  ];

  return (
    <section className="w-full py-24 px-6 bg-zinc-950 overflow-hidden">  
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 text-zinc-400 mb-6">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
            <span className="text-sm font-medium uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
              Why Choose StreamTogether
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-zinc-300 mb-6">
            The Ultimate{" "}
            <span className="relative">
              <span className="text-orange-500">Co-Watching</span>
              <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            </span>
            {" "}Experience
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            We've built the most comprehensive platform for watching together online, 
            combining cutting-edge technology with social features that bring people closer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group p-6 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 
                transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10
                relative overflow-hidden cursor-pointer`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 
                group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;