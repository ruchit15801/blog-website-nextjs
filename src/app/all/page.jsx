import Games from "@/components/Games";

export const metadata = {
  title: "All Games | Blogcafeai",
  description: "Browse all free online games on Blogcafeai. Search and paginate through our full catalog. No install, play on any device.",
};

export default function AllGamesPage() {
  return (
    <div className="min-h-screen -mt-20">
      <Games />
    </div>
  );
}


