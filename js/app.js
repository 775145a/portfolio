function sanitize(str) {
    if (!str) return '';
    return str.replace(/[<>&"']/g, function(m) {
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '&') return '&amp;';
        if (m === '"') return '&quot;';
        if (m === "'") return '&#x27;';
        return m;
    });
}

var appData = {
    cart: [],
    invoices: [],
    subscriptions: [],
    customers: [],
    settings: {
        pharmacyName: 'ValoPOS',
        address: '',
        phone: ''
    },
    nextInvoiceId: 1,
    stockChanges: []
};

function loadData() {
    var saved = localStorage.getItem('pharmacy_pos_data');
    if (saved) {
        try {
            var parsed = JSON.parse(saved);
            appData = { ...appData, ...parsed };
        } catch (e) {
            console.error('خطأ في تحميل البيانات');
        }
    }
}

function saveData() {
    localStorage.setItem('pharmacy_pos_data', JSON.stringify(appData));
}

function formatDate(d) {
    var date = new Date(d);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(d) {
    var date = new Date(d);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPrice(p) {
    return parseFloat(p).toFixed(2);
}

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

function isToday(dateStr) {
    return dateStr.startsWith(todayStr());
}

function isThisMonth(dateStr) {
    var d = new Date(dateStr);
    var now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function debounce(fn, delay) {
    var timer;
    return function() {
        var args = arguments;
        var ctx = this;
        clearTimeout(timer);
        timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
    };
}

function showToast(message, type) {
    if (!type) type = 'success';
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    var icons = { success: '\u2705', error: '\u274C', warning: '\u26A0\uFE0F', info: '\u2139\uFE0F' };
    toast.innerHTML = (icons[type] || '') + ' ' + message;
    container.appendChild(toast);
    setTimeout(function() {
        toast.classList.add('toast-remove');
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

function highlightText(text, query) {
    if (!query) return text;
    var escaped = query.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('(' + escaped + ')', 'gi');
    return text.replace(re, '<mark>$1</mark>');
}

function getExpiryDays(expiryDate) {
    if (!expiryDate) return null;
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(expiryDate) {
    var days = getExpiryDays(expiryDate);
    if (days === null) return '';
    if (days <= 0) return 'expired';
    if (days <= 30) return 'soon';
    if (days <= 60) return 'warning';
    return 'ok';
}

// ===== EXISTING APP FUNCTIONS =====

var navItems = document.querySelectorAll('.nav-item');
var pages = document.querySelectorAll('.page');

navItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        var pageId = this.dataset.page;
        navItems.forEach(function(n) { n.classList.remove('active'); });
        this.classList.add('active');
        pages.forEach(function(p) { p.classList.remove('active'); });
        var target = document.getElementById('page-' + pageId);
        if (target) target.classList.add('active');
        if (pageId === 'inventory') renderInventory();
        if (pageId === 'reports') renderReports();
        if (pageId === 'dashboard') renderDashboard();
        if (pageId === 'pos') { renderMedsGrid(); loadCustomerSelect(); }
        if (pageId === 'subscriptions') renderSubsHistory();
        if (pageId === 'customers') renderCustomers();
        if (window.innerWidth < 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    });
});

document.getElementById('menuToggle').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('open');
});

document.getElementById('closeSidebar').addEventListener('click', function() {
    document.getElementById('sidebar').classList.remove('open');
});

function updateDate() {
    var now = new Date();
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString('ar-EG', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}
updateDate();

document.getElementById('globalSearch').addEventListener('input', function() {
    var q = this.value.trim();
    if (q.length < 2) return;
    var results = searchMedicines(q);
    if (results.length > 0) {
        document.querySelector('[data-page="pos"]').click();
        document.getElementById('posSearch').value = q;
        renderMedsGrid(q);
    }
});

var selectedPlan = null;

function renderMedsGrid(query) {
    var grid = document.getElementById('medsGrid');
    var category = document.getElementById('posCategory').value;
    var meds = query ? searchMedicines(query) : medicinesDB;
    if (category !== '\u0627\u0644\u0643\u0644') {
        meds = meds.filter(function(m) { return m.category === category; });
    }
    if (!query) {
        var searchVal = document.getElementById('posSearch').value.trim();
        if (searchVal) meds = searchMedicines(searchVal);
    }
    grid.innerHTML = '';
    if (meds.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">\uD83D\uDC8A</div><div class="empty-state-text">\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u062F\u0648\u064A\u0629 \u0645\u0637\u0627\u0628\u0642\u0629</div></div>';
        return;
    }
    meds.forEach(function(m) {
        var div = document.createElement('div');
        div.className = 'med-item' + (m.qty <= 0 ? ' out-of-stock' : '');
        div.innerHTML = '\n            <span class="med-name">' + m.name + '</span>\n            <span class="med-price">' + formatPrice(m.price) + ' \u062C.\u0645</span>\n            <span class="med-stock">\u0627\u0644\u0645\u062E\u0632\u0648\u0646: ' + m.qty + '</span>\n        ';
        if (m.qty > 0) {
            div.addEventListener('click', function() { addToCart(m); });
        }
        grid.appendChild(div);
    });
}

function doSearch() {
    var input = document.getElementById('posSearch');
    var q = input.value.trim();
    var suggestions = document.getElementById('searchSuggestions');
    if (q.length < 1) {
        suggestions.classList.remove('active');
        renderMedsGrid();
        return;
    }
    if (/^\d+$/.test(q)) {
        var barcodeMatch = medicinesDB.find(function(m) { return m.barcode && m.barcode === q; });
        if (barcodeMatch && barcodeMatch.qty > 0) {
            addToCart(barcodeMatch);
            showToast('\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 ' + barcodeMatch.name + ' \u0639\u0646 \u0637\u0631\u064A\u0642 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F', 'success');
            input.value = '';
            suggestions.classList.remove('active');
            renderMedsGrid();
            return;
        }
    }
    var results = searchMedicines(q);
    renderMedsGrid(q);
    if (results.length > 0) {
        suggestions.innerHTML = '';
        results.slice(0, 8).forEach(function(m) {
            var item = document.createElement('div');
            item.className = 'search-suggestion-item';
            item.innerHTML = '\n                <div class="search-suggestion-info">\n                    <span class="search-suggestion-name">' + highlightText(m.name, q) + '</span>\n                    <span class="search-suggestion-sub">' + highlightText(m.scientificName, q) + ' | ' + highlightText(m.category, q) + '</span>\n                </div>\n                <div style="text-align:left;">\n                    <div class="search-suggestion-price">' + formatPrice(m.price) + ' \u062C.\u0645</div>\n                    <div class="search-suggestion-stock">\u0627\u0644\u0645\u062E\u0632\u0648\u0646: ' + m.qty + '</div>\n                </div>\n            ';
            if (m.qty > 0) {
                item.addEventListener('click', function() {
                    addToCart(m);
                    input.value = '';
                    suggestions.classList.remove('active');
                    renderMedsGrid();
                    input.focus();
                });
            }
            suggestions.appendChild(item);
        });
        suggestions.classList.add('active');
    } else {
        suggestions.classList.remove('active');
    }
}

var debouncedSearch = debounce(function() { doSearch(); }, 300);

document.getElementById('posSearch').addEventListener('input', debouncedSearch);

document.getElementById('posSearch').addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('searchSuggestions').classList.remove('active');
    }
});

