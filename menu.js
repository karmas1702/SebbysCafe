// Filter the menu by category, using the site's own button classes
var tabs = document.querySelectorAll('.menu-tab');
var cards = document.querySelectorAll('#menuGrid .product-card');
var count = document.getElementById('menuCount');

function showCategory(filter) {
  var shown = 0;

  cards.forEach(function (card) {
    var match = filter === 'all' || card.dataset.category === filter;
    card.hidden = !match;
    if (match) shown++;
  });

  count.textContent = shown + (shown === 1 ? ' item' : ' items');
}

tabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle('primary-btn', active);
      t.classList.toggle('secondary-btn', !active);
      t.setAttribute('aria-pressed', active);
    });
    showCategory(tab.dataset.filter);
  });
});

showCategory('all');