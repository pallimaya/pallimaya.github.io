/* ============================================================
   Pallimaya — YouTube video hub
   Reads data/videos.json. Empty list = honest empty state.
   ============================================================ */
(function () {
  "use strict";
  var el = function (id) { return document.getElementById(id); };

  function render(d) {
    var vids = d.videos || [];
    var grid = el("videoGrid");
    if (!vids.length) {
      el("videoEmpty").hidden = false;
      grid.hidden = true;
      return;
    }
    el("videoEmpty").hidden = true;
    grid.hidden = false;
    grid.innerHTML = "";
    vids.forEach(function (v) {
      var card = document.createElement("article");
      card.className = "video-card";
      card.innerHTML =
        '<a class="video-thumb" href="https://www.youtube.com/watch?v=' + v.id + '" target="_blank" rel="noopener">' +
        '<img src="https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg" alt="' + v.title.replace(/"/g, "&quot;") + '" loading="lazy">' +
        '<span class="play" aria-hidden="true">▶</span></a>' +
        '<div class="video-body"><h3>' + v.title + "</h3>" +
        '<p class="muted">' + (v.desc || "") + "</p>" +
        '<div class="video-actions">' +
        '<a class="btn btn-outline btn-sm" href="https://www.youtube.com/watch?v=' + v.id + '" target="_blank" rel="noopener">Watch on YouTube</a>' +
        (v.quiz ? '<a class="btn btn-gold btn-sm" href="quiz.html?subject=' + v.quiz + '">Related quiz</a>' : "") +
        "</div></div>";
      grid.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("data/videos.json")
      .then(function (r) { return r.json(); })
      .then(render)
      .catch(function () { el("videoEmpty").hidden = false; });
  });
})();
