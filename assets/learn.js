/* ============================================================
   Pallimaya — Learn & Explore cards
   ============================================================ */
(function () {
  "use strict";
  var CARDS = [];
  var activeCat = "All";
  var el = function (id) { return document.getElementById(id); };

  function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function renderFilters() {
    var cats = ["All"];
    CARDS.forEach(function (c) { if (cats.indexOf(c.cat) === -1) cats.push(c.cat); });
    var box = el("learnFilters");
    box.innerHTML = "";
    cats.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (c === activeCat ? " active" : "");
      b.textContent = c;
      b.addEventListener("click", function () { activeCat = c; renderFilters(); renderCards(); });
      box.appendChild(b);
    });
  }

  function renderCards() {
    var done = read("pl_learn_done", {});
    var grid = el("learnGrid");
    grid.innerHTML = "";
    CARDS.filter(function (c) { return activeCat === "All" || c.cat === activeCat; })
      .forEach(function (c) {
        var facts = c.facts.map(function (f) { return "<li>" + f + "</li>"; }).join("");
        var card = document.createElement("article");
        card.className = "learn-card" + (done[c.id] ? " is-done" : "");
        card.innerHTML =
          '<span class="learn-cat">' + c.cat + "</span>" +
          "<h3>" + c.title + "</h3>" +
          '<p class="learn-short">' + c.short + "</p>" +
          '<ul class="learn-facts">' + facts + "</ul>" +
          '<div class="learn-example"><b>Example:</b> ' + c.example + "</div>" +
          '<div class="learn-actions">' +
          '<a class="btn btn-gold btn-sm" href="quiz.html?subject=' + c.quiz + '">Test your knowledge</a>' +
          '<button class="btn btn-outline btn-sm" type="button" data-done="' + c.id + '">' +
          (done[c.id] ? "Completed ✓" : "Mark as completed") + "</button>" +
          "</div>";
        grid.appendChild(card);
      });

    grid.querySelectorAll("[data-done]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-done");
        var d = read("pl_learn_done", {});
        d[id] = !d[id];
        write("pl_learn_done", d);
        renderCards();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("data/learn.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        CARDS = d.cards;
        renderFilters();
        renderCards();
      })
      .catch(function () {
        el("learnGrid").innerHTML = '<p class="muted">Could not load the learning cards. Please refresh the page.</p>';
      });
  });
})();
