"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";
import { fetchPostById, getAdminToken } from "@/lib/adminClient";
import DashboardLayout from "../../DashBoardLayout";
import { LinkedinIcon, InstagramIcon, FacebookIcon } from "lucide-react";
import toast from "react-hot-toast";

type RemotePost = {
  _id: string;
  title: string;
  subtitle?: string;
  contentHtml: string;
  bannerImageUrl?: string;
  imageUrls?: string[];
  category?: string;
  tags?: string[];
  author?: { fullName: string; twitterUrl: string; facebookUrl: string; instagramUrl: string; linkedinUrl: string };
  publishedAt?: string;
  readingTimeMinutes?: string;
};

export default function PostPage() {
  const [post, setPost] = useState<RemotePost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token =
    typeof window !== "undefined" ? getAdminToken() || localStorage.getItem("token") : null;

  const params = useParams();
  const postId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) throw new Error("Missing auth token. Please login.");
        const response = await fetchPostById(postId, token);

        const maybePost = (response?.post ?? response?.data ?? response) as RemotePost | undefined;
        if (!maybePost) throw new Error("Post not found");
        setPost(maybePost);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        toast.error(msg || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, token]);

  if (loading) return <Loader inline label="Loading post..." />;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!post) return <div className="text-gray-500 text-center py-10">Post not found</div>;

  /** New function to inject images in content every 3 paragraphs */
  function getContentWithImages(post: RemotePost) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.contentHtml, "text/html");
    const paragraphs = Array.from(doc.body.children); // <p>, <h2>, etc

    const blocks: Array<string | { type: "image"; url: string }> = [];
    let imageIndex = 0;

    paragraphs.forEach((p, i) => {
      blocks.push(p.outerHTML); // original content block
      if ((i + 1) % 3 === 0 && post.imageUrls && imageIndex < post.imageUrls.length) {
        blocks.push({ type: "image", url: post.imageUrls[imageIndex] });
        imageIndex++;
      }
    });

    // Remaining images at the end
    if (post.imageUrls) {
      for (let j = imageIndex; j < post.imageUrls.length; j++) {
        blocks.push({ type: "image", url: post.imageUrls[j] });
      }
    }

    return blocks;
  }

  const contentBlocks = getContentWithImages(post);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        {post.bannerImageUrl && (
          <div className="relative w-full h-56 sm:h-72 md:h-96 lg:h-[28rem] rounded-2xl overflow-hidden">
            <Image src={post.bannerImageUrl} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {/* Main Layout */}
        <div className="flex justify-center">
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto">
            {/* Sidebar */}
            <div
              className="w-full sm:w-auto lg:w-1/5 flex-shrink-0 flex justify-center lg:block mb-4 lg:mb-0"
              style={{ position: "sticky", top: "80px", alignSelf: "start" }}
            >
              <div className="flex gap-6 sm:flex-row lg:flex-col sm:items-center justify-center lg:justify-start">
                {/* Reading Time Circle */}
                <div
                  className="relative flex items-center justify-center text-center font-bold rounded-full"
                  style={{ width: "90px", height: "90px" }}
                >
                  <div
                    className="flex items-center justify-center text-gray-800"
                    style={{
                      position: "sticky",
                      top: "100px",
                      width: "70px",
                      height: "70px",
                      boxShadow: "0px 5px 20px rgba(114, 114, 255, 0.15)",
                      background: "#fff",
                      borderRadius: "9999px",
                      transition: ".25s",
                    }}
                  >
                    <span className="text-sm font-bold px-2" style={{ fontSize: "0.85rem" }}>
                      {post.readingTimeMinutes || 0} min read
                    </span>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex flex-row sm:flex-row lg:flex-col items-center gap-4 text-gray-800">
                  {post.author?.twitterUrl && (
                    <a
                      href={post.author.twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter"
                      className="hover:text-blue-600 transition-colors"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path d="M13.982 10.622 20.54 3h-1.554l-5.693 6.618L8.745 3H3.5l6.876 10.007L3.5 21h1.554l6.012-6.989L15.868 21h5.245l-7.131-10.378Zm-2.128 2.474-.697-.997-5.543-7.93H8l4.474 6.4.697.996 5.815 8.318h-2.387l-4.745-6.787Z" />
                      </svg>
                    </a>
                  )}
                  {post.author?.facebookUrl && (
                    <a
                      href={post.author.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="hover:text-sky-500 transition-colors"
                    >
                      <FacebookIcon />
                    </a>
                  )}
                  {post.author?.instagramUrl && (
                    <a
                      href={post.author.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="hover:text-pink-500 transition-colors"
                    >
                      <InstagramIcon />
                    </a>
                  )}
                  {post.author?.linkedinUrl && (
                    <a
                      href={post.author.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="hover:text-blue-700 transition-colors"
                    >
                      <LinkedinIcon />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-4/5 flex flex-col space-y-4">
              {post.publishedAt && (
                <div className="text-sm text-indigo-600 font-medium">
                  Published At :{" "}
                  {new Date(post.publishedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              )}
              {post.subtitle && (
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 text-center lg:text-left">
                  {post.subtitle}
                </h2>
              )}

              <div className="text-base sm:text-lg leading-relaxed text-gray-800 space-y-4">
                {contentBlocks.map((block, idx) =>
                  typeof block === "string" ? (
                    <div
                      key={idx}
                      className="prose_content prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: block }}
                    />
                  ) : (
                    <div
                      key={idx}
                      className="relative w-full sm:w-3/4 h-64 mx-auto my-6 rounded-2xl overflow-hidden shadow-lg"
                    >
                      <Image src={block.url} alt={`Post image ${idx}`} fill className="object-cover rounded-2xl" />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}