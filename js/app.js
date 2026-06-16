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
    customers: [],
    suppliers: [],
    purchases: [],
    settings: {
        pharmacyName: 'ValoPOS',
        address: '',
        phone: '',
        receiptFooter: 'شكراً لتعاملكم معنا',
        taxRate: 0,
        currency: 'ج.م'
    },
    nextInvoiceId: 1,
    nextPurchaseId: 1,
    stockChanges: []
};

function loadData() {
    var saved = localStorage.getItem('pharmacy_pos_data');
    if (saved) {
        try {
            var parsed = JSON.parse(saved);
            appData = { ...appData, ...parsed };
            appData.settings = { ...appData.settings, ...parsed.settings };
        } catch (e) {
            console.error('Error loading data');
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
    toast.innerHTML = (icons[type] || '') + ' ' + sanitize(message);
    container.appendChild(toast);
    setTimeout(function() {
        toast.classList.add('toast-remove');
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

function highlightText(text, query) {
    if (!query) return sanitize(text);
    var escaped = query.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
    var re = new RegExp('(' + escaped + ')', 'gi');
    return sanitize(text).replace(re, '<mark>$1</mark>');
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

function getStockStatus(med) {
    if (med.qty <= 0) return 'نفذ';
    if (med.qty <= 10) return 'منخفض';
    return 'متوفر';
}

function getMedicineById(id) {
    return medicinesDB.find(function(m) { return m.id === parseInt(id); });
}

function searchMedicines(query) {
    var q = query.toLowerCase().trim();
    if (!q) return medicinesDB;
    return medicinesDB.filter(function(m) {
        return m.name.toLowerCase().includes(q) ||
               (m.scientificName && m.scientificName.toLowerCase().includes(q)) ||
               (m.barcode && m.barcode.includes(q)) ||
               (m.category && m.category.toLowerCase().includes(q));
    });
}

function getCategories() {
    var cats = [];
    medicinesDB.forEach(function(m) {
        if (cats.indexOf(m.category) === -1) cats.push(m.category);
    });
    return cats.sort();
}

// ===== NAVIGATION =====

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
        if (pageId === 'customers') renderCustomers();
        if (pageId === 'suppliers') renderSuppliers();
        if (pageId === 'purchases') { renderPurchases(); loadPurchaseSelects(); }
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

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'F1' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.querySelector('[data-page="pos"]').click();
        document.getElementById('posSearch').focus();
        return;
    }
    if (e.key === 'F2' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        appData.cart = [];
        saveData();
        renderCart();
        document.getElementById('discountInput').value = 0;
        document.getElementById('paidInput').value = '';
        showToast('فاتورة جديدة', 'info');
        return;
    }
    if (e.key === 'F8' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.getElementById('checkoutBtn').click();
        return;
    }
    var posPage = document.getElementById('page-pos');
    if (posPage && posPage.classList.contains('active') && appData.cart.length > 0) {
        if (e.key === 'Escape') {
            e.preventDefault();
            document.getElementById('searchSuggestions').classList.remove('active');
            document.getElementById('posSearch').blur();
            return;
        }
    }
});

// ===== GLOBAL SEARCH =====
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

// ===== POS PAGE =====

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
        var expiryStatus = getExpiryStatus(m.expiryDate);
        var extraClass = m.qty <= 0 ? ' out-of-stock' : '';
        if (expiryStatus === 'expired' && m.qty > 0) extraClass += ' expired';
        else if (expiryStatus === 'soon' && m.qty > 0) extraClass += ' expiring';
        div.className = 'med-item' + extraClass;
        div.innerHTML = '\n            <span class="med-name">' + sanitize(m.name) + '</span>\n            <span class="med-price">' + formatPrice(m.price) + ' ' + appData.settings.currency + '</span>\n            <span class="med-stock">\u0627\u0644\u0645\u062E\u0632\u0648\u0646: ' + m.qty + '</span>\n        ';
        if (m.qty > 0 && expiryStatus !== 'expired') {
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
        if (barcodeMatch) {
            if (barcodeMatch.qty > 0) {
                addToCart(barcodeMatch);
                showToast('\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 ' + sanitize(barcodeMatch.name) + ' \u0639\u0646 \u0637\u0631\u064A\u0642 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F', 'success');
                input.value = '';
                suggestions.classList.remove('active');
                renderMedsGrid();
                return;
            } else {
                showToast(sanitize(barcodeMatch.name) + ' \u0646\u0641\u0630 \u0645\u0646 \u0627\u0644\u0645\u062E\u0632\u0648\u0646', 'warning');
                input.value = '';
                suggestions.classList.remove('active');
                renderMedsGrid();
                return;
            }
        }
    }
    var results = searchMedicines(q);
    renderMedsGrid(q);
    if (results.length > 0) {
        suggestions.innerHTML = '';
        results.slice(0, 8).forEach(function(m) {
            var item = document.createElement('div');
            item.className = 'search-suggestion-item';
            item.innerHTML = '\n                <div class="search-suggestion-info">\n                    <span class="search-suggestion-name">' + highlightText(m.name, q) + '</span>\n                    <span class="search-suggestion-sub">' + highlightText(m.scientificName, q) + ' | ' + highlightText(m.category, q) + '</span>\n                </div>\n                <div style="text-align:left;">\n                    <div class="search-suggestion-price">' + formatPrice(m.price) + ' ' + appData.settings.currency + '</div>\n                    <div class="search-suggestion-stock">\u0627\u0644\u0645\u062E\u0632\u0648\u0646: ' + m.qty + '</div>\n                </div>\n            ';
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

document.getElementById('posSearch').addEventListener('input', function() {
    var val = this.value.trim();
    if (val && /^\d+$/.test(val)) {
        doSearch();
    } else {
        debouncedSearch();
    }
});

document.getElementById('posSearch').addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('searchSuggestions').classList.remove('active');
    }
    if (e.key === 'Enter') {
        var q = this.value.trim();
        if (/^\d+$/.test(q)) {
            var bm = medicinesDB.find(function(m) { return m.barcode && m.barcode === q; });
            if (bm) {
                if (bm.qty > 0) {
                    addToCart(bm);
                    showToast('\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 ' + sanitize(bm.name) + ' \u0639\u0646 \u0637\u0631\u064A\u0642 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F', 'success');
                } else {
                    showToast(sanitize(bm.name) + ' \u0646\u0641\u0630 \u0645\u0646 \u0627\u0644\u0645\u062E\u0632\u0648\u0646', 'warning');
                }
                this.value = '';
                document.getElementById('searchSuggestions').classList.remove('active');
                renderMedsGrid();
            }
        }
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
        var html = '<option value="\u0627\u0644\u0643\u0644">\u0643\u0644 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A</option>';
        cats.forEach(function(c) {
            html += '<option value="' + sanitize(c) + '">' + sanitize(c) + '</option>';
        });
        sel.innerHTML = html;
    });
}

// ===== CART =====

function addToCart(med) {
    var existing = appData.cart.find(function(item) { return item.id === med.id; });
    if (existing) {
        if (existing.qty < med.qty) existing.qty++;
        else { showToast('\u0643\u0645\u064A\u0629 ' + sanitize(med.name) + ' \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631\u0629 \u0628\u0627\u0644\u0645\u062E\u0632\u0648\u0646', 'warning'); return; }
    } else {
        appData.cart.push({ id: med.id, name: med.name, price: med.price, qty: 1, maxQty: med.qty });
    }
    saveData();
    renderCart();
    animateCartCount();
}

function animateCartCount() {
    var el = document.getElementById('cartCount');
    if (!el) return;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
}

function renderCart() {
    var container = document.getElementById('cartItems');
    var count = document.getElementById('cartCount');
    count.textContent = appData.cart.length;
    if (appData.cart.length === 0) {
        container.innerHTML = '<p class="text-center empty-cart">\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0635\u0646\u0627\u0641 \u0641\u064A \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629</p>';
        updateCartSummary();
        return;
    }
    container.innerHTML = '';
    appData.cart.forEach(function(item, idx) {
        var div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = '\n            <div class="cart-item-info">\n                <span class="cart-item-name">' + sanitize(item.name) + '</span>\n                <span class="cart-item-sub">' + formatPrice(item.price) + ' ' + appData.settings.currency + ' \u00D7 ' + item.qty + '</span>\n            </div>\n            <div class="cart-item-actions">\n                <input type="number" class="cart-item-qty" value="' + item.qty + '" min="1" max="' + item.maxQty + '" data-index="' + idx + '">\n                <span class="cart-item-remove" data-index="' + idx + '">&times;</span>\n            </div>\n        ';
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
}

function updateCartSummary() {
    var subtotal = appData.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
    var discount = parseFloat(document.getElementById('discountInput').value) || 0;
    var taxRate = parseFloat(appData.settings.taxRate) || 0;
    var tax = subtotal * taxRate / 100;
    var net = Math.max(0, subtotal - discount + tax);
    var paid = parseFloat(document.getElementById('paidInput').value) || 0;
    var change = Math.max(0, paid - net);
    document.getElementById('cartTotal').textContent = formatPrice(subtotal) + ' ' + appData.settings.currency;
    document.getElementById('cartNet').textContent = formatPrice(net) + ' ' + appData.settings.currency;
    document.getElementById('cartChange').textContent = formatPrice(change) + ' ' + appData.settings.currency;
}

document.getElementById('discountInput').addEventListener('input', updateCartSummary);
document.getElementById('paidInput').addEventListener('input', updateCartSummary);

function loadCustomerSelect() {
    var sel = document.getElementById('cartCustomer');
    if (!sel) return;
    var currentVal = sel.value;
    var html = '<option value="">\u0628\u062F\u0648\u0646 \u0639\u0645\u064A\u0644</option>';
    appData.customers.forEach(function(c) {
        html += '<option value="' + c.id + '">' + sanitize(c.name) + ' - ' + sanitize(c.phone) + '</option>';
    });
    sel.innerHTML = html;
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

// ===== CONFIRM SALE =====
document.getElementById('checkoutBtn').addEventListener('click', function() {
    if (appData.cart.length === 0) {
        showToast('\u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0641\u0627\u0631\u063A\u0629! \u0623\u0636\u0641 \u0623\u0635\u0646\u0627\u0641\u0627\u064B \u0623\u0648\u0644\u0627\u064B.', 'error');
        return;
    }
    var subtotal = appData.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
    var discount = parseFloat(document.getElementById('discountInput').value) || 0;
    var taxRate = parseFloat(appData.settings.taxRate) || 0;
    var tax = subtotal * taxRate / 100;
    var net = Math.max(0, subtotal - discount + tax);
    var paid = parseFloat(document.getElementById('paidInput').value) || 0;
    if (paid < net) {
        showToast('\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u0635\u0627\u0641\u064A!', 'error');
        return;
    }
    var content = document.getElementById('confirmSaleContent');
    var itemsHtml = '';
    appData.cart.forEach(function(item) {
        itemsHtml += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;border-bottom:1px solid var(--border-light);"><span>' + sanitize(item.name) + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + ' ' + appData.settings.currency + '</span></div>';
    });
    content.innerHTML = '\n        <div style="margin-bottom:12px;">' + itemsHtml + '</div>\n        <div style="border-top:2px solid var(--primary);padding-top:8px;">\n            <div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(subtotal) + ' ' + appData.settings.currency + '</span></div>\n            <div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(discount) + ' ' + appData.settings.currency + '</span></div>\n            ' + (taxRate > 0 ? '<div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629 (' + taxRate + '%)</span><span>' + formatPrice(tax) + ' ' + appData.settings.currency + '</span></div>' : '') + '\n            <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;margin-top:6px;"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(net) + ' ' + appData.settings.currency + '</span></div>\n            <div style="display:flex;justify-content:space-between;font-size:15px;color:var(--success);"><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(paid) + ' ' + appData.settings.currency + '</span></div>\n            <div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(paid - net) + ' ' + appData.settings.currency + '</span></div>\n        </div>\n    ';
    document.getElementById('confirmSaleModal').style.display = 'block';
    document.getElementById('confirmSaleYes').onclick = function() {
        document.getElementById('confirmSaleModal').style.display = 'none';
        completeSale(subtotal, discount, tax, net, paid);
    };
});

function completeSale(subtotal, discount, tax, net, paid) {
    var customerSelect = document.getElementById('cartCustomer');
    var customerId = customerSelect ? parseInt(customerSelect.value) || null : null;
    var invoice = {
        id: appData.nextInvoiceId++,
        date: new Date().toISOString(),
        items: appData.cart.map(function(item) { return { ...item }; }),
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        net: net,
        paid: paid,
        change: paid - net,
        customerId: customerId,
        status: 'مكتملة'
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
}

document.getElementById('newSaleBtn').addEventListener('click', function() {
    appData.cart = [];
    saveData();
    renderCart();
    document.getElementById('discountInput').value = 0;
    document.getElementById('paidInput').value = '';
    showToast('\u0641\u0627\u062A\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629', 'info');
});

// ===== RECEIPT =====
function barcodeHTML(code) {
    if (!code) return '';
    var chars = code.split('');
    var bars = '';
    chars.forEach(function(c) {
        var w = 1 + parseInt(c) * 0.5;
        bars += '<span style="display:inline-block;width:' + w + 'px;height:30px;background:#000;margin-left:0.5px;"></span>';
    });
    return '<div class="receipt-barcode"><div style="text-align:center;overflow:hidden;white-space:nowrap;direction:ltr;">' + bars + '</div><div class="receipt-barcode-text">' + sanitize(code) + '</div></div>';
}

function showReceipt(invoice) {
    var content = document.getElementById('receiptContent');
    var itemsHtml = '';
    invoice.items.forEach(function(item) {
        itemsHtml += '<div class="receipt-row"><span>' + sanitize(item.name) + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + '</span></div>';
    });
    var customerName = '';
    if (invoice.customerId) {
        var c = appData.customers.find(function(cx) { return cx.id === invoice.customerId; });
        if (c) customerName = c.name;
    }
    var firstBarcode = '';
    if (invoice.items.length > 0) {
        var firstMed = medicinesDB.find(function(m) { return m.name === invoice.items[0].name; });
        if (firstMed && firstMed.barcode) firstBarcode = barcodeHTML(firstMed.barcode);
    }
    var footer = appData.settings.receiptFooter || '\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0639\u0627\u0645\u0644\u0643\u0645 \u0645\u0639\u0646\u0627';
    var taxRate = parseFloat(appData.settings.taxRate) || 0;
    content.innerHTML = '\n        <div class="receipt">\n            <h3>' + sanitize(appData.settings.pharmacyName || 'ValoPOS') + '</h3>\n            <p>' + sanitize(appData.settings.address || '') + '</p>\n            <p>' + sanitize(appData.settings.phone || '') + '</p>\n            ' + firstBarcode + '\n            <div class="receipt-line"></div>\n            <p>\u0641\u0627\u062A\u0648\u0631\u0629 #' + invoice.id + '</p>\n            <p>' + formatDate(invoice.date) + '</p>\n            ' + (customerName ? '<p class="receipt-customer">\u0627\u0644\u0639\u0645\u064A\u0644: ' + sanitize(customerName) + '</p>' : '') + '\n            <div class="receipt-line"></div>\n            ' + itemsHtml + '\n            <div class="receipt-line"></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(invoice.subtotal) + ' ' + appData.settings.currency + '</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(invoice.discount) + ' ' + appData.settings.currency + '</span></div>\n            ' + (taxRate > 0 ? '<div class="receipt-row"><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629 (' + taxRate + '%)</span><span>' + formatPrice(invoice.tax || 0) + ' ' + appData.settings.currency + '</span></div>' : '') + '\n            <div class="receipt-row receipt-total"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(invoice.net) + ' ' + appData.settings.currency + '</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(invoice.paid) + ' ' + appData.settings.currency + '</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(invoice.change) + ' ' + appData.settings.currency + '</span></div>\n            <div class="receipt-line"></div>\n            <p>' + sanitize(footer) + '</p>\n        </div>\n    ';
    document.getElementById('receiptModal').style.display = 'block';
}

window.addEventListener('afterprint', function() {
    var m = document.getElementById('receiptModal');
    if (m) m.style.display = 'none';
});

document.getElementById('printReceiptBtn').addEventListener('click', function() {
    if (appData.cart.length > 0) {
        var subtotal = appData.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
        var discount = parseFloat(document.getElementById('discountInput').value) || 0;
        var taxRate = parseFloat(appData.settings.taxRate) || 0;
        var tax = subtotal * taxRate / 100;
        var net = Math.max(0, subtotal - discount + tax);
        var paid = parseFloat(document.getElementById('paidInput').value) || 0;
        showReceipt({
            id: appData.nextInvoiceId,
            date: new Date().toISOString(),
            items: appData.cart.map(function(item) { return { ...item }; }),
            subtotal: subtotal,
            discount: discount,
            tax: tax,
            net: net,
            paid: paid,
            change: paid - net
        });
    }
});

// ===== INVENTORY PAGE =====
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
        tr.innerHTML = '\n            <td>' + m.id + '</td>\n            <td><strong class="inline-edit" data-field="name" data-id="' + m.id + '">' + sanitize(m.name) + '</strong></td>\n            <td class="inline-edit" data-field="scientificName" data-id="' + m.id + '">' + sanitize(m.scientificName) + '</td>\n            <td>' + sanitize(m.category) + '</td>\n            <td><strong class="inline-edit" data-field="price" data-id="' + m.id + '">' + formatPrice(m.price) + '</strong></td>\n            <td class="inline-edit" data-field="qty" data-id="' + m.id + '">' + m.qty + '</td>\n            <td><span class="expiry-badge ' + expiryBadge + '">' + expiryDisplay + (expiryDays !== null && expiryDays <= 60 ? ' (' + expiryDays + ' \u064A\u0648\u0645)' : '') + '</span></td>\n            <td><span class="badge ' + statusClass + '">' + statusText + '</span></td>\n            <td>' + (m.rx ? '\u0646\u0639\u0645' : '\u0644\u0627') + '</td>\n            <td><button class="btn btn-sm btn-primary" onclick="editStock(' + m.id + ')">\u062A\u0639\u062F\u064A\u0644</button></td>\n        ';
        tbody.appendChild(tr);
    });
    document.querySelectorAll('.inline-edit').forEach(function(el) {
        el.addEventListener('dblclick', function() {
            if (this.classList.contains('editing')) return;
            var field = this.dataset.field;
            var id = parseInt(this.dataset.id);
            var med = getMedicineById(id);
            if (!med) return;
            var current = med[field] !== undefined ? med[field] : this.textContent.trim();
            this.classList.add('editing');
            var input = document.createElement('input');
            input.type = field === 'price' || field === 'qty' ? 'number' : 'text';
            input.value = current;
            input.step = field === 'price' ? '0.5' : '1';
            input.min = '0';
            this.innerHTML = '';
            this.appendChild(input);
            input.focus();
            input.select();
            function saveInline() {
                var val = field === 'price' || field === 'qty' ? parseFloat(input.value) : input.value.trim();
                if (field === 'qty') val = parseInt(val) || 0;
                if (field === 'price') val = Math.max(0, val);
                if (val !== undefined && val !== '') {
                    med[field] = val;
                    saveData();
                    renderInventory();
                    renderMedsGrid();
                    showToast('\u062A\u0645 \u062A\u062D\u062F\u064A\u062B ' + sanitize(med.name), 'success');
                }
            }
            input.addEventListener('blur', saveInline);
            input.addEventListener('keydown', function(ev) {
                if (ev.key === 'Enter') { saveInline(); }
                if (ev.key === 'Escape') { renderInventory(); }
            });
        });
    });
}

document.getElementById('invSearch').addEventListener('input', renderInventory);
document.getElementById('invCategory').addEventListener('change', renderInventory);
document.getElementById('invStatus').addEventListener('change', renderInventory);

function editStock(id) {
    var med = getMedicineById(id);
    if (!med) return;
    var sel = document.getElementById('stockMedSelect');
    sel.innerHTML = '<option value="' + med.id + '">' + sanitize(med.name) + ' (\u0645\u062E\u0632\u0648\u0646: ' + med.qty + ')</option>';
    document.getElementById('stockQtyInput').value = 10;
    document.getElementById('stockPriceInput').value = med.price;
    document.getElementById('stockExpiryInput').value = med.expiryDate || '';
    document.getElementById('stockModal').style.display = 'block';
}

document.getElementById('addStockBtn').addEventListener('click', function() {
    var sel = document.getElementById('stockMedSelect');
    sel.innerHTML = '';
    medicinesDB.forEach(function(m) {
        sel.innerHTML += '<option value="' + m.id + '">' + sanitize(m.name) + ' (\u0645\u062E\u0632\u0648\u0646: ' + m.qty + ')</option>';
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
    renderMedsGrid();
    document.getElementById('stockModal').style.display = 'none';
    showToast('\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0628\u0646\u062C\u0627\u062D', 'success');
});

// ===== ADD MEDICINE =====
document.getElementById('addMedBtn').addEventListener('click', function() {
    document.getElementById('newMedName').value = '';
    document.getElementById('newMedScientific').value = '';
    document.getElementById('newMedCategory').value = '\u0639\u0627\u0645';
    document.getElementById('newMedPrice').value = '';
    document.getElementById('newMedQty').value = '0';
    document.getElementById('newMedExpiry').value = '';
    document.getElementById('newMedBarcode').value = '';
    document.getElementById('newMedRx').checked = false;
    document.getElementById('addMedModal').style.display = 'block';
});

document.getElementById('saveNewMedBtn').addEventListener('click', function() {
    var name = document.getElementById('newMedName').value.trim();
    var scientific = document.getElementById('newMedScientific').value.trim();
    var category = document.getElementById('newMedCategory').value;
    var price = parseFloat(document.getElementById('newMedPrice').value);
    var qty = parseInt(document.getElementById('newMedQty').value) || 0;
    var expiry = document.getElementById('newMedExpiry').value;
    var barcode = document.getElementById('newMedBarcode').value.trim();
    var rx = document.getElementById('newMedRx').checked;
    if (!name) { showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u062F\u0648\u0627\u0621', 'error'); return; }
    if (!price || price <= 0) { showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0633\u0639\u0631 \u0635\u0627\u0644\u062D', 'error'); return; }
    if (barcode && medicinesDB.some(function(m) { return m.barcode === barcode; })) {
        showToast('\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u0645\u0648\u062C\u0648\u062F \u0645\u0633\u0628\u0642\u0627\u064B', 'error');
        return;
    }
    var maxId = 0;
    medicinesDB.forEach(function(m) { if (m.id > maxId) maxId = m.id; });
    medicinesDB.push({
        id: maxId + 1,
        name: name,
        scientificName: scientific || '-',
        category: category,
        price: price,
        qty: qty,
        expiryDate: expiry || '',
        barcode: barcode,
        rx: rx
    });
    saveData();
    renderInventory();
    renderMedsGrid();
    loadCategories();
    document.getElementById('addMedModal').style.display = 'none';
    showToast('\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 ' + sanitize(name) + ' \u0628\u0646\u062C\u0627\u062D', 'success');
});

// ===== CUSTOMER PAGE =====
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
        tbody.innerHTML = '<tr><td colspan="8" class="text-center empty-state"><div class="empty-state-icon">\uD83D\uDC65</div><div class="empty-state-text">\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621</div></td></tr>';
        return;
    }
    customers.forEach(function(c) {
        var debt = c.debt || 0;
        var debtClass = debt > 0 ? 'positive' : 'zero';
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + c.id + '</td>\n            <td><strong>' + sanitize(c.name) + '</strong></td>\n            <td>' + sanitize(c.phone) + '</td>\n            <td>' + formatPrice(c.totalSpent || 0) + ' ' + appData.settings.currency + '</td>\n            <td>' + (c.points || 0) + '</td>\n            <td><span class="debt-badge ' + debtClass + '">' + formatPrice(debt) + ' ' + appData.settings.currency + '</span></td>\n            <td>' + (c.lastPurchase ? formatDate(c.lastPurchase) : '-') + '</td>\n            <td class="customer-actions">\n                <button class="btn btn-sm btn-info" onclick="viewCustomer(' + c.id + ')">\u0639\u0631\u0636</button>\n                <button class="btn btn-sm btn-primary" onclick="editCustomer(' + c.id + ')">\u062A\u0639\u062F\u064A\u0644</button>\n                <button class="btn btn-sm btn-warning" onclick="addDebtPayment(' + c.id + ')">\u062F\u0641\u0639 \u062F\u064A\u0646</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(' + c.id + ')">\u062D\u0630\u0641</button>\n            </td>\n        ';
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
    var name = document.getElementById('customerNameInput').value.trim();
    var phone = document.getElementById('customerPhoneInput').value.trim();
    var email = document.getElementById('customerEmailInput').value.trim();
    var notes = document.getElementById('customerNotesInput').value.trim();
    if (!name || !phone) {
        showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641', 'error');
        return;
    }
    if (editId) {
        var c = appData.customers.find(function(cx) { return cx.id === parseInt(editId); });
        if (c) { c.name = name; c.phone = phone; c.email = email; c.notes = notes; }
        showToast('\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0644', 'success');
    } else {
        var maxId = appData.customers.reduce(function(max, cx) { return Math.max(max, cx.id); }, 0);
        appData.customers.push({
            id: maxId + 1, name: name, phone: phone, email: email, notes: notes,
            points: 0, totalSpent: 0, debt: 0, lastPurchase: null, createdAt: new Date().toISOString()
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
            invoicesHtml += '<tr><td>#' + inv.id + '</td><td>' + formatDate(inv.date) + '</td><td>' + inv.items.length + '</td><td>' + formatPrice(inv.net) + ' ' + appData.settings.currency + '</td><td><span class="badge badge-success">\u0645\u0643\u062A\u0645\u0644\u0629</span></td></tr>';
        });
    }
    var debt = c.debt || 0;
    var content = document.getElementById('customerDetailContent');
    content.innerHTML = '\n        <div class="customer-detail-card">\n            <div class="customer-detail-header">\n                <div>\n                    <div class="customer-detail-name">' + sanitize(c.name) + '</div>\n                    <div class="customer-detail-phone">' + sanitize(c.phone) + (c.email ? ' | ' + sanitize(c.email) : '') + '</div>\n                </div>\n                <button class="btn btn-sm btn-primary" onclick="editCustomer(' + c.id + '); document.getElementById(\'customerDetailModal\').style.display=\'none\';">\u062A\u0639\u062F\u064A\u0644</button>\n            </div>\n            <div class="customer-detail-stats">\n                <div class="customer-stat"><span class="customer-stat-value">' + formatPrice(c.totalSpent || 0) + ' ' + appData.settings.currency + '</span><span class="customer-stat-label">\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A</span></div>\n                <div class="customer-stat"><span class="customer-stat-value">' + (c.points || 0) + '</span><span class="customer-stat-label">\u0646\u0642\u0627\u0637</span></div>\n                <div class="customer-stat"><span class="customer-stat-value">' + invoices.length + '</span><span class="customer-stat-label">\u0639\u062F\u062F \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631</span></div>\n                <div class="customer-stat"><span class="customer-stat-value" style="color:' + (debt > 0 ? 'var(--danger)' : 'var(--success)') + ';">' + formatPrice(debt) + ' ' + appData.settings.currency + '</span><span class="customer-stat-label">\u0627\u0644\u0645\u062F\u064A\u0648\u0646\u064A\u0629</span></div>\n            </div>\n            <h4 style="margin-bottom:10px;font-size:14px;color:var(--text-light);">\u0633\u062C\u0644 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A</h4>\n            <div class="table-responsive">\n                <table class="table">\n                    <thead><tr><th>\u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629</th><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0639\u062F\u062F \u0627\u0644\u0623\u0635\u0646\u0627\u0641</th><th>\u0627\u0644\u0645\u0628\u0644\u063A</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th></tr></thead>\n                    <tbody>' + invoicesHtml + '</tbody>\n                </table>\n            </div>\n        </div>\n    ';
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

// ===== CUSTOMER DEBT =====
function addDebtPayment(id) {
    var c = appData.customers.find(function(cx) { return cx.id === id; });
    if (!c) return;
    var amount = prompt('\u0627\u0644\u0645\u062F\u064A\u0648\u0646\u064A\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629: ' + formatPrice(c.debt || 0) + '\n\u0623\u062F\u062E\u0644 \u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639:', '0');
    if (amount === null) return;
    var val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0645\u0628\u0644\u063A \u0635\u0627\u0644\u062D', 'error'); return; }
    if (val > (c.debt || 0)) {
        if (!confirm('\u0627\u0644\u0645\u0628\u0644\u063A \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0645\u062F\u064A\u0648\u0646\u064A\u0629. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0633\u062A\u0645\u0631\u0627\u0631\u061F')) return;
    }
    c.debt = Math.max(0, (c.debt || 0) - val);
    if (!appData.debtPayments) appData.debtPayments = [];
    appData.debtPayments.push({ customerId: id, amount: val, date: new Date().toISOString() });
    saveData();
    renderCustomers();
    showToast('\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u0641\u0639 \u0628\u0646\u062C\u0627\u062D: ' + formatPrice(val) + ' ' + appData.settings.currency, 'success');
}

// Allow customer debt on checkout
var origCompleteSale = completeSale;
completeSale = function(subtotal, discount, tax, net, paid) {
    var customerSelect = document.getElementById('cartCustomer');
    var customerId = customerSelect ? parseInt(customerSelect.value) || null : null;
    if (paid < net && customerId) {
        var debtAmount = net - paid;
        if (confirm('\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u0635\u0627\u0641\u064A. \u0647\u0644 \u062A\u0631\u064A\u062F \u062A\u0633\u062C\u064A\u0644 ' + formatPrice(debtAmount) + ' \u0643\u0645\u062F\u064A\u0648\u0646\u064A\u0629 \u0639\u0644\u0649 \u0627\u0644\u0639\u0645\u064A\u0644\u061F')) {
            var c = appData.customers.find(function(cx) { return cx.id === customerId; });
            if (c) {
                c.debt = (c.debt || 0) + debtAmount;
                showToast('\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 ' + formatPrice(debtAmount) + ' \u0643\u0645\u062F\u064A\u0648\u0646\u064A\u0629', 'warning');
            }
        } else {
            showToast('\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u0635\u0627\u0641\u064A!', 'error');
            return;
        }
    } else if (paid < net) {
        showToast('\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u0635\u0627\u0641\u064A! \u0623\u0648 \u0627\u062E\u062A\u0631 \u0639\u0645\u064A\u0644 \u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0645\u062F\u064A\u0648\u0646\u064A\u0629', 'error');
        return;
    }
    origCompleteSale(subtotal, discount, tax, net, paid);
};

// ===== SUPPLIERS PAGE =====
function renderSuppliers() {
    var search = (document.getElementById('supplierSearch').value || '').trim().toLowerCase();
    var suppliers = appData.suppliers || [];
    if (search) {
        suppliers = suppliers.filter(function(s) {
            return s.name.toLowerCase().includes(search) || s.phone.includes(search);
        });
    }
    var tbody = document.getElementById('suppliersBody');
    tbody.innerHTML = '';
    if (suppliers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0631\u062F\u0648\u0646</td></tr>';
        return;
    }
    suppliers.forEach(function(s) {
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + s.id + '</td>\n            <td><strong>' + sanitize(s.name) + '</strong></td>\n            <td>' + sanitize(s.phone || '') + '</td>\n            <td>' + sanitize(s.address || '') + '</td>\n            <td>' + sanitize(s.notes || '') + '</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="editSupplier(' + s.id + ')">\u062A\u0639\u062F\u064A\u0644</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteSupplier(' + s.id + ')">\u062D\u0630\u0641</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

document.getElementById('supplierSearch').addEventListener('input', renderSuppliers);

document.getElementById('addSupplierBtn').addEventListener('click', function() {
    document.getElementById('supplierEditId').value = '';
    document.getElementById('supplierModalTitle').textContent = '\u0625\u0636\u0627\u0641\u0629 \u0645\u0648\u0631\u062F \u062C\u062F\u064A\u062F';
    document.getElementById('supplierNameInput').value = '';
    document.getElementById('supplierPhoneInput').value = '';
    document.getElementById('supplierAddressInput').value = '';
    document.getElementById('supplierNotesInput').value = '';
    document.getElementById('supplierModal').style.display = 'block';
});

document.getElementById('saveSupplierBtn').addEventListener('click', function() {
    var editId = document.getElementById('supplierEditId').value;
    var name = document.getElementById('supplierNameInput').value.trim();
    var phone = document.getElementById('supplierPhoneInput').value.trim();
    var address = document.getElementById('supplierAddressInput').value.trim();
    var notes = document.getElementById('supplierNotesInput').value.trim();
    if (!name) { showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0631\u062F', 'error'); return; }
    if (editId) {
        var s = appData.suppliers.find(function(sx) { return sx.id === parseInt(editId); });
        if (s) { s.name = name; s.phone = phone; s.address = address; s.notes = notes; }
        showToast('\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0648\u0631\u062F', 'success');
    } else {
        var maxId = (appData.suppliers || []).reduce(function(max, sx) { return Math.max(max, sx.id); }, 0);
        if (!appData.suppliers) appData.suppliers = [];
        appData.suppliers.push({
            id: maxId + 1, name: name, phone: phone, address: address, notes: notes,
            createdAt: new Date().toISOString()
        });
        showToast('\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0648\u0631\u062F \u0628\u0646\u062C\u0627\u062D', 'success');
    }
    saveData();
    renderSuppliers();
    document.getElementById('supplierModal').style.display = 'none';
});

function editSupplier(id) {
    var s = appData.suppliers.find(function(sx) { return sx.id === id; });
    if (!s) return;
    document.getElementById('supplierEditId').value = id;
    document.getElementById('supplierModalTitle').textContent = '\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0648\u0631\u062F';
    document.getElementById('supplierNameInput').value = s.name;
    document.getElementById('supplierPhoneInput').value = s.phone || '';
    document.getElementById('supplierAddressInput').value = s.address || '';
    document.getElementById('supplierNotesInput').value = s.notes || '';
    document.getElementById('supplierModal').style.display = 'block';
}

function deleteSupplier(id) {
    if (!confirm('\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0645\u0648\u0631\u062F\u061F')) return;
    appData.suppliers = appData.suppliers.filter(function(s) { return s.id !== id; });
    saveData();
    renderSuppliers();
    showToast('\u062A\u0645 \u062D\u0630\u0641 \u0627\u0644\u0645\u0648\u0631\u062F', 'info');
}

// ===== PURCHASES PAGE =====
var purchaseItems = [];

function loadPurchaseSelects() {
    var sel = document.getElementById('purchaseSupplierSelect');
    if (!sel) return;
    var html = '<option value="">\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0648\u0631\u062F</option>';
    (appData.suppliers || []).forEach(function(s) {
        html += '<option value="' + s.id + '">' + sanitize(s.name) + '</option>';
    });
    sel.innerHTML = html;
    var medSel = document.getElementById('purchaseMedSelect');
    if (medSel) {
        var mHtml = '<option value="">\u0627\u062E\u062A\u0631 \u062F\u0648\u0627\u0621</option>';
        medicinesDB.forEach(function(m) {
            mHtml += '<option value="' + m.id + '">' + sanitize(m.name) + '</option>';
        });
        medSel.innerHTML = mHtml;
    }
    var filterSel = document.getElementById('purchaseSupplierFilter');
    if (filterSel) {
        var fHtml = '<option value="\u0627\u0644\u0643\u0644">\u0643\u0644 \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646</option>';
        (appData.suppliers || []).forEach(function(s) {
            fHtml += '<option value="' + s.id + '">' + sanitize(s.name) + '</option>';
        });
        filterSel.innerHTML = fHtml;
    }
}

document.getElementById('addPurchaseBtn').addEventListener('click', function() {
    purchaseItems = [];
    document.getElementById('purchaseEditId').value = '';
    document.getElementById('purchaseModalTitle').textContent = '\u0641\u0627\u062A\u0648\u0631\u0629 \u0634\u0631\u0627\u0621 \u062C\u062F\u064A\u062F\u0629';
    document.getElementById('purchaseSupplierSelect').value = '';
    document.getElementById('purchaseDiscount').value = '0';
    document.getElementById('purchaseNotes').value = '';
    renderPurchaseItems();
    loadPurchaseSelects();
    document.getElementById('purchaseModal').style.display = 'block';
});

document.getElementById('addPurchaseItemBtn').addEventListener('click', function() {
    var medId = parseInt(document.getElementById('purchaseMedSelect').value);
    var qty = parseInt(document.getElementById('purchaseMedQty').value) || 1;
    var price = parseFloat(document.getElementById('purchaseMedPrice').value);
    var expiry = document.getElementById('purchaseMedExpiry').value;
    if (!medId) { showToast('\u0627\u062E\u062A\u0631 \u062F\u0648\u0627\u0621', 'error'); return; }
    if (!price || price <= 0) { showToast('\u0623\u062F\u062E\u0644 \u0633\u0639\u0631 \u0634\u0631\u0627\u0621 \u0635\u0627\u0644\u062D', 'error'); return; }
    var med = getMedicineById(medId);
    if (!med) return;
    var existing = purchaseItems.find(function(p) { return p.medId === medId; });
    if (existing) {
        existing.qty += qty;
        if (expiry) existing.expiry = expiry;
    } else {
        purchaseItems.push({ medId: medId, name: med.name, qty: qty, price: price, expiry: expiry });
    }
    document.getElementById('purchaseMedQty').value = '1';
    document.getElementById('purchaseMedPrice').value = '';
    document.getElementById('purchaseMedExpiry').value = '';
    renderPurchaseItems();
    showToast('\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 ' + sanitize(med.name), 'success');
});

function renderPurchaseItems() {
    var tbody = document.getElementById('purchaseItemsBody');
    if (purchaseItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">\u0644\u0645 \u062A\u0636\u0641 \u0623\u0635\u0646\u0627\u0641\u0627\u064B \u0628\u0639\u062F</td></tr>';
        document.getElementById('purchaseTotal').textContent = '0.00';
        return;
    }
    tbody.innerHTML = '';
    var total = 0;
    purchaseItems.forEach(function(p, idx) {
        var lineTotal = p.qty * p.price;
        total += lineTotal;
        var tr = document.createElement('tr');
        tr.className = 'purchase-item-row';
        tr.innerHTML = '\n            <td>' + sanitize(p.name) + '</td>\n            <td>' + p.qty + '</td>\n            <td>' + formatPrice(p.price) + '</td>\n            <td>' + (p.expiry || '-') + '</td>\n            <td>' + formatPrice(lineTotal) + '</td>\n            <td><span class="remove-item" data-index="' + idx + '">&times;</span></td>\n        ';
        tbody.appendChild(tr);
    });
    document.getElementById('purchaseTotal').textContent = formatPrice(total);
    tbody.querySelectorAll('.remove-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var idx = parseInt(this.dataset.index);
            purchaseItems.splice(idx, 1);
            renderPurchaseItems();
        });
    });
}

document.getElementById('savePurchaseBtn').addEventListener('click', function() {
    var supplierId = parseInt(document.getElementById('purchaseSupplierSelect').value) || null;
    var discount = parseFloat(document.getElementById('purchaseDiscount').value) || 0;
    var notes = document.getElementById('purchaseNotes').value.trim();
    if (purchaseItems.length === 0) { showToast('\u0623\u0636\u0641 \u0623\u0635\u0646\u0627\u0641\u0627\u064B \u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0634\u0631\u0627\u0621', 'error'); return; }
    var subtotal = purchaseItems.reduce(function(sum, p) { return sum + p.qty * p.price; }, 0);
    var net = Math.max(0, subtotal - discount);
    if (!appData.purchases) appData.purchases = [];
    var purchase = {
        id: appData.nextPurchaseId++,
        date: new Date().toISOString(),
        supplierId: supplierId,
        items: purchaseItems.map(function(p) { return { ...p }; }),
        subtotal: subtotal,
        discount: discount,
        net: net,
        notes: notes
    };
    appData.purchases.push(purchase);
    purchaseItems.forEach(function(p) {
        var med = getMedicineById(p.medId);
        if (med) {
            med.qty = (med.qty || 0) + p.qty;
            if (p.price > 0) med.price = p.price;
            if (p.expiry) med.expiryDate = p.expiry;
        }
    });
    saveData();
    purchaseItems = [];
    renderPurchases();
    renderInventory();
    renderMedsGrid();
    document.getElementById('purchaseModal').style.display = 'none';
    showToast('\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0634\u0631\u0627\u0621 \u0628\u0646\u062C\u0627\u062D', 'success');
});

function renderPurchases() {
    var search = (document.getElementById('purchaseSearch').value || '').trim().toLowerCase();
    var filterSupplier = document.getElementById('purchaseSupplierFilter').value;
    var purchases = appData.purchases || [];
    if (filterSupplier !== '\u0627\u0644\u0643\u0644') {
        purchases = purchases.filter(function(p) { return p.supplierId === parseInt(filterSupplier); });
    }
    if (search) {
        purchases = purchases.filter(function(p) {
            var s = p.supplierId ? appData.suppliers.find(function(sx) { return sx.id === p.supplierId; }) : null;
            return (s && s.name.toLowerCase().includes(search)) || p.id.toString().includes(search);
        });
    }
    var tbody = document.getElementById('purchasesBody');
    tbody.innerHTML = '';
    if (purchases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center empty-state">\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631 \u0634\u0631\u0627\u0621</td></tr>';
        return;
    }
    purchases.slice().reverse().forEach(function(p) {
        var s = p.supplierId ? appData.suppliers.find(function(sx) { return sx.id === p.supplierId; }) : null;
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>#' + p.id + '</td>\n            <td>' + (s ? sanitize(s.name) : '-') + '</td>\n            <td>' + formatDate(p.date) + '</td>\n            <td>' + p.items.length + '</td>\n            <td>' + formatPrice(p.subtotal) + ' ' + appData.settings.currency + '</td>\n            <td>' + formatPrice(p.discount) + ' ' + appData.settings.currency + '</td>\n            <td><strong>' + formatPrice(p.net) + ' ' + appData.settings.currency + '</strong></td>\n            <td><button class="btn btn-sm btn-danger" onclick="deletePurchase(' + p.id + ')">\u062D\u0630\u0641</button></td>\n        ';
        tbody.appendChild(tr);
    });
}

document.getElementById('purchaseSearch').addEventListener('input', renderPurchases);
document.getElementById('purchaseSupplierFilter').addEventListener('change', renderPurchases);

function deletePurchase(id) {
    if (!confirm('\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0634\u0631\u0627\u0621\u061F')) return;
    appData.purchases = appData.purchases.filter(function(p) { return p.id !== id; });
    saveData();
    renderPurchases();
    showToast('\u062A\u0645 \u062D\u0630\u0641 \u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0634\u0631\u0627\u0621', 'info');
}

// ===== CANCEL INVOICE =====
function cancelInvoice(id) {
    document.getElementById('cancelInvoiceId').value = id;
    document.getElementById('cancelInvoiceModal').style.display = 'block';
}

document.getElementById('confirmCancelInvoice').addEventListener('click', function() {
    var id = parseInt(document.getElementById('cancelInvoiceId').value);
    var invoice = appData.invoices.find(function(inv) { return inv.id === id; });
    if (!invoice) return;
    invoice.items.forEach(function(item) {
        var med = medicinesDB.find(function(m) { return m.id === item.id; });
        if (med) med.qty += item.qty;
    });
    invoice.status = '\u0645\u0644\u063A\u064A\u0629';
    saveData();
    renderDashboard();
    renderReports();
    document.getElementById('cancelInvoiceModal').style.display = 'none';
    showToast('\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 #' + id + ' \u0648\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0645\u062E\u0632\u0648\u0646', 'warning');
});

// ===== DASHBOARD =====
function renderDashboard() {
    var todaySales = appData.invoices
        .filter(function(inv) { return isToday(inv.date) && inv.status !== '\u0645\u0644\u063A\u064A\u0629'; })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var monthlySales = appData.invoices
        .filter(function(inv) { return isThisMonth(inv.date) && inv.status !== '\u0645\u0644\u063A\u064A\u0629'; })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var lowStock = medicinesDB.filter(function(m) { return m.qty > 0 && m.qty <= 10; }).length;
    var outOfStock = medicinesDB.filter(function(m) { return m.qty <= 0; }).length;
    var expiringMeds = medicinesDB.filter(function(m) {
        var days = getExpiryDays(m.expiryDate);
        return days !== null && days >= 0 && days <= 30;
    }).length;

    document.getElementById('todaySales').textContent = formatPrice(todaySales) + ' ' + appData.settings.currency;
    document.getElementById('totalMeds').textContent = medicinesDB.length;
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('outOfStock').textContent = outOfStock;
    document.getElementById('monthlySales').textContent = formatPrice(monthlySales) + ' ' + appData.settings.currency;
    document.getElementById('expiringMedsCount').textContent = expiringMeds;

    var tbody = document.getElementById('recentSalesBody');
    var recent = appData.invoices.slice().reverse().slice(0, 10);
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state"><div class="empty-state-icon">\uD83D\uDCB0</div><div class="empty-state-text">\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0628\u064A\u0639\u0627\u062A \u0628\u0639\u062F</div></td></tr>';
    } else {
        tbody.innerHTML = '';
        recent.forEach(function(inv) {
            var statusBadge = inv.status === '\u0645\u0644\u063A\u064A\u0629' ? 'badge-danger' : 'badge-success';
            var statusText = inv.status || '\u0645\u0643\u062A\u0645\u0644\u0629';
            var tr2 = document.createElement('tr');
            tr2.innerHTML = '\n                <td>#' + inv.id + '</td>\n                <td>' + formatPrice(inv.net) + ' ' + appData.settings.currency + '</td>\n                <td>' + formatDate(inv.date) + '</td>\n                <td><span class="badge ' + statusBadge + '">' + statusText + '</span></td>\n                <td>' + (statusText !== '\u0645\u0644\u063A\u064A\u0629' ? '<button class="btn btn-sm btn-danger" onclick="cancelInvoice(\'' + inv.id + '\')">\u0625\u0644\u063A\u0627\u0621</button>' : '') + '</td>\n            ';
            tbody.appendChild(tr2);
        });
    }

    var medCounts = {};
    appData.invoices.forEach(function(inv) {
        if (inv.status === '\u0645\u0644\u063A\u064A\u0629') return;
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
            list.innerHTML += '<li><span>' + sanitize(name) + '</span><span style="color:var(--primary);font-weight:700;">' + count + '</span></li>';
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
                tr3.innerHTML = '\n                    <td><strong>' + sanitize(m.name) + '</strong></td>\n                    <td>' + formatDateShort(m.expiryDate) + '</td>\n                    <td><span class="expiry-badge ' + (days <= 0 ? 'red' : 'yellow') + '">' + days + ' \u064A\u0648\u0645</span></td>\n                    <td>' + m.qty + '</td>\n                ';
                expiryTbody.appendChild(tr3);
            });
        }
    }
}

// ===== REPORTS =====
var reportDateFrom = null;
var reportDateTo = null;

function getFilteredInvoices() {
    var invoices = appData.invoices.slice();
    if (reportDateFrom) {
        invoices = invoices.filter(function(inv) { return inv.date >= reportDateFrom; });
    }
    if (reportDateTo) {
        var endDate = reportDateTo + 'T23:59:59';
        invoices = invoices.filter(function(inv) { return inv.date <= endDate; });
    }
    return invoices;
}

function renderReports() {
    var invoices = getFilteredInvoices();
    var activeInvoices = invoices.filter(function(inv) { return inv.status !== '\u0645\u0644\u063A\u064A\u0629'; });
    var totalSales = activeInvoices.reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var totalCount = activeInvoices.length;
    var todayInvs = activeInvoices.filter(function(inv) { return isToday(inv.date); });
    var todaySales = todayInvs.reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var todayCount = todayInvs.length;
    var monthInvs = activeInvoices.filter(function(inv) { return isThisMonth(inv.date); });
    var monthSales = monthInvs.reduce(function(sum, inv) { return sum + inv.net; }, 0);
    var monthCount = monthInvs.length;

    var cur = appData.settings.currency;
    document.getElementById('reportTodaySales').textContent = formatPrice(todaySales) + ' ' + cur;
    document.getElementById('reportTodayCount').textContent = todayCount;
    document.getElementById('reportMonthSales').textContent = formatPrice(monthSales) + ' ' + cur;
    document.getElementById('reportMonthCount').textContent = monthCount;
    document.getElementById('reportTotalSales').textContent = formatPrice(totalSales) + ' ' + cur;
    document.getElementById('reportTotalCount').textContent = totalCount;

    var tbody = document.getElementById('allInvoicesBody');
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center empty-state">\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    invoices.slice().reverse().forEach(function(inv) {
        var statusBadge = inv.status === '\u0645\u0644\u063A\u064A\u0629' ? 'badge-danger' : 'badge-success';
        var statusText = inv.status || '\u0645\u0643\u062A\u0645\u0644\u0629';
        var tr3 = document.createElement('tr');
        tr3.innerHTML = '\n            <td>#' + inv.id + '</td>\n            <td>' + formatDate(inv.date) + '</td>\n            <td>' + inv.items.length + '</td>\n            <td>' + formatPrice(inv.subtotal) + ' ' + cur + '</td>\n            <td>' + formatPrice(inv.discount) + ' ' + cur + '</td>\n            <td><strong>' + formatPrice(inv.net) + ' ' + cur + '</strong></td>\n            <td><span class="badge ' + statusBadge + '">' + statusText + '</span></td>\n            <td>' + (statusText !== '\u0645\u0644\u063A\u064A\u0629' ? '<button class="btn btn-sm btn-danger" onclick="cancelInvoice(\'' + inv.id + '\');renderReports();">\u0625\u0644\u063A\u0627\u0621</button>' : '') + '</td>\n        ';
        tbody.appendChild(tr3);
    });
}

document.getElementById('filterReportsBtn').addEventListener('click', function() {
    reportDateFrom = document.getElementById('reportDateFrom').value;
    reportDateTo = document.getElementById('reportDateTo').value;
    renderReports();
});

document.getElementById('exportCsvBtn').addEventListener('click', function() {
    var invoices = getFilteredInvoices();
    if (invoices.length === 0) { showToast('\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631 \u0644\u0644\u062A\u0635\u062F\u064A\u0631', 'warning'); return; }
    var csv = '\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629,\u0627\u0644\u062A\u0627\u0631\u064A\u062E,\u0639\u062F\u062F \u0627\u0644\u0623\u0635\u0646\u0627\u0641,\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A,\u0627\u0644\u062E\u0635\u0645,\u0627\u0644\u0635\u0627\u0641\u064A,\u0627\u0644\u062D\u0627\u0644\u0629\n';
    invoices.forEach(function(inv) {
        csv += '#' + inv.id + ',' + inv.date + ',' + inv.items.length + ',' + inv.subtotal + ',' + inv.discount + ',' + inv.net + ',' + (inv.status || '\u0645\u0643\u062A\u0645\u0644\u0629') + '\n';
    });
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'invoices_report_' + todayStr() + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u062A\u0642\u0631\u064A\u0631', 'success');
});

// ===== SETTINGS =====
function loadSettings() {
    var s = appData.settings;
    document.getElementById('pharmacyName').value = s.pharmacyName || 'ValoPOS';
    document.getElementById('pharmacyAddress').value = s.address || '';
    document.getElementById('pharmacyPhone').value = s.phone || '';
    document.getElementById('receiptFooter').value = s.receiptFooter || '';
    document.getElementById('taxRate').value = s.taxRate || 0;
    document.getElementById('currency').value = s.currency || '\u062C.\u0645';
}

function saveSettings() {
    appData.settings.pharmacyName = document.getElementById('pharmacyName').value;
    appData.settings.address = document.getElementById('pharmacyAddress').value;
    appData.settings.phone = document.getElementById('pharmacyPhone').value;
    appData.settings.receiptFooter = document.getElementById('receiptFooter').value;
    appData.settings.taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    appData.settings.currency = document.getElementById('currency').value || '\u062C.\u0645';
    saveData();
    showToast('\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0628\u0646\u062C\u0627\u062D', 'success');
}

function resetData() {
    if (confirm('\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F\u061F \u0633\u064A\u062A\u0645 \u0645\u0633\u062D \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A.')) {
        if (confirm('\u062A\u0623\u0643\u064A\u062F \u0646\u0647\u0627\u0626\u064A\u061F \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639!')) {
            localStorage.removeItem('pharmacy_pos_data');
            appData = {
                cart: [], invoices: [], customers: [], suppliers: [], purchases: [],
                settings: { pharmacyName: 'ValoPOS', address: '', phone: '', receiptFooter: '\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0639\u0627\u0645\u0644\u0643\u0645 \u0645\u0639\u0646\u0627', taxRate: 0, currency: '\u062C.\u0645' },
                nextInvoiceId: 1, nextPurchaseId: 1, stockChanges: []
            };
            saveData();
            renderDashboard();
            renderInventory();
            renderReports();
            renderCustomers();
            renderSuppliers();
            renderPurchases();
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
                appData.settings = { ...appData.settings, ...data.settings };
                saveData();
                renderDashboard();
                renderInventory();
                renderReports();
                renderCustomers();
                renderSuppliers();
                renderPurchases();
                showToast('\u062A\u0645 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u062C\u0627\u062D', 'success');
            } catch (err) {
                showToast('\u062E\u0637\u0623 \u0641\u064A \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0645\u0644\u0641', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// ===== MODALS =====
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

// ===== RIPPLE EFFECT =====
(function() {
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.btn');
        if (!btn) return;
        var ripple = document.createElement('span');
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;
        ripple.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(255,255,255,0.3);transform:scale(0);animation:ripple 0.6s ease-out;pointer-events:none;';
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(function() { ripple.remove(); }, 700);
    });
})();

// ===== DARK MODE =====
(function() {
    var toggleIds = ['valoposThemeToggle', 'headerThemeToggle'];
    var toggles = toggleIds.map(function(id) { return document.getElementById(id); });
    var icons = toggles.map(function(t) { return t ? t.querySelector('i') : null; });
    var saved = localStorage.getItem('valopos_theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'valopos-dark');
        icons.forEach(function(ic) { if (ic) ic.className = 'fas fa-sun'; });
    }
    function applyTheme(isDark) {
        var html = document.documentElement;
        if (isDark) {
            html.setAttribute('data-theme', 'valopos-dark');
            icons.forEach(function(ic) { if (ic) ic.className = 'fas fa-sun'; });
            localStorage.setItem('valopos_theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
            icons.forEach(function(ic) { if (ic) ic.className = 'fas fa-moon'; });
            localStorage.setItem('valopos_theme', 'light');
        }
    }
    toggles.forEach(function(toggle) {
        if (toggle) {
            toggle.addEventListener('click', function() {
                var html = document.documentElement;
                var isDark = html.getAttribute('data-theme') === 'valopos-dark';
                applyTheme(!isDark);
            });
        }
    });
})();

// ===== KEYBOARD HINT =====
var kh = document.createElement('div');
kh.className = 'keyboard-hint';
kh.innerHTML = '\n    <button class="keyboard-hint-close" onclick="this.parentElement.remove()">&times;</button>\n    <span><kbd>F1</kbd> \u0628\u062D\u062B</span>\n    <span><kbd>F2</kbd> \u0641\u0627\u062A\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629</span>\n    <span><kbd>F8</kbd> \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0628\u064A\u0639</span>\n    <span><kbd>Esc</kbd> \u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0628\u062D\u062B</span>\n';
document.body.appendChild(kh);

// ===== INIT =====
loadData();
loadCategories();
loadSettings();
renderMedsGrid();
renderCart();
renderDashboard();
renderInventory();
renderReports();
renderCustomers();
renderSuppliers();
renderPurchases();
loadCustomerSelect();
loadPurchaseSelects();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function(err) {
        console.log('SW registration failed:', err);
    });
}
