/**
 * UrURL-Core │ THE BRAIN
 * VERSION: 1.0 - DEFINITIVE
 */

const UrURL = {
    // 1. THE SYMBOL GUARD
    isIllegal: function(text) {
        if (!text) return false;
        const forbidden = /[|~]/; 
        return forbidden.test(text);
    },

    // 2. THE PACKER
    pack: function(d) {
        // Order: Name|Photo|Bio|Link|Email|Contact|PIN|Word
        const raw = `${d.n}|${d.p}|${d.b}|${d.l}|${d.e}|${d.c}|${d.k}|${d.w}`;
        return btoa(unescape(encodeURIComponent(raw)));
    },

    // 3. THE UNPACKER
    unpack: function(suitcase) {
        try {
            const raw = decodeURIComponent(escape(atob(suitcase)));
            const parts = raw.split('|');
            
            if (parts.length !== 8) return null;

            // Map strictly to shortnames to match index and viewer
            return {
                n: parts[0],
                p: parts[1],
                b: parts[2],
                l: parts[3],
                e: parts[4],
                c: parts[5],
                k: parts[6],
                w: parts[7]
            };
        } catch (e) {
            return null;
        }
    }
};
