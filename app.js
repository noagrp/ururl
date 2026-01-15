/* --- UrURL ENGINE v1.0 --- */

// 1. LIVE PREVIEW LOGIC
// Connects the input fields to the phone mockup in real-time
const fields = ['n', 'p', 'b']; // name, photo, bio
fields.forEach(f => {
    document.getElementById(`in-${f}`).addEventListener('input', (e) => {
        const val = e.target.value;
        if (f === 'p') {
            document.getElementById('pre-img').style.backgroundImage = `url('${val}')`;
            document.getElementById('pre-img').style.backgroundSize = 'cover';
        } else {
            document.getElementById(`pre-${f}`).innerText = val || (f === 'n' ? 'Your Name' : 'Your bio will appear here.');
        }
    });
});

// 2. KEY UPLOAD LOGIC
// Allows users to import their .txt key to edit their profile
document.getElementById('key-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        const suitcase = event.target.result.trim();
        const data = UrURL.unpack(suitcase);
        if (data) {
            // Fill the form with existing data
            document.getElementById('in-n').value = data.name;
            document.getElementById('in-p').value = data.photo;
            document.getElementById('in-b').value = data.bio;
            document.getElementById('in-l').value = data.link;
            document.getElementById('in-e').value = data.email;
            document.getElementById('in-c').value = data.contact;
            document.getElementById('in-k').value = data.pin;
            document.getElementById('in-w').value = data.word;
            // Trigger preview update
            document.getElementById('in-n').dispatchEvent(new Event('input'));
        } else {
            alert("Invalid Key File.");
        }
    };
    reader.readAsText(file);
});

// 3. QR GENERATION LOGIC
// Initializing the library
const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    dotsOptions: { color: "#0A1A3C", type: "rounded" },
    cornersSquareOptions: { color: "#0A1A3C", type: "extra-rounded" },
    backgroundOptions: { color: "#ffffff" }
});

document.getElementById('btn-generate').onclick = () => {
    const data = {
        n: document.getElementById('in-n').value,
        p: document.getElementById('in-p').value,
        b: document.getElementById('in-b').value,
        l: document.getElementById('in-l').value,
        e: document.getElementById('in-email') ? document.getElementById('in-email').value : document.getElementById('in-e').value,
        c: document.getElementById('in-c').value,
        k: document.getElementById('in-k').value,
        w: document.getElementById('in-w').value
    };

    const suitcase = UrURL.pack(data);
    if (!suitcase) return alert("Please fill the form correctly.");

    // Create the Short URL pointing to v.html (Template 1)
    const finalURL = `${window.location.origin}${window.location.pathname.replace('index.html', '')}v.html?d=${suitcase}&t=1`;

    // Update and Show QR
    qrCode.update({ data: finalURL });
    document.getElementById('qr-canvas').innerHTML = "";
    qrCode.append(document.getElementById('qr-canvas'));
    document.getElementById('qr-editor-overlay').classList.remove('hidden');

    // Handle Downloads
    document.getElementById('dl-qr').onclick = () => qrCode.download({ name: "UrURL_QR", extension: "png" });
    document.getElementById('dl-key').onclick = () => {
        const blob = new Blob([suitcase], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "UrURL_Key.txt";
        a.click();
    };
};