document.addEventListener('click', function(e) {
    var wrap = document.querySelector('.pos-search-wrap');
    if (wrap && !wrap.contains(e.target)) {
        var sug = document.getElementById('searchSuggestions');
        if (sug) sug.classList.remove('active');
    }
});

document.getElementById('posCategory').addEventListener('change', function() {
    renderMedsGrid();
});

function loadCategories() {
    var cats = getCategories();
    var selects = ['posCategory', 'invCategory'];
    selects.forEach(function(id) {
        var sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = '<option value="\u0627\u0644\u0643\u0644">\u0643\u0644 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A</option>';
        cats.forEach(function(c) {
            sel.innerHTML += '<option value="' + c + '">' + c + '</option>';
        });
    });
}

function addToCart(med) {
    var existing = appData.cart.find(function(item) { return item.id === med.id; });
    if (existing) {
        if (existing.qty < med.qty) existing.qty++;
        else return;
    } else {
        appData.cart.push({ id: med.id, name: med.name, price: med.price, qty: 1, maxQty: med.qty });
    }
    saveData();
    renderCart();
}

function renderCart() {
    var container = document.getElementById('cartItems');
    var count = document.getElementById('cartCount');
    var headerCount = document.getElementById('headerCartCount');
    count.textContent = appData.cart.length;
    if (headerCount) headerCount.textContent = appData.cart.length;
    if (appData.cart.length === 0) {
        container.innerHTML = '<p class="text-center empty-cart">\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0635\u0646\u0627\u0641 \u0641\u064A \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629</p>';
        updateCartSummary();
        renderCartPreview();
        return;
    }
    container.innerHTML = '';
    appData.cart.forEach(function(item, idx) {
        var div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = '\n            <div class="cart-item-info">\n                <span class="cart-item-name">' + item.name + '</span>\n                <span class="cart-item-sub">' + formatPrice(item.price) + ' \u062C.\u0645 \u00D7 ' + item.qty + '</span>\n            </div>\n            <div class="cart-item-actions">\n                <input type="number" class="cart-item-qty" value="' + item.qty + '" min="1" max="' + item.maxQty + '" data-index="' + idx + '">\n                <span class="cart-item-remove" data-index="' + idx + '">&times;</span>\n            </div>\n        ';
        container.appendChild(div);
    });
    container.querySelectorAll('.cart-item-qty').forEach(function(inp) {
        inp.addEventListener('change', function() {
            var idx = parseInt(this.dataset.index);
            var val = parseInt(this.value);
            if (val > 0 && val <= appData.cart[idx].maxQty) {
                appData.cart[idx].qty = val;
                saveData();
                renderCart();
            } else {
                this.value = appData.cart[idx].qty;
            }
        });
    });
    container.querySelectorAll('.cart-item-remove').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var idx = parseInt(this.dataset.index);
            appData.cart.splice(idx, 1);
            saveData();
            renderCart();
        });
    });
    updateCartSummary();
    renderCartPreview();
}

function updateCartSummary() {
    var subtotal = appData.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
    var discount = parseFloat(document.getElementById('discountInput').value) || 0;
    var net = Math.max(0, subtotal - discount);
    var paid = parseFloat(document.getElementById('paidInput').value) || 0;
    var change = Math.max(0, paid - net);
    document.getElementById('cartTotal').textContent = formatPrice(subtotal) + ' \u062C.\u0645';
    document.getElementById('cartNet').textContent = formatPrice(net) + ' \u062C.\u0645';
    document.getElementById('cartChange').textContent = formatPrice(change) + ' \u062C.\u0645';
}

document.getElementById('discountInput').addEventListener('input', updateCartSummary);
document.getElementById('paidInput').addEventListener('input', updateCartSummary);

function renderCartPreview() {
    var preview = document.getElementById('cartPreview');
    if (!preview) return;
    if (appData.cart.length === 0) {
        preview.innerHTML = '<div class="cart-preview-empty">\u0627\u0644\u0633\u0644\u0629 \u0641\u0627\u0631\u063A\u0629</div>';
        return;
    }
    preview.innerHTML = '';
    appData.cart.forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'cart-preview-item';
        div.innerHTML = '<span>' + item.name + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + ' \u062C.\u0645</span>';
        preview.appendChild(div);
    });
}

function loadCustomerSelect() {
    var sel = document.getElementById('cartCustomer');
    if (!sel) return;
    var currentVal = sel.value;
    sel.innerHTML = '<option value="">\u0628\u062F\u0648\u0646 \u0639\u0645\u064A\u0644</option>';
    appData.customers.forEach(function(c) {
        sel.innerHTML += '<option value="' + c.id + '">' + c.name + ' - ' + c.phone + '</option>';
    });
    if (currentVal) sel.value = currentVal;
}

