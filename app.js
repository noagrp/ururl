// 1. INITIALIZE QR ENGINE
const qrCode = new QRCodeStyling({
    width: 250, height: 250,
    dotsOptions: { color: "#0A1A3C", type: "rounded" },
    backgroundOptions: { color: "#ffffff" }
});

// 2. LIVE PREVIEW SYNC
const sync = (id, target, isBtn = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.oninput = (e) => {
        const val = e.target.value;
        const targetEl = document.getElementById(target);
        if (isBtn) targetEl.style.display = val ? "block" : "none";
        else targetEl.innerText = val || (id === 'in-n' ? "Name Preview" : "Your bio will appear here.");
    };
};

sync('in-n', 'p-n'); sync('in-b', 'p-b');
sync('in-l', 'pre-l', true); sync('in-e', 'pre-e', true); sync('in-c', 'pre-c', true);
document.getElementById('in-p').oninput = (e) => { 
    document.getElementById('p-img').style.backgroundImage = `url(${e.target.value})`; 
};

// 3. GENERATE QR & SHARE LINK
document.getElementById('btn-generate').onclick = () => {
    const d = {
        n: document.getElementById('in-n').value, p: document.getElementById('in-p').value,
        b: document.getElementById('in-b').value, l: document.getElementById('in-l').value,
        e: document.getElementById('in-e').value, c: document.getElementById('in-c').value,
        k: document.getElementById('in-k').value, w: document.getElementById('in-w').value
    };
    if (Object.values(d).some(v => UrURL.isIllegal(v))) return alert("Symbols | or ~ are not allowed.");

    const suitcase = UrURL.pack(d);
    const shortURL = `${window.location.href.split('index.html')[0]}v.html?d=${suitcase}`;
    
    qrCode.update({ data: shortURL });
    document.getElementById('share-url').value = shortURL;
    document.getElementById('qr-result').innerHTML = "";
    qrCode.append(document.getElementById('qr-result'));
    document.getElementById('qr-overlay').classList.remove('hidden');
};

// 4. QR EDITOR
document.getElementById('qr-color').oninput = (e) => qrCode.update({ dotsOptions: { color: e.target.value } });
document.getElementById('qr-style').onchange = (e) => qrCode.update({ dotsOptions: { type: e.target.value } });

// 5. COPY TO CLIPBOARD
document.getElementById('btn-copy').onclick = () => {
    const copyText = document.getElementById('share-url');
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    const btn = document.getElementById('btn-copy');
    btn.innerText = "COPIED!"; btn.style.background = "#28a745";
    setTimeout(() => { btn.innerText = "COPY"; btn.style.background = "#007AFF"; }, 2000);
};

// 6. DOWNLOADS
document.getElementById('dl-qr').onclick = () => qrCode.download({ name: "UrURL_QR" });
document.getElementById('dl-key').onclick = () => {
    const d = { n:document.getElementById('in-n').value, p:document.getElementById('in-p').value, b:document.getElementById('in-b').value, l:document.getElementById('in-l').value, e:document.getElementById('in-e').value, c:document.getElementById('in-c').value, k:document.getElementById('in-k').value, w:document.getElementById('in-w').value };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([UrURL.pack(d)], {type:"text/plain"}));
    a.download = "UrURL_Key.txt"; a.click();
};

// 7. RESTORE DATA (SECURE EDITING)
document.getElementById('upload-key').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const d = UrURL.unpack(event.target.result);
        if (d) {
            if (d.k && d.k.trim() !== "") {
                const userPin = prompt("Enter the 4-Digit PIN to edit this profile:");
                if (userPin !== d.k) { return alert("Incorrect PIN. Access Denied."); }
            }
            document.getElementById('in-n').value = d.n; document.getElementById('in-p').value = d.p;
            document.getElementById('in-b').value = d.b; document.getElementById('in-l').value = d.l;
            document.getElementById('in-e').value = d.e; document.getElementById('in-c').value = d.c;
            document.getElementById('in-k').value = d.k; document.getElementById('in-w').value = d.w;
            ['in-n', 'in-p', 'in-b', 'in-l', 'in-e', 'in-c'].forEach(id => document.getElementById(id).dispatchEvent(new Event('input')));
            alert("Lock verified. Profile loaded for editing!");
        }
    };
    reader.readAsText(file);
};
