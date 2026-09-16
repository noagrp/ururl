/**
 * UrURL-Core │ THE BRAIN
 * VERSION: 2.0 - IMMUTABLE PROFILES
 */

const UrURL = {
    isIllegal: function(text) {
        if (!text) return false;
        return /[|~]/.test(text);
    },

    // New profiles use 6 fields only.
    // Order: Name|Photo|Bio|Link|Email|Contact
    pack: function(d) {
        const raw = `${d.n || ''}|${d.p || ''}|${d.b || ''}|${d.l || ''}|${d.e || ''}|${d.c || ''}`;
        return btoa(unescape(encodeURIComponent(raw)));
    },

    unpack: function(suitcase) {
        try {
            const raw = decodeURIComponent(escape(atob(suitcase)));
            const parts = raw.split('|');

            // Current format.
            if (parts.length === 6) {
                return {
                    n: parts[0],
                    p: parts[1],
                    b: parts[2],
                    l: parts[3],
                    e: parts[4],
                    c: parts[5]
                };
            }

            // Legacy compatibility: old links/backups had PIN + secret word.
            // Those legacy fields are intentionally ignored.
            if (parts.length === 8) {
                return {
                    n: parts[0],
                    p: parts[1],
                    b: parts[2],
                    l: parts[3],
                    e: parts[4],
                    c: parts[5]
                };
            }

            return null;
        } catch (e) {
            return null;
        }
    }
};
