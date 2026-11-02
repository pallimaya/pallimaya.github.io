/* ============================================================
   Pallimaya — My Progress
   Everything here is stored in this browser only (localStorage).
   No account, nothing sent to a server.
   ============================================================ */
(function () {
  "use strict";
  var el = function (id) { return document.getElementById(id); };

  function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }

  function stats() {
    var h = read("pl_quiz_history", []);
    var brain = read("pl_brain_done", {});
    var learn = read("pl_learn_done", {});
    var streak = read("pl_brain_streak", { count: 0 });

    var totalQ = 0, totalC = 0, best = 0, bestName = "—";
    h.forEach(function (r) {
      totalQ += r.n || 0;
      totalC += r.c || 0;
      if ((r.acc || 0) > best) { best = r.acc || 0; bestName = r.name || "—"; }
    });
    var acc = totalQ ? Math.round((totalC / totalQ) * 100) : 0;

    return {
      quizzes: h.length,
      totalQ: totalQ,
      correct: totalC,
      accuracy: acc,
      best: best,
      bestName: bestName,
      brainDays: Object.keys(brain).length,
      streak: streak.count || 0,
      topics: Object.keys(learn).filter(function (k) { return learn[k]; }).length,
      history: h.slice(-8).reverse()
    };
  }

  var BADGES = [
    { id: "first", name: "First Quiz", desc: "Complete your first quiz", test: function (s) { return s.quizzes >= 1; } },
    { id: "perfect", name: "Perfect Score", desc: "Score 100% in any quiz", test: function (s) { return s.best >= 100; } },
    { id: "ten", name: "Ten Quizzes", desc: "Complete 10 quizzes", test: function (s) { return s.quizzes >= 10; } },
    { id: "streak7", name: "7-Day Streak", desc: "A seven-day challenge streak", test: function (s) { return s.streak >= 7; } },
    { id: "brain", name: "Brain Challenge Master", desc: "Finish 20 daily challenges", test: function (s) { return s.brainDays >= 20; } },
    { id: "explorer", name: "Knowledge Explorer", desc: "Mark 8 learning cards completed", test: function (s) { return s.topics >= 8; } }
  ];

  function render() {
    var s = stats();
    el("pQuizzes").textContent = s.quizzes;
    el("pCorrect").textContent = s.correct;
    el("pBest").textContent = s.best ? s.best + "%" : "—";
    el("pBestName").textContent = s.bestName;
    el("pAcc").textContent = s.accuracy + "%";
    el("pBrain").textContent = s.brainDays;
    el("pStreak").textContent = s.streak;
    el("pTopics").textContent = s.topics;

    var box = el("badgeGrid");
    box.innerHTML = "";
    BADGES.forEach(function (b) {
      var earned = b.test(s);
      var d = document.createElement("div");
      d.className = "badge-card" + (earned ? " earned" : "");
      d.innerHTML =
        '<div class="badge-icon">' + (earned ? "★" : "☆") + "</div>" +
        "<h4>" + b.name + "</h4><p>" + b.desc + "</p>" +
        '<span class="badge-state">' + (earned ? "Earned" : "Locked") + "</span>";
      box.appendChild(d);
    });

    var hist = el("historyList");
    if (!s.history.length) {
      hist.innerHTML = '<p class="muted">No quizzes completed yet. <a href="quiz.html">Take your first quiz →</a></p>';
    } else {
      hist.innerHTML = s.history.map(function (r) {
        var d = new Date(r.t);
        var when = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
        return '<div class="history-row"><span>' + r.name + "</span><span>" + r.c + "/" + r.n +
          "</span><span>" + (r.acc || 0) + "%</span><span>" + when + "</span></div>";
      }).join("");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    var reset = el("resetProgress");
    if (reset) {
      reset.addEventListener("click", function () {
        if (!confirm("Clear all quiz results and badges from this browser? This cannot be undone.")) return;
        ["pl_quiz_history", "pl_brain_done", "pl_brain_streak", "pl_learn_done"].forEach(function (k) {
          try { localStorage.removeItem(k); } catch (e) {}
        });
        render();
      });
    }
  });
})();