document.getElementById('quickAddCustomerBtn').addEventListener('click', function() {
    document.getElementById('customerEditId').value = '';
    document.getElementById('customerModalTitle').textContent = '\u0625\u0636\u0627\u0641\u0629 \u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F';
    document.getElementById('customerNameInput').value = '';
    document.getElementById('customerPhoneInput').value = '';
    document.getElementById('customerEmailInput').value = '';
    document.getElementById('customerNotesInput').value = '';
    document.getElementById('customerModal').style.display = 'block';
});

document.getElementById('checkoutBtn').addEventListener('click', function() {
    if (appData.cart.length === 0) {
        showToast('\u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0641\u0627\u0631\u063A\u0629! \u0623\u0636\u0641 \u0623\u0635\u0646\u0627\u0641\u0627\u064B \u0623\u0648\u0644\u0627\u064B.', 'error');
        return;
    }
    var subtotal = appData.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
    var discount = parseFloat(document.getElementById('discountInput').value) || 0;
    var net = Math.max(0, subtotal - discount);
    var paid = parseFloat(document.getElementById('paidInput').value) || 0;
    if (paid < net) {
        showToast('\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u0635\u0627\u0641\u064A!', 'error');
        return;
    }
    var customerSelect = document.getElementById('cartCustomer');
    var customerId = customerSelect ? parseInt(customerSelect.value) || null : null;
    var invoice = {
        id: appData.nextInvoiceId++,
        date: new Date().toISOString(),
        items: appData.cart.map(function(item) { return { ...item }; }),
        subtotal: subtotal,
        discount: discount,
        net: net,
        paid: paid,
        change: paid - net,
        customerId: customerId
    };
    appData.invoices.push(invoice);
    appData.cart.forEach(function(item) {
        var med = medicinesDB.find(function(m) { return m.id === item.id; });
        if (med) med.qty = Math.max(0, med.qty - item.qty);
    });
    if (customerId) {
        var customer = appData.customers.find(function(c) { return c.id === customerId; });
        if (customer) {
            customer.totalSpent = (customer.totalSpent || 0) + net;
            customer.lastPurchase = invoice.date;
            customer.points = (customer.points || 0) + Math.floor(net / 10);
        }
    }
    appData.cart = [];
    saveData();
    renderCart();
    renderDashboard();
    updateCartSummary();
    document.getElementById('discountInput').value = 0;
    document.getElementById('paidInput').value = '';
    if (customerSelect) customerSelect.value = '';
    showReceipt(invoice);
    showToast('\u062A\u0645 \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0628\u064A\u0639 \u0628\u0646\u062C\u0627\u062D!', 'success');
});

document.getElementById('newSaleBtn').addEventListener('click', function() {
    appData.cart = [];
    saveData();
    renderCart();
    document.getElementById('discountInput').value = 0;
    document.getElementById('paidInput').value = '';
});

function barcodeHTML(code) {
    if (!code) return '';
    var chars = code.split('');
    var bars = '';
    chars.forEach(function(c) {
        var w = 1 + parseInt(c) * 0.5;
        bars += '<span style="display:inline-block;width:' + w + 'px;height:30px;background:#000;margin-left:0.5px;"></span>';
    });
    return '<div class="receipt-barcode"><div style="text-align:center;overflow:hidden;white-space:nowrap;direction:ltr;">' + bars + '</div><div class="receipt-barcode-text">' + code + '</div></div>';
}

function showReceipt(invoice) {
    var content = document.getElementById('receiptContent');
    var itemsHtml = '';
    invoice.items.forEach(function(item) {
        itemsHtml += '<div class="receipt-row"><span>' + item.name + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + '</span></div>';
    });
    var customerName = '';
    if (invoice.customerId) {
        var c = appData.customers.find(function(cx) { return cx.id === invoice.customerId; });
        if (c) customerName = c.name;
    }
    var med = invoice.items.length > 0 ? medicinesDB.find(function(m) { return m.name === invoice.items[0].name; }) : null;
    var barcode = med && med.barcode ? barcodeHTML(med.barcode) : '';
    content.innerHTML = '\n        <div class="receipt">\n            <h3>' + (appData.settings.pharmacyName || 'ValoPOS') + '</h3>\n            <p>' + (appData.settings.address || '') + '</p>\n            <p>' + (appData.settings.phone || '') + '</p>\n            ' + barcode + '\n            <div class="receipt-line"></div>\n            <p>\u0641\u0627\u062A\u0648\u0631\u0629 #' + invoice.id + '</p>\n            <p>' + formatDate(invoice.date) + '</p>\n            ' + (customerName ? '<p class="receipt-customer">\u0627\u0644\u0639\u0645\u064A\u0644: ' + customerName + '</p>' : '') + '\n            <div class="receipt-line"></div>\n            ' + itemsHtml + '\n            <div class="receipt-line"></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(invoice.subtotal) + ' \u062C.\u0645</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(invoice.discount) + ' \u062C.\u0645</span></div>\n            <div class="receipt-row receipt-total"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(invoice.net) + ' \u062C.\u0645</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(invoice.paid) + ' \u062C.\u0645</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(invoice.change) + ' \u062C.\u0645</span></div>\n            <div class="receipt-line"></div>\n            <p>\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0639\u0627\u0645\u0644\u0643\u0645 \u0645\u0639\u0646\u0627</p>\n        </div>\n    ';
    document.getElementById('receiptModal').style.display = 'block';
}

document.getElementById('printReceiptBtn').addEventListener('click', function() {
    if (appData.cart.length > 0) {
        var subtotal = appData.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
        var discount = parseFloat(document.getElementById('discountInput').value) || 0;
        var net = Math.max(0, subtotal - discount);
        var paid = parseFloat(document.getElementById('paidInput').value) || 0;
        showReceipt({
            id: appData.nextInvoiceId,
            date: new Date().toISOString(),
            items: appData.cart.map(function(item) { return { ...item }; }),
            subtotal: subtotal,
            discount: discount,
            net: net,
            paid: paid,
            change: paid - net
        });
    }
});

