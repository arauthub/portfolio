const { spawn } = require('child_process');
const http = require('http');

async function getDebuggerUrl(port) {
  return new Promise((resolve, reject) => {
    const tryConnect = (attempts) => {
      http.get(`http://127.0.0.1:${port}/json/version`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.webSocketDebuggerUrl);
          } catch (e) {
            if (attempts > 0) setTimeout(() => tryConnect(attempts - 1), 300);
            else reject(e);
          }
        });
      }).on('error', (err) => {
        if (attempts > 0) setTimeout(() => tryConnect(attempts - 1), 300);
        else reject(err);
      });
    };
    tryConnect(15);
  });
}

function sendCDP(ws, method, params = {}) {
  return new Promise((resolve) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evalCDP(pageWs, expression) {
  const res = await sendCDP(pageWs, 'Runtime.evaluate', {
    expression: `(() => { ${expression} })()`,
    returnByValue: true
  });
  return res?.result?.value;
}

async function auditSite(url, name, isKids = false) {
  console.log(`\n======================================================`);
  console.log(`SPEC-DRIVEN VERIFICATION AUDIT: ${name}`);
  console.log(`URL: ${url}`);
  console.log(`======================================================`);

  const port = 9700 + Math.floor(Math.random() * 200);
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    'about:blank'
  ]);

  try {
    const browserWsUrl = await getDebuggerUrl(port);
    const browserWs = new WebSocket(browserWsUrl);
    await new Promise(res => browserWs.onopen = res);

    const createTargetRes = await sendCDP(browserWs, 'Target.createTarget', { url: 'about:blank' });
    const pageWsUrl = `ws://127.0.0.1:${port}/devtools/page/${createTargetRes.targetId}`;
    const pageWs = new WebSocket(pageWsUrl);
    await new Promise(res => pageWs.onopen = res);

    const consoleErrors = [];
    pageWs.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' '));
      }
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        consoleErrors.push(msg.params.entry.text);
      }
    });

    await sendCDP(pageWs, 'Runtime.enable');
    await sendCDP(pageWs, 'Log.enable');
    await sendCDP(pageWs, 'Page.enable');
    await sendCDP(pageWs, 'DOM.enable');

    await sendCDP(pageWs, 'Page.navigate', { url });
    await new Promise(r => setTimeout(r, 2000));

    // Clear storage for initial gate check
    await evalCDP(pageWs, `localStorage.clear(); return true;`);
    await sendCDP(pageWs, 'Page.reload');
    await new Promise(r => setTimeout(r, 2500));

    // 1. Meta & Favicon Check
    const meta = await evalCDP(pageWs, `
      const favicon = document.querySelector('link[rel*="icon"]')?.getAttribute('href') || '';
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
      const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
      return { favicon, ogTitle, ogImg };
    `);

    // 2. VIP Gate Check & Unlock
    const gateCheck = await evalCDP(pageWs, `
      const gate = document.querySelector('.gate-modal');
      const btn = document.querySelector('.guest-preview-btn');
      const present = !!gate;
      if (btn) btn.click();
      return { present, clicked: !!btn };
    `);
    await new Promise(r => setTimeout(r, 800));

    // 3. Dropdown Opacity Check
    const conciergeSelector = isKids ? '.concierge-pill-btn' : '.concierge-btn';
    await evalCDP(pageWs, `
      const b = document.querySelector('${conciergeSelector}');
      if (b) b.click();
    `);
    await new Promise(r => setTimeout(r, 600));

    const menuCheck = await evalCDP(pageWs, `
      const menu = document.querySelector('.mat-mdc-menu-panel');
      if (!menu) return { found: false, solid: false };
      const cs = window.getComputedStyle(menu);
      const solid = cs.opacity === '1' && !cs.backgroundColor.includes('rgba(0, 0, 0, 0)');
      return { found: true, solid, bg: cs.backgroundColor, opacity: cs.opacity };
    `);

    // 4. Contrast Verification
    const contrastCheck = await evalCDP(pageWs, `
      function parseColor(cStr) {
        if (!cStr || cStr === 'transparent' || cStr === 'rgba(0, 0, 0, 0)') return null;
        const match = cStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
        if (match) {
          return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3]),
            a: match[4] !== undefined ? parseFloat(match[4]) : 1
          };
        }
        return null;
      }

      function blend(fore, back) {
        if (!fore) return back;
        if (fore.a >= 1) return fore;
        const a = fore.a;
        return {
          r: Math.round(fore.r * a + back.r * (1 - a)),
          g: Math.round(fore.g * a + back.g * (1 - a)),
          b: Math.round(fore.b * a + back.b * (1 - a)),
          a: 1
        };
      }

      function getEffectiveBg(el) {
        let curr = el;
        const bgStack = [];

        while (curr && curr !== document.documentElement) {
          const style = window.getComputedStyle(curr);
          const parsed = parseColor(style.backgroundColor);
          if (parsed) {
            bgStack.unshift(parsed);
          }
          curr = curr.parentElement;
        }

        const bodyBg = parseColor(window.getComputedStyle(document.body).backgroundColor);
        let base = bodyBg || { r: 255, g: 255, b: 255, a: 1 };

        for (const layer of bgStack) {
          base = blend(layer, base);
        }
        return base;
      }

      function getsRGB(c) {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      }

      function getLuminance(rgb) {
        return 0.2126 * getsRGB(rgb.r) + 0.7152 * getsRGB(rgb.g) + 0.0722 * getsRGB(rgb.b);
      }

      function getRatio(rgb1, rgb2) {
        const l1 = getLuminance(rgb1);
        const l2 = getLuminance(rgb2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null);
      let failures = 0;
      let totalAudited = 0;

      while (walker.nextNode()) {
        const el = walker.currentNode;
        if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'NOSCRIPT'].includes(el.tagName)) continue;

        let directText = '';
        for (const child of el.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            directText += child.nodeValue.trim() + ' ';
          }
        }
        directText = directText.trim();
        if (!directText) continue;

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const style = window.getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) === 0) continue;

        totalAudited++;
        const fg = parseColor(style.color) || { r: 0, g: 0, b: 0, a: 1 };
        const bg = getEffectiveBg(el);
        const ratio = getRatio(fg, bg);

        const fontSize = parseFloat(style.fontSize);
        const fontWeight = parseInt(style.fontWeight) || 400;
        const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
        const minRatio = isLarge ? 3.0 : 4.5;

        if (ratio < minRatio) {
          failures++;
        }
      }

      return { totalAudited, failures };
    `);

    browserWs.close();
    pageWs.close();
    chrome.kill();

    const ok = consoleErrors.length === 0 &&
               meta.favicon.includes('favicon.svg') &&
               gateCheck.present &&
               menuCheck.solid &&
               contrastCheck.failures === 0;

    console.log(`- Favicon:        ${meta.favicon.includes('favicon.svg') ? '✓ PASS' : '✕ FAIL'}`);
    console.log(`- OpenGraph:      ${meta.ogTitle ? '✓ PASS' : '✕ FAIL'}`);
    console.log(`- VIP Gate:       ${gateCheck.present ? '✓ PASS' : '✕ FAIL'}`);
    console.log(`- Menu Opacity:   ${menuCheck.solid ? '✓ PASS' : '✕ FAIL'}`);
    console.log(`- WCAG Contrast:  ${contrastCheck.failures === 0 ? '✓ PASS' : '✕ FAIL'} (${contrastCheck.failures} issues)`);
    console.log(`- Console Errors: ${consoleErrors.length === 0 ? '✓ 0 ERRORS' : `✕ ${consoleErrors.length} ERRORS`}`);
    console.log(`OVERALL RESULT:   ${ok ? '✓ SPEC COMPLIANT' : '✕ NON-COMPLIANT'}`);

    return { ok, consoleErrors: consoleErrors.length, contrastFailures: contrastCheck.failures };
  } catch (err) {
    chrome.kill();
    console.error(`Audit failed:`, err);
    return { ok: false, error: err.message };
  }
}

async function main() {
  const atelier = await auditSite('http://localhost:4202', 'Atelier Riwayat (Haute Couture)', false);
  const kids = await auditSite('http://localhost:4201', 'Nanhi Maison (Kids Heirloom)', true);

  const passed = atelier.ok && kids.ok;
  console.log(`\n======================================================`);
  console.log(`FINAL SDD VERIFICATION: ${passed ? 'ALL PASSED (0 ERRORS)' : 'FAILED'}`);
  console.log(`======================================================\n`);
  process.exit(passed ? 0 : 1);
}

main().catch(e => { console.error(e); process.exit(1); });
