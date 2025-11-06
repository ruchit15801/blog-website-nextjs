import Image from "next/image";
import Link from "next/link";

async function fetchPosts(page = 1, limit = 12, search = "") {
  const base = process.env.NEXT_PUBLIC_BLOG_API_URL || "https://api.blogcafeai.com/api/posts";
  const endpoint = `${base}?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
  try {
    const res = await fetch(endpoint, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Failed to fetch posts");
    const json = await res.json();
    return { items: Array.isArray(json?.data) ? json.data : [], meta: json?.meta || { page, limit, total: 0 } };
  } catch (_) {
    return { items: [], meta: { page, limit, total: 0 } };
  }
}

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) > 0 ? Number(params.page) : 1;
  const limit = 12;
  const q = typeof params?.search === "string" ? params.search : "";
  const { items: posts, meta } = await fetchPosts(page, limit, q);
  const total = Number(meta?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="relative bg-[#020C17] text-white min-h-screen pt-12 pb-24 overflow-hidden">
      {/* animated ambient background matching theme */}
      <div className="bg-hero-container" aria-hidden="true">
        <div className="bg-hero-gradient" />
        <div className="bg-hero-grid" />
        <div className="bg-hero-noise" />
        <div className="bg-hero-orb orb-a" />
        <div className="bg-hero-orb orb-b" />
        <div className="bg-hero-orb orb-c" />
        <div className="bg-hero-orb orb-d" />
        <div className="bg-hero-beam beam-1" />
        <div className="bg-hero-beam beam-2" />
      </div>

      <div className="relative px-[20.2rem] media_resp max-lg:px-5 z-[1]">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold heading-glow">Latest Blogs</h1>
            <div className="line-glow mt-2" />
          </div>
          {/* Search bar */}
          <form action="/blog" className="relative w-full md:w-[420px] flex items-center gap-2">
            <input
              name="search"
              defaultValue={q}
              placeholder="Search blogs..."
              className="w-full rounded-full bg-[#0b1622] border border-[#2a3644] px-5 py-3 text-[15px] text-white placeholder-[#6b7a8a] focus:outline-none focus:border-[#DCF836] focus:ring-1 focus:ring-[#DCF836]"
            />
            <input type="hidden" name="page" value="1" />
            <button className="bg-[#DCF836] text-black text-sm font-semibold px-4 py-2 rounded-full hover:brightness-95" aria-label="Search">
              Search
            </button>
            <Link href="/blog" className="border border-[#2a3644] text-[#abb7c4] hover:text-black hover:bg-[#DCF836] text-sm font-semibold px-4 py-2 rounded-full transition-colors" aria-label="Clear search">
              Clear
            </Link>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-8 max-xxl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {posts.map((p) => (
            <a
  key={p?._id}
  href={`https://blogcafeai.com/welcome` || `https://blogcafeai.com/`}
  className="group rounded-2xl overflow-hidden poster-container focus:outline-none focus:ring-2 focus:ring-[#DCF836] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
>
              <div className="relative aspect-[5/3] bg-[#0b1622]">
                <Image
                  src={p?.bannerImageUrl || p?.imageUrls?.[0] || "/BlogCafe_Logo.svg"}
                  alt={p?.title || "Blog"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  quality={90}
                  priority={false}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 brightness-100 group-hover:brightness-105 [image-rendering:auto]"
                />
                {/* bottom vignette only to keep image crisp */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07121c]/50 via-transparent to-transparent pointer-events-none" />
                <span className="poster-orb orb-1" />
                <span className="poster-orb orb-2" />
              </div>
              <div className="p-4 flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-[#DCF836] mt-2 shadow-[0_0_10px_rgba(220,248,54,0.6)]" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#DCF836] transition-colors line-clamp-2">
                    {p?.title}
                  </h3>
                  <div className="mt-2 h-[2px] w-20 underline-shine" />
                </div>
              </div>
            </a>
          ))}

          {posts.length === 0 && (
            <div className="col-span-full text-[#abb7c4]">No blogs available right now.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}${q ? `&search=${encodeURIComponent(q)}` : ""}`}
                className="px-4 py-2 rounded-full border border-[#2a3644] text-[#abb7c4] hover:text-black hover:bg-[#DCF836] transition-colors"
              >
                Prev
              </Link>
            )}

            {Array.from({ length: totalPages }).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((_, idx) => {
              const num = Math.max(1, page - 2) + idx;
              return (
                <Link
                  key={num}
                  href={`/blog?page=${num}${q ? `&search=${encodeURIComponent(q)}` : ""}`}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    num === page
                      ? "bg-[#DCF836] text-black border-[#DCF836]"
                      : "border-[#2a3644] text-[#abb7c4] hover:text-black hover:bg-[#DCF836]"
                  }`}
                >
                  {num}
                </Link>
              );
            })}

            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}${q ? `&search=${encodeURIComponent(q)}` : ""}`}
                className="px-4 py-2 rounded-full border border-[#2a3644] text-[#abb7c4] hover:text-black hover:bg-[#DCF836] transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Blogs | Blogcafeai",
  description: "Read handpicked blogs from BlogCafeAI.",
};


