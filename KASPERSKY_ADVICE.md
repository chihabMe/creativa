# Kaspersky Antivirus Issues Advice

If your client is facing issues with Kaspersky blocking the order creation ("create order"), it is likely due to one of the following reasons. Since I cannot see the screenshot, here are the most common solutions:

## 1. SSL/HTTPS Certificate
Ensure your website is served over **HTTPS** with a valid SSL certificate. Kaspersky aggressively blocks forms sending data over unencrypted HTTP, often flagging them as "Data Loss Threat" or "Phishing".

- **Check**: Look for the padlock icon in the browser address bar.
- **Fix**: If using Vercel/Netlify, this is automatic. If self-hosting, use Let's Encrypt.

## 2. False Positive (Phishing Heuristic)
Kaspersky's heuristic analysis might incorrectly flag your new domain or the specific behavior of the checkout form as suspicious (e.g., if it resembles a known phishing template).

- **Fix**: You must report the false positive to Kaspersky.
  - Go to [Kaspersky Virus Desk](https://virusdesk.kaspersky.com/) or [Kaspersky Whitelist Request](https://whitelist.kaspersky.com/).
  - Submit your website URL for analysis.
  - Explain that it is a legitimate e-commerce store.

## 3. Suspicious Scripts
If you have any compromised or "obfuscated" JavaScript files (e.g., from a third-party ad network or analytics), Kaspersky might block the page.

- **Check**: Open the browser Developer Tools (F12) -> Network tab. See if any request is blocked (red) when submitting the order.
- **Fix**: Remove any unnecessary 3rd party scripts.

## 4. Mixed Content
If your site is HTTPS but you are loading images or scripts via HTTP, this is "Mixed Content" and is often blocked.

- **Fix**: Ensure all resources (images, scripts) are loaded via `https://`.

## What to do now?
1. **Send the error details**: Copy the exact text from the Kaspersky popup.
2. **Whitelist locally**: Ask the client to temporarily "Add to exclusions" in their Kaspersky settings to confirm it's the antivirus blocking it (Settings -> Threat and Exclusions).
