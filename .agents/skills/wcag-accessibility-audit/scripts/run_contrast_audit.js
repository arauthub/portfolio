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

async function auditAccessibility(url, siteName) {
  console.log(`\n======================================================`);
  console.log(`ACCESSIBILITY & CONTRAST AUDIT: ${siteName}`);
  console.log(`URL: ${url}`);
  console.log(`======================================================`);

  const port = 9600 + Math.floor(Math.random() * 300);
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

    const { targetId } = await sendCDP(browserWs, 'Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await sendCDP(browserWs, 'Target.attachToTarget', { targetId, flatten: true });

    const send = (method, params = {}) => {
      return new Promise((resolve) => {
        const id = Math.floor(Math.random() * 1000000);
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === id) {
            browserWs.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        browserWs.addEventListener('message', handler);
        browserWs.send(JSON.stringify({ id, sessionId, method, params }));
      });
    };

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });

    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 3000));

    // Evaluate WCAG contrast on all text elements
    const contrastResults = await send('Runtime.evaluate', {
      expression: `(() => {
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
          let stacked = { r: 255, g: 255, b: 255, a: 1 };
          const bgStack = [];

          while (curr && curr !== document.documentElement) {
            const style = window.getComputedStyle(curr);
            const parsed = parseColor(style.backgroundColor);
            if (parsed) {
              bgStack.unshift(parsed);
            }
            curr = curr.parentElement;
          }

          // Default root bg fallback based on body
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
        const issues = [];
        let checkedCount = 0;

        while (walker.nextNode()) {
          const el = walker.currentNode;
          if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'NOSCRIPT'].includes(el.tagName)) continue;

          // Check if element has direct text or text node
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

          checkedCount++;
          const fg = parseColor(style.color) || { r: 0, g: 0, b: 0, a: 1 };
          const bg = getEffectiveBg(el);
          const ratio = getRatio(fg, bg);

          const fontSize = parseFloat(style.fontSize);
          const fontWeight = parseInt(style.fontWeight) || 400;
          const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
          const minRatio = isLarge ? 3.0 : 4.5;

          if (ratio < minRatio) {
            issues.push({
              tag: el.tagName.toLowerCase(),
              className: el.className ? String(el.className).substring(0, 50) : '',
              text: directText.substring(0, 40),
              fontSize: Math.round(fontSize) + 'px',
              fontWeight,
              fg: 'rgb(' + fg.r + ',' + fg.g + ',' + fg.b + ')',
              bg: 'rgb(' + bg.r + ',' + bg.g + ',' + bg.b + ')',
              ratio: Math.round(ratio * 100) / 100,
              required: minRatio
            });
          }
        }

        return { checkedCount, issues };
      })()`,
      returnByValue: true,
      awaitPromise: true
    });

    const { checkedCount, issues } = contrastResults?.result?.value || { checkedCount: 0, issues: [] };
    console.log(`Audited ${checkedCount} rendered text elements.`);
    console.log(`Identified contrast issues: ${issues.length}`);

    if (issues.length > 0) {
      console.log(`\nContrast Issues Found:`);
      issues.slice(0, 15).forEach((iss, idx) => {
        console.log(`[#${idx + 1}] <${iss.tag} class="${iss.className}"> "${iss.text}"`);
        console.log(`    Ratio: ${iss.ratio}:1 (Required: ${iss.required}:1) | Size: ${iss.fontSize} (w: ${iss.fontWeight})`);
        console.log(`    FG: ${iss.fg} vs BG: ${iss.bg}`);
      });
    } else {
      console.log(`✅ 100% of visible text elements meet WCAG 2.1 AA contrast requirements!`);
    }

    browserWs.close();
    return issues;
  } finally {
    chrome.kill('SIGKILL');
  }
}

async function run() {
  const atelierIssues = await auditAccessibility('http://localhost:4202', 'Atelier Riwayat (Haute Couture)');
  const kidsIssues = await auditAccessibility('http://localhost:4201', 'Nanhi Maison (Kids & Nursery)');

  console.log(`\n======================================================`);
  console.log(`OVERALL ACCESSIBILITY CONTRAST SUMMARY:`);
  console.log(`Atelier Issues: ${atelierIssues.length}`);
  console.log(`Kids Issues: ${kidsIssues.length}`);
  console.log(`======================================================\n`);
}

run().catch(console.error);