function renderInventory() {
    var search = (document.getElementById('invSearch').value || '').trim();
    var category = document.getElementById('invCategory').value;
    var status = document.getElementById('invStatus').value;
    var meds = medicinesDB.slice();
    if (search) meds = searchMedicines(search);
    if (category !== '\u0627\u0644\u0643\u0644') meds = meds.filter(function(m) { return m.category === category; });
    if (status !== '\u0627\u0644\u0643\u0644') {
        meds = meds.filter(function(m) {
            var s = getStockStatus(m);
            return s === status;
        });
    }
    var tbody = document.getElementById('inventoryBody');
    tbody.innerHTML = '';
    if (meds.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center empty-state">\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C</td></tr>';
        return;
    }
    meds.forEach(function(m) {
        var statusText = getStockStatus(m);
        var statusClass = statusText === '\u0645\u062A\u0648\u0641\u0631' ? 'badge-success' : statusText === '\u0645\u0646\u062E\u0641\u0636' ? 'badge-warning' : 'badge-danger';
        var expiryDays = getExpiryDays(m.expiryDate);
        var expiryStatus = getExpiryStatus(m.expiryDate);
        var expiryDisplay = m.expiryDate ? formatDateShort(m.expiryDate) : '-';
        var expiryBadge = 'green';
        if (expiryStatus === 'expired' || expiryStatus === 'soon') expiryBadge = 'red';
        else if (expiryStatus === 'warning') expiryBadge = 'yellow';
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + m.id + '</td>\n            <td><strong>' + m.name + '</strong></td>\n            <td>' + m.scientificName + '</td>\n            <td>' + m.category + '</td>\n            <td><strong>' + formatPrice(m.price) + '</strong></td>\n            <td>' + m.qty + '</td>\n            <td><span class="expiry-badge ' + expiryBadge + '">' + expiryDisplay + (expiryDays !== null && expiryDays <= 60 ? ' (' + expiryDays + ' \u064A\u0648\u0645)' : '') + '</span></td>\n            <td><span class="badge ' + statusClass + '">' + statusText + '</span></td>\n            <td>' + (m.rx ? '\u0646\u0639\u0645' : '\u0644\u0627') + '</td>\n            <td><button class="btn btn-sm btn-primary" onclick="editStock(' + m.id + ')">\u062A\u0639\u062F\u064A\u0644</button></td>\n        ';
        tbody.appendChild(tr);
    });
}

document.getElementById('invSearch').addEventListener('input', renderInventory);
document.getElementById('invCategory').addEventListener('change', renderInventory);
document.getElementById('invStatus').addEventListener('change', renderInventory);

function editStock(id) {
    var med = getMedicineById(id);
    if (!med) return;
    document.getElementById('stockMedSelect').value = id;
    document.getElementById('stockQtyInput').value = 10;
    document.getElementById('stockPriceInput').value = med.price;
    document.getElementById('stockExpiryInput').value = med.expiryDate || '';
    document.getElementById('stockModal').style.display = 'block';
}

document.getElementById('addStockBtn').addEventListener('click', function() {
    var sel = document.getElementById('stockMedSelect');
    sel.innerHTML = '';
    medicinesDB.forEach(function(m) {
        sel.innerHTML += '<option value="' + m.id + '">' + m.name + ' (\u0645\u062E\u0632\u0648\u0646: ' + m.qty + ')</option>';
    });
    document.getElementById('stockQtyInput').value = 10;
    document.getElementById('stockPriceInput').value = '';
    document.getElementById('stockExpiryInput').value = '';
    document.getElementById('stockModal').style.display = 'block';
});

document.getElementById('saveStockBtn').addEventListener('click', function() {
    var id = parseInt(document.getElementById('stockMedSelect').value);
    var qty = parseInt(document.getElementById('stockQtyInput').value);
    var price = parseFloat(document.getElementById('stockPriceInput').value);
    var expiry = document.getElementById('stockExpiryInput').value;
    var med = getMedicineById(id);
    if (!med) return;
    if (qty > 0) med.qty += qty;
    if (price > 0) med.price = price;
    if (expiry) med.expiryDate = expiry;
    saveData();
    renderInventory();
    document.getElementById('stockModal').style.display = 'none';
    showToast('\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0628\u0646\u062C\u0627\u062D', 'success');
});

