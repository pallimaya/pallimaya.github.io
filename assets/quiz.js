/* ============================================================
   Pallimaya — Quiz engine
   Setup → timed quiz → results with explanations.
   Saves a summary to localStorage for the progress page.
   ============================================================ */
(function () {
  "use strict";

  var DATA = null;
  var state = { subject: null, questions: [], answers: [], index: 0, timeLeft: 0, timer: null, total: 0 };

  var el = function (id) { return document.getElementById(id); };

  function store() {
    try { return JSON.parse(localStorage.getItem("pl_quiz_history") || "[]"); } catch (e) { return []; }
  }
  function save(entry) {
    var h = store(); h.push(entry);
    if (h.length > 60) h = h.slice(-60);
    try { localStorage.setItem("pl_quiz_history", JSON.stringify(h)); } catch (e) {}
  }

  function diffLabel(d) { return { 1: "Beginner", 2: "Intermediate", 3: "Advanced", 4: "Expert" }[d] || "Beginner"; }

  /* ---------- setup screen ---------- */
  function renderSetup() {
    var grid = el("subjectGrid");
    grid.innerHTML = "";
    DATA.subjects.forEach(function (s) {
      var b = document.createElement("button");
      b.className = "subject-card";
      b.type = "button";
      b.innerHTML =
        '<span class="s-icon" aria-hidden="true">' + s.name.charAt(0).toUpperCase() + "</span>" +
        '<span class="s-name">' + s.name + "</span>" +
        '<span class="s-meta">' + s.questions.length + " questions · " + s.group + "</span>" +
        '<span class="s-desc">' + s.desc + "</span>";
      b.addEventListener("click", function () { pickSubject(s.id); });
      grid.appendChild(b);
    });
    var sel = el("qSubject");
    sel.innerHTML = DATA.subjects.map(function (s) {
      return '<option value="' + s.id + '">' + s.name + "</option>";
    }).join("");
  }

  function pickSubject(id) {
    el("qSubject").value = id;
    updateCounts();
    el("setupPanel").scrollIntoView({ behavior: "smooth", block: "center" });
    document.querySelectorAll(".subject-card").forEach(function (c) {
      c.classList.toggle("selected", c.querySelector(".s-name").textContent === subjectById(id).name);
    });
  }

  function subjectById(id) {
    return DATA.subjects.filter(function (s) { return s.id === id; })[0] || DATA.subjects[0];
  }

  function pool() {
    var s = subjectById(el("qSubject").value);
    var d = parseInt(el("qDiff").value, 10);
    if (!d) return s.questions.slice();
    var f = s.questions.filter(function (q) { return q.d === d; });
    return f.length >= 5 ? f : s.questions.slice();
  }

  function updateCounts() {
    var n = pool().length;
    var box = el("poolNote");
    if (box) box.textContent = n + " questions available for this selection.";
    var max = Math.min(n, 30);
    var sel = el("qCount");
    Array.prototype.forEach.call(sel.options, function (o) {
      o.disabled = parseInt(o.value, 10) > max;
      if (o.disabled && o.selected) sel.value = String(max);
    });
  }

  /* ---------- quiz run ---------- */
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function start() {
    var n = parseInt(el("qCount").value, 10);
    var mins = parseInt(el("qTime").value, 10);
    var qs = shuffle(pool().slice()).slice(0, n);
    if (!qs.length) { alert("No questions available for that selection."); return; }

    state.subject = subjectById(el("qSubject").value);
    state.questions = qs;
    state.answers = new Array(qs.length).fill(null);
    state.index = 0;
    state.total = qs.length;
    state.timeLeft = mins * 60;

    el("setupScreen").hidden = true;
    el("resultScreen").hidden = true;
    el("quizScreen").hidden = false;
    el("qTotal").textContent = state.total;
    renderQuestion();
    startTimer();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startTimer() {
    clearInterval(state.timer);
    paintTimer();
    state.timer = setInterval(function () {
      state.timeLeft--;
      paintTimer();
      if (state.timeLeft <= 0) { clearInterval(state.timer); finish(); }
    }, 1000);
  }

  function paintTimer() {
    var t = Math.max(0, state.timeLeft);
    var m = Math.floor(t / 60), s = t % 60;
    var txt = m + ":" + (s < 10 ? "0" : "") + s;
    el("qTimer").textContent = txt;
    el("qTimer").classList.toggle("urgent", t <= 30);
    var pct = state.total ? ((state.index) / state.total) * 100 : 0;
    el("qProgressBar").style.width = pct + "%";
  }

  function renderQuestion() {
    var q = state.questions[state.index];
    el("qNumber").textContent = state.index + 1;
    el("qText").textContent = q.q;
    el("qDiffBadge").textContent = diffLabel(q.d);
    el("qRemaining").textContent = state.total - state.index - 1;

    var box = el("qOptions");
    box.innerHTML = "";
    q.o.forEach(function (opt, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "option" + (state.answers[state.index] === i ? " chosen" : "");
      b.innerHTML = '<span class="opt-key">' + "ABCD"[i] + "</span><span>" + opt + "</span>";
      b.addEventListener("click", function () {
        state.answers[state.index] = i;
        renderQuestion();
      });
      box.appendChild(b);
    });

    el("qPrev").disabled = state.index === 0;
    el("qNext").hidden = state.index === state.total - 1;
    el("qSubmit").hidden = state.index !== state.total - 1;
    paintTimer();
  }

  function next() { if (state.index < state.total - 1) { state.index++; renderQuestion(); } }
  function prev() { if (state.index > 0) { state.index--; renderQuestion(); } }

  function finish() {
    clearInterval(state.timer);
    var correct = 0, wrong = 0, skipped = 0;
    state.questions.forEach(function (q, i) {
      var a = state.answers[i];
      if (a === null) skipped++;
      else if (a === q.a) correct++;
      else wrong++;
    });
    var acc = state.total ? Math.round((correct / state.total) * 100) : 0;

    el("quizScreen").hidden = true;
    el("resultScreen").hidden = false;

    el("rTotal").textContent = state.total;
    el("rCorrect").textContent = correct;
    el("rWrong").textContent = wrong;
    el("rSkipped").textContent = skipped;
    el("rScore").textContent = correct + "/" + state.total;
    el("rAcc").textContent = acc + "%";
    el("rSubject").textContent = state.subject.name;
    el("rRing").style.setProperty("--pct", acc);

    var review = el("reviewList");
    review.innerHTML = "";
    state.questions.forEach(function (q, i) {
      var a = state.answers[i];
      var ok = a === q.a;
      var card = document.createElement("div");
      card.className = "review-item " + (a === null ? "skipped" : ok ? "right" : "wrong");
      var yours = a === null ? "<em>Not answered</em>" : q.o[a];
      card.innerHTML =
        '<div class="review-q"><span class="mark">' + (a === null ? "–" : ok ? "✓" : "✕") + "</span>" +
        (i + 1) + ". " + q.q + "</div>" +
        '<div class="review-a">Your answer: <b>' + yours + "</b></div>" +
        (ok ? "" : '<div class="review-a">Correct answer: <b>' + q.o[q.a] + "</b></div>") +
        '<div class="review-e">' + q.e + "</div>";
      review.appendChild(card);
    });

    save({
      s: state.subject.id, name: state.subject.name,
      c: correct, n: state.total, acc: acc,
      t: new Date().toISOString()
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    clearInterval(state.timer);
    el("resultScreen").hidden = true;
    el("quizScreen").hidden = true;
    el("setupScreen").hidden = false;
    updateCounts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    fetch("data/quiz.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        DATA = d;
        renderSetup();
        var q = new URLSearchParams(location.search).get("subject");
        if (q) pickSubject(q);
        else updateCounts();

        el("qSubject").addEventListener("change", updateCounts);
        el("qDiff").addEventListener("change", updateCounts);
        el("startBtn").addEventListener("click", start);
        el("qNext").addEventListener("click", next);
        el("qPrev").addEventListener("click", prev);
        el("qSubmit").addEventListener("click", finish);
        el("againBtn").addEventListener("click", reset);
        el("setupAgain").addEventListener("click", reset);
      })
      .catch(function () {
        el("subjectGrid").innerHTML = '<p class="muted">Could not load the quiz questions. Please refresh the page.</p>';
      });
  });
})();
