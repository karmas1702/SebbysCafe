window.SebbysCart = (function () {
  var KEY = 'sebbysCart';
  var items = read();
  var listeners = [];

  function read() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(saved) ? saved : [];
    } catch (e) {
      return [];
    }
  }

  function write() {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      // storage is blocked: the cart still works until the page is closed
    }
  }

  function find(id) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  function count() {
    return items.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function total() {
    return items.reduce(function (sum, item) { return sum + item.qty * item.price; }, 0);
  }

  function money(n) {
    return '₱' + n.toLocaleString('en-PH');
  }

  // The number on the cart button in the navbar
  function updateBadge() {
    var badge = document.getElementById('cartCount');
    var button = document.getElementById('cartBtn');
    var n = count();

    if (badge) {
      badge.textContent = n;
      badge.hidden = n === 0;
    }
    if (button) {
      button.setAttribute('aria-label', 'Open cart, ' + n + (n === 1 ? ' item' : ' items'));
    }
  }

  function changed() {
    write();
    updateBadge();
    listeners.forEach(function (fn) { fn(); });
  }

  function add(item) {
    var existing = find(item.id);
    if (existing) existing.qty += 1;
    else items.push({ id: item.id, name: item.name, price: item.price, img: item.img, qty: 1 });
    changed();
  }

  function changeQty(id, change) {
    var item = find(id);
    if (!item) return;
    item.qty += change;
    if (item.qty < 1) remove(id);
    else changed();
  }

  function remove(id) {
    items = items.filter(function (item) { return item.id !== id; });
    changed();
  }

  function clear() {
    items = [];
    changed();
  }

  // Keep the cart in step if it changes in another tab
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) {
      items = read();
      updateBadge();
      listeners.forEach(function (fn) { fn(); });
    }
  });

  updateBadge();

  return {
    items: function () { return items.slice(); },
    add: add,
    changeQty: changeQty,
    remove: remove,
    clear: clear,
    count: count,
    total: total,
    money: money,
    onChange: function (fn) { listeners.push(fn); }
  };
})();