function renderCustomers() {
    var search = (document.getElementById('customerSearch').value || '').trim().toLowerCase();
    var customers = appData.customers.slice();
    if (search) {
        customers = customers.filter(function(c) {
            return c.name.toLowerCase().includes(search) || c.phone.includes(search);
        });
    }
    var tbody = document.getElementById('customersBody');
    tbody.innerHTML = '';
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center empty-state"><div class="empty-state-icon">\uD83D\uDC65</div><div class="empty-state-text">\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621</div></td></tr>';
        return;
    }
    customers.forEach(function(c) {
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + c.id + '</td>\n            <td><strong>' + c.name + '</strong></td>\n            <td>' + c.phone + '</td>\n            <td>' + formatPrice(c.totalSpent || 0) + ' \u062C.\u0645</td>\n            <td>' + (c.points || 0) + '</td>\n            <td>' + (c.lastPurchase ? formatDate(c.lastPurchase) : '-') + '</td>\n            <td class="customer-actions">\n                <button class="btn btn-sm btn-info" onclick="viewCustomer(' + c.id + ')">\u0639\u0631\u0636</button>\n                <button class="btn btn-sm btn-primary" onclick="editCustomer(' + c.id + ')">\u062A\u0639\u062F\u064A\u0644</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(' + c.id + ')">\u062D\u0630\u0641</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

document.getElementById('customerSearch').addEventListener('input', renderCustomers);

document.getElementById('addCustomerBtn').addEventListener('click', function() {
    document.getElementById('customerEditId').value = '';
    document.getElementById('customerModalTitle').textContent = '\u0625\u0636\u0627\u0641\u0629 \u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F';
    document.getElementById('customerNameInput').value = '';
    document.getElementById('customerPhoneInput').value = '';
    document.getElementById('customerEmailInput').value = '';
    document.getElementById('customerNotesInput').value = '';
    document.getElementById('customerModal').style.display = 'block';
});

document.getElementById('saveCustomerBtn').addEventListener('click', function() {
    var editId = document.getElementById('customerEditId').value;
    var name = sanitize(document.getElementById('customerNameInput').value.trim());
    var phone = sanitize(document.getElementById('customerPhoneInput').value.trim());
    var email = sanitize(document.getElementById('customerEmailInput').value.trim());
    var notes = sanitize(document.getElementById('customerNotesInput').value.trim());
    if (!name || !phone) {
        showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641', 'error');
        return;
    }
    if (editId) {
        var c = appData.customers.find(function(cx) { return cx.id === parseInt(editId); });
        if (c) {
            c.name = name;
            c.phone = phone;
            c.email = email;
            c.notes = notes;
        }
        showToast('\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0644', 'success');
    } else {
        var maxId = appData.customers.reduce(function(max, cx) { return Math.max(max, cx.id); }, 0);
        appData.customers.push({
            id: maxId + 1,
            name: name,
            phone: phone,
            email: email,
            notes: notes,
            points: 0,
            totalSpent: 0,
            lastPurchase: null,
            createdAt: new Date().toISOString()
        });
        showToast('\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0639\u0645\u064A\u0644 \u0628\u0646\u062C\u0627\u062D', 'success');
    }
    saveData();
    renderCustomers();
    loadCustomerSelect();
    document.getElementById('customerModal').style.display = 'none';
});

function viewCustomer(id) {
    var c = appData.customers.find(function(cx) { return cx.id === id; });
    if (!c) return;
    var invoices = appData.invoices.filter(function(inv) { return inv.customerId === id; });
    var invoicesHtml = '';
    if (invoices.length === 0) {
        invoicesHtml = '<tr><td colspan="5" class="text-center empty-state">\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0634\u062A\u0631\u064A\u0627\u062A \u0633\u0627\u0628\u0642\u0629</td></tr>';
    } else {
        invoices.slice().reverse().forEach(function(inv) {
            invoicesHtml += '<tr><td>#' + inv.id + '</td><td>' + formatDate(inv.date) + '</td><td>' + inv.items.length + '</td><td>' + formatPrice(inv.net) + ' \u062C.\u0645</td><td><span class="badge badge-success">\u0645\u0643\u062A\u0645\u0644\u0629</span></td></tr>';
        });
    }
    var content = document.getElementById('customerDetailContent');
    content.innerHTML = '\n        <div class="customer-detail-card">\n            <div class="customer-detail-header">\n                <div>\n                    <div class="customer-detail-name">' + c.name + '</div>\n                    <div class="customer-detail-phone">' + c.phone + (c.email ? ' | ' + c.email : '') + '</div>\n                </div>\n                <button class="btn btn-sm btn-primary" onclick="editCustomer(' + c.id + '); document.getElementById(\'customerDetailModal\').style.display=\'none\';">\u062A\u0639\u062F\u064A\u0644</button>\n            </div>\n            <div class="customer-detail-stats">\n                <div class="customer-stat"><span class="customer-stat-value">' + formatPrice(c.totalSpent || 0) + ' \u062C.\u0645</span><span class="customer-stat-label">\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A</span></div>\n                <div class="customer-stat"><span class="customer-stat-value">' + (c.points || 0) + '</span><span class="customer-stat-label">\u0646\u0642\u0627\u0637</span></div>\n                <div class="customer-stat"><span class="customer-stat-value">' + invoices.length + '</span><span class="customer-stat-label">\u0639\u062F\u062F \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631</span></div>\n            </div>\n            <h4 style="margin-bottom:10px;font-size:14px;color:var(--text-light);">\u0633\u062C\u0644 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A</h4>\n            <div class="table-responsive">\n                <table class="table">\n                    <thead><tr><th>\u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629</th><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0639\u062F\u062F \u0627\u0644\u0623\u0635\u0646\u0627\u0641</th><th>\u0627\u0644\u0645\u0628\u0644\u063A</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th></tr></thead>\n                    <tbody>' + invoicesHtml + '</tbody>\n                </table>\n            </div>\n        </div>\n    ';
    document.getElementById('customerDetailModal').style.display = 'block';
}

function editCustomer(id) {
    var c = appData.customers.find(function(cx) { return cx.id === id; });
    if (!c) return;
    document.getElementById('customerEditId').value = id;
    document.getElementById('customerModalTitle').textContent = '\u062A\u0639\u062F\u064A\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0644';
    document.getElementById('customerNameInput').value = c.name;
    document.getElementById('customerPhoneInput').value = c.phone;
    document.getElementById('customerEmailInput').value = c.email || '';
    document.getElementById('customerNotesInput').value = c.notes || '';
    document.getElementById('customerModal').style.display = 'block';
}

function deleteCustomer(id) {
    if (!confirm('\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0639\u0645\u064A\u0644\u061F')) return;
    appData.customers = appData.customers.filter(function(c) { return c.id !== id; });
    saveData();
    renderCustomers();
    loadCustomerSelect();
    showToast('\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0639\u0645\u064A\u0644', 'info');
}

var generatedOtp = '';
var generatedOtpRef = '';
var TARGET_PHONE = '01003677165';

function selectPlan(type, amount) {
    selectedPlan = { type: type, amount: amount };
    document.getElementById('subTypeDisplay').textContent = type === '\u0634\u0647\u0631\u064A' ? '\u0627\u0634\u062A\u0631\u0627\u0643 \u0634\u0647\u0631\u064A' : '\u0627\u0634\u062A\u0631\u0627\u0643 \u0633\u0646\u0648\u064A';
    document.getElementById('subAmountDisplay').textContent = amount + ' \u062C.\u0645';
    document.getElementById('subStep1').style.display = 'block';
    document.getElementById('subStep2').style.display = 'none';
    document.getElementById('subStep3').style.display = 'none';
    document.getElementById('walletPhone').value = '';
    document.getElementById('otpError').style.display = 'none';
    document.getElementById('subModal').style.display = 'block';
}

document.getElementById('sendOtpBtn').addEventListener('click', function() {
    var phone = document.getElementById('walletPhone').value.trim();
    if (!phone || phone.length < 10) {
        showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0635\u062D\u064A\u062D', 'error');
        return;
    }
    showToast('\u062C\u0627\u0631\u064A \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F...', 'info');
    document.getElementById('displayPhone').textContent = phone;
    fetch('/api/sms/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone })
    }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.success) {
            generatedOtpRef = data.reference;
            document.getElementById('subStep1').style.display = 'none';
            document.getElementById('subStep2').style.display = 'block';
            document.getElementById('subStep3').style.display = 'none';
            document.querySelectorAll('.otp-box').forEach(function(inp) { inp.value = ''; });
            document.getElementById('otpError').style.display = 'none';
            if (data.devOtp) {
                showToast('\u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F: ' + data.devOtp, 'warning');
            } else {
                showToast('\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0625\u0644\u0649 ' + phone, 'success');
            }
        } else {
            showToast('\u0641\u0634\u0644 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F: ' + (data.message || '\u062E\u0637\u0623 \u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0641'), 'error');
        }
    }).catch(function() {
        generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
        document.getElementById('subStep1').style.display = 'none';
        document.getElementById('subStep2').style.display = 'block';
        document.getElementById('subStep3').style.display = 'none';
        document.querySelectorAll('.otp-box').forEach(function(inp) { inp.value = ''; });
        document.getElementById('otpError').style.display = 'none';
        showToast('\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0639\u0644\u0649 ' + phone + '\n\u0627\u0644\u0631\u0645\u0632: ' + generatedOtp, 'info');
    });
});

