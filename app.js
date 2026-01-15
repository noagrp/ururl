/* --- UrURL ENGINE v1.1 --- */

// 1. LIVE PREVIEW LOGIC
const inputMap = {
    'in-n': 'p-n',
    'in-b': 'p-b'
};

Object.keys(inputMap).forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
        document.getElementById(inputMap[id]).innerText = e.target.value || "...";
    });
});

document.getElementById('in-p').addEventListener('input', (e) => {
    document.getElementById('p-img').style.backgroundImage = `url('${e.target.value}')`;
});

// 2. QR INITIALIZATION
const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
    dotsOptions: { color: "#0A1A3C", type: "rounded" },
    backgroundOptions: { color: "#ffffff" },
    cornersSquareOptions: { type: "extra-rounded" }
});

// 3. GENERATE & OPEN EDITOR
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

    if (!data.n) return alert("Name is required!");

    const suitcase = UrURL.pack(data);
    // THE CRITICAL LINK:
    const finalURL = `https://noagrp.github.io/ururl/v.html?d=${suitcase}&t=1`;

    // Render QR
    qrCode.update({ data: finalURL });
    document.getElementById('qr-result').innerHTML = "";
    qrCode.append(document.getElementById('qr-result'));
    
    // Show Modal
    document.getElementById('qr-overlay').classList.remove('hidden');

    // Handle Downloads
    document.getElementById('dl-qr').onclick = () => qrCode.download({ name: "UrURL_Code", extension: "png" });
    document.getElementById('dl-key').onclick = () => {
        const blob = new Blob([suitcase], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "UrURL_Key.txt";
        a.click();
    };
};

// 4. LIVE QR STYLING (In the Modal)
document.getElementById('qr-dot-color').oninput = (e) => {
    qrCode.update({ dotsOptions: { color: e.target.value } });
};

document.getElementById('qr-dot-type').onchange = (e) => {
    qrCode.update({ dotsOptions: { type: e.target.value } });
};

// 5. FILE UPLOAD (KEY.TXT)
document.getElementById('file-input').onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const data = UrURL.unpack(event.target.result);
        if(data) {
            document.getElementById('in-n').value = data.name;
            document.getElementById('in-p').value = data.photo;
            document.getElementById('in-b').value = data.bio;
            document.getElementById('in-l').value = data.link;
            document.getElementById('in-e').value = data.email;
            document.getElementById('in-c').value = data.contact;
            document.getElementById('in-k').value = data.pin;
            document.getElementById('in-w').value = data.word;
            // Trigger visual updates
            document.getElementById('in-n').dispatchEvent(new Event('input'));
        }
    };
    reader.readAsText(e.target.files[0]);
};