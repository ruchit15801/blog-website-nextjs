export function slugifyTitle(title: string): string {
    const base = (title || "").toString().toLowerCase();
    return base
        .normalize("NFKD")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 90);
}

export function buildSlugPath(id: string, title?: string): string {
    const safeId = (id || "").toString();
    const slug = slugifyTitle(title || "article");
    return `${slug}-${safeId}`;
}

export function extractIdFromSlug(slugParam: string | string[] | undefined): string | null {
    const raw = Array.isArray(slugParam) ? slugParam[0] : slugParam || "";
    if (!raw) return null;
    // Expect format: some-title-<id>
    const parts = raw.split("-");
    const candidate = parts[parts.length - 1];
    // Accept any non-empty; optionally validate hex-ish id length
    if (candidate && candidate.length >= 8) return candidate;
    // Fallback: when route was created with pure id
    return raw || null;
}