document.querySelectorAll('.otp-box').forEach(function(inp, idx) {
    inp.addEventListener('input', function() {
        if (this.value && idx < 5) {
            document.querySelector('.otp-box[data-idx="' + (idx + 1) + '"]').focus();
        }
    });
    inp.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value && idx > 0) {
            document.querySelector('.otp-box[data-idx="' + (idx - 1) + '"]').focus();
        }
    });
});

document.getElementById('confirmOtpBtn').addEventListener('click', function() {
    var entered = '';
    document.querySelectorAll('.otp-box').forEach(function(inp) { entered += inp.value; });
    if (entered.length < 6) {
        document.getElementById('otpError').textContent = '\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u0643\u0648\u0646 \u0645\u0646 6 \u0623\u0631\u0642\u0627\u0645';
        document.getElementById('otpError').style.display = 'block';
        return;
    }
    var phone = document.getElementById('displayPhone').textContent;
    fetch('/api/sms/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone, otp: entered, reference: generatedOtpRef })
    }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.valid) {
            document.getElementById('otpError').style.display = 'none';
            showToast('\u062C\u0627\u0631\u064A \u0645\u0639\u0627\u0644\u062C\u0629 \u0627\u0644\u062F\u0641\u0639...', 'info');
            fetch('/api/payments/wallet-pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: phone,
                    amount: selectedPlan.amount,
                    description: selectedPlan.type === '\u0634\u0647\u0631\u064A' ? '\u0627\u0634\u062A\u0631\u0627\u0643 \u0634\u0647\u0631\u064A ValoPOS' : '\u0627\u0634\u062A\u0631\u0627\u0643 \u0633\u0646\u0648\u064A ValoPOS',
                    customerName: appData.settings.pharmacyName
                })
            }).then(function(r) { return r.json(); }).then(function(payData) {
                completeSubscription(phone, payData);
            }).catch(function() {
                completeSubscription(phone, { status: 'completed', reference: 'local-' + Date.now() });
            });
        } else {
            document.getElementById('otpError').textContent = '\u0631\u0645\u0632 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649';
            document.getElementById('otpError').style.display = 'block';
        }
    }).catch(function() {
        if (entered !== generatedOtp) {
            document.getElementById('otpError').textContent = '\u0631\u0645\u0632 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u060C \u062D\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649';
            document.getElementById('otpError').style.display = 'block';
            return;
        }
        document.getElementById('otpError').style.display = 'none';
        completeSubscription(phone, { status: 'completed', reference: 'local-' + Date.now() });
    });
});

function completeSubscription(phone, payData) {
    var sub = {
        id: appData.subscriptions.length + 1,
        type: selectedPlan.type,
        amount: selectedPlan.amount,
        walletPhone: phone,
        transferredTo: TARGET_PHONE,
        paymentRef: payData.reference || '',
        startDate: new Date().toISOString(),
        endDate: selectedPlan.type === '\u0634\u0647\u0631\u064A'
            ? new Date(Date.now() + 30*24*60*60*1000).toISOString()
            : new Date(Date.now() + 365*24*60*60*1000).toISOString(),
        paymentMethod: '\u0645\u062D\u0641\u0638\u0629 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629',
        status: '\u0646\u0634\u0637',
        date: new Date().toISOString()
    };
    appData.subscriptions.push(sub);
    saveData();
    renderSubsHistory();
    renderDashboard();
    document.getElementById('subStep1').style.display = 'none';
    document.getElementById('subStep2').style.display = 'none';
    document.getElementById('subStep3').style.display = 'block';
    document.getElementById('successType').textContent = selectedPlan.type === '\u0634\u0647\u0631\u064A' ? '\u0627\u0634\u062A\u0631\u0627\u0643 \u0634\u0647\u0631\u064A (500 \u062C.\u0645)' : '\u0627\u0634\u062A\u0631\u0627\u0643 \u0633\u0646\u0648\u064A (5000 \u062C.\u0645)';
    document.getElementById('successAmount').textContent = selectedPlan.amount + ' \u062C.\u0645';
    document.getElementById('successPhone').textContent = phone;
    document.getElementById('successDate').textContent = formatDate(new Date().toISOString());
    if (payData.status === 'completed') {
        showToast('\u062A\u0645 \u0627\u0644\u062F\u0641\u0639 \u0628\u0646\u062C\u0627\u062D!', 'success');
    } else {
        showToast('\u062A\u0645 \u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643 \u0648\u0644\u0643\u0646 \u0641\u0634\u0644 \u0627\u0644\u062F\u0641\u0639\u060C \u064A\u0631\u062C\u0649 \u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0625\u062F\u0627\u0631\u0629', 'warning');
    }
}

