(function () {
  "use strict";

  const CONFIG = {
    r: "https://raw.githubusercontent.com/dbofchl/bypass/main/bypass.txt"
  };

  const VALID_KEYS = ["psteamadm", "renzy", "bagasxit"];

  document.getElementById("bagas-full-wrapper")?.remove();

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
    .bagas-card-container { background: #120e29; border: 2px solid #3c1e70; border-radius: 24px; padding: 35px 25px; width: 100%; max-width: 340px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.6); box-sizing: border-box; }
    .bagas-icon { font-size: 42px; margin-bottom: 15px; }
    .bagas-input-field { width: 100%; padding: 14px; margin-bottom: 16px; border: 1px solid #3c1e70; border-radius: 12px; background: #090518; color: #fff; text-align: center; box-sizing: border-box; font-size: 14px; outline: none; }
    .bagas-input-field:focus { border-color: #9d4edd; }
    .bagas-action-btn { width: 100%; border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 13px; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; box-sizing: border-box; transition: transform 0.1s ease, background 0.2s; }
    .bagas-action-btn:active { transform: scale(0.98); }
    .btn-style-whatsapp { background: #19c368; color: #fff; }
    .btn-style-whatsapp:hover { background: #15a857; }
    .btn-style-premium { background: #9d4edd; color: #fff; }
    .btn-style-premium:hover { background: #853ec4; }
    .btn-style-outline { background: transparent; border: 1px solid #3c1e70; color: #a39cb5; font-size: 12px; padding: 10px; margin-top: 5px; margin-bottom: 0; }
  `;
  document.head.appendChild(styleEl);

  const fullWrapper = document.createElement("div");
  fullWrapper.id = "bagas-full-wrapper";
  document.body.appendChild(fullWrapper);

  function showGatewayAuthPage() {
    fullWrapper.innerHTML = `
      <div class="bagas-brand-header">BAGAS<span>XIT</span></div>
      <div class="bagas-sub-status">FREE TRIAL ACTIVE: ALL MODS INCLUDED</div>
      <div class="bagas-card-container">
        <div class="bagas-icon">🎮</div>
        <input type="text" id="access-key-input" class="bagas-input-field" placeholder="Masukkan Access Key Anda">
        <button id="submit-verify-btn" class="bagas-action-btn btn-style-premium">Verify Access Key</button>
        <button id="join-whatsapp-btn" class="bagas-action-btn btn-style-whatsapp">💬 WhatsApp Community</button>
        <div id="auth-status-msg" style="margin-top: 15px; font-size: 11px; color: #5f5777; font-weight: 600;">Masukkan lisensi untuk melanjutkan bypass</div>
      </div>
    `;

    document.getElementById("join-whatsapp-btn").addEventListener("click", () => {
      window.open("https://chat.whatsapp.com/your-link-here", "_blank");
    });

    const verifyBtn = document.getElementById("submit-verify-btn");
    const keyInput  = document.getElementById("access-key-input");
    const statusMsg = document.getElementById("auth-status-msg");

    verifyBtn.addEventListener("click", () => {
      const keyValue = keyInput.value.trim().toLowerCase();
      if (!keyValue) {
        statusMsg.innerHTML = "<span style='color:#ff4444;'>MOHON INPUT AKSES KEY!</span>";
        return;
      }
      if (VALID_KEYS.includes(keyValue)) {
        statusMsg.innerHTML = "<span style='color:#19c368;'>LISENSI BERHASIL DIKONFIRMASI! ✓</span>";
        verifyBtn.disabled = true;
        setTimeout(() => { showBypassDashboardPage(); }, 800);
      } else {
        statusMsg.innerHTML = "<span style='color:#ff4444;'>LISENSI TIDAK VALID!</span>";
      }
    });
  }

  function showBypassDashboardPage() {
    fullWrapper.innerHTML = `
      <div class="bagas-brand-header">BAGAS<span>XIT</span> VIP</div>
      <div class="bagas-sub-status" style="color:#a39cb5;">PILIH METODE SISTEM BYPASS</div>
      <div class="bagas-card-container">
        <div class="bagas-icon">⚙️</div>
        <button id="mode-fast-btn" class="bagas-action-btn btn-style-premium" style="background:#d90429;">FAST MODE (HIGH RISK)</button>
        <button id="mode-secure-btn" class="bagas-action-btn btn-style-premium" style="background:#6c5ce7;">SECURE MODE (MIDDLE)</button>
        <button id="mode-safe-btn" class="bagas-action-btn btn-style-whatsapp">SAFE MODE (FULL SAFE)</button>
        <button id="back-to-auth-btn" class="bagas-action-btn btn-style-outline">← Kembali ke Verifikasi</button>
      </div>
    `;

    document.getElementById("mode-fast-btn").addEventListener("click", () => startBypassRedirection(30));
    document.getElementById("mode-secure-btn").addEventListener("click", () => startBypassRedirection(45));
    document.getElementById("mode-safe-btn").addEventListener("click", () => startBypassRedirection(60));
    document.getElementById("back-to-auth-btn").addEventListener("click", () => showGatewayAuthPage());
  }

  function startBypassRedirection(countdownSeconds) {
    if (!document.getElementById("bagas-fire-style")) {
      const fireStyle = document.createElement("style");
      fireStyle.id = "bagas-fire-style";
      fireStyle.textContent = `
        @keyframes bagas-fire-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes bagas-fire-pulse { 0%, 100% { transform: scale(1); filter: blur(2px) drop-shadow(0 0 15px #9d4edd); } 50% { transform: scale(1.03); filter: blur(4px) drop-shadow(0 0 30px #bd00ff); } }
      `;
      document.head.appendChild(fireStyle);
    }

    fullWrapper.innerHTML = `
      <div style="text-align:center;">
        <div style="position:relative; width:260px; height:260px; margin:0 auto; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:220px; height:220px; border-radius:50%; background:conic-gradient(from 0deg, #bd00ff, #9d4edd, #3c1e70, #bd00ff); animation: bagas-fire-pulse 1.5s ease-in-out infinite, bagas-fire-spin 3s linear infinite; opacity: 0.8; z-index:1;"></div>
          <div style="position:absolute; width:205px; height:205px; border-radius:50%; background:conic-gradient(from 180deg, #9d4edd, #bd00ff, transparent 60%, #9d4edd); padding: 6px; box-sizing: border-box; animation: bagas-fire-spin 1.5s linear infinite; z-index:2;"><div style="width:100%; height:100%; background:#0b0813; border-radius:50%;"></div></div>
          <div id="countdown-timer-text" style="position:relative; font-size:68px; font-weight:900; color:#fff; z-index:4; font-family:sans-serif; text-shadow: 0 0 15px #bd00ff, 0 0 30px #9d4edd;">${countdownSeconds}</div>
        </div>
        <p style="margin-top:45px; color:#bd00ff; font-size:14px; font-weight:800; letter-spacing:5px; text-transform:uppercase; text-shadow: 0 0 10px rgba(157,78,221,0.5);">SINKRONISASI SERVER BYPASS...</p>
      </div>
    `;

    let remainingTime = countdownSeconds;
    const timerText = document.getElementById("countdown-timer-text");
    const intervalTimer = setInterval(async () => {
      remainingTime--;
      if (timerText) timerText.textContent = remainingTime;
      if (remainingTime <= 0) {
        clearInterval(intervalTimer);
        fullWrapper.remove();
        try {
          const redirectRes = await fetch(CONFIG.r + "?t=" + Date.now());
          const redirectUrl = (await redirectRes.text()).trim();
          if (redirectUrl.startsWith("http")) { window.location.replace(redirectUrl); }
        } catch { alert("Gagal terhubung ke server"); }
      }
    }, 1000);
  }

  showGatewayAuthPage();
})();
