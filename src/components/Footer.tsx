// export default function Footer() {
//     return (
//         <footer className="mt-20 border-t border-white/10">
//             <div className="mx-auto max-w-6xl px-4 py-10 text-sm opacity-80 flex flex-col sm:flex-row items-center justify-between gap-3">
//                 <p>
//                     © {new Date().getFullYear()} Blogcafeai. Built with Next.js.
//                 </p>
//                 <p>
//                     <a href="#" className="hover:underline" style={{ color: "var(--brand-muted-blue)" }}>Privacy</a>
//                     <span className="mx-2">•</span>
//                     <a href="#" className="hover:underline" style={{ color: "var(--brand-teal)" }}>Terms</a>
//                 </p>
//             </div>
//         </footer>
//     );
// }



export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/10 bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
        {/* ===== LEFT SIDE ===== */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-semibold">Blogcafeai</span>
          </div>

          <p className="mb-4 opacity-80">
            Your daily dose of tech stories, tutorials, and design inspiration.
          </p>

          <div className="flex gap-4 mb-4">
            {/* social icons */}
            <a href="#" aria-label="Twitter" className="hover:opacity-80">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53..." />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:opacity-80">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3..." />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:opacity-80">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8..." />
              </svg>
            </a>
          </div>

          <p className="opacity-60">© {year} – Revision. All Rights Reserved.</p>
        </div>

        {/* ===== RIGHT SIDE ===== */}
        <div className="sm:col-span-1 lg:col-span-3 flex justify-end">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* === Homepages === */}
            <li>
              <a href="#" className="block text-base font-semibold mb-3">
                Homepages
              </a>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:underline">Classic List</a></li>
                <li><a href="#" className="hover:underline">Classic Grid</a></li>
                <li><a href="#" className="hover:underline">Classic Overlay</a></li>
                <li><a href="#" className="hover:underline">Hero Slider</a></li>
                <li><a href="#" className="hover:underline">Featured Posts</a></li>
              </ul>
            </li>

            {/* === Categories === */}
            <li>
              <a href="#" className="block text-base font-semibold mb-3">
                Categories
              </a>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:underline">Technology</a></li>
                <li><a href="#" className="hover:underline">Travel</a></li>
                <li><a href="#" className="hover:underline">Sport</a></li>
                <li><a href="#" className="hover:underline">Business</a></li>
              </ul>
            </li>

            {/* === Pages === */}
            <li>
              <a href="#" className="block text-base font-semibold mb-3">
                Pages
              </a>
              <ul className="space-y-2 opacity-80">
                <li><a href="#" className="hover:underline">About</a></li>
                <li><a href="#" className="hover:underline">Categories</a></li>
                <li><a href="#" className="hover:underline">Contacts</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}