document.getElementById('resendOtpBtn').addEventListener('click', function() {
    var phone = document.getElementById('displayPhone').textContent;
    document.querySelectorAll('.otp-box').forEach(function(inp) { inp.value = ''; });
    document.getElementById('otpError').style.display = 'none';
    fetch('/api/sms/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone, reference: generatedOtpRef })
    }).then(function(r) { return r.json(); }).then(function(data) {
        if (data.success) {
            generatedOtpRef = data.reference;
            document.querySelectorAll('.otp-box').forEach(function(inp) { inp.value = ''; });
            document.getElementById('otpError').style.display = 'none';
            if (data.devOtp) {
                showToast('\u062A\u0645 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644 - \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F: ' + data.devOtp, 'warning');
            } else {
                showToast('\u062A\u0645 \u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0625\u0644\u0649 ' + phone, 'success');
            }
        } else {
            showToast('\u0641\u0634\u0644 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0625\u0631\u0633\u0627\u0644', 'error');
        }
    }).catch(function() {
        generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
        showToast('\u062A\u0645 \u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644 \u0631\u0645\u0632 \u0627\u0644\u062A\u0623\u0643\u064A\u062F \u0625\u0644\u0649 ' + phone + '\n\u0627\u0644\u0631\u0645\u0632: ' + generatedOtp, 'info');
    });
});

document.getElementById('closeSuccessBtn').addEventListener('click', function() {
    document.getElementById('subModal').style.display = 'none';
});

function renderSubsHistory() {
    var tbody = document.getElementById('subsHistoryBody');
    if (appData.subscriptions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state">\u0644\u0627 \u062A\u0648\u062C\u062F \u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    appData.subscriptions.forEach(function(s) {
        var isActive = new Date(s.endDate) > new Date();
        var badge = isActive ? 'badge-success' : 'badge-danger';
        var statusText = isActive ? '\u0646\u0634\u0637' : '\u0645\u0646\u062A\u0647\u064A';
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + (s.type === '\u0634\u0647\u0631\u064A' ? '\u0634\u0647\u0631\u064A' : '\u0633\u0646\u0648\u064A') + '</td>\n            <td>' + s.amount + ' \u062C.\u0645</td>\n            <td>' + formatDate(s.startDate) + '</td>\n            <td>' + formatDate(s.endDate) + '</td>\n            <td><span class="badge ' + badge + '">' + statusText + '</span></td>\n        ';
        tbody.appendChild(tr);
    });
}

function updateSubBadge() {
    var badge = document.getElementById('subBadge');
    var active = appData.subscriptions.some(function(s) { return new Date(s.endDate) > new Date(); });
    if (active) {
        badge.innerHTML = '<span class="badge-dot"></span><span>\u0627\u0634\u062A\u0631\u0627\u0643 \u0646\u0634\u0637</span>';
    } else {
        badge.innerHTML = '<span class="badge-dot" style="background:var(--danger)"></span><span>\u0644\u0627 \u064A\u0648\u062C\u062F \u0627\u0634\u062A\u0631\u0627\u0643</span>';
    }
}

function renderDashboard() {
    var todaySales = appData.invoices
        .filter(function(inv) { return isToday(inv.date); })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var monthlySales = appData.invoices
        .filter(function(inv) { return isThisMonth(inv.date); })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var lowStock = medicinesDB.filter(function(m) { return m.qty > 0 && m.qty <= 10; }).length;
    var outOfStock = medicinesDB.filter(function(m) { return m.qty <= 0; }).length;
    var activeSubs = appData.subscriptions.filter(function(s) { return new Date(s.endDate) > new Date(); }).length;
    var expiringMeds = medicinesDB.filter(function(m) {
        var days = getExpiryDays(m.expiryDate);
        return days !== null && days >= 0 && days <= 30;
    }).length;

    document.getElementById('todaySales').textContent = formatPrice(todaySales) + ' \u062C.\u0645';
    document.getElementById('totalMeds').textContent = medicinesDB.length;
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('outOfStock').textContent = outOfStock;
    document.getElementById('monthlySales').textContent = formatPrice(monthlySales) + ' \u062C.\u0645';
    document.getElementById('activeSubs').textContent = activeSubs;
    document.getElementById('expiringMedsCount').textContent = expiringMeds;

    var tbody = document.getElementById('recentSalesBody');
    var recent = appData.invoices.slice().reverse().slice(0, 10);
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center empty-state"><div class="empty-state-icon">\uD83D\uDCB0</div><div class="empty-state-text">\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0628\u064A\u0639\u0627\u062A \u0628\u0639\u062F</div></td></tr>';
    } else {
        tbody.innerHTML = '';
        recent.forEach(function(inv) {
            var tr2 = document.createElement('tr');
            tr2.innerHTML = '\n                <td>#' + inv.id + '</td>\n                <td>' + formatPrice(inv.net) + ' \u062C.\u0645</td>\n                <td>' + formatDate(inv.date) + '</td>\n                <td><span class="badge badge-success">\u0645\u0643\u062A\u0645\u0644\u0629</span></td>\n            ';
            tbody.appendChild(tr2);
        });
    }

    var medCounts = {};
    appData.invoices.forEach(function(inv) {
        inv.items.forEach(function(item) {
            medCounts[item.name] = (medCounts[item.name] || 0) + item.qty;
        });
    });
    var topMeds = Object.entries(medCounts).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
    var list = document.getElementById('topMedsList');
    if (topMeds.length === 0) {
        list.innerHTML = '<li class="text-center empty-state" style="padding:10px"><div class="empty-state-text">\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0639\u062F</div></li>';
    } else {
        list.innerHTML = '';
        topMeds.forEach(function(entry) {
            var name = entry[0], count = entry[1];
            list.innerHTML += '<li><span>' + name + '</span><span style="color:var(--primary);font-weight:700;">' + count + '</span></li>';
        });
    }

    var expiryTbody = document.getElementById('expiryAlertBody');
    var expiryMeds = medicinesDB.filter(function(m) {
        var days = getExpiryDays(m.expiryDate);
        return days !== null && days >= 0 && days <= 30;
    }).sort(function(a, b) { return getExpiryDays(a.expiryDate) - getExpiryDays(b.expiryDate); });
    var expiryCount = document.getElementById('expiryAlertCount');
    if (expiryCount) expiryCount.textContent = expiryMeds.length;
    if (expiryTbody) {
        if (expiryMeds.length === 0) {
            expiryTbody.innerHTML = '<tr><td colspan="4" class="text-center empty-state">\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u062F\u0648\u064A\u0629 \u0642\u0631\u0628 \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621</td></tr>';
        } else {
            expiryTbody.innerHTML = '';
            expiryMeds.forEach(function(m) {
                var days = getExpiryDays(m.expiryDate);
                var tr3 = document.createElement('tr');
                tr3.innerHTML = '\n                    <td><strong>' + m.name + '</strong></td>\n                    <td>' + formatDateShort(m.expiryDate) + '</td>\n                    <td><span class="expiry-badge ' + (days <= 0 ? 'red' : 'yellow') + '">' + days + ' \u064A\u0648\u0645</span></td>\n                    <td>' + m.qty + '</td>\n                ';
                expiryTbody.appendChild(tr3);
            });
        }
    }

    updateSubBadge();
}

