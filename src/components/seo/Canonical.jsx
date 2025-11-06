"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Canonical() {
  const pathname = usePathname();

  useEffect(() => {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const canonicalUrl = `${protocol}//${host}${pathname}`;

    let link = document.querySelector("link[rel='canonical']");

    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }

    link.setAttribute("href", canonicalUrl);
  }, [pathname]);

  return null;
}
