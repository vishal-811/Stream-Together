import { Check, Star, Zap, Crown } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      icon: <Star className="w-6 h-6 text-blue-400" />,
      description: "Perfect for casual viewers",
      gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
      borderGlow: "hover:shadow-blue-500/10",
      features: [
        "Watch with up to 2 friends",
        "720p video quality",
        "Basic chat features",
        "5 hours monthly watch time",
        "Public rooms only",
      ]
    },
    {
      name: "Pro",
      price: "9.99",
      icon: <Zap className="w-6 h-6 text-orange-400" />,
      description: "For dedicated streamers",
      gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
      borderGlow: "hover:shadow-orange-500/10",
      popular: true,
      features: [
        "Watch with up to 10 friends",
        "1080p video quality",
        "Advanced chat & reactions",
        "Unlimited watch time",
        "Private rooms",
        "Custom room backgrounds",
        "Priority support"
      ]
    },
    {
      name: "Ultimate",
      price: "19.99",
      icon: <Crown className="w-6 h-6 text-purple-400" />,
      description: "For power users",
      gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
      borderGlow: "hover:shadow-purple-500/10",
      features: [
        "Watch with unlimited friends",
        "4K video quality",
        "Premium chat & reactions",
        "Unlimited watch time",
        "Private rooms with passwords",
        "Custom room themes",
        "24/7 priority support",
        "Early access to features",
        "Custom emojis"
      ]
    }
  ];

  return (
    <section className="py-24 bg-zinc-950 overflow-hidden w-full">
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

      <div className="w-full relative">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-2 text-zinc-400 mb-6">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
            <span className="text-sm font-medium uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
              Simple Pricing
            </span>
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-zinc-300 mb-6">
            Choose Your 
            <span className="relative mx-2">
              <span className="text-orange-500">Perfect Plan</span>
              <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Select the perfect plan that matches your watching style. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[90%] mx-auto px-4">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 
                transition-all duration-500 hover:-translate-y-2 ${plan.borderGlow}
                overflow-hidden backdrop-blur-sm`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 
                group-hover:opacity-100 transition-opacity duration-500`} />
              
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-orange-500 text-zinc-950 text-sm font-semibold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <div className="relative p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-zinc-800/50 group-hover:scale-110 transition-transform duration-300">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-200">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-zinc-200">${plan.price}</span>
                    <span className="text-zinc-400">/month</span>
                  </div>
                  <p className="text-zinc-500 mt-2">{plan.description}</p>
                </div>

                <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300
                  ${plan.popular 
                    ? 'bg-orange-500 hover:bg-orange-600 text-zinc-950' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'}`}>
                  Get Started
                </button>

                <div className="mt-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-zinc-400">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-zinc-400">
            All plans include basic features like synchronized playback and cross-device support.
            <br />
            <span className="text-orange-500 hover:text-orange-400 cursor-pointer transition-colors">
              Contact us
            </span>
            {" "}for custom enterprise solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;