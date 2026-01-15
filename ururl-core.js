const UrURL = {
    pack: (data) => {
        try {
            const raw = [data.n, data.p, data.b, data.l, data.e, data.c, data.k, data.w].join('|');
            return btoa(unescape(encodeURIComponent(raw)));
        } catch (e) { return null; }
    },
    unpack: (scrambled) => {
        try {
            const p = decodeURIComponent(escape(atob(scrambled))).split('|');
            return { name: p[0], photo: p[1], bio: p[2], link: p[3], email: p[4], contact: p[5], pin: p[6], word: p[7] };
        } catch (e) { return null; }
    }
};