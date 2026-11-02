/* ============================================================
   Pallimaya — Daily Brain Challenge
   One challenge per day, chosen by date. Answer, reveal, explain.
   ============================================================ */
(function () {
  "use strict";

  var CH = [];
  var todayIdx = 0;
  var answered = false;
  var el = function (id) { return document.getElementById(id); };

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dayNumber() {
    return Math.floor(Date.now() / 86400000);
  }
  function read(k, d) {
    try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; }
  }
  function write(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  function bumpStreak(ok) {
    var s = read("pl_brain_streak", { last: "", count: 0 });
    var t = todayKey();
    if (s.last === t) return s;
    var y = new Date(); y.setDate(y.getDate() - 1);
    var yk = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
    s.count = (s.last === yk && ok) ? s.count + 1 : (ok ? 1 : s.count);
    s.last = t;
    write("pl_brain_streak", s);
    return s;
  }

  function render(idx) {
    var c = CH[idx];
    answered = false;
    el("bType").textContent = c.t;
    el("bDate").textContent = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
    el("bText").textContent = c.q;
    el("bFeedback").hidden = true;
    el("bFeedback").className = "brain-feedback";

    var box = el("bOptions");
    box.innerHTML = "";
    c.o.forEach(function (opt, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.innerHTML = '<span class="opt-key">' + "ABCD"[i] + "</span><span>" + opt + "</span>";
      b.addEventListener("click", function () { answer(i, b); });
      box.appendChild(b);
    });

    var done = read("pl_brain_done", {});
    el("bDoneToday").textContent = done[todayKey()] ? "Completed today ✓" : "Not completed yet";
    el("bDoneToday").className = done[todayKey()] ? "brain-status done" : "brain-status";

    var st = read("pl_brain_streak", { count: 0 });
    el("bStreak").textContent = st.count;
  }

  function answer(i, btn) {
    if (answered) return;
    answered = true;
    var c = CH[todayIdx];
    var right = i === c.a;
    document.querySelectorAll("#bOptions .option").forEach(function (o, k) {
      o.classList.add("locked");
      if (k === c.a) o.classList.add("correct");
    });
    if (!right) btn.classList.add("wrong");

    var fb = el("bFeedback");
    fb.hidden = false;
    fb.className = "brain-feedback " + (right ? "good" : "bad");
    fb.innerHTML =
      "<strong>" + (right ? "Correct!" : "Not quite.") + "</strong> " +
      (right ? "" : "The answer is <b>" + c.o[c.a] + "</b>. ") + c.e;

    var done = read("pl_brain_done", {});
    done[todayKey()] = true;
    write("pl_brain_done", done);
    var st = bumpStreak(right);
    el("bStreak").textContent = st.count;
    el("bDoneToday").textContent = "Completed today ✓";
    el("bDoneToday").className = "brain-status done";
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("data/brain.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        CH = d.challenges;
        todayIdx = dayNumber() % CH.length;
        render(todayIdx);
        el("bNext").addEventListener("click", function () {
          todayIdx = (todayIdx + 1) % CH.length;
          render(todayIdx);
        });
      })
      .catch(function () {
        el("bText").textContent = "Could not load today's challenge. Please refresh the page.";
      });
  });
})();
