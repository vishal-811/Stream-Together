import StreamTogetherHero from "@/components/hero"
import PricingSection from "@/components/pricing"
import WhyChooseUs from "@/components/whyChooseUs"

export const HomePage = () =>{
    return(
       <div className="w-full min-h-screen bg-zinc-950">
          <StreamTogetherHero/>
           <WhyChooseUs/>
           <PricingSection/>
       </div>
    )
}