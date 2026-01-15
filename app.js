/**
 * UrURL Engine v2.1
 * Handles Live Preview, QR Generation, and Data Packing
 */

// 1. LIVE PREVIEW SYSTEM
// This updates the phone mockup as you type
const setupLivePreview = (inputId, previewId, isButton = false) => {
    const inputElement = document.getElementById(inputId);
    const previewElement = document.getElementById(previewId);

    if (!inputElement || !previewElement) return;

    inputElement.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        
        if (isButton) {
            // Toggle button visibility
            previewElement.style.display = value ? "block" : "none";
        } else {
            // Update text content
            if (inputId === 'in-n') {
                previewElement.innerText = value || "Name Preview";
            } else if (inputId === 'in-b') {
                previewElement.innerText = value || "Your bio will appear here.";
            }
        }
    });
};

// Initialize Preview Listeners
setupLivePreview('in-n', 'p-n');
setupLivePreview('in-b', 'p-b');
setupLivePreview('in-l', 'pre-l', true);
setupLivePreview('in-e', 'pre-e', true);
setupLivePreview('in-c', 'pre-c', true);

// Special case for Photo Preview
document.getElementById('in-p').addEventListener('input', (e) => {
    const url = e.target.value.trim();
    const imgCircle = document.getElementById('p-img');
    if (url) {
        imgCircle.style.backgroundImage = `url('${url}')`;
    } else {
        imgCircle.style.backgroundImage = 'none';
    }
});

// 2. QR CODE STYLING OBJECT
const qrCode = new QRCodeStyling({
    width: 240,
    height: 240,
    type: "svg",
    data: "https://noagrp.github.io/ururl/",
    dotsOptions: {
        color: "#0A1A3C",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#ffffff",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 0
    }
});

// 3. MAIN GENERATION FUNCTION
document.getElementById('btn-generate').onclick = function() {
    // Collect all data from the form
    const userData = {
        n: document.getElementById('in-n').value,
        p: document.getElementById('in-p').value,
        b: document.getElementById('in-b').value,
        l: document.getElementById('in-l').value,
        e: document.getElementById('in-e').value,
        c: document.getElementById('in-c').value,
        k: document.getElementById('in-k').value, // PIN
        w: document.getElementById('in-w').value  // Secret Word
    };

    // Validation: Name is mandatory
    if (!userData.n) {
        alert("Please enter at least a Name.");
        return;
    }

    // Pack data into a Base64 string using ururl-core.js
    const suitcase = UrURL.pack(userData);
    const finalURL = `https://noagrp.github.io/ururl/v.html?d=${suitcase}&t=1`;

    // Update and Display QR Code
    qrCode.update({ data: finalURL });
    const qrContainer = document.getElementById('qr-result');
    qrContainer.innerHTML = ""; // Clear old QR
    qrCode.append(qrContainer);

    // Create and Display Copyable Link
    const shareUI = document.createElement('div');
    shareUI.style = "margin-top:15px; background:#f4f7f9; padding:10px; border-radius:8px; border:1px solid #ddd;";
    shareUI.innerHTML = `
        <p style="font-size:10px; color:#888; margin-bottom:5px; text-align:left;">YOUR URL:</p>
        <input type="text" id="copy-url-field" value="${finalURL}" readonly 
               style="width:100%; font-size:11px; padding:5px; border:1px solid #ccc; margin-bottom:8px;">
        <button id="copy-btn" style="width:100%; background:#0A1A3C; color:#00E8FF; border:none; padding:8px; border-radius:4px; font-weight:bold; cursor:pointer;">
            COPY LINK TO CLIPBOARD
        </button>
    `;
    qrContainer.appendChild(shareUI);

    // Copy Button Functionality
    document.getElementById('copy-btn').onclick = function() {
        const copyText = document.getElementById("copy-url-field");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);
        this.innerText = "COPIED!";
        setTimeout(() => { this.innerText = "COPY LINK TO CLIPBOARD"; }, 2000);
    };

    // Show the Modal
    document.getElementById('qr-overlay').classList.remove('hidden');

    // 4. DOWNLOAD HANDLERS
    document.getElementById('dl-qr').onclick = () => {
        qrCode.download({ name: "My_UrURL_QR", extension: "png" });
    };

    document.getElementById('dl-key').onclick = () => {
        const blob = new Blob([suitcase], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "UrURL_Key.txt";
        link.click();
    };
};

// 5. LIVE MODAL QR STYLING
document.getElementById('qr-color').oninput = (e) => {
    qrCode.update({ dotsOptions: { color: e.target.value } });
};

document.getElementById('qr-style').onchange = (e) => {
    qrCode.update({ dotsOptions: { type: e.target.value } });

};
document.getElementById('upload-key').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const d = UrURL.unpack(event.target.result);
        if (d) {
            document.getElementById('in-n').value = d.n || "";
            document.getElementById('in-p').value = d.p || "";
            document.getElementById('in-b').value = d.b || "";
            document.getElementById('in-l').value = d.l || "";
            document.getElementById('in-e').value = d.e || "";
            document.getElementById('in-c').value = d.c || "";
            document.getElementById('in-k').value = d.k || "";
            document.getElementById('in-w').value = d.w || "";
            
            // Trigger preview refresh
            ['in-n', 'in-p', 'in-b', 'in-l', 'in-e', 'in-c'].forEach(id => {
                document.getElementById(id).dispatchEvent(new Event('input'));
            });
            alert("Data Restored! You can now edit.");
        } else {
            alert("Invalid Key File.");
        }
    };
    reader.readAsText(file);
};
