(function () {
  "use strict";

  const CONFIG = {
    r: "https://raw.githubusercontent.com/dbofchl/bypass/main/bypass.txt",
    t: "https://raw.githubusercontent.com/dbofchl/bypass/main/ch.txt",
    m: "https://raw.githubusercontent.com/vanz-website/VanzBypass/main/music.mp3"
  };

  const VALID_KEYS = [
    "psteamadm",
    "renzy",
    "bagasxit"
  ];

  const FALLBACK_MUSIC_URL = "https://raw.githubusercontent.com/vanz-website/VanzBypass/main/music.mp3";
  let audioPlayer = null;

  (async function () {

    // Menghapus elemen lama agar tidak menumpuk
    document.getElementById("bagas-full-wrapper")?.remove();
    document.getElementById("alenz-floating-credit")?.remove();

    const titleName = "BAGASXIT PREMIUM";

    // --- BAGIAN UI & CSS (DIUBAH MENJADI HALAMAN PENUH & EFEK API UNGU) ---
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
      .btn-style-outline { background: transparent; border: 1px solid #3c1e70; color: #a39cb5; font-size: 12px; padding: 10px; margin-top: 5px; margin-bottom: 0; }
      
      /* Animasi Putaran & Denyut Api Ungu */
      @keyframes bagas-fire-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes bagas-fire-pulse { 0%, 100% { transform: scale(1); filter: blur(2px) drop-shadow(0 0 15px #9d4edd); } 50% { transform: scale(1.03); filter: blur(4px) drop-shadow(0 0 30px #bd00ff); } }
      @keyframes alenz-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `;
    document.head.appendChild(styleEl);

    // Membuat Pembungkus Utama Layar Penuh
    const fullWrapper = document.createElement("div");
    fullWrapper.id = "bagas-full-wrapper";
    document.body.appendChild(fullWrapper);

    // --- LOGIKA UTAMA 1: HALAMAN LOGIN / VERIFIKASI KEY ---
    function showGatewayAuthPage() {
      fullWrapper.innerHTML = `
        <div class="bagas-brand-header">BAGAS<span>XIT</span></div>
        <div class="bagas-sub-status">FREE TRIAL ACTIVE: ALL MODS INCLUDED</div>
        <div class="bagas-card-container">
          <!-- Tombol Musik (Sesuai Logika Aslimu) -->
          <button id="alenz-music-btn" style="
            position:absolute; top:15px; right:15px;
            background:rgba(255,255,255,0.05); border:1px solid rgba(189,0,255,0.3);
            color:#ff4444; border-radius:50%; width:32px; height:32px;
            cursor:pointer; font-size:14px; display:flex; align-items:center;
            justify-content:center; box-shadow:0 0 8px rgba(0,0,0,0.3);
            z-index:10;">🔇</button>

          <div class="bagas-icon">🎮</div>
          <input type="text" id="alenz-key-input" class="bagas-input-field" placeholder="Masukkan Access Key Anda">
          <button id="alenz-login-btn" class="bagas-action-btn btn-style-premium">Verify Access Key</button>
          <button id="alenz-telegram-btn" class="bagas-action-btn btn-style-whatsapp">💬 WhatsApp Community</button>
          <div id="alenz-status" style="margin-top:15px; font-size:11px; color:#5f5777; font-weight:600;">Masukkan lisensi untuk melanjutkan bypass</div>
        </div>
      `;

      const musicBtn    = document.getElementById("alenz-music-btn");
      const keyInput    = document.getElementById("alenz-key-input");
      const loginBtn    = document.getElementById("alenz-login-btn");
      const telegramBtn = document.getElementById("alenz-telegram-btn");
      const statusEl    = document.getElementById("alenz-status");

      // Logika Musik Bawaan Asli (Tidak Diubah)
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

      // Logika Tombol Komunitas (Aslinya ke Telegram, sekarang diarahkan ke link WA kamu)
      telegramBtn.addEventListener("click", () => {
        window.open("https://chat.whatsapp.com/your-link-here", "_blank");
      });

      // Logika Submit Verifikasi Key (Sesuai Aslinya)
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
          telegramBtn.disabled = true;
          setTimeout(() => { showBypassDashboardPage(); }, 800);
        } else {
          statusEl.innerHTML = "<span style='color:#ff4444;'>INVALID LICENSE KEY!</span>";
        }
      });
    }

    // --- LOGIKA UTAMA 2: HALAMAN DASHBOARD / PILIH MODE ---
    function showBypassDashboardPage() {
      fullWrapper.innerHTML = `
        <div class="bagas-brand-header">BAGAS<span>XIT</span> VIP</div>
        <div class="bagas-sub-status" style="color:#a39cb5;">PILIH METODE SISTEM BYPASS</div>
        <div class="bagas-card-container">
          <div class="bagas-icon">⚙️</div>
          <button id="alenz-btn-fast" class="bagas-action-btn btn-style-premium" style="background:#d90429;">FAST MODE (BAN RISK)</button>
          <button id="alenz-btn-secure" class="bagas-action-btn btn-style-premium" style="background:#6c5ce7;">SECURE MODE (MIDDLE)</button>
          <button id="alenz-btn-safe" class="bagas-action-btn btn-style-whatsapp">SAFE MODE (FULL SAFE)</button>
        </div>
      `;

      document.getElementById("alenz-btn-fast").addEventListener("click",   () => runRedirect(30));
      document.getElementById("alenz-btn-secure").addEventListener("click", () => runRedirect(45));
      document.getElementById("alenz-btn-safe").addEventListener("click",   () => runRedirect(60));
    }

    // --- LOGIKA UTAMA 3: PROSES CHECKING UPDATE & RUN REDIRECT ---
    function runRedirect(countdownSeconds) {
      // 1. Tampilan Awal: Checking Update (Sesuai Logika Aslimu)
      fullWrapper.innerHTML = `
        <div style="text-align:center; background:#120e29; padding:35px 30px; border-radius:16px; border:2px solid #3c1e70; width:290px;">
          <div style="width:45px; height:45px; border:4px solid rgba(189,0,255,0.1); border-top:4px solid #bd00ff; border-radius:50%; margin:0 auto 20px auto; animation:alenz-spin 0.8s linear infinite;"></div>
          <p id="alenz-check-text" style="color:#bd00ff; font-size:15px; font-weight:700; margin:0; letter-spacing:1.5px;">CHECKING UPDATE...</p>
        </div>
      `;

      setTimeout(async () => {
        let hasUpdate = false;
        try {
          // Tetap melakukan fetch update ke server Rama Modz asli milikmu
          const updateRes  = await fetch("https://rm.rama-modz.workers.dev/");
          const updateText = await updateRes.text();
          if (updateText.includes("GitHub Updated")) hasUpdate = true;
        } catch { }

        const checkText = document.getElementById("alenz-check-text");
        checkText.innerHTML = hasUpdate
          ? "<span style='color:#19c368;'>Link Updated Successfully! ✓</span>"
          : "<span style='color:#ff4444;'>No Update Available!</span>";

        // 2. Masuk Ke Hitung Mundur Setelah Checking Selesai (5 Detik)
        setTimeout(async () => {
          try {
            const redirectRes = await fetch(CONFIG.r + "?t=" + Date.now());
            const redirectUrl = (await redirectRes.text()).trim();

            if (!redirectUrl.startsWith("http")) return;

            // UBAH TAMPILAN JADI RING API UNGU PREMIUM COCOK UNTUK COUNDOWN
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
                  <div id="countdown-text" style="position:relative; font-size:68px; font-weight:900; color:#fff; z-index:4; 
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
            const countdownText = document.getElementById("countdown-text");

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

    // Jalankan halaman utama pertama kali
    showGatewayAuthPage();

  })();
})();
