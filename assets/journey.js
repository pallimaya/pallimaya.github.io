/* ============================================================
   Pallimaya — YouTube subscriber journey
   Renders the milestone ladder from data/milestones.json
   ============================================================ */
(function () {
  "use strict";
  var el = function (id) { return document.getElementById(id); };

  function fmt(n) { return n.toLocaleString("en-IN"); }

  function render(d) {
    var current = d.current || 0;
    var list = d.milestones || [];

    el("curCount").textContent = fmt(current);
    el("updDate").textContent = d.updated || "—";
    el("chanName").textContent = d.channel || "Pallimaya GhibliStory";

    var reached = list.filter(function (m) { return current >= m.target; });
    var next = list.filter(function (m) { return current < m.target; })[0];
    var last = reached.length ? reached[reached.length - 1].target : 0;

    el("reachedCount").textContent = reached.length;
    el("totalCount").textContent = list.length;

    if (next) {
      var span = next.target - last;
      var got = current - last;
      var pct = span > 0 ? Math.min(100, Math.round((got / span) * 100)) : 0;
      el("nextTarget").textContent = fmt(next.target);
      el("nextLeft").textContent = fmt(next.target - current);
      el("nextBar").style.width = pct + "%";
      el("nextPct").textContent = pct + "%";
      el("nextName").textContent = "Next milestone: " + fmt(next.target) +
        (next.target === 1 ? " subscriber" : " subscribers");
    } else {
      el("nextName").textContent = "All milestones reached.";
      el("nextBar").style.width = "100%";
      el("nextPct").textContent = "100%";
      el("nextLeft").textContent = "0";
      el("nextTarget").textContent = fmt(list.length ? list[list.length - 1].target : 0);
    }

    var rail = el("milestoneList");
    rail.innerHTML = "";
    list.forEach(function (m) {
      var done = current >= m.target;
      var isNext = next && m.target === next.target;
      var remaining = Math.max(0, m.target - current);
      var status = done ? "Completed" : isNext ? "In progress" : "Upcoming";

      var row = document.createElement("div");
      row.className = "milestone" + (done ? " done" : isNext ? " current" : "");
      row.innerHTML =
        '<div class="ms-dot" aria-hidden="true"></div>' +
        '<div class="ms-body">' +
        '<div class="ms-top"><span class="ms-target">' + fmt(m.target) +
        (m.target === 1 ? " subscriber" : " subscribers") + "</span>" +
        '<span class="ms-status">' + status + "</span></div>" +
        '<div class="ms-bar"><span style="width:' + (done ? 100 : 0) + '%"></span></div>' +
        '<div class="ms-meta">' +
        (done ? "Achieved" : fmt(remaining) + " to go") +
        "</div></div>";
      rail.appendChild(row);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("data/milestones.json")
      .then(function (r) { return r.json(); })
      .then(render)
      .catch(function () {
        el("milestoneList").innerHTML = '<p class="muted">Could not load milestone data.</p>';
      });
  });
})();
