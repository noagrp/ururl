/* ============================================================
   URURL SECURITY BOUNCER (block.js)
   ============================================================ */
async function runBlockCheck() {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('d');
    
    // If there's no data ID in the URL, don't do anything
    if (!d) return;

    try {
        // Fetch your "naughty list" from GitHub
        const response = await fetch('https://noagrp.github.io/ururl/blacklist.json?t=' + Date.now());
        if (!response.ok) return;

        const blacklist = await response.json();

        // If the suitcase ID is found in your blacklist...
        if (blacklist.includes(d)) {
           localStorage.clear();
           sessionStorage.clear();
            // ...Wipe the page and show the block screen
            document.body.innerHTML = `
                <div style="background:#000; color:white; height:100vh; width:100vw; 
                     display:flex; flex-direction:column; justify-content:center; 
                     align-items:center; font-family:sans-serif; text-align:center;
                     position:fixed; top:0; left:0; z-index:9999;">
                    <h1 style="color:#ff4444; font-size:3rem;">🚫</h1>
                    <h2>Access Restricted</h2>
                    <p style="color:#888; padding:0 20px;">This link has been deactivated for safety or policy violations.</p>
                    <a href="index.html" style="color:#d2e823; margin-top:20px; text-decoration:none; border:1px solid #d2e823; padding:10px 20px; border-radius:8px;">Return Home</a>
                </div>`;
            
            window.stop(); // Stop all other scripts (like ururl-core) from running
            throw new Error("Link Blocked"); 
        }
    } catch (err) {
        console.log("Security Check: Active");
    }
}

// Run the check immediately when the script loads

runBlockCheck();
