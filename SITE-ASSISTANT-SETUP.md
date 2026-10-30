# Portfolio AI assistant and private project inquiries — activation guide

The portfolio has a compact, click-to-open helper. The interface is implemented on the homepage, CAD portfolio page, and two project case studies. **It is intentionally hidden until at least one external service is configured.** The Forge10 OEE calculator is unchanged and does not load the helper.

## 1. Real AI answers — Botpress

1. Open https://botpress.com and create a bot in your own account (check its current free plan limits).
2. Provide the bot with **public information only** from these exact URLs:
   - https://lukasrudolphky.github.io/
   - https://lukasrudolphky.github.io/cad-3d-printing.html
   - https://lukasrudolphky.github.io/projects/magnetic-lanyard-screwdriver-holder-case-study.html
   - https://lukasrudolphky.github.io/projects/laser-engraver-ventilation-adapter.html
   - https://lukasrudolphky.github.io/free-oee-tracker.html
3. Give it instructions like the following. Verify answers through actual tests before deployment:

   > You are a website AI guide for the public mechanical design and industrial technology portfolio of Lukas Rudolph. Answer questions using only documented public website information. Explain CAD, 3D printing, design case studies, manufacturing experience, and the Forge10 tool. Be clear when something is not documented; do not invent dimensions, test results, credentials, service availability, pricing, deadlines, client names, or guarantees. Do not state or imply Lukas is a licensed professional engineer. Encourage visitors who want a custom project, estimate, or human response to choose the Project inquiry tab. Never request confidential employer information.

4. Publish the bot. Under **Webchat > Deploy Settings**, select **Embedded**. Set the **Element ID** to exactly `lr-botpress-chat`, then save/publish that configuration.
5. Copy the bot's public embed **config script URL** from the supplied embed code; it typically begins with `https://files.bpcontent.cloud/` and ends with `.js`. Do **not** paste the general `https://cdn.botpress.cloud/webchat/v3.3/inject.js` URL as the config script; the site loads the latter automatically.
6. Open `assets/site-assistant-config.js` and set:

   `botpressConfigScript: "https://files.bpcontent.cloud/...your-embed-config.js"`

7. Commit this public script URL through GitHub. It is not a secret API key. **Never** put a secret API key on GitHub Pages or in browser JavaScript.
8. Test on desktop and mobile by opening the launcher, asking a factual project question, an undocumented question, and a question about quotes. Confirm it never fabricates details and doesn't appear automatically.

Official setup reference: https://botpress.com/docs/webchat/get-started/embed-in-element/

## 2. Private emails — Formspree

1. Open https://formspree.io and create a free form **using an email address you control**. Set email notifications to that address in the Formspree dashboard. Confirm/verify the address there; do not put it in site code.
2. Copy the form's **public endpoint URL**, which looks like `https://formspree.io/f/xxxxxxxx`.
3. Edit `assets/site-assistant-config.js` and set:

   `formspreeEndpoint: "https://formspree.io/f/xxxxxxxx"`

4. Commit the change. This endpoint is designed to be public; it does not reveal the recipient address.
5. In Formspree, enable available spam controls and domain restrictions for `lukasrudolphky.github.io`.
6. Send a **test inquiry** yourself from the website. Confirm it appears in the Formspree dashboard and reaches your configured email inbox. Also test missing fields and an invalid email. Check spam folders if necessary.
7. **Do not consider forwarding operational until a real end-to-end test succeeds.** Contact details and project requests are sent to the independent form provider only when the visitor submits with consent.

Formspree documents standard AJAX submissions: https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax

## Trigger and privacy decisions

- The assistant is **button-only** in the lower-right corner. It will not auto-open on page load or interfere with the OEE calculator.
- Third-party AI code loads only after a visitor opens the AI tab.
- If both integrations are unconfigured, no broken widget appears publicly.
- If only one service is configured, only that tab is presented.
- The form requests a name, preferred reply method, matching contact detail, project category, project description, and explicit consent.
- Visitor inquiries can be sent to a private email through Formspree without exposing your email address in the site.
- **No genuine AI or email delivery is active until you configure those services.** Automated AI replies are not a substitute for discussing quotations, professional licensing, project scope or availability directly.

## Final acceptance tests

- [ ] Desktop/mobile launcher opens and closes without obstructing navigation.
- [ ] The bot answers questions only from public evidence and admits when it doesn't know.
- [ ] The bot never invents credentials, prices, dimensional specifications, or test data.
- [ ] Form blocks empty required fields and submits a valid test.
- [ ] You receive the test email and verify the return contact details.
- [ ] Provider domain restrictions and available spam filtering are enabled.
- [ ] No private email, passwords, secret keys, or work-proprietary documents are exposed in the repository.
- [ ] OEE calculator features remain unaffected.
