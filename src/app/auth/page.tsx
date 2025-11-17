"use client";

import React, { Suspense, } from "react";
import AuthContent from "./AuthContent";
import Loader from "@/components/Loader";

export const dynamic = "force-dynamic";
export default function AuthPage() {
    return (
        <Suspense fallback={<Loader />}>
            <AuthContent />
        </Suspense>
    );
}