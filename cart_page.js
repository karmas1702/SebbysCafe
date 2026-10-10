(function () {
  var store = window.SebbysCart;
  if (!store) return;

  var layout = document.getElementById('cartLayout');
  var itemsList = document.getElementById('cartItems');
  var emptyMsg = document.getElementById('cartEmpty');
  var summaryBox = document.getElementById('checkoutForm');
  var summaryCount = document.getElementById('summaryCount');
  var totalEl = document.getElementById('cartTotal');
  var nameInput = document.getElementById('orderName');
  var checkoutBtn = document.getElementById('checkoutBtn');
  var clearBtn = document.getElementById('clearCart');
  var done = document.getElementById('cartDone');

  function render() {
    var items = store.items();
    var isEmpty = items.length === 0;

    itemsList.innerHTML = '';
    items.forEach(function (item) {
      var li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML =
        '<img alt="">' +
        '<div>' +
          '<span class="cart-item-name"></span>' +
          '<span class="cart-item-price"></span>' +
          '<div class="qty">' +
            '<button type="button" class="qty-btn" data-act="minus">−</button>' +
            '<span class="qty-num" aria-live="polite"></span>' +
            '<button type="button" class="qty-btn" data-act="plus">+</button>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<div class="cart-line-total"></div>' +
          '<button type="button" class="cart-remove" data-act="remove">Remove</button>' +
        '</div>';

      var img = li.querySelector('img');
      if (item.img) img.src = item.img; else img.hidden = true;
      li.querySelector('.cart-item-name').textContent = item.name;
      li.querySelector('.cart-item-price').textContent = store.money(item.price) + ' each';
      li.querySelector('.qty-num').textContent = item.qty;
      li.querySelector('.cart-line-total').textContent = store.money(item.price * item.qty);
      li.querySelector('[data-act="minus"]').setAttribute('aria-label', 'Fewer ' + item.name);
      li.querySelector('[data-act="plus"]').setAttribute('aria-label', 'More ' + item.name);
      li.querySelector('[data-act="remove"]').setAttribute('aria-label', 'Remove ' + item.name);
      li.dataset.id = item.id;
      itemsList.appendChild(li);
    });

    emptyMsg.hidden = !isEmpty;
    summaryBox.hidden = isEmpty;
    layout.classList.toggle('is-empty', isEmpty);
    summaryCount.textContent = store.count();
    totalEl.textContent = store.money(store.total());
    checkoutBtn.disabled = isEmpty;
  }

  itemsList.addEventListener('click', function (e) {
    var button = e.target.closest('button[data-act]');
    if (!button) return;
    var id = button.closest('.cart-item').dataset.id;
    var act = button.dataset.act;

    if (act === 'plus') store.changeQty(id, 1);
    else if (act === 'minus') store.changeQty(id, -1);
    else store.remove(id);
  });

  clearBtn.addEventListener('click', function () { store.clear(); });

  // Place order: there is no payment or server, so this shows a summary for the barista
  summaryBox.addEventListener('submit', function (e) {
    e.preventDefault();
    var items = store.items();
    if (items.length === 0) return;

    var orderNumber = '#SB-' + String(Date.now()).slice(-4);
    var list = document.getElementById('doneItems');
    list.innerHTML = '';
    items.forEach(function (item) {
      var li = document.createElement('li');
      var left = document.createElement('span');
      var right = document.createElement('span');
      left.textContent = item.qty + ' × ' + item.name;
      right.textContent = store.money(item.price * item.qty);
      li.appendChild(left);
      li.appendChild(right);
      list.appendChild(li);
    });

    document.getElementById('doneName').textContent = nameInput.value.trim();
    document.getElementById('doneNumber').textContent = orderNumber;
    document.getElementById('doneTotal').textContent = store.money(store.total());

    layout.hidden = true;
    done.hidden = false;
    store.clear();
    window.scrollTo(0, 0);
  });

  store.onChange(render);
  render();
})();