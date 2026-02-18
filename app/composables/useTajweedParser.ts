/**
 * Tajweed markup parser for AlQuran.cloud API quran-tajweed edition.
 *
 * The API returns text with inline tags like:
 *   [h:1[ٱ]   → Hamzah Wasl
 *   [l[ل]     → Lam Shamsiyyah
 *   [n[ٰ]     → Small High Meem / Nun
 *   [p[ِي]    → Meem Saakinah
 *   [s[وْ]    → Silent letter
 *   [q[بْ]    → Qalqalah
 *   [f[نْ]    → Far' (noon/meem related)
 *   [g[مّ]    → Ghunnah
 *   [m[َا]    → Madd (elongation)
 *   [o[َا]    → Madd Laazim
 *   [c[ُمْ]   → Ikhfa Shafawi
 *   [a[ً]     → Tanween
 *   [u[ِنْ]   → Ikhfa
 *   [i[مْ]    → Iqlab
 *   [w[ُمْ]   → Idgham with Ghunnah
 *
 * Each tag maps to a CSS class for color rendering.
 */

const TAG_MAP: Record<string, string> = {
    'h': 'tj-hamzah',        // Hamzah wasl — dark gray
    'l': 'tj-lam',           // Lam shamsiyyah — teal
    'n': 'tj-madd-normal',   // Normal madd (2 harakat) — orange
    'p': 'tj-madd-permissible', // Madd 'iwad/permissible — purple
    's': 'tj-silent',        // Silent — gray
    'q': 'tj-qalqalah',     // Qalqalah — blue
    'f': 'tj-ikhfa-noon',   // Rules of noon saakinah — green
    'g': 'tj-ghunnah',      // Ghunnah — dark green
    'm': 'tj-madd-obligatory', // Madd laazim/obligatory — red
    'o': 'tj-madd-normal',  // Also madd — orange
    'c': 'tj-ikhfa-meem',   // Ikhfa shafawi — indigo
    'a': 'tj-idgham-no-ghunnah', // Idgham without ghunnah — cyan
    'u': 'tj-ikhfa',        // Ikhfa — light green
    'i': 'tj-iqlab',        // Iqlab — pink
    'w': 'tj-idgham-ghunnah', // Idgham with ghunnah — teal
}

/**
 * Parse tajweed markup text into HTML with colored spans.
 * Handles nested and sequential tags.
 */
export function parseTajweed(text: string): string {
    if (!text) return ''

    let result = ''
    let i = 0

    while (i < text.length) {
        // Match tag patterns like [h:123[content] or [l[content]
        if (text[i] === '[') {
            const tagChar = text[i + 1]

            if (tagChar && TAG_MAP[tagChar]) {
                // Find content start — either [x[ or [x:NNN[
                let contentStart = -1

                if (text[i + 2] === '[') {
                    // Short form: [x[content]
                    contentStart = i + 3
                } else if (text[i + 2] === ':') {
                    // Long form: [x:NNN[content]
                    const innerBracket = text.indexOf('[', i + 3)
                    if (innerBracket !== -1) {
                        contentStart = innerBracket + 1
                    }
                }

                if (contentStart !== -1) {
                    // Find the matching closing bracket
                    const contentEnd = text.indexOf(']', contentStart)
                    if (contentEnd !== -1) {
                        const content = text.substring(contentStart, contentEnd)
                        const cssClass = TAG_MAP[tagChar]
                        // Recursively parse content (might have nested tags)
                        result += `<span class="${cssClass}">${parseTajweed(content)}</span>`
                        i = contentEnd + 1
                        continue
                    }
                }
            }
        }

        result += text[i]
        i++
    }

    return result
}

/**
 * Composable for tajweed parsing in Vue components
 */
export function useTajweedParser() {
    return {
        parseTajweed,
        TAG_MAP,
    }
}
