const sync = (id, target, isBtn = false) => {
    document.getElementById(id).addEventListener('input', (e) => {
        const val = e.target.value;
        const el = document.getElementById(target);
        if(isBtn) el.style.display = val ? "block" : "none";
        else el.innerText = val || (id === 'in-n' ? "Name Preview" : "Bio preview...");
    });
};
sync('in-n', 'p-n'); sync('in-b', 'p-b');
sync('in-l', 'pre-l', true); sync('in-e', 'pre-e', true); sync('in-c', 'pre-c', true);
document.getElementById('in-p').oninput = (e) => document.getElementById('p-img').style.backgroundImage = `url(${e.target.value})`;

const qrCode = new QRCodeStyling({ width: 200, height: 200, dotsOptions: { color: "#0A1A3C", type: "rounded" } });

document.getElementById('btn-generate').onclick = () => {
    const data = { n: document.getElementById('in-n').value, p: document.getElementById('in-p').value, b: document.getElementById('in-b').value, l: document.getElementById('in-l').value, e: document.getElementById('in-e').value, c: document.getElementById('in-c').value };
    const suitcase = UrURL.pack(data);
    const finalURL = `https://noagrp.github.io/ururl/v.html?d=${suitcase}&t=1`;
    qrCode.update({ data: finalURL });
    const res = document.getElementById('qr-result');
    res.innerHTML = ""; qrCode.append(res);
    
    const share = document.createElement('div');
    share.innerHTML = `<input id="copy-inp" value="${finalURL}" readonly style="font-size:10px; margin-top:10px;">
    <button onclick="navigator.clipboard.writeText('${finalURL}');alert('Copied!')" style="width:100%; font-size:10px; cursor:pointer; padding:5px;">COPY LINK</button>`;
    res.appendChild(share);

    document.getElementById('qr-overlay').classList.remove('hidden');
    document.getElementById('dl-qr').onclick = () => qrCode.download({ name: "QR", extension: "png" });
    document.getElementById('dl-key').onclick = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([suitcase], { type: "text/plain" }));
        a.download = "key.txt"; a.click();
    };
};
document.getElementById('qr-color').oninput = (e) => qrCode.update({ dotsOptions: { color: e.target.value } });
document.getElementById('qr-style').onchange = (e) => qrCode.update({ dotsOptions: { type: e.target.value } });