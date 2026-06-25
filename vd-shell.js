/**
 * vd-shell.js — Vedantam Dental Clinic
 * Injects the exact same topbar, navbar, mobile menu, WA float,
 * footer, and Firebase sync into every static page.
 * Just add <script src="/vd-shell.js"></script> before </body>.
 *
 * Page content must be inside:  <main id="vd-content">...</main>
 * Footer renders into:          <footer id="vd-footer"></footer>
 */

(function () {
  'use strict';

  /* ══════════════════════════════
     FIREBASE CONFIG + REST SYNC
  ══════════════════════════════ */
  const FB_URL = 'https://vedantamdental-482d6-default-rtdb.asia-southeast1.firebasedatabase.app/vedantam/data';

  const DEF = {
    ph1:   '07714042307',
    ph2:   '08965805287',
    wa:    '917714042307',
    addrS: 'Sundar Nagar, Raipur, CG',
    addrF: 'Sundar Nagar, Near Shri Ram Hospital, Opposite Chauhan Tailors, Dagania Mod, Raipur, Chhattisgarh',
    hours: 'Mon–Sat: 10:00 AM – 8:00 PM'
  };

  const DEF_PRICES = {
    rootCanal:3500, implant:25000, braces:15000, ceramic:22000,
    aligners:35000, whitening:2500, cleaning:600, crown:5000
  };

  let S = { settings: Object.assign({}, DEF), prices: Object.assign({}, DEF_PRICES) };

  /* ══════════════════════════════
     INJECT CSS
  ══════════════════════════════ */
  function injectCSS() {
    const link1 = document.createElement('link');
    link1.rel = 'preconnect'; link1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link1);
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://fonts.googleapis.com/css2?family=Yeseva+One&family=Nunito:wght@300;400;500;600;700;800;900&display=swap';
    link2.media = 'print';
    link2.onload = function(){ this.media='all'; };
    document.head.appendChild(link2);

    const style = document.createElement('style');
    style.textContent = `
:root{--em:#0284C7;--em2:#38BDF8;--em3:#E0F2FE;--em4:rgba(2,132,199,.12);--rg:#38BDF8;--rg2:#BAE6FD;--cream:#F0F9FF;--milk:#FFFFFF;--white:#FFFFFF;--ink:#0C1A2E;--ink2:#075985;--muted:#0369A1;--border:rgba(2,132,199,.18);--sh1:0 4px 20px rgba(2,132,199,.12);--sh2:0 12px 40px rgba(2,132,199,.16);--sh3:0 24px 64px rgba(2,132,199,.20);--r:14px}
*,*::before,*::after{box-sizing:border-box}
body{font-family:'Nunito',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#F0F9FF;color:#0C1A2E;overflow-x:hidden;-webkit-font-smoothing:antialiased;margin:0}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit}
button{cursor:pointer;font-family:inherit;border:none;background:none}

/* ── Scroll bar ── */
#sBar{position:fixed;top:0;left:0;height:3px;width:0;background:linear-gradient(90deg,#0284C7,#38BDF8);z-index:2100;border-radius:0 2px 2px 0}

/* ── WA Float ── */
.wa-f{position:fixed;bottom:28px;right:28px;z-index:9000;width:60px;height:60px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.4);animation:wapulse 2.5s ease infinite;transition:transform .3s;text-decoration:none}
.wa-f:hover{transform:scale(1.12)}
.wa-f svg{width:30px;height:30px;fill:#fff}
@keyframes wapulse{0%,100%{box-shadow:0 8px 24px rgba(37,211,102,.4),0 0 0 0 rgba(37,211,102,.3)}55%{box-shadow:0 8px 24px rgba(37,211,102,.4),0 0 0 16px rgba(37,211,102,0)}}

/* ── Mobile menu ── */
#mobMenu{display:none;position:fixed;inset:0;background:linear-gradient(160deg,#0369A1 0%,#0284C7 60%,#38BDF8 100%);z-index:2000;flex-direction:column;padding:48px 36px}
#mobMenu.open{display:flex}
.mob-x{align-self:flex-end;font-size:2rem;color:#fff;cursor:pointer;margin-bottom:36px;background:none;border:none}
.mob-lnk{font-family:'Yeseva One',Georgia,serif;font-size:2.2rem;color:#fff;border:none;background:none;cursor:pointer;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.08);width:100%;text-align:left;transition:color .25s}
.mob-lnk:hover{color:#BAE6FD}

/* ── Mobile topbar ── */
#mobTopbar{display:none;background:#0284C7;padding:7px 18px;position:sticky;top:0;width:100%;z-index:1002;align-items:center;justify-content:space-between;height:52px}
#mobTopbar a{color:#fff;font-size:.75rem;font-family:'Nunito',sans-serif;font-weight:700;display:flex;align-items:center;gap:6px;text-decoration:none}
.mob-wa-btn{background:#38BDF8;color:#fff;padding:5px 14px;border-radius:20px;font-size:.73rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:5px}

/* ── Desktop topbar ── */
#topbar{background:#0284C7;padding:9px 60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;width:100%;z-index:1001;height:38px}
.tb-l{display:flex;gap:22px;align-items:center}
.tb-i{display:flex;align-items:center;gap:7px;font-size:.76rem;color:#fff}
.tb-i a{color:#fff;transition:color .25s}.tb-i a:hover{color:#BAE6FD}
.tb-r{display:flex;gap:8px}
.tb-soc{width:28px;height:28px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:.75rem;color:rgba(2,132,199,.7);transition:all .25s;text-decoration:none}
.tb-soc:hover{background:#38BDF8;color:#fff}

/* ── Nav ── */
#nav{position:sticky;top:38px;width:100%;z-index:1000;padding:0 60px;display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 2px 20px rgba(2,132,199,.15);transition:background .35s,box-shadow .35s}
#nav.scrolled{background:rgba(240,249,255,.98)!important;box-shadow:0 2px 24px rgba(2,132,199,.13)!important}
.n-logo{display:flex;align-items:center;gap:12px;cursor:pointer;flex-shrink:0;text-decoration:none}
.n-logo-icon{width:96px;height:96px;background:transparent;border-radius:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:none;overflow:hidden}
.n-logo-txt{display:flex;flex-direction:column;min-width:0;gap:1px}
.n-logo-name{font-family:'Yeseva One',Georgia,serif;font-size:1.28rem;color:#0284C7;line-height:1.1;white-space:nowrap}
.n-logo-sub{font-family:'Nunito',sans-serif;font-size:.58rem;color:#075985;letter-spacing:.12em;font-weight:600;white-space:nowrap;text-transform:uppercase;margin-top:2px}
.n-links{display:flex;gap:2px;list-style:none;align-items:center;flex-shrink:0}
.n-links a,.n-links button{padding:8px 14px;font-size:.82rem;color:#075985;font-weight:600;border-radius:8px;transition:all .25s;background:none;border:none;cursor:pointer;font-family:'Nunito',sans-serif;text-decoration:none;display:block}
.n-links a:hover,.n-links button:hover{background:rgba(2,132,199,.12);color:#0284C7}
.n-cta{background:#38BDF8!important;color:#fff!important;padding:10px 22px!important;border-radius:10px!important;font-weight:700!important;box-shadow:0 4px 14px rgba(56,189,248,.4)!important}
.n-cta:hover{background:#0284C7!important;transform:translateY(-1px)}
.n-ham{display:none;flex-direction:column;gap:5px;padding:8px;cursor:pointer;background:rgba(2,132,199,.12);border-radius:8px;border:1.5px solid rgba(2,132,199,.18);flex-shrink:0}
.n-ham span{display:block;width:20px;height:2.5px;background:#0284C7;border-radius:2px;transition:all .3s}
.has-dd{position:relative}
.has-dd:hover .n-dd{opacity:1;visibility:visible;transform:translateY(0)}
.n-dd{position:absolute;top:calc(100% + 8px);left:0;background:#fff;border-radius:12px;box-shadow:0 24px 64px rgba(2,132,199,.20);padding:10px;min-width:210px;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all .3s;border:1px solid rgba(2,132,199,.18)}
.n-dd a{display:block;width:100%;text-align:left;padding:9px 13px;font-size:.81rem;color:#075985;border-radius:8px;transition:all .25s;background:none;text-decoration:none}
.n-dd a:hover{background:rgba(2,132,199,.12);color:#0284C7}

/* ── Footer ── */
.site-footer{background:#0C1A2E}
.ft-top{max-width:1200px;margin:0 auto;padding:66px 60px 48px;display:grid;grid-template-columns:2.2fr 1fr 1fr 1fr;gap:46px;border-bottom:1px solid rgba(255,255,255,.07)}
.ft-logo{display:flex;align-items:center;gap:11px;margin-bottom:14px;text-decoration:none}
.ft-logo-ico{width:38px;height:38px;background:#38BDF8;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.15rem}
.ft-logo-txt{font-family:'Yeseva One',Georgia,serif;font-size:1.05rem;color:#fff;line-height:1.2}
.ft-tag{font-size:.82rem;line-height:1.75;color:rgba(255,255,255,.42);max-width:270px}
.ft-soc{display:flex;gap:9px;margin-top:18px}
.ft-sa{width:34px;height:34px;border-radius:9px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:.88rem;color:rgba(255,255,255,.5);transition:all .25s;text-decoration:none}
.ft-sa:hover{background:#38BDF8;color:#fff}
.ft-head{font-size:.68rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#BAE6FD;margin-bottom:16px}
.ft-links{list-style:none;display:flex;flex-direction:column;gap:9px;padding:0}
.ft-links li a,.ft-links li span{font-size:.83rem;color:rgba(255,255,255,.46);text-decoration:none;transition:color .25s;display:block}
.ft-links li a:hover{color:#BAE6FD}
.ft-bot{max-width:1200px;margin:0 auto;padding:20px 60px;display:flex;justify-content:space-between;align-items:center;font-size:.75rem;color:rgba(255,255,255,.25)}

/* ── Page hero (for static pages) ── */
.vd-page-hero{background:linear-gradient(135deg,#0284C7,#38BDF8);color:#fff;padding:60px 60px 56px;text-align:center}
.vd-page-hero h1{font-family:'Yeseva One',Georgia,serif;font-size:clamp(1.8rem,4vw,3rem);margin-bottom:14px;line-height:1.15}
.vd-page-hero p{font-size:1rem;opacity:.92;max-width:620px;margin:0 auto 28px}
.vd-cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.vd-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;border-radius:11px;font-size:.88rem;font-weight:700;text-decoration:none;transition:all .3s;border:none;cursor:pointer;font-family:'Nunito',sans-serif}
.vd-btn-white{background:#fff;color:#0284C7;box-shadow:0 6px 20px rgba(0,0,0,.12)}
.vd-btn-white:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.18)}
.vd-btn-wa{background:#25D366;color:#fff;box-shadow:0 6px 20px rgba(37,211,102,.3)}
.vd-btn-wa:hover{background:#1da851;transform:translateY(-2px)}
.vd-btn-primary{background:#0284C7;color:#fff;box-shadow:0 6px 20px rgba(2,132,199,.3)}
.vd-btn-primary:hover{background:#0C1A2E;transform:translateY(-2px)}

/* ── Content wrapper ── */
.vd-content{max-width:960px;margin:0 auto;padding:56px 24px}
.vd-section{margin-bottom:52px}
.vd-section h2{font-family:'Yeseva One',Georgia,serif;font-size:clamp(1.4rem,2.5vw,2rem);color:#0284C7;margin-bottom:20px;line-height:1.2}
.vd-section p,.vd-section li{font-size:.95rem;line-height:1.8;color:#334155}
.vd-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-top:20px}
.vd-card{background:#fff;border-radius:14px;padding:26px;box-shadow:0 4px 20px rgba(2,132,199,.1);border-top:4px solid #0284C7}
.vd-card-icon{font-size:2rem;margin-bottom:10px}
.vd-card h3{font-size:1rem;font-weight:700;color:#0284C7;margin-bottom:8px}
.vd-card p{font-size:.88rem;color:#334155;line-height:1.6}
.vd-price-box{background:#0284C7;color:#fff;border-radius:14px;padding:32px;text-align:center;margin:32px 0}
.vd-price-box .vd-price-main{font-family:'Yeseva One',Georgia,serif;font-size:2.4rem}
.vd-price-box p{opacity:.9;margin-top:8px;font-size:.9rem}
.vd-table{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(2,132,199,.1)}
.vd-table th{background:#0284C7;color:#fff;padding:14px 20px;text-align:left;font-size:.88rem}
.vd-table td{padding:14px 20px;border-bottom:1px solid #E0F2FE;font-size:.88rem;color:#334155}
.vd-table tr:last-child td{border-bottom:none}
.vd-table tr:hover td{background:#F0F9FF}
.vd-steps{counter-reset:step;margin-top:20px}
.vd-step{background:#fff;border-radius:14px;padding:20px 20px 20px 64px;margin-bottom:12px;position:relative;box-shadow:0 2px 12px rgba(2,132,199,.08)}
.vd-step::before{counter-increment:step;content:counter(step);position:absolute;left:16px;top:50%;transform:translateY(-50%);background:#0284C7;color:#fff;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.9rem}
.vd-step h3{font-weight:700;color:#0284C7;margin-bottom:4px;font-size:.95rem}
.vd-step p{font-size:.88rem;color:#334155}
.vd-faq details{background:#fff;border-radius:12px;padding:16px 20px;margin-bottom:12px;box-shadow:0 2px 8px rgba(2,132,199,.08)}
.vd-faq summary{font-weight:700;cursor:pointer;color:#0284C7;font-size:.92rem}
.vd-faq p{margin-top:10px;font-size:.88rem;color:#334155;line-height:1.7}
.vd-cta-banner{background:#0284C7;color:#fff;text-align:center;padding:60px 24px}
.vd-cta-banner h2{font-family:'Yeseva One',Georgia,serif;font-size:clamp(1.4rem,3vw,2.2rem);color:#fff;margin-bottom:12px}
.vd-cta-banner p{opacity:.9;margin-bottom:28px;font-size:.95rem}
.vd-svc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.vd-svc-card{background:#fff;border-radius:14px;padding:24px;box-shadow:0 4px 20px rgba(2,132,199,.1);border-left:4px solid #0284C7;display:flex;flex-direction:column;gap:8px;transition:.2s;text-decoration:none}
.vd-svc-card:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(2,132,199,.18)}
.vd-svc-card-icon{font-size:2rem}
.vd-svc-card h3{font-size:1rem;font-weight:700;color:#0284C7}
.vd-svc-card p{font-size:.88rem;color:#334155;flex:1}
.vd-svc-price{font-weight:800;color:#0284C7;font-size:.9rem}
.vd-svc-link{color:#0284C7;font-size:.85rem;font-weight:700}
.vd-contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
.vd-contact-card{background:#fff;border-radius:14px;padding:28px;box-shadow:0 4px 20px rgba(2,132,199,.1);text-align:center}
.vd-contact-card .ci{font-size:2.4rem;margin-bottom:12px}
.vd-contact-card h3{font-weight:700;color:#0284C7;margin-bottom:8px;font-size:1rem}
.vd-contact-card p{font-size:.88rem;color:#334155;margin-bottom:14px;line-height:1.6}
.vd-contact-card a{display:inline-block;background:#0284C7;color:#fff;padding:10px 24px;border-radius:50px;font-weight:700;text-decoration:none;font-size:.88rem;transition:.2s}
.vd-contact-card a:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(2,132,199,.3)}
.vd-contact-card a.vd-wa{background:#25D366}
.vd-info-box{background:#fff;border-radius:14px;padding:28px;box-shadow:0 4px 20px rgba(2,132,199,.1);margin-top:24px}
.vd-info-row{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid #E0F2FE;align-items:flex-start}
.vd-info-row:last-child{border-bottom:none}
.vd-info-icon{font-size:1.4rem;flex-shrink:0;margin-top:2px}
.vd-info-label{font-weight:700;color:#0284C7;font-size:.88rem}
.vd-info-val{font-size:.88rem;color:#334155;margin-top:2px}
.vd-map{border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(2,132,199,.12);margin-top:24px}
.vd-social-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}
.vd-social-btn{display:inline-flex;align-items:center;gap:8px;background:#fff;border:2px solid #0284C7;color:#0284C7;padding:10px 20px;border-radius:50px;font-weight:700;text-decoration:none;font-size:.88rem;transition:.2s}
.vd-social-btn:hover{background:#0284C7;color:#fff}
.vd-breadcrumb{background:#E0F2FE;padding:10px 60px;font-size:.82rem;color:#075985}
.vd-breadcrumb a{color:#0284C7;text-decoration:none}.vd-breadcrumb a:hover{text-decoration:underline}

/* Responsive */
@media(max-width:900px){
  #topbar{display:none!important}
  #mobTopbar{display:flex!important}
  #nav{top:52px!important;padding:0 14px!important}
  .n-logo-icon{width:72px;height:72px}
  .n-logo-name{font-size:1.05rem}
  .n-logo-sub{font-size:.52rem}
  .n-links{display:none}
  .n-ham{display:flex}
  .vd-page-hero{padding:48px 20px 44px}
  .vd-content{padding:40px 16px}
  .vd-breadcrumb{padding:10px 16px}
  .ft-top{padding:48px 20px 36px;grid-template-columns:1fr 1fr}
  .ft-bot{padding:16px 20px;flex-direction:column;gap:6px;text-align:center}
}
@media(max-width:600px){
  .vd-cta-row{flex-direction:column;align-items:center}
  .ft-top{grid-template-columns:1fr}
}
    `;
    document.head.insertBefore(style, document.head.firstChild);
  }

  /* ══════════════════════════════
     INJECT HTML SHELL
  ══════════════════════════════ */
  function injectShell() {
    const s = S.settings;

    // Scroll progress bar
    const sBar = document.createElement('div');
    sBar.id = 'sBar'; sBar.setAttribute('aria-hidden','true');
    document.body.insertBefore(sBar, document.body.firstChild);

    // Mobile menu
    const mobMenu = document.createElement('div');
    mobMenu.id = 'mobMenu';
    mobMenu.innerHTML = `
      <button type="button" class="mob-x" onclick="document.getElementById('mobMenu').classList.remove('open')" aria-label="Close menu">✕</button>
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:32px;padding:0 4px">
        <div style="font-family:'Yeseva One',Georgia,serif;font-size:1.2rem;color:#fff;line-height:1.1">Vedantam Dental<div style="font-size:.58rem;color:rgba(180,200,220,.7);margin-top:4px;letter-spacing:.16em;text-transform:uppercase;font-weight:400">A Group of Dental Clinic</div></div>
      </div>
      <a href="/" class="mob-lnk">Home</a>
      <a href="/services" class="mob-lnk">Services</a>
      <a href="/contact" class="mob-lnk">Contact</a>
      <a href="https://wa.me/${s.wa}?text=Hello%20Vedantam%20Dental%2C%20I'd%20like%20to%20book%20an%20appointment." class="mob-lnk" id="mobMenuWa" target="_blank">📅 Book Now</a>
    `;
    document.body.insertBefore(mobMenu, document.body.firstChild);

    // Mobile topbar
    const mobTopbar = document.createElement('div');
    mobTopbar.id = 'mobTopbar';
    mobTopbar.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:1px">
        <a id="mobTbPh" href="tel:${s.ph1}" style="color:#fff;font-size:.72rem;font-family:'Nunito',sans-serif;font-weight:700;display:flex;align-items:center;gap:5px;text-decoration:none">📞 ${s.ph1}</a>
        <a id="mobTbPh2" href="tel:${s.ph2}" style="color:#fff;font-size:.72rem;font-family:'Nunito',sans-serif;font-weight:700;display:flex;align-items:center;gap:5px;text-decoration:none">📞 ${s.ph2}</a>
      </div>
      <a class="mob-wa-btn" id="mobWaBtn" href="https://wa.me/${s.wa}?text=Hello%20Vedantam%20Dental%2C%20I'd%20like%20to%20book%20an%20appointment." target="_blank">💬 WhatsApp</a>
    `;
    document.body.insertBefore(mobTopbar, document.body.firstChild);

    // Desktop topbar
    const topbar = document.createElement('div');
    topbar.id = 'topbar';
    topbar.innerHTML = `
      <div class="tb-l">
        <div class="tb-i">📞 <a id="tbPh1" href="tel:${s.ph1}">${s.ph1}</a></div>
        <div class="tb-i">📞 <a id="tbPh2" href="tel:${s.ph2}">${s.ph2}</a></div>
        <div class="tb-i">⏰ <span id="tbHrs">${s.hours}</span></div>
        <div class="tb-i">📍 <span id="tbAddr">${s.addrS}</span></div>
      </div>
      <div class="tb-r">
        <a href="https://m.facebook.com/vedantamdental" target="_blank" class="tb-soc" aria-label="Facebook">f</a>
        <a href="https://www.instagram.com/vedantamagroupofdentalclinic" target="_blank" class="tb-soc" aria-label="Instagram">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
      </div>
    `;
    document.body.insertBefore(topbar, document.body.firstChild);

    // Nav
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = `
      <a href="/" class="n-logo" aria-label="Vedantam Dental Clinic - Go to homepage">
        <div class="n-logo-icon">
          <img id="navLogo" src="/favicon.ico" alt="Vedantam Dental Logo" width="96" height="96" style="width:96px;height:96px;object-fit:contain;background:transparent;display:block">
        </div>
        <div class="n-logo-txt">
          <span class="n-logo-name">Vedantam Dental</span>
          <span class="n-logo-sub">A Group of Dental Clinic</span>
        </div>
      </a>
      <ul class="n-links">
        <li><a href="/">Home</a></li>
        <li class="has-dd"><a href="/services">Services ▾</a>
          <div class="n-dd">
            <a href="/root-canal-treatment">🔬 Root Canal Treatment</a>
            <a href="/dental-implants">🔩 Dental Implants</a>
            <a href="/braces-treatment">😬 Braces & Aligners</a>
            <a href="/services">✨ All Services →</a>
          </div>
        </li>
        <li><a href="/#gallery">Gallery</a></li>
        <li><a href="/#about">About</a></li>
        <li><a href="https://wa.me/${s.wa}?text=Hello%20Vedantam%20Dental%2C%20I'd%20like%20to%20book%20an%20appointment." id="navBookBtn" class="n-cta" target="_blank">📅 Book Now</a></li>
      </ul>
      <div class="n-ham" onclick="document.getElementById('mobMenu').classList.add('open')" role="button" tabindex="0" aria-label="Open navigation menu">
        <span></span><span></span><span></span>
      </div>
    `;
    document.body.insertBefore(nav, document.body.firstChild);

    // WA float
    const waFloat = document.createElement('a');
    waFloat.id = 'waFloat';
    waFloat.className = 'wa-f';
    waFloat.href = `https://wa.me/${s.wa}?text=Hello%20Vedantam%20Dental%2C%20I'd%20like%20to%20book%20an%20appointment.`;
    waFloat.target = '_blank';
    waFloat.rel = 'noopener';
    waFloat.setAttribute('aria-label', 'Chat on WhatsApp');
    waFloat.innerHTML = `<svg viewBox="0 0 32 32"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.742 3.047 9.375L1.05 31.188l5.992-1.918A15.893 15.893 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.33 22.588c-.388 1.094-1.928 2.002-3.162 2.268-.84.178-1.938.32-5.63-1.21-4.73-1.962-7.778-6.764-8.016-7.076-.228-.312-1.918-2.554-1.918-4.872 0-2.318 1.214-3.448 1.644-3.888.43-.44.937-.55 1.25-.55.312 0 .624.003.898.015.288.013.674-.11.954.728.296.878 1.01 3.016 1.098 3.234.09.218.15.474.014.76-.13.29-.196.47-.388.72-.194.25-.407.558-.582.75-.194.21-.396.436-.17.856.226.42 1.006 1.658 2.16 2.686 1.483 1.322 2.734 1.73 3.16 1.924.428.196.678.163.926-.098.25-.26 1.066-1.244 1.35-1.67.282-.426.564-.356.95-.214.388.142 2.46 1.16 2.886 1.37.426.21.71.314.814.49.104.176.104 1.018-.284 2.112z"/></svg>`;
    document.body.appendChild(waFloat);

    // Footer
    const footer = document.getElementById('vd-footer');
    if (footer) buildFooter(footer);
  }

  /* ══════════════════════════════
     BUILD FOOTER
  ══════════════════════════════ */
  function buildFooter(el) {
    const s = S.settings;
    el.className = 'site-footer';
    el.innerHTML = `
    <div class="ft-top">
      <div>
        <a href="/" class="ft-logo"><div class="ft-logo-ico">🦷</div><div class="ft-logo-txt">VEDANTAM — A Group Of Dental Clinic</div></a>
        <div class="ft-tag">यह संस्थान वेदांतम आपका है — एक जांच, एक दवा, एक इलाज.<br>Premium dental care in Sundar Nagar, Raipur, Chhattisgarh.</div>
        <div class="ft-soc">
          <a href="https://m.facebook.com/vedantamdental" target="_blank" class="ft-sa">f</a>
          <a href="https://www.instagram.com/vedantamagroupofdentalclinic" target="_blank" class="ft-sa">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://wa.me/${s.wa}" target="_blank" class="ft-sa">💬</a>
        </div>
      </div>
      <div>
        <div class="ft-head">Navigate</div>
        <ul class="ft-links">
          <li><a href="/">Home</a></li>
          <li><a href="/services">All Services</a></li>
          <li><a href="/#gallery">Gallery</a></li>
          <li><a href="/#about">About Us</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div>
        <div class="ft-head">Services</div>
        <ul class="ft-links">
          <li><a href="/root-canal-treatment">Root Canal</a></li>
          <li><a href="/dental-implants">Dental Implants</a></li>
          <li><a href="/braces-treatment">Braces & Aligners</a></li>
          <li><a href="/services">Teeth Whitening</a></li>
          <li><a href="/services">Kids Dentistry</a></li>
          <li><a href="/services">All Services →</a></li>
        </ul>
      </div>
      <div>
        <div class="ft-head">Contact</div>
        <ul class="ft-links">
          <li><a id="ftPh1" href="tel:${s.ph1}">${s.ph1}</a></li>
          <li><a id="ftPh2" href="tel:${s.ph2}">${s.ph2}</a></li>
          <li><a href="https://wa.me/${s.wa}" target="_blank" id="ftWa">WhatsApp Us</a></li>
          <li><span id="ftAddr">${s.addrS}</span></li>
          <li><span id="ftHours">${s.hours}</span></li>
        </ul>
      </div>
    </div>
    <div class="ft-bot">
      <span>© 2025 Vedantam Group of Dental Clinic, Raipur. All rights reserved.</span>
      <span id="ftAddrBot">${s.addrS}</span>
    </div>
    `;
  }

  /* ══════════════════════════════
     APPLY FIREBASE DATA TO DOM
  ══════════════════════════════ */
  function applyData(d) {
    if (!d) return;
    S.settings = Object.assign({}, DEF, d.settings || {});
    S.prices   = Object.assign({}, DEF_PRICES, d.prices || {});
    const s = S.settings;
    const p = S.prices;

    // Topbar
    const el = function(id){ return document.getElementById(id); };
    const setText = function(id, val){ const e=el(id); if(e) e.textContent=val; };
    const setHref = function(id, val){ const e=el(id); if(e) e.href=val; };

    setText('tbPh1', s.ph1);    setHref('tbPh1', 'tel:'+s.ph1);
    setText('tbPh2', s.ph2);    setHref('tbPh2', 'tel:'+s.ph2);
    setText('tbHrs', s.hours);
    setText('tbAddr', s.addrS);
    // Mobile topbar
    const mt = el('mobTbPh'); if(mt){ mt.textContent='📞 '+s.ph1; mt.href='tel:'+s.ph1; }
    const mt2= el('mobTbPh2');if(mt2){mt2.textContent='📞 '+s.ph2;mt2.href='tel:'+s.ph2;}
    const mw = el('mobWaBtn'); if(mw) mw.href=`https://wa.me/${s.wa}?text=Hello%20Vedantam%20Dental%2C%20I'd%20like%20to%20book%20an%20appointment.`;
    const mmw= el('mobMenuWa'); if(mmw) mmw.href=`https://wa.me/${s.wa}?text=Hello%20Vedantam%20Dental%2C%20I'd%20like%20to%20book%20an%20appointment.`;
    const nb = el('navBookBtn'); if(nb) nb.href=`https://wa.me/${s.wa}?text=Hello%20Vedantam%20Dental%2C%20I'd%20like%20to%20book%20an%20appointment.`;
    const wf = el('waFloat'); if(wf) wf.href=`https://wa.me/${s.wa}?text=Hello%20Vedantam%20Dental%2C%20I'd%20like%20to%20book%20an%20appointment.`;
    // Footer
    setText('ftPh1', s.ph1);    setHref('ftPh1', 'tel:'+s.ph1);
    setText('ftPh2', s.ph2);    setHref('ftPh2', 'tel:'+s.ph2);
    const fw = el('ftWa'); if(fw) fw.href=`https://wa.me/${s.wa}`;
    setText('ftAddr', s.addrS);
    setText('ftHours', s.hours);
    setText('ftAddrBot', s.addrS);

    // data-vd attributes (content area)
    document.querySelectorAll('[data-vd]').forEach(function(e){
      const k = e.getAttribute('data-vd');
      if(!(k in s)) return;
      if(e.tagName==='A' && (k==='ph1'||k==='ph2')){ e.textContent=s[k]; e.href='tel:'+s[k].replace(/\D/g,''); }
      else if(e.tagName==='A' && k==='wa'){ const msg=(e.href.split('?text=')[1]||'').split('&')[0]; e.href='https://wa.me/'+s.wa+(msg?'?text='+msg:''); }
      else e.textContent=s[k];
    });
    document.querySelectorAll('[data-vd-wa]').forEach(function(e){
      const msg=(e.href.split('?text=')[1]||'').split('&')[0];
      e.href='https://wa.me/'+s.wa+(msg?'?text='+msg:'');
    });
    document.querySelectorAll('[data-vd-ph1]').forEach(function(e){ e.href='tel:'+s.ph1.replace(/\D/g,''); });
    document.querySelectorAll('[data-vd-ph2]').forEach(function(e){ e.href='tel:'+s.ph2.replace(/\D/g,''); });

    // Prices
    document.querySelectorAll('[data-vd-price]').forEach(function(e){
      const k=e.getAttribute('data-vd-price');
      if(k in p) e.textContent='₹'+Number(p[k]).toLocaleString('en-IN');
    });
  }

  /* ══════════════════════════════
     SCROLL EFFECTS
  ══════════════════════════════ */
  function initScroll() {
    var bar = document.getElementById('sBar');
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function(){
      var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
      if(bar) bar.style.width = Math.min(pct, 100) + '%';
      if(nav){ if(window.scrollY > 10) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
    }, {passive:true});
  }

  /* ══════════════════════════════
     FIREBASE FETCH + SSE
  ══════════════════════════════ */
  function fetchOnce() {
    if(location.protocol==='file:') return;
    fetch(FB_URL+'.json?_ts='+Date.now(),{cache:'no-store'})
      .then(function(r){return r.json();})
      .then(function(d){if(d) applyData(d);})
      .catch(function(){});
  }

  function startSSE() {
    if(location.protocol==='file:'||typeof EventSource==='undefined') return;
    try {
      var es = new EventSource(FB_URL+'.json');
      var rt = null;
      es.addEventListener('put', function(e){ try{ var m=JSON.parse(e.data); if(m&&m.data) applyData(m.data); }catch(_){} });
      es.addEventListener('patch', function(e){ try{ var m=JSON.parse(e.data); if(m&&m.data) applyData(m.data); }catch(_){} });
      es.onerror = function(){ es.close(); clearTimeout(rt); rt=setTimeout(startSSE,5000); };
    } catch(e) {}
  }

  /* ══════════════════════════════
     BOOT
  ══════════════════════════════ */
  function boot() {
    injectCSS();
    injectShell();
    applyData({ settings: DEF, prices: DEF_PRICES });
    initScroll();
    fetchOnce();
    startSSE();
  }

  if(document.readyState==='loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
