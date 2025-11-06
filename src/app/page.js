import Games from "@/components/Games";
import AnimatedBackground from "@/components/AnimatedBackground";

export const metadata = {
  title: "Free Online Games on Blogcafeai| Play Now!",
  description:
    "Discover over 1,000 free games on Blogcafeai, including funny, shooting, sports, action, brain games, and more. Play now, no download needed!",
};

export default function Home() {
  return (
    <div className="min-h-screen -mt-20 relative">
      <AnimatedBackground />
      <div className="relative z-[1]">
        <Games />
      </div>
    </div>
  );
}
