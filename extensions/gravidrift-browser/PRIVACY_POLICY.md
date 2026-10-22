# Privacy Policy for GraviDrift Web

**Effective Date:** October 23, 2026  
**Last Updated:** October 23, 2026  
**Developer:** Abhijeet Raut  
**Extension Name:** GraviDrift: Web Physics & Space Arcade  
**Repository:** [https://github.com/arauthub/gravidrift-web](https://github.com/arauthub/gravidrift-web)

---

## 1. Introduction

**GraviDrift Web** ("we", "our", or "the Extension") is committed to protecting your privacy. This Privacy Policy explains our data collection, handling, and storage practices in accordance with the Google Chrome Web Store Developer Program Policies and the Google API Services User Data Policy.

**Summary:**  
- **We do NOT collect, transmit, store, sell, or monetize any of your personal data or browsing history.**
- All physics simulations and arcade interactions occur **100% locally on your computer** within client-side memory.
- No network requests are made to any remote servers, analytics services, or third-party trackers.

---

## 2. Data Collection and Usage

### A. Personal Identifiable Information (PII)
The Extension does **NOT** collect any personally identifiable information, including but not limited to:
- Names, email addresses, physical addresses, or phone numbers.
- User accounts, passwords, or authentication credentials.
- Financial, payment, or biometric information.

### B. Browsing Activity and Webpage Content
- **In-Memory DOM Extraction:** When you activate GraviDrift mode on an active tab, the extension reads the computed styles and coordinates of visible semantic elements on that webpage (such as cards, headings, and buttons) to render floating physics bodies inside an isolated overlay.
- **Strictly Local Processing:** This DOM processing occurs **exclusively in your browser's local RAM**. At no point is the content of any webpage, text, or image transmitted to external servers, cloud databases, or third parties.
- **No Keystroke or Form Logging:** The extension does not record, log, or transmit form inputs, password fields, or private data.

### C. Chrome Storage (`chrome.storage.local`)
The Extension uses Google Chrome's local storage API solely to persist non-identifiable user preferences across sessions:
- Sound effects toggle (muted or unmuted).
- Preferred game mode (`starfighter`, `cosmicorb`, or `sandbox`).
- Preferred gravity strength setting.
- Tutorial completion state (`ag_tutorial_seen = true`).

All stored preference data remains on your local device and is never synchronized with external servers.

---

## 3. Permissions Justification

In compliance with the Chrome Web Store **Principle of Least Privilege**, the Extension requests only the minimum permissions required for core functionality:

| Permission | Technical Purpose |
| :--- | :--- |
| **`activeTab`** | Allows the extension to run physics simulations on the specific tab you explicitly activate, without granting background access to all tabs. |
| **`storage`** | Saves your local gameplay preferences (audio volume, tutorial status, active mode) on your local device. |
| **`scripting`** | Injects the bundled Matter.js physics engine and content script into the active page when you click the extension action or press the keyboard shortcut. |
| **`<all_urls>`** | Enables the playful GraviDrift simulation to function across general websites when explicitly launched by the user. |

---

## 4. Third-Party Services and Remote Code

- **Zero Third-Party SDKs:** The Extension contains no third-party tracking libraries, analytics scripts, advertising modules, or external telemetry.
- **Zero Remote Code Execution:** In compliance with Manifest V3 security requirements, all executable JavaScript and assets (`lib/matter.min.js`, `content/content.js`, `popup/popup.js`, `background/background.js`) are bundled locally within the extension package. No remote scripts or CDNs are executed.

---

## 5. Security & Data Protection

Because the Extension processes all gameplay and physics transformations strictly on the client device without server communication:
- Your data never travels over the network.
- There are no central databases or remote servers that could be compromised.
- Closing or restoring the page immediately purges all runtime DOM physics bodies from memory.

---

## 6. Children's Privacy

The Extension does not target or knowingly collect data from children under the age of 13 (or under 16 in the European Economic Area). It does not collect any user data from any individual regardless of age.

---

## 7. Changes to This Policy

We may update this Privacy Policy from time to time to reflect extension updates or regulatory changes. Any modifications will be posted in this document and reflected in the extension's Chrome Web Store listing.

---

## 8. Contact Information

If you have any questions or feedback regarding this Privacy Policy, please contact:

- **Developer:** Abhijeet Raut  
- **GitHub:** [https://github.com/arauthub](https://github.com/arauthub)  
- **Extension Repository:** [https://github.com/arauthub/gravidrift-web](https://github.com/arauthub/gravidrift-web)
