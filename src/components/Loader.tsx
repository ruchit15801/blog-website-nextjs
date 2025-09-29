"use client";

import React from "react";

export default function Loader({ inline = false, label }: { inline?: boolean; label?: string }) {
    const content = (
        <div className="flex items-center justify-center gap-3">
            <div className="loader-ring">
                <span className="loader-dot" />
                <span className="loader-dot" />
                <span className="loader-dot" />
            </div>
            {label ? <span className="text-gray-600 text-sm font-medium">{label}</span> : null}
        </div>
    );

    if (inline) return content;

    return (
        <div className="w-full flex items-center justify-center py-10">
            {content}
        </div>
    );
}


