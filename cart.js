(function () {
  var store = window.SebbysCart;
  if (!store) return;

  var toast = document.getElementById('cartToast');
  var toastTimer;

  // flavor picker (only used by items that have data-flavors)
  var flavorModal = document.getElementById('flavorModal');
  var flavorForm = document.getElementById('flavorForm');
  var flavorOptions = document.getElementById('flavorOptions');
  var flavorTitle = document.getElementById('flavorTitle');
  var flavorPhoto = document.getElementById('flavorPhoto');
  var flavorAdd = document.getElementById('flavorAdd');
  var flavorCancel = document.getElementById('flavorCancel');
  var flavorButton = null;

  function slug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  // Add one item to the cart. For items with flavors, the chosen flavor is part of the item.
  function addFromButton(btn, flavor, flavorPrice) {
    var card = btn.closest('.product-card');
    var image = card ? card.querySelector('.product-image img') : null;
    var id = btn.dataset.id;
    var name = btn.dataset.name;

    if (flavor) {
      id += '-' + slug(flavor);
      name += ' (' + flavor + ')';
    }

    store.add({
      id: id,
      name: name,
      price: typeof flavorPrice === 'number' ? flavorPrice : Number(btn.dataset.price),
      img: image ? image.getAttribute('src') : ''
    });
    showToast(name + ' added to your cart');

    btn.classList.add('added');
    btn.textContent = 'Added ✓';
    setTimeout(function () {
      btn.classList.remove('added');
      btn.textContent = btn.dataset.label;
    }, 1200);
  }

  document.querySelectorAll('.add-to-cart').forEach(function (btn) {
    btn.dataset.label = btn.textContent;

    btn.addEventListener('click', function () {
      if (btn.dataset.flavors && flavorModal) openFlavor(btn);
      else addFromButton(btn, null);
    });

    // Items with flavors: clicking anywhere on the card opens the flavor box
    var card = btn.closest('.product-card');
    if (card && btn.dataset.flavors && flavorModal) {
      card.classList.add('has-flavors');
      card.addEventListener('click', function (e) {
        if (!e.target.closest('button')) openFlavor(btn);
      });
    }
  });

  /* ---------- flavor picker ---------- */
  // data-flavors looks like "Mango=120,Strawberry=130": a flavor name, then = and its price
  function parseFlavors(btn) {
    return btn.dataset.flavors.split(',').map(function (part) {
      var bits = part.split('=');
      return {
        name: bits[0].trim(),
        price: bits[1] ? Number(bits[1]) : Number(btn.dataset.price)
      };
    });
  }

  function openFlavor(btn) {
    flavorButton = btn;
    var card = btn.closest('.product-card');
    var image = card ? card.querySelector('.product-image img') : null;

    flavorTitle.textContent = btn.dataset.name;
    if (image) {
      flavorPhoto.src = image.getAttribute('src');
      flavorPhoto.alt = btn.dataset.name;
      flavorPhoto.hidden = false;
    } else {
      flavorPhoto.hidden = true;
    }

    flavorOptions.innerHTML = '';
    parseFlavors(btn).forEach(function (flavor, index) {
      var label = document.createElement('label');
      var input = document.createElement('input');
      var box = document.createElement('span');
      var name = document.createElement('span');
      var price = document.createElement('span');

      label.className = 'flavor-option';
      input.type = 'radio';
      input.name = 'flavor';
      input.value = flavor.name;
      input.dataset.price = flavor.price;
      input.checked = index === 0;
      name.textContent = flavor.name;
      price.className = 'flavor-price';
      price.textContent = store.money(flavor.price);

      box.appendChild(name);
      box.appendChild(price);
      label.appendChild(input);
      label.appendChild(box);
      flavorOptions.appendChild(label);
    });

    updateAddLabel();
    flavorModal.classList.add('open');
    flavorModal.setAttribute('aria-hidden', 'false');
    flavorForm.querySelector('input:checked').focus();
  }

  // The button shows the price of the chosen flavor
  function updateAddLabel() {
    var chosen = flavorForm.querySelector('input[name="flavor"]:checked');
    flavorAdd.textContent = chosen ? 'Add to cart · ' + store.money(Number(chosen.dataset.price)) : 'Add to cart';
  }

  function closeFlavor() {
    flavorModal.classList.remove('open');
    flavorModal.setAttribute('aria-hidden', 'true');
    if (flavorButton) flavorButton.focus();
  }

  if (flavorModal) {
    flavorForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var chosen = flavorForm.querySelector('input[name="flavor"]:checked');
      if (chosen && flavorButton) addFromButton(flavorButton, chosen.value, Number(chosen.dataset.price));
      closeFlavor();
    });

    flavorOptions.addEventListener('change', updateAddLabel);
    flavorCancel.addEventListener('click', closeFlavor);

    flavorModal.addEventListener('click', function (e) {
      if (e.target === flavorModal) closeFlavor();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && flavorModal.classList.contains('open')) closeFlavor();
    });
  }
})();