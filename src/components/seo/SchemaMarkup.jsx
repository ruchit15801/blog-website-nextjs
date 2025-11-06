import Head from "next/head";

export const SchemaMarkup = () => {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.Blogcafeai.com";

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Blogcafeai",
            url: siteUrl,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
            publisher: {
              "@type": "Organization",
              name: "Blogcafeai",
              url: siteUrl,
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/favicon-96x96.png`,
              },
            },
          }),
        }}
      />
    </Head>
  );
};
