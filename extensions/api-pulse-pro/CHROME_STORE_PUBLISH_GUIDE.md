# 🚀 Chrome Web Store Publishing Guide: API Pulse Pro

This comprehensive guide contains **every single asset, form field, copy-paste text, and permission justification** required to successfully publish **API Pulse Pro** to the Google Chrome Web Store without review delays or rejections.

---

## 📦 1. Pre-Built Production Package

The production package has been compiled, audited for Manifest V3 compliance, and strictly stripped of test pages and non-runtime files:

- **Zip File Location**:  
  `extensions/api-pulse-pro/dist/api-pulse-pro-v1.0.0.zip`
- **File Size**: ~48 KB
- **Manifest Version**: 3
- **Included Folders**: `manifest.json`, `assets/`, `background/`, `content/`, `popup/`, `studio/`, `devtools/`

> **To rebuild at any time**:
> ```bash
> cd /Users/abhijeetraut/Documents/All-Projects/extensions/api-pulse-pro
> ./package.sh
> ```

---

## 🎨 2. Visual Store Assets (Verified Exact Dimensions)

All visual assets have been generated in the exact pixel dimensions required by Google:

| Asset Type | Required Dimensions | Prepared File Path |
|---|---|---|
| **Store Icon** | 128 x 128 px | `extensions/api-pulse-pro/store-assets/icons/icon128.png` |
| **Screenshot 1** | 1280 x 800 px | `extensions/api-pulse-pro/store-assets/screenshots/screenshot1_studio_workbench.png` |
| **Screenshot 2** | 1280 x 800 px | `extensions/api-pulse-pro/store-assets/screenshots/screenshot2_floating_hud.png` |
| **Screenshot 3** | 1280 x 800 px | `extensions/api-pulse-pro/store-assets/screenshots/screenshot3_mock_engine.png` |
| **Screenshot 4** | 1280 x 800 px | `extensions/api-pulse-pro/store-assets/screenshots/screenshot4_replay_studio.png` |
| **Screenshot 5** | 1280 x 800 px | `extensions/api-pulse-pro/store-assets/screenshots/screenshot5_types_security.png` |
| **Small Promo Tile** | 440 x 280 px | `extensions/api-pulse-pro/store-assets/promo/promo_small_440x280.png` |
| **Marquee Promo Banner**| 1400 x 560 px | `extensions/api-pulse-pro/store-assets/promo/promo_marquee_1400x560.png` |

---

## 📋 3. Store Listing Tab (Copy & Paste Details)

When editing the **Store Listing** tab in the Chrome Web Store Developer Dashboard:

