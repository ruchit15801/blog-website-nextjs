import "./globals.css";
import "../../public/css/style.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
        </div>
        <script dangerouslySetInnerHTML={{
          __html: `
          (function(){
            var observer = new IntersectionObserver(function(entries){
              entries.forEach(function(entry){
                if(entry.isIntersecting){ entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
              });
            }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
            document.addEventListener('DOMContentLoaded', function(){
              var selectors = [
                'article',
                'section',
                'header',
                'footer',
                '.aside-shadow',
                '.navbar-container',
                '.footer-item-inner',
                '.feature-posts .group',
                '.full-list article',
                '.grid article'
              ];
              var nodes = document.querySelectorAll(selectors.join(','));
              nodes.forEach(function(el){ el.classList.add('reveal'); observer.observe(el); });
              document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });
            });
          })();
        `}} />
      </body>
    </html>
  );
}
