/* --- UrURL MASTER CORE v1.0 --- */
const UrURL = {
    // 1. MASTER SECRET (Change this once to any random characters)
    _ss: "Ur_URL_S3cur3_2026_X",

    // 2. PACKER: Turns Object -> Scrambled String
    pack: function(data) {
        try {
            const raw = [
                data.n || '', // Name
                data.p || '', // Photo URL
                data.b || '', // Bio
                data.l || '', // Link
                data.e || '', // Email
                data.c || '', // Contact
                data.k || '', // PIN
                data.w || ''  // Secret Word
            ].join('|');
            return btoa(unescape(encodeURIComponent(raw)));
        } catch (e) { return null; }
    },

    // 3. UNPACKER: Turns Scrambled String -> Object
    unpack: function(scrambled) {
        try {
            const decoded = decodeURIComponent(escape(atob(scrambled)));
            const p = decoded.split('|');
            return {
                name: p[0], photo: p[1], bio: p[2], 
                link: p[3], email: p[4], contact: p[5], 
                pin: p[6], word: p[7]
            };
        } catch (e) { return null; }
    }
};
Object.freeze(UrURL);