### Product Details
* **Name** (Up to 75 chars in Store Dashboard):
  ```text
  API Pulse Pro: Network Inspector, Replay & Mock Studio
  ```
  *(Note: The manifest name is safely set to `API Pulse Pro: Network Inspector Studio` to respect Chrome's 45-character manifest limit).*

* **Summary / Short Description** (Max 132 chars — exactly 122 chars):
  ```text
  Real-time API & POST inspector, in-browser request replayer, response mocking studio, cURL export & TypeScript generator.
  ```

* **Category**:
  ```text
  Developer Tools
  ```

* **Language**:
  ```text
  English (United States)
  ```

---

### Detailed Description (Formatted with Markdown/Text)

Copy and paste the exact text below into the **Detailed Description** box:

```text
Stop digging through cluttered DevTools tabs filled with hundreds of static images, font files, and script bundles.

API Pulse Pro is an IDE-grade network traffic inspector, in-browser request replayer, response mocking engine, and TypeScript type generator designed by engineers for engineers. It gives you immediate clarity and complete interactive control over every single HTTP request occurring on any web page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 KEY CAPABILITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. REAL-TIME API & POST MONITORING
• Automatically tracks all fetch() and XMLHttpRequest calls in the page context.
• Dedicated focus on POST, PUT, PATCH, DELETE, GET, and GraphQL mutations.
• Color-coded method badges, HTTP status codes, latency waterfall (ms), payload sizes, and exact timestamps.
• Syntax-highlighted JSON viewer for both Request Payloads and Response Bodies.

2. IN-PAGE FLOATING HUD (HEADS-UP DISPLAY)
• Sleek glassmorphic floating capsule docked directly inside the web page.
• Live real-time traffic counters: e.g. "14 APIs | 6 POST | 0 ERR".
• Animated pulse ping on every new request.
• Expandable into an instant In-Page Quick Drawer without opening DevTools!
• Fully draggable anywhere on screen; toggle anytime with Alt+Shift+P.

3. IN-BROWSER REQUEST REPLAYER
• Ever wanted to tweak a POST body or headers and re-send it with active session cookies and CORS credentials?
• Pre-populate any captured request with one click.
• Replay directly inside the page's execution context or via direct studio fetch.
• View execution results side-by-side with original responses.

4. IN-BROWSER MOCK ENGINE (RESPONSE STUBBING)
• Intercept matching API endpoints in the browser and return synthetic responses without touching the server!
• Match endpoints with wildcards (/api/v1/orders*) or regular expressions.
• Configure custom HTTP status codes (200, 400, 404, 500), simulated latency sliders (0ms to 3000ms), and custom JSON bodies.
• Test frontend loading spinners, empty states, and error toasts with ease!

5. AUTO-GENERATED TYPESCRIPT INTERFACES
• 1-click generation of production-ready TypeScript types from request payloads and response bodies.
• Accurately types nested objects, arrays, and primitive values.

6. MULTI-LANGUAGE CODE GENERATORS
• Instantly copy any captured request as:
  - cURL (bash)
  - JavaScript fetch()
  - Axios (JS/TS)
  - Python requests
  - Go net/http

7. SECURITY & SECRETS SCANNER + JWT DECODER
• Highlights exposed Authorization headers, Bearer tokens, and API keys.
• Built-in JWT Decoder displays decoded Header, Payload claims, and expiration timers.

8. SIDE-BY-SIDE JSON DIFF TOOL
• Compare two captured responses or before/after mutations with visual diffing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 100% PRIVACY & CLIENT-SIDE SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Zero telemetry. Zero analytics. Zero cloud servers.
• All data remains 100% local inside your browser memory.
• Manifest V3 compliant.
```

---

## 🔒 4. Privacy Practices Tab (CRITICAL FOR REVIEW PASS)

Google scrutinizes the **Privacy Practices** tab closely. Use these exact answers:

### 1. Single Purpose Description
> **What is the single purpose of this extension?**
```text
API Pulse Pro is a developer utility designed to monitor, inspect, replay, and mock HTTP and GraphQL network requests directly in the browser during web application development and testing.
```

---

### 2. Permission Justifications

Google requires clear justifications for every declared permission. Copy and paste:

* **`storage`**:
  ```text
  Used exclusively to persist user-defined mock rules, pinned requests, and workbench preferences (such as dark theme, filter preferences, and floating HUD position) locally on the device via chrome.storage.local.
  ```

* **`activeTab`**:
  ```text
  Used to determine the active tab's domain for contextual request filtering and to toggle the in-page Floating HUD when the developer presses the Alt+Shift+P shortcut.
  ```

* **`scripting`**:
  ```text
  Used to inject the page network interceptor into the MAIN execution world to observe fetch and XMLHttpRequest network calls in the web application's runtime context.
  ```

* **`<all_urls>` (Host Permissions)**:
  ```text
  As an in-browser developer debugging workbench, API Pulse Pro must allow software engineers to inspect, replay, and mock API calls across arbitrary development environments, including localhost (with arbitrary port numbers), local IP addresses, internal staging servers, and production domains. Because developers build and test applications across unpredictable host origins, broad host permissions are strictly necessary. The extension operates 100% locally on the client machine; no user data, network traffic, or telemetry is ever stored remotely, uploaded, or transmitted to any third party.
  ```

---

### 3. Data Usage Questionnaire Answers

In the Developer Dashboard's **Data Usage** section:

1. **Does the extension collect or transmit user data?**  
   👉 Select **No** (The extension operates entirely locally).

2. **Check the following certifications**:
   - [x] *I certify that this extension does not sell user data to third parties.*
   - [x] *I certify that this extension does not use or transfer user data for purposes unrelated to the item's single purpose.*
   - [x] *I certify that this extension does not use or transfer user data for creditworthiness or lending purposes.*

---

### 4. Privacy Policy URL

Chrome Web Store requires a publicly accessible HTTPS link:

* **Primary GitHub Raw Link**:
  ```text
  https://raw.githubusercontent.com/arauthub/All-Projects/main/extensions/api-pulse-pro/PRIVACY_POLICY.md
  ```
* **Repository Link**:
  ```text
  https://github.com/arauthub/All-Projects/tree/main/extensions/api-pulse-pro
  ```
* **HTML Web Page**:  
  `extensions/api-pulse-pro/privacy-policy.html` (can be deployed to GitHub Pages or your custom domain).

---

## 🚀 5. Step-by-Step Submission Walkthrough

### Step 1: Open the Developer Dashboard
Navigate to: **[https://chrome.google.com/webstore/devconsole/](https://chrome.google.com/webstore/devconsole/)**  
*(If this is your first time publishing, Google charges a one-time $5 developer registration fee).*

### Step 2: Create a New Item
1. Click **+ New Item** in the upper-right corner.
2. Drag and drop `extensions/api-pulse-pro/dist/api-pulse-pro-v1.0.0.zip`.
3. Wait for Google's manifest validator to process the zip (it should pass with 0 errors).

### Step 3: Fill in "Store Listing"
1. Verify Title: `API Pulse Pro: Network Inspector, Replay & Mock Studio`
2. Paste Short Description & Detailed Description.
3. Upload Graphic Assets:
   - **Extension Icon**: `store-assets/icons/icon128.png`
   - **Screenshots**: Upload all 5 screenshots from `store-assets/screenshots/`
   - **Small Tile**: `store-assets/promo/promo_small_440x280.png`
   - **Marquee Tile**: `store-assets/promo/promo_marquee_1400x560.png`
4. Set Category to **Developer Tools**.

### Step 4: Complete "Privacy Practices"
1. Paste the **Single Purpose Description**.
2. Paste justifications for `storage`, `activeTab`, `scripting`, and `<all_urls>`.
3. Check all three compliance checkboxes (no data sale, single purpose only, no lending).
4. Enter the Privacy Policy URL.

### Step 5: Distribution & Review
1. Under **Distribution**, select:
   - Visibility: **Public**
   - Regions: **All regions** (or your selected countries)
2. Click **Save Draft**, then click **Submit for Review**.
3. Chrome Web Store review typically completes within **24 to 48 hours**.

---

## 🛠️ Summary of Created Files

| File | Purpose |
|---|---|
| `manifest.json` | Updated with compliant character limits (name < 45 chars, short_name < 12 chars). |
| `package.sh` | Clean production bundler excluding tests, scripts, and markdown. |
| `dist/api-pulse-pro-v1.0.0.zip` | Ready-to-upload 48KB production package. |
| `privacy-policy.html` | Standalone, modern HTML Privacy Policy page. |
| `store-assets/icons/` | 128x128 store icon. |
| `store-assets/screenshots/` | 5 high-resolution (1280x800) feature screenshots. |
| `store-assets/promo/` | Small Promo Tile (440x280) and Marquee Banner (1400x560). |
| `scripts/build_store_media.py` | Automated Headless Chrome script to re-render store assets anytime. |