function renderReports() {
    var todaySales = appData.invoices
        .filter(function(inv) { return isToday(inv.date); })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var todayCount = appData.invoices.filter(function(inv) { return isToday(inv.date); }).length;
    var monthSales = appData.invoices
        .filter(function(inv) { return isThisMonth(inv.date); })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var monthCount = appData.invoices.filter(function(inv) { return isThisMonth(inv.date); }).length;
    var totalSales = appData.invoices.reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var totalCount = appData.invoices.length;

    document.getElementById('reportTodaySales').textContent = formatPrice(todaySales) + ' \u062C.\u0645';
    document.getElementById('reportTodayCount').textContent = todayCount;
    document.getElementById('reportMonthSales').textContent = formatPrice(monthSales) + ' \u062C.\u0645';
    document.getElementById('reportMonthCount').textContent = monthCount;
    document.getElementById('reportTotalSales').textContent = formatPrice(totalSales) + ' \u062C.\u0645';
    document.getElementById('reportTotalCount').textContent = totalCount;

    var tbody = document.getElementById('allInvoicesBody');
    if (appData.invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    appData.invoices.slice().reverse().forEach(function(inv) {
        var tr3 = document.createElement('tr');
        tr3.innerHTML = '\n            <td>#' + inv.id + '</td>\n            <td>' + formatDate(inv.date) + '</td>\n            <td>' + inv.items.length + '</td>\n            <td>' + formatPrice(inv.subtotal) + ' \u062C.\u0645</td>\n            <td>' + formatPrice(inv.discount) + ' \u062C.\u0645</td>\n            <td><strong>' + formatPrice(inv.net) + ' \u062C.\u0645</strong></td>\n        ';
        tbody.appendChild(tr3);
    });
}

function loadSettings() {
    var s = appData.settings;
    document.getElementById('pharmacyName').value = s.pharmacyName || 'ValoPOS';
    document.getElementById('pharmacyAddress').value = s.address || '';
    document.getElementById('pharmacyPhone').value = s.phone || '';
}

function saveSettings() {
    appData.settings.pharmacyName = document.getElementById('pharmacyName').value;
    appData.settings.address = document.getElementById('pharmacyAddress').value;
    appData.settings.phone = document.getElementById('pharmacyPhone').value;
    saveData();
    showToast('\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0628\u0646\u062C\u0627\u062D', 'success');
}

function resetData() {
    if (confirm('\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F\u061F \u0633\u064A\u062A\u0645 \u0645\u0633\u062D \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A.')) {
        if (confirm('\u062A\u0623\u0643\u064A\u062F \u0646\u0647\u0627\u0626\u064A\u061F \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639!')) {
            localStorage.removeItem('pharmacy_pos_data');
            appData = {
                cart: [], invoices: [], subscriptions: [], customers: [],
                settings: { pharmacyName: 'ValoPOS', address: '', phone: '' },
                nextInvoiceId: 1, stockChanges: []
            };
            saveData();
            renderDashboard();
            renderInventory();
            renderSubsHistory();
            renderReports();
            renderCustomers();
            showToast('\u062A\u0645 \u0645\u0633\u062D \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A', 'info');
        }
    }
}

function exportData() {
    var dataStr = JSON.stringify(appData, null, 2);
    var blob = new Blob([dataStr], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'pharmacy_backup_' + todayStr() + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(ev) {
            try {
                var data = JSON.parse(ev.target.result);
                appData = { ...appData, ...data };
                saveData();
                renderDashboard();
                renderInventory();
                renderReports();
                renderCustomers();
                showToast('\u062A\u0645 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u062C\u0627\u062D', 'success');
            } catch (err) {
                showToast('\u062E\u0637\u0623 \u0641\u064A \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0645\u0644\u0641', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

document.querySelectorAll('.modal-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

document.getElementById('exportBtn').addEventListener('click', exportData);

loadData();
loadCategories();
loadSettings();
renderMedsGrid();
renderCart();
renderDashboard();
renderInventory();
renderSubsHistory();
renderReports();
renderCustomers();
updateSubBadge();
loadCustomerSelect();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function(err) {
        console.log('SW registration failed:', err);
    });
}
