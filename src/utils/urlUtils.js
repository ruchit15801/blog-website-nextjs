/**
 * Convert game title to URL-friendly slug
 * @param {string} title - The game title
 * @returns {string} - URL-friendly slug
 */
export function titleToSlug(title) {
    if (!title) return '';

    return title
        .toLowerCase()
        .trim()
        // Replace spaces and special characters with hyphens
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        // Remove multiple consecutive hyphens
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '');
}

/**
 * Convert URL slug back to title format (for display purposes)
 * @param {string} slug - The URL slug
 * @returns {string} - Formatted title
 */
export function slugToTitle(slug) {
    if (!slug) return '';

    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Normalize a string for loose comparisons (case-insensitive, alphanumeric only, single spaces)
 * @param {string} value
 * @returns {string}
 */
export function normalizeTitle(value) {
    if (!value) return '';
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');
}

/**
 * Parse dynamic route param that may contain an ID prefix (e.g., "68111-road-crosser").
 * Returns numeric id (string) if present and the slug portion.
 * @param {string} param
 * @returns {{ id: string|null, slug: string }}
 */
export function parseGameSlug(param) {
    if (!param) return { id: null, slug: '' };
    const match = param.match(/^(\d+)-(.*)$/);
    if (match) {
        return { id: match[1], slug: match[2] || '' };
    }
    return { id: null, slug: param };
}

/**
 * Build a stable path that starts with the game id when available.
 * @param {{ id?: string|number, _id?: string|number, gameId?: string|number, title?: string }} game
 * @returns {string}
 */
export function buildGamePath(game) {
    const id = (game?.id ?? game?._id ?? game?.gameId)?.toString();
    const slug = titleToSlug(game?.title || id || '');
    return id ? `${id}-${slug}` : slug;
}