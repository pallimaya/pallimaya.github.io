# Pallimaya — course website

Static website for Pallimaya's AI-skill PDF masterclasses. Plain HTML, CSS and JavaScript —
no build step, no dependencies, no backend. Hosted free on GitHub Pages.

**Live site:** https://pallimaya.github.io/

---

## Before you go live: set your WhatsApp number

Every "Chat on WhatsApp", purchase and form button on the site uses **one** setting.

1. Open `config.js`
2. Replace `91XXXXXXXXXX` with your full number, country code first, digits only
   — for example `919876543210`
3. Commit the change

Until you do this, the buttons show a reminder message instead of opening WhatsApp.
The number is never printed as text anywhere on the site; it only appears inside the
WhatsApp link.

`config.js` also holds the YouTube channel link and the UPI payment details.

---

## Pages

| File | Page |
|---|---|
| `index.html` | Home — welcome, featured courses, offer, how it works |
| `courses.html` | Available courses (the two launched courses) |
| `course-character.html` | AI Character Design & Consistency — full detail |
| `course-image.html` | AI Image Generation & Prompt Engineering — full detail |
| `upcoming.html` | Upcoming courses — Coming Soon, not purchasable |
| `offers.html` | Offers, price table, combo and discount requests |
| `purchase.html` | Purchase flow — course picker, UPI QR, payment form |
| `delivery.html` | How PDFs are delivered |
| `youtube.html` | YouTube channel showcase |
| `creators.html` | Free creator promotion + submission form |
| `about.html` | About Pallimaya |
| `contact.html` | Contact — WhatsApp buttons and message form |
| `faq.html` | Frequently asked questions |
| `support.html` | Course support and help centre |
| `testimonials.html` | Testimonials (empty until real feedback exists) |
| `refund.html` | Refund & cancellation policy |
| `terms.html` | Terms & conditions |
| `copyright.html` | Copyright & anti-piracy policy |
| `privacy.html` | Privacy policy |
| `404.html` | Not-found page |

Shared files: `styles.css` (all styling), `app.js` (chatbot, WhatsApp links, forms),
`config.js` (your settings), `sitemap.xml`, `robots.txt`, `assets/`.

---

## How the forms work

There is no server and no database. The contact, creator-promotion, support and purchase
forms run entirely in the browser: on submit they assemble a message and open WhatsApp with
it already typed. You receive the enquiry in your WhatsApp chat and reply there.

Nothing is stored, so keep your own record of orders — the transaction ID in the WhatsApp
chat is your purchase record.

---

## Editing common things

**Prices** — search for `999`, `799` and `499` in the relevant HTML file. The launch prices
appear on `index.html`, `courses.html`, `offers.html`, `purchase.html` and both course
detail pages.

**Courses** — to move an upcoming course to "available", copy a card block from
`courses.html`, paste it into the grid, and remove the matching card from `upcoming.html`.

**Colours** — the palette lives in the `:root` block at the top of `styles.css`.
`--gold` is the accent used throughout.

**Chatbot menu** — the list of quick options is the `CHAT_OPTIONS` array near the top of
`app.js`.

---

## Policies on the site

Terms & Conditions, Refund & Cancellation Policy and Copyright & Anti-Piracy Policy are
published as `terms.html`, `refund.html` and `copyright.html`, linked from the footer of
every page. Refund window is stated as 24 hours, with the 40% rule applying after a file
has been delivered and accessed.

These are practical protections, not a legal guarantee. If the business grows, have them
reviewed by a lawyer.
