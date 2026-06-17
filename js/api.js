var API = (function() {
    var BASE_URL = (function() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:' + (window.location.port || '3001');
        }
        return '';
    })();
    var TOKEN_KEY = 'valopos_token';
    var USER_KEY = 'valopos_user';

    function getToken() { return localStorage.getItem(TOKEN_KEY); }
    function getUser() { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch(e) { return null; } }
    function setAuth(token, user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    function clearAuth() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
    function isLoggedIn() { return !!getToken(); }

    function request(method, path, body) {
        var url = BASE_URL + '/api' + path;
        var opts = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        var token = getToken();
        if (token) opts.headers['Authorization'] = 'Bearer ' + token;
        if (body) opts.body = JSON.stringify(body);
        return fetch(url, opts).then(function(r) {
            if (r.status === 401) {
                clearAuth();
                if (window.showLogin) window.showLogin();
                throw new Error('Unauthorized');
            }
            return r.json().then(function(data) {
                if (!r.ok) throw new Error(data.message || data.error || 'Request failed');
                return data;
            });
        });
    }

    function get(path) { return request('GET', path); }
    function post(path, body) { return request('POST', path, body); }
    function put(path, body) { return request('PUT', path, body); }
    function del(path) { return request('DELETE', path); }

    return {
        BASE_URL: BASE_URL,
        getToken: getToken,
        getUser: getUser,
        setAuth: setAuth,
        clearAuth: clearAuth,
        isLoggedIn: isLoggedIn,
        get: get, post: post, put: put, del: del,

        // Auth
        login: function(username, password) { return post('/auth/login', { username: username, password: password }); },
        register: function(data) { return post('/auth/register', data); },
        getMe: function() { return get('/auth/me'); },

        // Users
        getUsers: function() { return get('/users'); },
        createUser: function(data) { return post('/users', data); },
        updateUser: function(id, data) { return put('/users/' + id, data); },
        deleteUser: function(id) { return del('/users/' + id); },

        // Medicines
        getMedicines: function(params) {
            var qs = '';
            if (params) { var parts = []; for (var k in params) { if (params[k]) parts.push(k + '=' + encodeURIComponent(params[k])); } if (parts.length) qs = '?' + parts.join('&'); }
            return get('/medicines' + qs);
        },
        getMedicine: function(id) { return get('/medicines/' + id); },
        getCategories: function() { return get('/medicines/categories'); },
        getLowStock: function() { return get('/medicines/low-stock'); },
        getExpiring: function() { return get('/medicines/expiring'); },
        createMedicine: function(data) { return post('/medicines', data); },
        updateMedicine: function(id, data) { return put('/medicines/' + id, data); },
        deleteMedicine: function(id) { return del('/medicines/' + id); },
        adjustStock: function(id, data) { return post('/medicines/' + id + '/stock-adjust', data); },

        // Invoices
        getInvoices: function(params) {
            var qs = '';
            if (params) { var parts = []; for (var k in params) { if (params[k]) parts.push(k + '=' + encodeURIComponent(params[k])); } if (parts.length) qs = '?' + parts.join('&'); }
            return get('/invoices' + qs);
        },
        getInvoice: function(id) { return get('/invoices/' + id); },
        createInvoice: function(data) { return post('/invoices', data); },
        cancelInvoice: function(id, reason) { return post('/invoices/' + id + '/cancel', { reason: reason }); },
        returnInvoice: function(id, data) { return post('/invoices/' + id + '/return', data); },

        // Customers
        getCustomers: function(search) {
            var qs = search ? '?search=' + encodeURIComponent(search) : '';
            return get('/customers' + qs);
        },
        getCustomer: function(id) { return get('/customers/' + id); },
        createCustomer: function(data) { return post('/customers', data); },
        updateCustomer: function(id, data) { return put('/customers/' + id, data); },
        deleteCustomer: function(id) { return del('/customers/' + id); },
        addCustomerPayment: function(id, data) { return post('/customers/' + id + '/payment', data); },
        getCustomerStatement: function(id) { return get('/customers/' + id + '/statement'); },

        // Suppliers
        getSuppliers: function() { return get('/suppliers'); },
        getSupplier: function(id) { return get('/suppliers/' + id); },
        createSupplier: function(data) { return post('/suppliers', data); },
        updateSupplier: function(id, data) { return put('/suppliers/' + id, data); },
        deleteSupplier: function(id) { return del('/suppliers/' + id); },

        // Purchases
        getPurchases: function(params) {
            var qs = '';
            if (params) { var parts = []; for (var k in params) { if (params[k]) parts.push(k + '=' + encodeURIComponent(params[k])); } if (parts.length) qs = '?' + parts.join('&'); }
            return get('/purchases' + qs);
        },
        createPurchase: function(data) { return post('/purchases', data); },
        cancelPurchase: function(id) { return post('/purchases/' + id + '/cancel'); },

        // Branches
        getBranches: function() { return get('/branches'); },
        createBranch: function(data) { return post('/branches', data); },
        updateBranch: function(id, data) { return put('/branches/' + id, data); },

        // Settings
        getSettings: function() { return get('/settings'); },
        updateSettings: function(data) { return put('/settings', data); },

        // Reports
        getDashboard: function() { return get('/reports/dashboard'); },
        getSalesToday: function() { return get('/reports/sales/today'); },
        getSalesWeek: function() { return get('/reports/sales/week'); },
        getSalesMonth: function() { return get('/reports/sales/month'); },
        getSalesRange: function(start, end) { return get('/reports/sales/range?start=' + start + '&end=' + end); },
        getTopMedicines: function() { return get('/reports/top-medicines'); },
        getBottomMedicines: function() { return get('/reports/bottom-medicines'); },
        getProfits: function(start, end) {
            var qs = '';
            if (start || end) { var parts = []; if (start) parts.push('start=' + start); if (end) parts.push('end=' + end); qs = '?' + parts.join('&'); }
            return get('/reports/profits' + qs);
        },
        getTopCustomers: function() { return get('/reports/top-customers'); },
        getTopEmployees: function() { return get('/reports/top-employees'); },
        getInventoryValue: function() { return get('/reports/inventory-value'); },
        getStockMovements: function() { return get('/reports/stock-movements'); },
        getTaxReport: function(start, end) {
            var qs = '';
            if (start || end) { var parts = []; if (start) parts.push('start=' + start); if (end) parts.push('end=' + end); qs = '?' + parts.join('&'); }
            return get('/reports/tax-report' + qs);
        },
        getDebtReport: function() { return get('/reports/debt-report'); },
        getReturns: function() { return get('/reports/returns'); },

        // Logs
        getLogs: function(params) {
            var qs = '';
            if (params) { var parts = []; for (var k in params) { if (params[k]) parts.push(k + '=' + encodeURIComponent(params[k])); } if (parts.length) qs = '?' + parts.join('&'); }
            return get('/logs' + qs);
        }
    };
})();
