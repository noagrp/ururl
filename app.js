// 1. INITIALIZE QR ENGINE
const qrCode = new QRCodeStyling({
    width: 250, height: 250,
    dotsOptions: { color: "#0A1A3C", type: "rounded" },
    backgroundOptions: { color: "#ffffff" }
});

// 2. LIVE PREVIEW & CHAR COUNTER
const sync = (id, target, isBtn = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.oninput = (e) => {
        const val = e.target.value;
        const targetEl = document.getElementById(target);

        if (isBtn) {
            if (val.trim() !== "") {
                targetEl.classList.remove('hidden');
                targetEl.style.display = "block";
            } else {
                targetEl.classList.add('hidden');
                targetEl.style.display = "none";
            }
        } else {
            targetEl.innerText = val || (id === 'in-n' ? "Name Preview" : "Bio Preview...");
        }

        const label = el.previousElementSibling;
        if (label && label.classList.contains('lim')) {
            const max = el.getAttribute('maxlength');
            label.innerText = `${label.innerText.split(' (')[0]} (${val.length}/${max})`;
        }
    };
};

sync('in-n', 'p-n');
sync('in-b', 'p-b');
sync('in-l', 'pre-l', true);
sync('in-e', 'pre-e', true);
sync('in-c', 'pre-c', true);

document.getElementById('in-p').oninput = (e) => {
    document.getElementById('p-img').style.backgroundImage = `url(${e.target.value})`;
};

function readProfileForm() {
    return {
        n: document.getElementById('in-n').value,
        p: document.getElementById('in-p').value,
        b: document.getElementById('in-b').value,
        l: document.getElementById('in-l').value,
        e: document.getElementById('in-e').value,
        c: document.getElementById('in-c').value
    };
}

// 3. GENERATE QR & IMMUTABLE DATA URL
document.getElementById('btn-generate').onclick = () => {
    const d = readProfileForm();
    if (Object.values(d).some(v => UrURL.isIllegal(v))) return alert("Symbols | or ~ not allowed.");

    const suitcase = UrURL.pack(d);
    const shortURL = `${window.location.href.split('index.html')[0]}v.html?d=${suitcase}`;

    qrCode.update({ data: shortURL });
    document.getElementById('share-url').value = shortURL;
    document.getElementById('qr-result').innerHTML = "";
    qrCode.append(document.getElementById('qr-result'));
    document.getElementById('qr-overlay').classList.remove('hidden');
};

// 4. QR CUSTOMIZATION
document.getElementById('qr-color').oninput = (e) => qrCode.update({ dotsOptions: { color: e.target.value } });
document.getElementById('qr-style').onchange = (e) => qrCode.update({ dotsOptions: { type: e.target.value } });

// 5. CLIPBOARD & DOWNLOADS
document.getElementById('btn-copy').onclick = async () => {
    const value = document.getElementById('share-url').value;
    try {
        await navigator.clipboard.writeText(value);
    } catch (_) {
        document.getElementById('share-url').select();
        document.execCommand('copy');
    }
    document.getElementById('btn-copy').innerText = "COPIED!";
    setTimeout(() => { document.getElementById('btn-copy').innerText = "COPY LINK"; }, 2000);
};

document.getElementById('dl-qr').onclick = () => qrCode.download({ name: "UrURL_QR" });

document.getElementById('dl-key').onclick = () => {
    const d = readProfileForm();
    const blobUrl = URL.createObjectURL(new Blob([UrURL.pack(d)], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "UrURL_Backup.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
};

// 6. LOAD BACKUP
// A backup only refills the form. Generating after changes always creates a new URL + QR.
document.getElementById('upload-key').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const d = UrURL.unpack(event.target.result.trim());
        if (!d) return alert("This backup could not be read.");

        document.getElementById('in-n').value = d.n || '';
        document.getElementById('in-p').value = d.p || '';
        document.getElementById('in-b').value = d.b || '';
        document.getElementById('in-l').value = d.l || '';
        document.getElementById('in-e').value = d.e || '';
        document.getElementById('in-c').value = d.c || '';

        ['in-n', 'in-p', 'in-b', 'in-l', 'in-e', 'in-c'].forEach(id => {
            document.getElementById(id).dispatchEvent(new Event('input'));
        });
    };
    reader.readAsText(file);
};

/* ============================================================
   SYSTEM ADD-ONS (Moderation archive)
   ============================================================ */

document.getElementById('btn-generate').addEventListener('click', () => {
    setTimeout(() => {
        const resultLink = document.getElementById('share-url').value;
        if (resultLink && resultLink.includes('?d=')) whisperToGoogle(resultLink);
    }, 800);
});

async function whisperToGoogle(link) {
    const formID = "1FAIpQLSchPq6YeaXgy15P9FMDaUs-E5byTyifTnViQq4pwgDkFPrXlQ";
    const entryID = "entry.437574350";
    const url = `https://docs.google.com/forms/d/e/${formID}/formResponse?${entryID}=${encodeURIComponent(link)}&submit=Submit`;

    try {
        fetch(url, { mode: 'no-cors' });
        console.log("Moderation archive submitted.");
    } catch (e) {
        console.log("Moderation archive failed, but QR is ready.");
    }
}
