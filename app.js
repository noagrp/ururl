// 1. INITIALIZE QR
const qrCode = new QRCodeStyling({
    width: 250, height: 250,
    dotsOptions: { color: "#0A1A3C", type: "rounded" },
    backgroundOptions: { color: "#ffffff" }
});

// 2. LIVE PREVIEW
const sync = (id, target, isBtn = false) => {
    const inputEl = document.getElementById(id);
    if (!inputEl) return;
    inputEl.oninput = (e) => {
        const val = e.target.value;
        const el = document.getElementById(target);
        if (isBtn) el.style.display = val ? "block" : "none";
        else el.innerText = val || (id === 'in-n' ? "Name Preview" : "Your bio will appear here.");
    };
};
sync('in-n', 'p-n'); sync('in-b', 'p-b');
sync('in-l', 'pre-l', true); sync('in-e', 'pre-e', true); sync('in-c', 'pre-c', true);
document.getElementById('in-p').oninput = (e) => {
    document.getElementById('p-img').style.backgroundImage = `url(${e.target.value})`;
};

// 3. GENERATE
document.getElementById('btn-generate').onclick = () => {
    const data = {
        n: document.getElementById('in-n').value,
        p: document.getElementById('in-p').value,
        b: document.getElementById('in-b').value,
        l: document.getElementById('in-l').value,
        e: document.getElementById('in-e').value,
        c: document.getElementById('in-c').value,
        k: document.getElementById('in-k').value,
        w: document.getElementById('in-w').value
    };
    if (Object.values(data).some(v => UrURL.isIllegal(v))) return alert("Remove | or ~");
    
    const suitcase = UrURL.pack(data);
    const shortURL = `${window.location.href.split('index.html')[0]}v.html?d=${suitcase}`;
    qrCode.update({ data: shortURL });
    document.getElementById('qr-result').innerHTML = "";
    qrCode.append(document.getElementById('qr-result'));
    document.getElementById('qr-overlay').classList.remove('hidden');
};

// 4. DOWNLOADS
document.getElementById('dl-qr').onclick = () => qrCode.download({ name: "UrURL_QR" });
document.getElementById('dl-key').onclick = () => {
    const data = { n:document.getElementById('in-n').value, p:document.getElementById('in-p').value, b:document.getElementById('in-b').value, l:document.getElementById('in-l').value, e:document.getElementById('in-e').value, c:document.getElementById('in-c').value, k:document.getElementById('in-k').value, w:document.getElementById('in-w').value };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([UrURL.pack(data)], {type:"text/plain"}));
    a.download = "UrURL_Key.txt"; a.click();
};

// 5. DATA RESTORE (The Fix)
document.getElementById('upload-key').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const d = UrURL.unpack(event.target.result);
        if (d) {
            document.getElementById('in-n').value = d.n;
            document.getElementById('in-p').value = d.p;
            document.getElementById('in-b').value = d.b;
            document.getElementById('in-l').value = d.l;
            document.getElementById('in-e').value = d.e;
            document.getElementById('in-c').value = d.c;
            document.getElementById('in-k').value = d.k;
            document.getElementById('in-w').value = d.w;
            ['in-n', 'in-p', 'in-b', 'in-l', 'in-e', 'in-c'].forEach(id => {
                document.getElementById(id).dispatchEvent(new Event('input'));
            });
            alert("Restored!");
        }
    };
    reader.readAsText(file);
};
