(function () {
  "use strict";

  const CONFIG = {
    r: "https://raw.githubusercontent.com/dbofchl/bypass/main/bypass.txt",
    t: "https://raw.githubusercontent.com/dbofchl/bypass/main/ch.txt",
    m: "https://raw.githubusercontent.com/vanz-website/VanzBypass/main/music.mp3"
  };

  const VALID_KEYS = [
    "bagasxit"
  ];

  // ==========================================
  // SAKELAR ON/OFF (Ganti "ON" untuk aktif, ganti "OFF" untuk mematikan script)
  const SCRIPT_STATUS = "ON"; 

  // ISI LINK SALURAN WHATSAPP KAMU DI SINI
  const WHATSAPP_LINK = "https://whatsapp.com/channel/0029Vb6Eyam7oQhZLQKN9E3P";
  // ==========================================

  const FALLBACK_MUSIC_URL = "https://raw.githubusercontent.com/vanz-website/VanzBypass/main/music.mp3";
  let audioPlayer = null;

  (async function () {

    // Menghapus elemen lama agar tidak menumpuk
    document.getElementById("bagas-full-wrapper")?.remove();

    const titleName = "BAGASXIT BYPASS KEY AINCRAD";

    // --- BAGIAN UI & CSS ---
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      #bagas-full-wrapper {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: #0b0813; color: #fff; z-index: 2147483647;
        font-family: system-ui, -apple-system, sans-serif;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        padding: 20px; box-sizing: border-box;
      }
      .bagas-brand-header { font-size: 32px; font-weight: 800; color: #bd00ff; letter-spacing: 1.5px; margin-bottom: 5px; text-transform: uppercase; }
      .bagas-brand-header span { color: #fff; }
      .bagas-sub-status { color: #ffd700; font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-bottom: 30px; text-transform: uppercase; }
      .bagas-card-container { background: #120e29; border: 2px solid #3c1e70; border-radius: 24px; padding: 35px 25px; width: 100%; max-width: 340px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.6); box-sizing: border-box; position: relative; }
      .bagas-icon { font-size: 42px; margin-bottom: 15px; }
      .bagas-input-field { width: 100%; padding: 14px; margin-bottom: 16px; border: 1px solid #3c1e70; border-radius: 12px; background: #090518; color: #fff; text-align: center; box-sizing: border-box; font-size: 14px; outline: none; }
      .bagas-input-field:focus { border-color: #9d4edd; }
      .bagas-action-btn { width: 100%; border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 13px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; box-sizing: border-box; transition: transform 0.1s ease; text-transform: uppercase; }
      .bagas-action-btn:active { transform: scale(0.98); }
      .btn-style-whatsapp { background: #19c368; color: #fff; }
      .btn-style-premium { background: #9d4edd; color: #fff; }
      .btn-style-off { background: #d90429; color: #fff; box-shadow: 0 0 15px rgba(217, 4, 41, 0.4); }
      
      .bagas-mode-btn {
        width: 100%; border: 1px solid rgba(189,0,255,0.3); padding: 12px; border-radius: 8px;
        font-weight: 700; cursor: pointer; font-size: 14px; letter-spacing: 1.5px; margin-bottom: 12px;
        color: #fff; transition: all 0.3s ease; text-transform: uppercase;
      }
      .bagas-btn-fast   { background: linear-gradient(90deg, rgba(255,0,234,0.1), rgba(255,0,234,0.2)); border-color: #ff00ea; box-shadow: 0 0 8px rgba(255,0,234,0.2); }
      .bagas-btn-fast:hover   { background: #ff00ea; color: #030712; box-shadow: 0 0 15px #ff00ea; }
      .bagas-btn-secure { background: linear-gradient(90deg, rgba(189,0,255,0.1), rgba(189,0,255,0.2)); border-color: #bd00ff; box-shadow: 0 0 8px rgba(189,0,255,0.2); }
      .bagas-btn-secure:hover { background: #bd00ff; color: #030712; box-shadow: 0 0 15px #bd00ff; }
      .bagas-btn-safe   { background: linear-gradient(90deg, rgba(0,240,255,0.1), rgba(0,240,255,0.2)); border-color: #00f0ff; box-shadow: 0 0 8px rgba(0,240,255,0.2); }
      .bagas-btn-safe:hover   { background: #00f0ff; color: #030712; box-shadow: 0 0 15px #00f0ff; }

      /* Animasi Putaran & Denyut Api Ungu */
      @keyframes bagas-fire-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes bagas-fire-pulse { 0%, 100% { transform: scale(1); filter: blur(2px) drop-shadow(0 0 15px #9d4edd); } 50% { transform: scale(1.03); filter: blur(4px) drop-shadow(0 0 30px #bd00ff); } }
      @keyframes bagas-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(styleEl);

    // Membuat Pembungkus Utama Layar Penuh
    const fullWrapper = document.createElement("div");
    fullWrapper.id = "bagas-full-wrapper";
    document.body.appendChild(fullWrapper);

    // --- TAMPILAN LOCK SCREEN JIKA DI-OFFKAN ---
    function showOffScreenPage() {
      fullWrapper.innerHTML = `
        <div class="bagas-brand-header" style="color:#d90429;">BAGAS<span>XIT</span></div>
        <div class="bagas-sub-status" style="color:#ff4444;">SCRIPT DISABLED BY OWNER</div>
        <div class="bagas-card-container" style="border-color:#d90429;">
          <div class="bagas-icon">🔒</div>
          <p style="font-size:13px; color:#a39cb5; margin-bottom:20px; line-height:1.6;">
            Akses sistem sedang ditutup sementara oleh owner.<br>Silakan masuk ke saluran WhatsApp resmi kami untuk informasi update terbaru.
          </p>
          <button id="bagas-off-wa-btn" class="bagas-action-btn btn-style-off">➔ Masuk Saluran WhatsApp</button>
        </div>
      `;

      document.getElementById("bagas-off-wa-btn").addEventListener("click", () => {
        window.open(WHATSAPP_LINK, "_blank");
      });
    }

    // --- LOGIKA UTAMA 1: HALAMAN LOGIN / VERIFIKASI KEY ---
    function showGatewayAuthPage() {
      fullWrapper.innerHTML = `
        <div class="bagas-brand-header">BAGAS<span>XIT</span></div>
        <div class="bagas-sub-status">FREE BYPASS GETKEY - AINCRAD MODS</div>
        <div class="bagas-card-container">
          <!-- Tombol Musik (Sesuai Logika Aslimu) -->
          <button id="bagas-music-btn" style="
            position:absolute; top:15px; right:15px;
            background:rgba(255,255,255,0.05); border:1px solid rgba(189,0,255,0.3);
            color:#ff4444; border-radius:50%; width:32px; height:32px;
            cursor:pointer; font-size:14px; display:flex; align-items:center;
            justify-content:center; box-shadow:0 0 8px rgba(0,0,0,0.3);
            z-index:10;">🔇</button>

          <div class="bagas-icon">🎮</div>
          <input type="text" id="bagas-key-input" class="bagas-input-field" placeholder="Masukkan Access Key Anda">
          <button id="bagas-login-btn" class="bagas-action-btn btn-style-premium">Verify Access Key</button>
          <button id="bagas-whatsapp-btn" class="bagas-action-btn btn-style-whatsapp">💬 WhatsApp Community</button>
          <div id="bagas-status" style="margin-top:15px; font-size:11px; color:#5f5777; font-weight:600;">Masukkan lisensi untuk melanjutkan bypass</div>
        </div>
      `;

      const musicBtn    = document.getElementById("bagas-music-btn");
      const keyInput    = document.getElementById("bagas-key-input");
      const loginBtn    = document.getElementById("bagas-login-btn");
      const whatsappBtn = document.getElementById("bagas-whatsapp-btn");
      const statusEl    = document.getElementById("bagas-status");

      // Logika Musik Bawaan Asli
      let musicLoading = false;
      musicBtn.addEventListener("click", async () => {
        if (musicLoading) return;
        if (!audioPlayer) {
          musicLoading = true;
          musicBtn.textContent = "⏳";
          let resolvedUrl = FALLBACK_MUSIC_URL;
          try {
            const res = await fetch(CONFIG.m + "?t=" + Date.now());
            const audioUrl = (await res.text()).trim();
            if (audioUrl && audioUrl.startsWith("http")) { resolvedUrl = audioUrl; }
          } catch (err) { console.log("Music fetch failed, using fallback:", err); }
          audioPlayer = new Audio(resolvedUrl);
          audioPlayer.loop = true;
          musicLoading = false;
        }
        if (audioPlayer.paused) {
          audioPlayer.play().then(() => {
            musicBtn.textContent = "🔊";
            musicBtn.style.color = "#bd00ff";
            musicBtn.style.borderColor = "#bd00ff";
          }).catch(err => { musicBtn.textContent = "🔇"; });
        } else {
          audioPlayer.pause();
          musicBtn.textContent = "🔇";
          musicBtn.style.color = "#ff4444";
        }
      });

      // Logika Tombol Komunitas WhatsApp kamu
      whatsappBtn.addEventListener("click", () => {
        window.open(WHATSAPP_LINK, "_blank");
      });

      // Logika Submit Verifikasi Key
      loginBtn.addEventListener("click", () => {
        const inputKey = keyInput.value.trim();
        if (!inputKey) {
          statusEl.innerHTML = "<span style='color:#ff4444;'>PLEASE INPUT KEY!</span>";
          return;
        }
        const isValid = VALID_KEYS.some(k => k.toLowerCase() === inputKey.toLowerCase());
        if (isValid) {
          statusEl.innerHTML = "<span style='color:#bd00ff;'>KEY VALIDATED! ✓</span>";
          loginBtn.disabled = true;
          whatsappBtn.disabled = true;
          setTimeout(() => { showBypassDashboardPage(); }, 800);
        } else {
          statusEl.innerHTML = "<span style='color:#ff4444;'>INVALID LICENSE KEY!</span>";
        }
      });
    }

    // --- LOGIKA UTAMA 2: HALAMAN DASHBOARD / PILIH MODE ---
    function showBypassDashboardPage() {
      fullWrapper.innerHTML = `
        <div class="bagas-brand-header">BAGAS<span>XIT</span> OFFICIAL</div>
        <div class="bagas-sub-status" style="color:#a39cb5;">PILIH METODE SISTEM BYPASS</div>
        <div class="bagas-card-container">
          <div class="bagas-icon">⚙️</div>
          <button id="bagas-btn-fast" class="bagas-mode-btn bagas-btn-fast">FAST MODE (BAN RISK)</button>
          <button id="bagas-btn-secure" class="bagas-mode-btn bagas-btn-secure">SECURE MODE (MIDDLE)</button>
          <button id="bagas-btn-safe" class="bagas-mode-btn bagas-btn-safe">SAFE MODE (FULL SAFE)</button>
        </div>
      `;

      document.getElementById("bagas-btn-fast").addEventListener("click",   () => runRedirect(30));
      document.getElementById("bagas-btn-secure").addEventListener("click", () => runRedirect(45));
      document.getElementById("bagas-btn-safe").addEventListener("click",   () => runRedirect(60));
    }

    // --- LOGIKA UTAMA 3: PROSES CHECKING UPDATE & RUN REDIRECT ---
    function runRedirect(countdownSeconds) {
      // Tampilan Awal: Checking Update
      fullWrapper.innerHTML = `
        <div style="text-align:center; background:#120e29; padding:35px 30px; border-radius:16px; border:2px solid #3c1e70; width:290px;">
          <div style="width:45px; height:45px; border:4px solid rgba(189,0,255,0.1); border-top:4px solid #bd00ff; border-radius:50%; margin:0 auto 20px auto; animation:bagas-spin 0.8s linear infinite;"></div>
          <p id="bagas-check-text" style="color:#bd00ff; font-size:15px; font-weight:700; margin:0; letter-spacing:1.5px;">CHECKING UPDATE...</p>
        </div>
      `;

      setTimeout(async () => {
        let hasUpdate = false;
        try {
          const updateRes  = await fetch("https://rm.rama-modz.workers.dev/");
          const updateText = await updateRes.text();
          if (updateText.includes("GitHub Updated")) hasUpdate = true;
        } catch { }

        const checkText = document.getElementById("bagas-check-text");
        checkText.innerHTML = hasUpdate
          ? "<span style='color:#19c368;'>Link Updated Successfully! ✓</span>"
          : "<span style='color:#ff4444;'>No Update Available!</span>";

        // Masuk Ke Hitung Mundur Setelah Pengecekan Selesai
        setTimeout(async () => {
          try {
            const redirectRes = await fetch(CONFIG.r + "?t=" + Date.now());
            const redirectUrl = (await redirectRes.text()).trim();

            if (!redirectUrl.startsWith("http")) return;

            // TAMPILAN CINCIN API UNGU PREMIUM BAGASXIT
            fullWrapper.innerHTML = `
              <div style="text-align:center;">
                <div style="position:relative; width:260px; height:260px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
                  
                  <!-- Efek Aura Api Ungu Luar -->
                  <div style="position:absolute; width:220px; height:220px; border-radius:50%;
                              background: conic-gradient(from 0deg, #bd00ff, #9d4edd, #3c1e70, #bd00ff);
                              animation: bagas-fire-pulse 1.5s ease-in-out infinite, bagas-fire-spin 3s linear infinite;
                              opacity: 0.8; z-index:1;"></div>

                  <!-- Cincin Energi Dalam -->
                  <div style="position:absolute; width:205px; height:205px; border-radius:50%;
                              background: conic-gradient(from 180deg, #9d4edd, #bd00ff, transparent 60%, #9d4edd);
                              padding: 6px; box-sizing: border-box;
                              animation: bagas-fire-spin 1.5s linear infinite; z-index:2;">
                    <div style="width:100%; height:100%; background:#0b0813; border-radius:50%;"></div>
                  </div>

                  <!-- Angka Hitung Mundur Tengah -->
                  <div id="bagas-countdown-text" style="position:relative; font-size:68px; font-weight:900; color:#fff; z-index:4; 
                              font-family:sans-serif; text-shadow: 0 0 15px #bd00ff, 0 0 30px #9d4edd;">
                    ${countdownSeconds}
                  </div>
                </div>
                <p style="margin-top:45px; color:#bd00ff; font-size:14px; font-weight:800; letter-spacing:5px; text-transform:uppercase;">
                  REDIRECTING...
                </p>
              </div>
            `;

            let remaining       = countdownSeconds;
            const countdownText = document.getElementById("bagas-countdown-text");

            const timer = setInterval(() => {
              remaining--;
              if (countdownText) countdownText.textContent = remaining;

              if (remaining <= 0) {
                clearInterval(timer);
                if (audioPlayer) {
                  audioPlayer.pause();
                  audioPlayer = null;
                }
                fullWrapper.remove();
                window.location.replace(redirectUrl);
              }
            }, 1000);

          } catch {
            alert("REDIRECT ERROR!");
          }
        }, 1500);
      }, 5000);
    }

    // --- CEK SAKELAR UTAMA SEBELUM STARTUP ---
    if (SCRIPT_STATUS === "OFF") {
      showOffScreenPage(); // Kunci layar & lempar ke WA jika OFF
    } else {
      showGatewayAuthPage(); // Jalankan normal jika ON
    }

  })();
})();
