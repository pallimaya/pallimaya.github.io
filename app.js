/* ============================================================
   Pallimaya — shared behaviour
   Chatbot, WhatsApp links, forms, nav, copy buttons.
   Reads settings from config.js (window.PALLIMAYA).
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.PALLIMAYA || {};
  var WA = String(CFG.whatsapp || "").replace(/[^0-9]/g, "");

  /* ---------- bold Unicode text, the way it looks in the brief ---------- */
  function toBold(str) {
    var out = "";
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if (c >= 65 && c <= 90) out += String.fromCodePoint(0x1D400 + (c - 65));
      else if (c >= 97 && c <= 122) out += String.fromCodePoint(0x1D41A + (c - 97));
      else if (c >= 48 && c <= 57) out += String.fromCodePoint(0x1D7CE + (c - 48));
      else out += str[i];
    }
    return out;
  }

  function waURL(message, bold) {
    var text = bold === false ? message : toBold(message);
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);
  }

  function openWA(message, bold) {
    if (!WA || WA.indexOf("XXXX") !== -1) {
      alert(
        "The WhatsApp number has not been set yet.\n\n" +
        "Open config.js and replace 91XXXXXXXXXX with the real number."
      );
      return;
    }
    window.open(waURL(message, bold), "_blank", "noopener");
  }

  /* ---------- wire up every [data-wa] element ---------- */
  function wireWaLinks(root) {
    (root || document).querySelectorAll("[data-wa]").forEach(function (el) {
      var msg = el.getAttribute("data-wa");
      var bold = el.getAttribute("data-wa-bold") !== "false";
      var href = waURL(msg, bold);

      if (el.tagName === "A") {
        el.setAttribute("href", href);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          openWA(msg, bold);
        });
      }
    });
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* ---------- copy buttons ---------- */
  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var done = function () {
          var old = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = old; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          var t = document.createElement("textarea");
          t.value = text; document.body.appendChild(t); t.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(t); done();
        }
      });
    });
  }

  /* ---------- chatbot ---------- */
  var CHAT_OPTIONS = [
    { icon: "🛒", label: "Purchase a Course", msg: "Hi Pallimaya, I want to purchase a course. Please guide me." },
    { icon: "📚", label: "View Available Courses", msg: "Hi Pallimaya, please send me the list of available courses with prices." },
    { icon: "🔜", label: "Check Upcoming Courses", msg: "Hi Pallimaya, I want to know about the upcoming courses and their release dates." },
    { icon: "🎁", label: "Request a Discount", msg: "Hi Pallimaya, I would like to request a discount. Please let me know the current offers." },
    { icon: "❓", label: "Ask a Question", msg: "Hi Pallimaya, I have a question about your courses." },
    { icon: "💳", label: "Payment Assistance", msg: "Hi Pallimaya, I need help with a payment." },
    { icon: "📥", label: "PDF Delivery Support", msg: "Hi Pallimaya, I have an issue with PDF delivery or download." },
    { icon: "↩️", label: "Refund Claim", msg: "Hi Pallimaya, I would like to request a refund." },
    { icon: "🤝", label: "Free Creator Promotion", msg: "Hi Pallimaya, I want to submit my YouTube channel for free creator promotion." },
    { icon: "🛟", label: "Course Support", msg: "Hi Pallimaya, I need help with a course I purchased." },
    { icon: "📱", label: "Contact Us", msg: "Hi Pallimaya, I would like to get in touch." }
  ];

  function initChat() {
    var fab = document.getElementById("chatFab");
    var panel = document.getElementById("chatPanel");
    if (!fab || !panel) return;

    var body = panel.querySelector(".chat-opts");
    CHAT_OPTIONS.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chat-opt";
      b.innerHTML = '<span aria-hidden="true">' + o.icon + "</span><span>" + o.label + "</span>";
      b.addEventListener("click", function () { openWA(o.msg); });
      body.appendChild(b);
    });

    fab.addEventListener("click", function () {
      panel.classList.toggle("open");
      fab.setAttribute("aria-expanded", panel.classList.contains("open") ? "true" : "false");
    });
    var close = panel.querySelector("[data-chat-close]");
    if (close) close.addEventListener("click", function () { panel.classList.remove("open"); });

    var askForm = panel.querySelector(".chat-ask");
    if (askForm) {
      askForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = askForm.querySelector("input");
        var q = (input.value || "").trim();
        if (!q) return;
        openWA("Hi Pallimaya, my question is: " + q);
        input.value = "";
      });
    }
  }

  /* ---------- purchase page ---------- */
  var COURSES = {
    character: { name: "AI Character Design & Consistency Masterclass", price: 499, was: 999 },
    image: { name: "AI Image Generation & Prompt Engineering Masterclass", price: 499, was: 799 },
    bundle: { name: "Both Masterclasses (combo)", price: 0, was: 0 }
  };

  function initPurchase() {
    var sel = document.getElementById("courseSelect");
    if (!sel) return;
    var amountEl = document.getElementById("amountNow");
    var wasEl = document.getElementById("amountWas");
    var summary = document.getElementById("orderSummary");
    var form = document.getElementById("purchaseForm");

    function refresh() {
      var c = COURSES[sel.value] || COURSES.character;
      if (c.price > 0) {
        amountEl.textContent = "₹" + c.price;
        wasEl.textContent = "₹" + c.was;
        wasEl.style.display = "";
        summary.textContent = c.name + " — ₹" + c.price;
      } else {
        amountEl.textContent = "Ask";
        wasEl.style.display = "none";
        summary.textContent = c.name + " — combo price on request";
      }
    }
    sel.addEventListener("change", refresh);
    refresh();

    // preselect from ?course=character|image|bundle
    var q = new URLSearchParams(location.search).get("course");
    if (q && COURSES[q]) { sel.value = q; refresh(); }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var c = COURSES[sel.value];
        var name = (form.elements.name.value || "").trim();
        var phone = (form.elements.phone.value || "").trim();
        var txn = (form.elements.txn.value || "").trim();
        var email = (form.elements.email.value || "").trim();
        var note = (form.elements.note.value || "").trim();

        if (!name || !phone || !txn) {
          alert("Please fill in your name, phone number and UPI transaction ID.");
          return;
        }

        var lines = [
          "New course purchase — Pallimaya",
          "",
          "Course: " + c.name,
          "Amount: " + (c.price > 0 ? "Rs " + c.price : "combo (price on request)"),
          "Name: " + name,
          "Phone: " + phone,
          "UPI transaction ID: " + txn
        ];
        if (email) lines.push("Email: " + email);
        if (note) lines.push("Note: " + note);
        lines.push("", "I am sending the payment screenshot in this chat now.");

        openWA(lines.join("\n"), false);
      });
    }
  }

  /* ---------- generic message forms (contact / creator / support) ---------- */
  function initMessageForms() {
    document.querySelectorAll("form[data-wa-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var parts = [form.getAttribute("data-wa-form")];
        var missing = [];
        form.querySelectorAll("[data-field]").forEach(function (el) {
          var label = el.getAttribute("data-field");
          var val = (el.value || "").trim();
          if (el.required && !val) missing.push(label);
          if (val) parts.push(label + ": " + val);
        });
        if (missing.length) {
          alert("Please fill in: " + missing.join(", "));
          return;
        }
        openWA(parts.join("\n"), false);
      });
    });
  }

  /* ---------- footer year ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireWaLinks();
    initNav();
    initCopy();
    initChat();
    initPurchase();
    initMessageForms();
    initYear();
  });
})();
