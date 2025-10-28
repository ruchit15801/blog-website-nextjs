"use client";

import Image from "next/image";
import React from "react";

type ImageWithCreditProps = {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
    className?: string;
    style?: React.CSSProperties;
    creditText?: string; // defaults to "Source: Gemini AI"
    creditUrl?: string;
    corner?: "br" | "bl" | "tr" | "tl";
};

export default function ImageWithCredit(props: ImageWithCreditProps) {
    const { src, alt, width, height, fill, priority, sizes, className, style, creditText, creditUrl, corner = "br" } = props;

    const cornerClasses = {
        br: "bottom-3 right-3",
        bl: "bottom-3 left-3",
        tr: "top-3 right-3",
        tl: "top-3 left-3",
    } as const;

    const credit = creditText || "Source: Gemini AI";

    const creditNode = (
        <div className={`absolute ${cornerClasses[corner]} z-[2] inline-flex items-center px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full`} style={{ background: "rgba(255,255,255,.88)", color: "#1f2330", backdropFilter: "blur(6px)", boxShadow: "0 10px 24px -12px rgba(0,0,0,.35)" }}>
            {creditUrl ? (
                <a href={creditUrl} target="_blank" rel="noopener nofollow" className="hover:underline opacity-90 hover:opacity-100 transition-opacity duration-200">{credit}</a>
            ) : (
                <span className="opacity-90">{credit}</span>
            )}
        </div>
    );

    return (
        <div className={`relative overflow-hidden ${className || ""}`} style={style}>
            {fill ? (
                <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" loading={priority ? undefined : "lazy"} decoding="async" />
            ) : (
                <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="object-cover w-full h-auto" loading={priority ? undefined : "lazy"} decoding="async" />
            )}
            {creditNode}
            <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,.06))" }} />
        </div>
    );
}


