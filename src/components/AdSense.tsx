"use client";

import { useEffect } from "react";

type AdSenseProps = {
    type: "banner" | "inner" | "content";
    className?: string;
};

export default function AdSense({ type, className = "" }: AdSenseProps) {
    useEffect(() => {
        try {

            if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {

                window.adsbygoogle.push({});
            }
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    if (type === "banner") {
        return (
            <div className={`w-full ${className}`}>
                <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-format="autorelaxed"
                    data-ad-client="ca-pub-8481647724806223"
                    data-ad-slot="5385999097"
                />
            </div>
        );
    }

    if (type === "content") {
        // Content ad - appears within blog content
        return (
            <div className={`w-full my-8 ${className}`}>
                <ins
                    className="adsbygoogle"
                    style={{ display: "block" }}
                    data-ad-format="fluid"
                    data-ad-layout-key="-fb+5w+4e-db+86"
                    data-ad-client="ca-pub-8481647724806223"
                    data-ad-slot="5865167783"
                />
            </div>
        );
    }

    // Inner image ad
    return (
        <div className={`w-full ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-format="fluid"
                data-ad-layout-key="-fb+5w+4e-db+86"
                data-ad-client="ca-pub-8481647724806223"
                data-ad-slot="2844252778"
            />
        </div>
    );
}

