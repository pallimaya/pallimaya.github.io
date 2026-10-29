# Pallimaya — course website

Static website for Pallimaya's AI-skill PDF masterclasses. Plain HTML, CSS and JavaScript —
no build step, no dependencies, no backend. Hosted free on GitHub Pages.

**Live site:** https://pallimaya.github.io/

---

## WhatsApp number

The live number is **+91 7439689326**, set once in `config.js` as `917439689326`
(country code first, digits only).

Every "Chat on WhatsApp" button, chatbot option, purchase form and enquiry form reads that
one setting. To change it, edit `config.js` and commit — nothing else needs touching.

The number is never printed as text on any page. It only appears inside the WhatsApp link
target, which is unavoidable for a direct `wa.me` link.

`config.js` also holds the YouTube channel link and the UPI payment details.

---

## Delivery promise

The site states that the PDF is delivered within **30 minutes** of payment confirmation.
That wording appears on `delivery.html`, `faq.html`, `index.html`, `purchase.html` and both
course detail pages — change all of them together if the promise ever changes.

---

## Course syllabus

The course detail pages deliberately do **not** carry a topic-by-topic syllabus. They show
the course overview, the learning outcomes from the poster, requirements, and
format/delivery details only. Add a topics section later once the PDFs are final.

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
