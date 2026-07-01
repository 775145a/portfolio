var currentUser = null;

function audit(action, details) {
    if (!appData.auditLog) appData.auditLog = [];
    appData.auditLog.push({
        id: (appData.auditLog.length || 0) + 1,
        userId: currentUser ? currentUser.id : 0,
        username: currentUser ? currentUser.username : 'system',
        action: action,
        details: details || '',
        timestamp: new Date().toISOString()
    });
    saveData();
}

function can(permission) {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'cashier') {
        if (['pos', 'customers'].includes(permission)) return true;
        if (permission === 'reports_view') return true;
        return false;
    }
    if (currentUser.role === 'pharmacist') {
        if (['pos', 'inventory', 'customers', 'prescriptions'].includes(permission)) return true;
        if (permission === 'reports_view') return true;
        return false;
    }
    return false;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[<>&"'`\/]/g, function(m) {
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '&') return '&amp;';
        if (m === '"') return '&quot;';
        if (m === "'") return '&#x27;';
        if (m === '`') return '&#x60;';
        if (m === '/') return '&#x2F;';
        return m;
    });
}

// ===== i18n - Language Toggle =====
const LANG = {
    ar: {
        'nav.dashboard': '\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645',
        'nav.pos': '\u0646\u0642\u0637\u0629 \u0627\u0644\u0628\u064A\u0639',
        'nav.inventory': '\u0627\u0644\u0645\u062E\u0632\u0648\u0646',
        'nav.customers': '\u0627\u0644\u0639\u0645\u0644\u0627\u0621',
        'nav.suppliers': '\u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646',
        'nav.purchases': '\u0641\u0648\u0627\u062A\u064A\u0631 \u0627\u0644\u0634\u0631\u0627\u0621',
        'nav.reports': '\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631',
        'nav.settings': '\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',
        'common.save': '\u062D\u0641\u0638',
        'common.cancel': '\u0625\u0644\u063A\u0627\u0621',
        'common.close': '\u0625\u063A\u0644\u0627\u0642',
        'common.print': '\u0637\u0628\u0627\u0639\u0629',
        'common.add': '\u0625\u0636\u0627\u0641\u0629',
        'common.edit': '\u062A\u0639\u062F\u064A\u0644',
        'common.delete': '\u062D\u0630\u0641',
        'common.search': '\u0628\u062D\u062B',
        'common.yes': '\u0646\u0639\u0645',
        'common.no': '\u0644\u0627',
        'common.total': '\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A',
        'common.discount': '\u0627\u0644\u062E\u0635\u0645',
        'common.net': '\u0627\u0644\u0635\u0627\u0641\u064A',
        'common.paid': '\u0627\u0644\u0645\u062F\u0641\u0648\u0639',
        'common.change': '\u0627\u0644\u0628\u0627\u0642\u064A',
        'common.status': '\u0627\u0644\u062D\u0627\u0644\u0629',
        'common.actions': '\u0625\u062C\u0631\u0627\u0621\u0627\u062A',
        'common.notes': '\u0645\u0644\u0627\u062D\u0638\u0627\u062A',
        'common.id': '#',
        'common.name': '\u0627\u0644\u0627\u0633\u0645',
        'common.phone': '\u0627\u0644\u0647\u0627\u062A\u0641',
        'common.address': '\u0627\u0644\u0639\u0646\u0648\u0627\u0646',
        'common.date': '\u0627\u0644\u062A\u0627\u0631\u064A\u062E',
        'common.qty': '\u0627\u0644\u0643\u0645\u064A\u0629',
        'common.price': '\u0627\u0644\u0633\u0639\u0631',
        'common.expiry': '\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629',
        'common.reason': '\u0627\u0644\u0633\u0628\u0628',
        'common.all': '\u0627\u0644\u0643\u0644',
        'common.view': '\u0639\u0631\u0636',
        'common.invoice': '\u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629',
        'common.amount': '\u0627\u0644\u0645\u0628\u0644\u063A',
        'common.items': '\u0627\u0644\u0623\u0635\u0646\u0627\u0641',
        'common.category': '\u0627\u0644\u062A\u0635\u0646\u064A\u0641',
        'common.back': '\u0631\u062C\u0648\u0639',
        'common.confirm': '\u062A\u0623\u0643\u064A\u062F',
        'common.email': '\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A',
        'common.filter': '\u062A\u0635\u0641\u064A\u0629',
        'dash.title': '\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645',
        'dash.subtitle': '\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 \u0639\u0644\u0649 \u0646\u0634\u0627\u0637 \u0627\u0644\u0635\u064A\u062F\u0644\u064A\u0629',
        'dash.welcome': '\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A ValoPOS',
        'dash.welcomeDesc': '\u0646\u0638\u0627\u0645 \u0645\u062A\u0643\u0627\u0645\u0644 \u0644\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0635\u064A\u062F\u0644\u064A\u0627\u062A \u2014 \u0641\u0648\u0627\u062A\u064A\u0631\u060C \u0645\u062E\u0632\u0648\u0646\u060C \u0639\u0645\u0644\u0627\u0621\u060C \u062A\u0642\u0627\u0631\u064A\u0631',
        'dash.todaySales': '\u0645\u0628\u064A\u0639\u0627\u062A \u0627\u0644\u064A\u0648\u0645',
        'dash.totalMeds': '\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0623\u062F\u0648\u064A\u0629',
        'dash.lowStock': '\u0645\u0646\u062A\u062C\u0627\u062A \u0645\u0646\u062E\u0641\u0636\u0629',
        'dash.outOfStock': '\u0646\u0641\u0630 \u0645\u0646 \u0627\u0644\u0645\u062E\u0632\u0648\u0646',
        'dash.expiring': '\u0642\u0631\u0628 \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621',
        'dash.monthlySales': '\u0645\u0628\u064A\u0639\u0627\u062A \u0627\u0644\u0634\u0647\u0631',
        'dash.recentSales': '\u0622\u062E\u0631 \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A',
        'dash.topSelling': '\u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u0623\u0643\u062B\u0631 \u0645\u0628\u064A\u0639\u0627\u064B',
        'dash.expiryAlert': '\u0623\u062F\u0648\u064A\u0629 \u0642\u0631\u0628 \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621',
        'dash.noSales': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0628\u064A\u0639\u0627\u062A \u0628\u0639\u062F',
        'dash.noData': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0639\u062F',
        'dash.noExpiry': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u062F\u0648\u064A\u0629 \u0642\u0631\u0628 \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621',
        'pos.title': '\u0646\u0642\u0637\u0629 \u0627\u0644\u0628\u064A\u0639',
        'pos.newSale': '\u0641\u0627\u062A\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629',
        'pos.searchPlaceholder': '\u0627\u0628\u062D\u062B \u0639\u0646 \u062F\u0648\u0627\u0621 \u0628\u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F...',
        'pos.allCategories': '\u0643\u0644 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A',
        'pos.emptyCart': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u0635\u0646\u0627\u0641 \u0641\u064A \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629',
        'pos.noMeds': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u062F\u0648\u064A\u0629 \u0645\u0637\u0627\u0628\u0642\u0629',
        'pos.stock': '\u0627\u0644\u0645\u062E\u0632\u0648\u0646:',
        'inv.title': '\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062E\u0632\u0648\u0646',
        'inv.addStock': '\u0625\u0636\u0627\u0641\u0629 \u0645\u062E\u0632\u0648\u0646',
        'inv.addMed': '\u062F\u0648\u0627\u0621 \u062C\u062F\u064A\u062F',
        'inv.export': '\u062A\u0635\u062F\u064A\u0631',
        'inv.exportCSV': '\u062A\u0635\u062F\u064A\u0631 CSV',
        'inv.searchPlaceholder': '\u0628\u062D\u062B \u0641\u064A \u0627\u0644\u0645\u062E\u0632\u0648\u0646...',
        'inv.allCategories': '\u0643\u0644 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A',
        'inv.allStatus': '\u0643\u0644 \u0627\u0644\u062D\u0627\u0644\u0627\u062A',
        'inv.edit': '\u062A\u0639\u062F\u064A\u0644',
        'inv.noResults': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C',
        'cust.title': '\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0639\u0645\u0644\u0627\u0621',
        'cust.add': '\u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F',
        'cust.searchPlaceholder': '\u0628\u062D\u062B \u0639\u0646 \u0639\u0645\u064A\u0644 \u0628\u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0627\u0644\u0647\u0627\u062A\u0641...',
        'cust.noCustomers': '\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621',
        'cust.payDebt': '\u062F\u0641\u0639 \u062F\u064A\u0646',
        'supp.title': '\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646',
        'supp.add': '\u0645\u0648\u0631\u062F \u062C\u062F\u064A\u062F',
        'supp.searchPlaceholder': '\u0628\u062D\u062B \u0639\u0646 \u0645\u0648\u0631\u062F...',
        'supp.noSuppliers': '\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0631\u062F\u0648\u0646',
        'purch.title': '\u0641\u0648\u0627\u062A\u064A\u0631 \u0627\u0644\u0634\u0631\u0627\u0621',
        'purch.add': '\u0641\u0627\u062A\u0648\u0631\u0629 \u0634\u0631\u0627\u0621 \u062C\u062F\u064A\u062F\u0629',
        'purch.searchPlaceholder': '\u0628\u062D\u062B \u0641\u064A \u0641\u0648\u0627\u062A\u064A\u0631 \u0627\u0644\u0634\u0631\u0627\u0621...',
        'purch.allSuppliers': '\u0643\u0644 \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646',
        'purch.noPurchases': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631 \u0634\u0631\u0627\u0621',
        'rep.title': '\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631',
        'rep.filter': '\u062A\u0635\u0641\u064A\u0629',
        'rep.exportCSV': '\u062A\u0635\u062F\u064A\u0631 CSV',
        'rep.todaySales': '\u0645\u0628\u064A\u0639\u0627\u062A \u0627\u0644\u064A\u0648\u0645',
        'rep.monthSales': '\u0645\u0628\u064A\u0639\u0627\u062A \u0627\u0644\u0634\u0647\u0631',
        'rep.totalSales': '\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A',
        'rep.totalProfit': '\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0631\u0628\u062D',
        'rep.profitMargin': '\u0646\u0633\u0628\u0629 \u0627\u0644\u0631\u0628\u062D',
        'rep.todayProfit': '\u0631\u0628\u062D \u0627\u0644\u064A\u0648\u0645',
        'rep.monthProfit': '\u0631\u0628\u062D \u0627\u0644\u0634\u0647\u0631',
        'rep.dailyProfit': '\u0627\u0644\u0631\u0628\u062D \u0627\u0644\u064A\u0648\u0645\u064A (\u0622\u062E\u0631 7 \u0623\u064A\u0627\u0645)',
        'rep.allInvoices': '\u062C\u0645\u064A\u0639 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631',
        'rep.returnLog': '\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A',
        'rep.invoiceCount': '\u0639\u062F\u062F \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631:',
        'rep.noInvoices': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631',
        'rep.noReturns': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0628\u0639\u062F',
        'set.title': '\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',
        'set.pharmacyInfo': '\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0635\u064A\u062F\u0644\u064A\u0629',
        'set.pharmacyName': '\u0627\u0633\u0645 \u0627\u0644\u0635\u064A\u062F\u0644\u064A\u0629',
        'set.address': '\u0627\u0644\u0639\u0646\u0648\u0627\u0646',
        'set.phone': '\u0631\u0642\u0645 \u0627\u0644\u062A\u0644\u064A\u0641\u0648\u0646',
        'set.receiptFooter': '\u062A\u0630\u064A\u064A\u0644 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629',
        'set.taxRate': '\u0646\u0633\u0628\u0629 \u0627\u0644\u0636\u0631\u064A\u0628\u0629 (%)',
        'set.currency': '\u0627\u0644\u0639\u0645\u0644\u0629',
        'set.save': '\u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',
        'set.dataBackup': '\u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0648\u0627\u0644\u0646\u0633\u062E \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A',
        'set.clearData': '\u0645\u0633\u062D \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A',
        'set.downloadBackup': '\u062A\u062D\u0645\u064A\u0644 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629',
        'set.importBackup': '\u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629',
        'set.exportAllData': '\u062A\u0635\u062F\u064A\u0631 \u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A',
        'set.importData': '\u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0628\u064A\u0627\u0646\u0627\u062A',
        'set.importWarning': '\u26A0\uFE0F \u062A\u062D\u0630\u064A\u0631: \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0633\u064A\u062D\u0644 \u0645\u062D\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629!',
        'set.lastBackup': '\u0622\u062E\u0631 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629:',
        'set.noBackup': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0633\u0627\u0628\u0642\u0629',
        'set.backupExported': '\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 - \u0627\u0644\u062D\u062C\u0645:',
        'set.restoreSuccess': '\u062A\u0645 \u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u062C\u0627\u062D! \u0633\u064A\u062A\u0645 \u0625\u0639\u0627\u062F\u0629 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0635\u0641\u062D\u0629...',
        'set.invalidBackupFile': '\u0645\u0644\u0641 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D',
        'set.exportCSV': '\u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 CSV',
        'lang.toggle': 'English',
        'cart.withoutCustomer': '\u0628\u062F\u0648\u0646 \u0639\u0645\u064A\u0644',
        'keyboard.search': '\u0628\u062D\u062B',
        'keyboard.newInvoice': '\u0641\u0627\u062A\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629',
        'keyboard.checkout': '\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0628\u064A\u0639',
        'keyboard.closeSearch': '\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0628\u062D\u062B',
        'auth.title': 'ValoPOS',
        'auth.subtitle': '\u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0635\u064A\u062F\u0644\u064A\u0627\u062A',
        'auth.password': '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
        'auth.passwordPlaceholder': '\u0623\u062F\u062E\u0644 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
        'auth.login': '\u062F\u062E\u0648\u0644',
        'auth.defaultHint': '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629:',
        'auth.errorWrong': '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629',
        'auth.changePass': '\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
        'auth.currentPass': '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629',
        'auth.newPass': '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629',
        'auth.confirmPass': '\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629',
        'auth.savePass': '\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
        'auth.back': '\u0631\u062C\u0648\u0639',
        'auth.switchToChange': '\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631',
        'auth.switchToLogin': '\u0631\u062C\u0648\u0639 \u0625\u0644\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644',
        'auth.changeErrorWrong': '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629',
        'auth.changeErrorLength': '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 6 \u0623\u062D\u0631\u0641 \u0623\u0648 \u0623\u0643\u062B\u0631',
        'auth.changeErrorMatch': '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u062A\u0637\u0627\u0628\u0642\u0629',
        'wa.tooltip': '\u0627\u062D\u062C\u0632 \u0646\u0633\u062E\u062A\u0643 \u0627\u0644\u0622\u0646!',
        '\u0645\u062A\u0648\u0641\u0631': '\u0645\u062A\u0648\u0641\u0631',
        '\u0645\u0646\u062E\u0641\u0636': '\u0645\u0646\u062E\u0641\u0636',
        '\u0646\u0641\u0630': '\u0646\u0641\u0630',
        '\u0645\u0646\u062A\u0647\u064A': '\u0645\u0646\u062A\u0647\u064A',
        '\u0645\u0643\u062A\u0645\u0644\u0629': '\u0645\u0643\u062A\u0645\u0644\u0629',
        '\u0645\u0644\u063A\u064A\u0629': '\u0645\u0644\u063A\u064A\u0629',
        '\u0645\u0631\u062A\u062C\u0639 \u0643\u0644\u064A': '\u0645\u0631\u062A\u062C\u0639 \u0643\u0644\u064A',
        '\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A': '\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A',
        '\u0627\u0644\u0643\u0644': '\u0627\u0644\u0643\u0644',
        '\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C',
        '\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621': '\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621',
        '\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0631\u062F\u0648\u0646': '\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0631\u062F\u0648\u0646',
        '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631 \u0634\u0631\u0627\u0621': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631 \u0634\u0631\u0627\u0621',
        '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631',
        'dash.prescription': '\u0631\u0648\u0634\u062A\u0629',
        'dash.cancel': '\u0625\u0644\u063A\u0627\u0621',
        'dash.day': '\u064A\u0648\u0645',
        'dash.noExpiring': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u062F\u0648\u064A\u0629 \u0642\u0631\u0628 \u0627\u0644\u0627\u0646\u062A\u0647\u0627\u0621',
        'reports.return': '\u0645\u0631\u062A\u062C\u0639',
        'reports.cancel': '\u0625\u0644\u063A\u0627\u0621',
        'reports.noExport': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631 \u0644\u0644\u062A\u0635\u062F\u064A\u0631',
        'reports.csvHeader': '\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629,\u0627\u0644\u062A\u0627\u0631\u064A\u062E,\u0639\u062F\u062F \u0627\u0644\u0623\u0635\u0646\u0627\u0641,\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A,\u0627\u0644\u062E\u0635\u0645,\u0627\u0644\u0635\u0627\u0641\u064A,\u0627\u0644\u062D\u0627\u0644\u0629',
        'reports.exported': '\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u062A\u0642\u0631\u064A\u0631',
        'returns.qtyLabel': '\u0627\u0644\u0643\u0645\u064A\u0629:',
        'returns.allReturned': '\u0643\u0644 \u0627\u0644\u0623\u0635\u0646\u0627\u0641 \u0645\u0631\u062A\u062C\u0639\u0629 \u0628\u0627\u0644\u0641\u0639\u0644',
        'returns.selectItem': '\u0627\u062E\u062A\u0631 \u0639\u0646\u0635\u0631\u0627\u064B \u0648\u0627\u062D\u062F\u0627\u064B \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644 \u0644\u0644\u0625\u0631\u062C\u0627\u0639',
        'returns.noItem': '\u0644\u0645 \u064A\u062A\u0645 \u0627\u062E\u062A\u064A\u0627\u0631 \u0623\u064A \u0639\u0646\u0635\u0631',
        'returns.noReason': '\u062F\u0648\u0646 \u0633\u0628\u0628',
        'returns.success': '\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0628\u0646\u062C\u0627\u062D',
        'returns.items': '\u0635\u0646\u0641(\u0627\u062A)',
        'returns.value': '\u0628\u0642\u064A\u0645\u0629',
        'returns.noReturns': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0628\u0639\u062F',
        'set.currencyDefault': '\u062C.\u0645',
        'set.saved': '\u062A\u0645 \u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0628\u0646\u062C\u0627\u062D',
        'set.receiptFooterDefault': '\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0639\u0627\u0645\u0644\u0643\u0645 \u0645\u0639\u0646\u0627',
        'set.resetConfirm1': '\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F\u061F \u0633\u064A\u062A\u0645 \u0645\u0633\u062D \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A.',
        'set.resetConfirm2': '\u062A\u0623\u0643\u064A\u062F \u0646\u0647\u0627\u0626\u064A\u061F \u0644\u0627 \u064A\u0645\u0643\u0646 \u0627\u0644\u062A\u0631\u0627\u062C\u0639!',
        'set.resetDone': '\u062A\u0645 \u0645\u0633\u062D \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A',
        'set.importSuccess': '\u062A\u0645 \u0627\u0633\u062A\u064A\u0631\u0627\u062F \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u062C\u0627\u062D',
        'set.importError': '\u062E\u0637\u0623 \u0641\u064A \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0645\u0644\u0641',
        'set.backupDownloaded': '\u062A\u0645 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629',
        'set.backupReminder': '\u0646\u0648\u0635\u064A \u0628\u0639\u0645\u0644 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0644\u0644\u0628\u064A\u0627\u0646\u0627\u062A',
        'inventory.day': '\u064A\u0648\u0645',
        'inventory.updated': '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B ',
        'inventory.noExport': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0623\u062F\u0648\u064A\u0629 \u0644\u0644\u062A\u0635\u062F\u064A\u0631',
        'inventory.csvHeader': '\u0627\u0644\u0631\u0642\u0645,\u0627\u0644\u0627\u0633\u0645,\u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u0641\u0639\u0627\u0644\u0629,\u0627\u0644\u062A\u0635\u0646\u064A\u0641,\u0627\u0644\u0633\u0639\u0631,\u0627\u0644\u0643\u0645\u064A\u0629,\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629,\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F,\u0648\u0635\u0641\u0629 \u0637\u0628\u064A\u0629',
        'inventory.rxYes': '\u0646\u0639\u0645',
        'inventory.rxNo': '\u0644\u0627',
        'inventory.exported': '\u062A\u0645 \u062A\u0635\u062F\u064A\u0631 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0625\u0644\u0649 CSV',
        'barcode.starting': '\u062C\u0627\u0631\u064A \u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0643\u0627\u0645\u064A\u0631\u0627...',
        'barcode.unsupported': '\u0627\u0644\u0645\u0633\u062D \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A \u063A\u064A\u0631 \u0645\u062F\u0639\u0648\u0645\u060C \u0623\u062F\u062E\u0644 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u064A\u062F\u0648\u064A\u0627\u064B',
        'barcode.aim': '\u0648\u062C\u0647 \u0627\u0644\u0643\u0627\u0645\u064A\u0631\u0627 \u0646\u062D\u0648 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F',
        'barcode.cameraReady': '\u0627\u0644\u0643\u0627\u0645\u064A\u0631\u0627 \u062A\u0639\u0645\u0644\u060C \u0623\u062F\u062E\u0644 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u064A\u062F\u0648\u064A\u0627\u064B',
        'barcode.error': '\u062E\u0637\u0623:',
        'barcode.cameraError': '\u062A\u0639\u0630\u0631 \u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0643\u0627\u0645\u064A\u0631\u0627:',
        'customers.noCustomers': '\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621',
        'customers.addNew': '\u0625\u0636\u0627\u0641\u0629 \u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F',
        'customers.errNamePhone': '\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 \u0648\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641',
        'customers.errNameLong': '\u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644 \u0637\u0648\u064A\u0644 \u062C\u062F\u0627\u064B',
        'customers.errPhoneLong': '\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0637\u0648\u064A\u0644 \u062C\u062F\u0627\u064B',
        'customers.errPhoneShort': '\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0642\u0635\u064A\u0631 \u062C\u062F\u0627\u064B',
        'customers.errPhoneInvalid': '\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D',
        'customers.updated': '\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0639\u0645\u064A\u0644',
        'customers.added': '\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0639\u0645\u064A\u0644 \u0628\u0646\u062C\u0627\u062D',
        'nav.expenses': '\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A',
        'nav.insurance': '\u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0635\u062D\u064A',
        'nav.warehouses': '\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A',
        'nav.po': '\u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u0634\u0631\u0627\u0621',
        'nav.doctors': '\u0627\u0644\u0623\u0637\u0628\u0627\u0621',
        'nav.loyalty': '\u0627\u0644\u0648\u0644\u0627\u0621 \u0648\u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0627\u062A',
        'nav.giftcards': '\u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u0647\u062F\u0627\u064A\u0627',
        'nav.coupons': '\u0643\u0648\u0628\u0648\u0646\u0627\u062A \u0627\u0644\u062E\u0635\u0645',
        'nav.compounds': '\u0627\u0644\u062A\u0631\u0643\u064A\u0628\u0627\u062A',
        'nav.targets': '\u0623\u0647\u062F\u0627\u0641 \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A',
        'dash.expenseToday': '\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0627\u0644\u064A\u0648\u0645',
        'dash.parkedSales': '\u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631 \u0627\u0644\u0645\u0639\u0644\u0642\u0629',
        'dash.noParkedSales': '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631 \u0645\u0639\u0644\u0642\u0629',
        'dash.targetProgress': '\u0627\u0644\u062A\u0642\u062F\u0645 \u0646\u062D\u0648 \u0627\u0644\u0647\u062F\u0641 \u0627\u0644\u0634\u0647\u0631\u064A',
        'dash.latestRx': '\u0622\u062E\u0631 \u0627\u0644\u0648\u0635\u0641\u0627\u062A \u0627\u0644\u0637\u0628\u064A\u0629',
        'dash.systemHealth': '\u0635\u062D\u0629 \u0627\u0644\u0646\u0638\u0627\u0645',
        'dash.welcomeVersion': 'v1.0 \u2014 \u062B\u0627\u0628\u062A \u0648\u0622\u0645\u0646',
        'pos.cartTitle': '\u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0628\u064A\u0639',
        'pos.prescriptionInfo': '\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0627\u0644\u0631\u0648\u0634\u062A\u0629',
        'pos.doctorName': '\u0627\u0633\u0645 \u0627\u0644\u0637\u0628\u064A\u0628',
        'pos.diagnosis': '\u0627\u0644\u062A\u0634\u062E\u064A\u0635',
        'pos.refills': '\u0639\u062F\u062F \u0645\u0631\u0627\u062A \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0635\u0631\u0641',
        'pos.rxDate': '\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0631\u0648\u0634\u062A\u0629',
        'pos.couponCode': '\u0643\u0648\u062F \u0627\u0644\u0643\u0648\u0628\u0648\u0646',
        'pos.giftCardCode': '\u0643\u0648\u062F \u0627\u0644\u0628\u0637\u0627\u0642\u0629',
        'pos.paid': '\u0627\u0644\u0645\u062F\u0641\u0648\u0639',
        'pos.splitCash': '\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0646\u0642\u062F\u064A',
        'pos.checkout': '\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0628\u064A\u0639',
        'pos.park': '\u062A\u0639\u0644\u064A\u0642',
        'pos.print': '\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629',
        'pos.priceTypeRetail': '\u0642\u0637\u0627\u0639\u064A',
        'pos.priceTypeWholesale': '\u062C\u0645\u0644\u0629',
        'inv.thScientific': '\u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u0641\u0639\u0627\u0644\u0629',
        'inv.thCategory': '\u0627\u0644\u062A\u0635\u0646\u064A\u0641',
        'inv.thPrice': '\u0627\u0644\u0633\u0639\u0631',
        'inv.thQty': '\u0627\u0644\u0643\u0645\u064A\u0629',
        'inv.thExpiry': '\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629',
        'inv.thStatus': '\u0627\u0644\u062D\u0627\u0644\u0629',
        'inv.thRx': '\u0648\u0635\u0641\u0629',
        'inv.thSchedule': '\u0627\u0644\u062C\u062F\u0648\u0644',
        'inv.thActions': '\u0625\u062C\u0631\u0627\u0621\u0627\u062A',
        'inv.barcodeScan': '\u0645\u0633\u062D \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u0628\u0627\u0644\u0643\u0627\u0645\u064A\u0631\u0627',
        'supp.thPhone': '\u0627\u0644\u0647\u0627\u062A\u0641',
        'supp.thAddress': '\u0627\u0644\u0639\u0646\u0648\u0627\u0646',
        'supp.thNotes': '\u0627\u0644\u0645\u0644\u0627\u062D\u0638\u0627\u062A',
        'purch.thSupplier': '\u0627\u0644\u0645\u0648\u0631\u062F',
        'purch.thDate': '\u0627\u0644\u062A\u0627\u0631\u064A\u062E',
        'purch.thItems': '\u0639\u062F\u062F \u0627\u0644\u0623\u0635\u0646\u0627\u0641',
        'purch.thTotal': '\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A',
        'purch.thDiscount': '\u0627\u0644\u062E\u0635\u0645',
        'purch.thNet': '\u0627\u0644\u0635\u0627\u0641\u064A',
        'cust.thTotal': '\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A',
        'cust.thPoints': '\u0627\u0644\u0646\u0642\u0627\u0637',
        'cust.thDebt': '\u0627\u0644\u0645\u062F\u064A\u0648\u0646\u064A\u0629',
        'cust.thLastPurchase': '\u0622\u062E\u0631 \u0634\u0631\u0627\u0621',
        'rep.totalExpenses': '\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A',
        'rep.closings': '\u0633\u062C\u0644 \u0627\u0644\u0625\u0642\u0641\u0627\u0644\u0627\u062A \u0627\u0644\u064A\u0648\u0645\u064A\u0629',
        'rep.hide': '\u0625\u062E\u0641\u0627\u0621',
        'exp.title': '\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A',
        'exp.add': '\u0625\u0636\u0627\u0641\u0629 \u0645\u0635\u0631\u0648\u0641',
        'exp.total': '\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062A',
        'exp.today': '\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0627\u0644\u064A\u0648\u0645',
        'exp.month': '\u0645\u0635\u0631\u0648\u0641\u0627\u062A \u0627\u0644\u0634\u0647\u0631',
        'exp.byCategory': '\u062D\u0633\u0628 \u0627\u0644\u0641\u0626\u0629',
        'exp.filter': '\u062A\u0635\u0641\u064A\u0629',
        'ins.title': '\u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0627\u0644\u0635\u062D\u064A',
        'ins.add': '\u0634\u0631\u0643\u0629 \u062A\u0623\u0645\u064A\u0646 \u062C\u062F\u064A\u062F\u0629',
        'ins.edit': '\u062A\u0639\u062F\u064A\u0644 \u0634\u0631\u0643\u0629 \u062A\u0623\u0645\u064A\u0646',
        'set.usersManagement': '\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646',
        'set.invoiceCustomization': '\u062A\u062E\u0635\u064A\u0635 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629',
        'set.loyaltyLevels': '\u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0648\u0644\u0627\u0621',
        'set.dashboardCustomization': '\u062A\u062E\u0635\u064A\u0635 \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645',
        'set.currencies': '\u0627\u0644\u0639\u0645\u0644\u0627\u062A',
        'set.announcements': '\u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062A',
        'set.supplierPrices': '\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646',
        'set.tools': '\u0627\u0644\u0623\u062F\u0648\u0627\u062A',
        'set.receiptHeader': '\u0631\u0623\u0633 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629',
        'set.paperSize': '\u062D\u062C\u0645 \u0627\u0644\u0648\u0631\u0642',
        'set.showLogo': '\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0634\u0639\u0627\u0631',
        'set.showTax': '\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0636\u0631\u064A\u0628\u0629',
        'set.showPoints': '\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u0646\u0642\u0627\u0637',
        'set.saveReceipt': '\u062D\u0641\u0638 \u0625\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629',
        'set.pointsPer10': '\u0646\u0642\u0627\u0637 \u0644\u0643\u0644 10 \u062C.\u0645',
        'set.redeemValue': '\u0642\u064A\u0645\u0629 \u0627\u0644\u0627\u0633\u062A\u0628\u062F\u0627\u0644 (\u0643\u0644 X \u0646\u0642\u0637\u0629)',
        'set.addTier': '\u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u062A\u0648\u0649',
        'set.saveTiers': '\u062D\u0641\u0638 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0648\u0644\u0627\u0621',
        'set.widgetRecentSales': '\u0622\u062E\u0631 \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A',
        'set.widgetTopMeds': '\u0623\u0641\u0636\u0644 \u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0645\u0628\u064A\u0639\u0627\u064B',
        'set.widgetExpiryAlerts': '\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629',
        'set.widgetLowStock': '\u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0627\u0644\u0645\u0646\u062E\u0641\u0636',
        'set.widgetTodayStats': '\u0625\u062D\u0635\u0627\u0626\u064A\u0627\u062A \u0627\u0644\u064A\u0648\u0645',
        'set.widgetProfitChart': '\u0627\u0644\u0631\u0633\u0645 \u0627\u0644\u0628\u064A\u0627\u0646\u064A \u0644\u0644\u0623\u0631\u0628\u0627\u062D',
        'set.widgetTargetProgress': '\u0627\u0644\u062A\u0642\u062F\u0645 \u0646\u062D\u0648 \u0627\u0644\u0647\u062F\u0641',
        'set.widgetDoctorRx': '\u0648\u0635\u0641\u0627\u062A \u0627\u0644\u0623\u0637\u0628\u0627\u0621',
        'set.saveWidgets': '\u062D\u0641\u0638 \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',
        'set.addCurrency': '\u0625\u0636\u0627\u0641\u0629 \u0639\u0645\u0644\u0629',
        'set.addAnnouncement': '\u0625\u0636\u0627\u0641\u0629 \u0625\u0639\u0644\u0627\u0646',
        'set.addSupplierPrice': '\u0625\u0636\u0627\u0641\u0629 \u0633\u0639\u0631',
        'set.touchMode': '\u062A\u0641\u0639\u064A\u0644 \u0648\u0636\u0639 \u0627\u0644\u0644\u0645\u0633',
        'set.importCSV': '\u0627\u0633\u062A\u064A\u0631\u0627\u062F CSV',
        'set.archiveInvoices': '\u0623\u0631\u0634\u0641\u0629 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631 \u0627\u0644\u0642\u062F\u064A\u0645\u0629',
        'set.clearAllData': '\u0645\u0633\u062D \u062C\u0645\u064A\u0639 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A',
        'set.quickLogin': '\u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644 \u0633\u0631\u064A\u0639 (PIN)',
        'set.filterBySupplier': '\u062A\u0635\u0641\u064A\u0629 \u062D\u0633\u0628 \u0627\u0644\u0645\u0648\u0631\u062F',
        'user.add': '\u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u062A\u062E\u062F\u0645',
        'user.edit': '\u062A\u0639\u062F\u064A\u0644 \u0645\u0633\u062A\u062E\u062F\u0645',
        'user.roleAdmin': '\u0645\u062F\u064A\u0631',
        'user.roleCashier': '\u0643\u0627\u0634\u064A\u0631',
        'user.rolePharmacist': '\u0635\u064A\u062F\u0644\u064A',
        'status.available': '\u0645\u062A\u0648\u0641\u0631',
        'status.low': '\u0645\u0646\u062E\u0641\u0636',
        'status.outOfStock': '\u0646\u0641\u0630',
        'status.expired': '\u0645\u0646\u062A\u0647\u064A',
        'status.completed': '\u0645\u0643\u062A\u0645\u0644\u0629',
        'status.cancelled': '\u0645\u0644\u063A\u064A\u0629',
        'status.active': '\u0646\u0634\u0637\u0629',
        'status.used': '\u0645\u0633\u062A\u062E\u062F\u0645\u0629',
        'status.pending': '\u0645\u0639\u0644\u0642',
        'pm.cash': '\u0646\u0642\u062F\u0627\u064B',
        'pm.vodafone': '\u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634',
        'pm.instapay': '\u0625\u0646\u0633\u062A\u0627 \u0628\u0627\u064A',
        'pm.card': '\u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062A\u0645\u0627\u0646',
        'pm.split': '\u0645\u0642\u0633\u0645',
        'pm.bank': '\u062A\u062D\u0648\u064A\u0644 \u0628\u0646\u0643\u064A',
        'pm.cheque': '\u0634\u064A\u0643',
        'schedule.normal': '\u0639\u0627\u062F\u064A',
        'schedule.schedule1': '\u062C\u062F\u0648\u0644 \u0623\u0648\u0644',
        'schedule.schedule2': '\u062C\u062F\u0648\u0644 \u062B\u0627\u0646\u064A',
        'schedule.schedule3': '\u062C\u062F\u0648\u0644 \u062B\u0627\u0644\u062B',
        'stock.addTitle': '\u0625\u0636\u0627\u0641\u0629 \u0645\u062E\u0632\u0648\u0646',
        'stock.medicine': '\u0627\u0644\u062F\u0648\u0627\u0621',
        'stock.qtyAdded': '\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u0645\u0636\u0627\u0641\u0629',
        'stock.sellingPrice': '\u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639',
        'stock.save': '\u062D\u0641\u0638',
        'med.addTitle': '\u0625\u0636\u0627\u0641\u0629 \u062F\u0648\u0627\u0621 \u062C\u062F\u064A\u062F',
        'med.name': '\u0627\u0633\u0645 \u0627\u0644\u062F\u0648\u0627\u0621',
        'med.scientific': '\u0627\u0644\u0645\u0627\u062F\u0629 \u0627\u0644\u0641\u0639\u0627\u0644\u0629',
        'med.category': '\u0627\u0644\u062A\u0635\u0646\u064A\u0641',
        'med.sellingPrice': '\u0633\u0639\u0631 \u0627\u0644\u0628\u064A\u0639',
        'med.qty': '\u0627\u0644\u0643\u0645\u064A\u0629',
        'med.expiry': '\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0629',
        'med.barcode': '\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F',
        'med.schedule': '\u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u0627\u0644\u0631\u0642\u0627\u0628\u064A',
        'med.wholesalePrice': '\u0633\u0639\u0631 \u0627\u0644\u062C\u0645\u0644\u0629',
        'med.minWholesaleQty': '\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u062C\u0645\u0644\u0629',
        'med.batch': '\u0631\u0642\u0645 \u0627\u0644\u0628\u0627\u062A\u0634',
        'med.reorderPoint': '\u0646\u0642\u0637\u0629 \u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0637\u0644\u0628',
        'med.needsRx': '\u064A\u062D\u062A\u0627\u062C \u0648\u0635\u0641\u0629 \u0637\u0628\u064A\u0629',
        'med.add': '\u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u062F\u0648\u0627\u0621',
        'wh.title': '\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A',
        'wh.subtitle': '\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u062E\u0627\u0632\u0646 \u0648\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A',
        'wh.add': '\u0625\u0636\u0627\u0641\u0629 \u0645\u0633\u062A\u0648\u062F\u0639',
        'wh.transfer': '\u062A\u062D\u0648\u064A\u0644 \u0645\u062E\u0632\u0648\u0646',
        'wh.list': '\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639\u0627\u062A',
        'wh.thLocation': '\u0627\u0644\u0645\u0648\u0642\u0639',
        'wh.thItems': '\u0639\u062F\u062F \u0627\u0644\u0623\u0635\u0646\u0627\u0641',
        'wh.transferLog': '\u0633\u062C\u0644 \u062A\u062D\u0648\u064A\u0644\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646',
        'po.title': '\u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u0634\u0631\u0627\u0621',
        'po.subtitle': '\u0625\u062F\u0627\u0631\u0629 \u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0634\u0631\u0627\u0621 \u0644\u0644\u0645\u0648\u0631\u062F\u064A\u0646',
        'po.add': '\u0623\u0645\u0631 \u0634\u0631\u0627\u0621 \u062C\u062F\u064A\u062F',
        'po.list': '\u0642\u0627\u0626\u0645\u0629 \u0623\u0648\u0627\u0645\u0631 \u0627\u0644\u0634\u0631\u0627\u0621',
        'doc.title': '\u0627\u0644\u0623\u0637\u0628\u0627\u0621',
        'doc.subtitle': '\u0625\u062F\u0627\u0631\u0629 \u0633\u062C\u0644 \u0627\u0644\u0623\u0637\u0628\u0627\u0621 \u0648\u0627\u0644\u0648\u0635\u0641\u0627\u062A',
        'doc.add': '\u0625\u0636\u0627\u0641\u0629 \u0637\u0628\u064A\u0628',
        'doc.list': '\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0623\u0637\u0628\u0627\u0621',
        'loyalty.title': '\u0627\u0644\u0648\u0644\u0627\u0621 \u0648\u0627\u0644\u0645\u0643\u0627\u0641\u0623\u0627\u062A',
        'loyalty.subtitle': '\u0646\u0638\u0627\u0645 \u0646\u0642\u0627\u0637 \u0648\u0644\u0627\u0621 \u0627\u0644\u0639\u0645\u0644\u0627\u0621',
        'loyalty.ranking': '\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0646\u0642\u0627\u0637',
        'gc.title': '\u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u0647\u062F\u0627\u064A\u0627',
        'gc.subtitle': '\u0625\u062F\u0627\u0631\u0629 \u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0644\u0647\u062F\u0627\u064A\u0627 \u0648\u0627\u0644\u0631\u0635\u064A\u062F',
        'gc.add': '\u0625\u0636\u0627\u0641\u0629 \u0628\u0637\u0627\u0642\u0629',
        'gc.list': '\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0628\u0637\u0627\u0642\u0627\u062A',
        'coupon.title': '\u0643\u0648\u0628\u0648\u0646\u0627\u062A \u0627\u0644\u062E\u0635\u0645',
        'coupon.subtitle': '\u0625\u062F\u0627\u0631\u0629 \u0643\u0648\u0628\u0648\u0646\u0627\u062A \u0648\u0642\u0633\u0627\u0626\u0645 \u0627\u0644\u062E\u0635\u0645',
        'coupon.add': '\u0625\u0636\u0627\u0641\u0629 \u0643\u0648\u0628\u0648\u0646',
        'coupon.list': '\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0643\u0648\u0628\u0648\u0646\u0627\u062A',
        'compound.title': '\u0627\u0644\u062A\u0631\u0643\u064A\u0628\u0627\u062A',
        'compound.subtitle': '\u062A\u0631\u0643\u064A\u0628\u0627\u062A \u0627\u0644\u0623\u062F\u0648\u064A\u0629 \u0627\u0644\u062C\u0627\u0647\u0632\u0629',
        'compound.add': '\u0625\u0636\u0627\u0641\u0629 \u062A\u0631\u0643\u064A\u0628\u0629',
        'compound.list': '\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0631\u0643\u064A\u0628\u0627\u062A',
        'target.title': '\u0623\u0647\u062F\u0627\u0641 \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A',
        'target.subtitle': '\u062A\u062D\u062F\u064A\u062F \u0648\u0645\u062A\u0627\u0628\u0639\u0629 \u0623\u0647\u062F\u0627\u0641 \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A \u0627\u0644\u0634\u0647\u0631\u064A\u0629',
        'target.add': '\u0625\u0636\u0627\u0641\u0629 \u0647\u062F\u0641',
        'target.list': '\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0623\u0647\u062F\u0627\u0641',
        'auth.username': '\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645',
        'auth.hintText': '\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A\u0629:',
        'auth.quickLoginTitle': '\u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644 \u0633\u0631\u064A\u0639',
        'auth.quickLoginDesc': '\u0623\u062F\u062E\u0644 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0633\u0631\u064A \u0644\u0644\u0643\u0627\u0634\u064A\u0631',
        'auth.quickLoginBtn': '\u062F\u062E\u0648\u0644',
        'sidebar.logoVersion': 'v1.0 \u2014 \u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0635\u064A\u062F\u0644\u064A\u0627\u062A',
        'sidebar.userName': '\u0627\u0644\u0645\u062F\u064A\u0631',
        'sidebar.logout': '\u062E\u0631\u0648\u062C',
    },
    en: {
        'nav.dashboard': 'Dashboard',
        'nav.pos': 'POS',
        'nav.inventory': 'Inventory',
        'nav.customers': 'Customers',
        'nav.suppliers': 'Suppliers',
        'nav.purchases': 'Purchases',
        'nav.reports': 'Reports',
        'nav.settings': 'Settings',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.close': 'Close',
        'common.print': 'Print',
        'common.add': 'Add',
        'common.edit': 'Edit',
        'common.delete': 'Delete',
        'common.search': 'Search',
        'common.yes': 'Yes',
        'common.no': 'No',
        'common.total': 'Total',
        'common.discount': 'Discount',
        'common.net': 'Net',
        'common.paid': 'Paid',
        'common.change': 'Change',
        'common.status': 'Status',
        'common.actions': 'Actions',
        'common.notes': 'Notes',
        'common.id': '#',
        'common.name': 'Name',
        'common.phone': 'Phone',
        'common.address': 'Address',
        'common.date': 'Date',
        'common.qty': 'Qty',
        'common.price': 'Price',
        'common.expiry': 'Expiry Date',
        'common.reason': 'Reason',
        'common.all': 'All',
        'common.view': 'View',
        'common.invoice': 'Invoice',
        'common.amount': 'Amount',
        'common.items': 'Items',
        'common.category': 'Category',
        'common.back': 'Back',
        'common.confirm': 'Confirm',
        'common.email': 'Email',
        'common.filter': 'Filter',
        'dash.title': 'Dashboard',
        'dash.subtitle': 'Pharmacy Activity Overview',
        'dash.welcome': 'Welcome to ValoPOS',
        'dash.welcomeDesc': 'Integrated pharmacy management system \u2014 Invoices, Inventory, Customers, Reports',
        'dash.todaySales': 'Today\u2019s Sales',
        'dash.totalMeds': 'Total Medicines',
        'dash.lowStock': 'Low Stock',
        'dash.outOfStock': 'Out of Stock',
        'dash.expiring': 'Expiring Soon',
        'dash.monthlySales': 'Month\u2019s Sales',
        'dash.recentSales': 'Recent Sales',
        'dash.topSelling': 'Top Selling',
        'dash.expiryAlert': 'Expiring Medicines',
        'dash.noSales': 'No sales yet',
        'dash.noData': 'No data yet',
        'dash.noExpiry': 'No medicines expiring soon',
        'pos.title': 'Point of Sale',
        'pos.newSale': 'New Invoice',
        'pos.searchPlaceholder': 'Search medicine by name or barcode...',
        'pos.allCategories': 'All Categories',
        'pos.emptyCart': 'No items in invoice',
        'pos.noMeds': 'No matching medicines',
        'pos.stock': 'Stock:',
        'inv.title': 'Inventory Management',
        'inv.addStock': 'Add Stock',
        'inv.addMed': 'New Medicine',
        'inv.export': 'Export',
        'inv.exportCSV': 'Export CSV',
        'inv.searchPlaceholder': 'Search inventory...',
        'inv.allCategories': 'All Categories',
        'inv.allStatus': 'All Status',
        'inv.edit': 'Edit',
        'inv.noResults': 'No results',
        'cust.title': 'Customer Management',
        'cust.add': 'New Customer',
        'cust.searchPlaceholder': 'Search by name or phone...',
        'cust.noCustomers': 'No customers',
        'cust.payDebt': 'Pay Debt',
        'supp.title': 'Supplier Management',
        'supp.add': 'New Supplier',
        'supp.searchPlaceholder': 'Search supplier...',
        'supp.noSuppliers': 'No suppliers',
        'purch.title': 'Purchase Invoices',
        'purch.add': 'New Purchase Invoice',
        'purch.searchPlaceholder': 'Search purchase invoices...',
        'purch.allSuppliers': 'All Suppliers',
        'purch.noPurchases': 'No purchase invoices',
        'rep.title': 'Reports',
        'rep.filter': 'Filter',
        'rep.exportCSV': 'Export CSV',
        'rep.todaySales': 'Today\u2019s Sales',
        'rep.monthSales': 'Month\u2019s Sales',
        'rep.totalSales': 'Total Sales',
        'rep.totalProfit': 'Total Profit',
        'rep.profitMargin': 'Profit Margin',
        'rep.todayProfit': 'Today\u2019s Profit',
        'rep.monthProfit': 'Month\u2019s Profit',
        'rep.dailyProfit': 'Daily Profit (Last 7 Days)',
        'rep.allInvoices': 'All Invoices',
        'rep.returnLog': 'Returns Log',
        'rep.invoiceCount': 'Invoices:',
        'rep.noInvoices': 'No invoices',
        'rep.noReturns': 'No returns yet',
        'set.title': 'Settings',
        'set.pharmacyInfo': 'Pharmacy Info',
        'set.pharmacyName': 'Pharmacy Name',
        'set.address': 'Address',
        'set.phone': 'Phone Number',
        'set.receiptFooter': 'Receipt Footer',
        'set.taxRate': 'Tax Rate (%)',
        'set.currency': 'Currency',
        'set.save': 'Save Settings',
        'set.dataBackup': 'Data & Backup',
        'set.clearData': 'Clear All Data',
        'set.downloadBackup': 'Download Backup',
        'set.importBackup': 'Import Backup',
        'set.exportAllData': 'Export All Data',
        'set.importData': 'Import Data',
        'set.importWarning': '\u26A0\uFE0F Warning: Importing will OVERWRITE all existing data!',
        'set.lastBackup': 'Last backup:',
        'set.noBackup': 'No previous backup',
        'set.backupExported': 'Backup exported - size:',
        'set.restoreSuccess': 'Data restored successfully! Reloading page...',
        'set.invalidBackupFile': 'Invalid backup file',
        'set.exportCSV': 'Export Inventory CSV',
        'lang.toggle': '\u0639\u0631\u0628\u064A',
        'cart.withoutCustomer': 'No Customer',
        'keyboard.search': 'Search',
        'keyboard.newInvoice': 'New Invoice',
        'keyboard.checkout': 'Checkout',
        'keyboard.closeSearch': 'Close Search',
        'auth.title': 'ValoPOS',
        'auth.subtitle': 'Pharmacy Management System',
        'auth.password': 'Password',
        'auth.passwordPlaceholder': 'Enter password',
        'auth.login': 'Login',
        'auth.defaultHint': 'Default password:',
        'auth.errorWrong': 'Incorrect password',
        'auth.changePass': 'Change Password',
        'auth.currentPass': 'Current Password',
        'auth.newPass': 'New Password',
        'auth.confirmPass': 'Confirm New Password',
        'auth.savePass': 'Change Password',
        'auth.back': 'Back',
        'auth.switchToChange': 'Change Password',
        'auth.switchToLogin': 'Back to Login',
        'auth.changeErrorWrong': 'Current password is incorrect',
        'auth.changeErrorLength': 'New password must be 6 characters or more',
        'auth.changeErrorMatch': 'Passwords do not match',
        'wa.tooltip': 'Book your copy now!',
        '\u0645\u062A\u0648\u0641\u0631': 'Available',
        '\u0645\u0646\u062E\u0641\u0636': 'Low',
        '\u0646\u0641\u0630': 'Out of Stock',
        '\u0645\u0646\u062A\u0647\u064A': 'Expired',
        '\u0645\u0643\u062A\u0645\u0644\u0629': 'Completed',
        '\u0645\u0644\u063A\u064A\u0629': 'Cancelled',
        '\u0645\u0631\u062A\u062C\u0639 \u0643\u0644\u064A': 'Full Return',
        '\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A': 'Partial Return',
        '\u0627\u0644\u0643\u0644': 'All',
        '\u0644\u0627 \u062A\u0648\u062C\u062F \u0646\u062A\u0627\u0626\u062C': 'No results found',
        '\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u0644\u0627\u0621': 'No customers found',
        '\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0631\u062F\u0648\u0646': 'No suppliers found',
        '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631 \u0634\u0631\u0627\u0621': 'No purchase invoices found',
        '\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631': 'No invoices found',
        'dash.prescription': 'Prescription',
        'dash.cancel': 'Cancel',
        'dash.day': 'day',
        'dash.noExpiring': 'No medicines expiring soon',
        'reports.return': 'Return',
        'reports.cancel': 'Cancel',
        'reports.noExport': 'No invoices to export',
        'reports.csvHeader': 'Invoice#,Date,Items,Subtotal,Discount,Net,Status',
        'reports.exported': 'Report exported successfully',
        'returns.qtyLabel': 'Qty:',
        'returns.allReturned': 'All items already returned',
        'returns.selectItem': 'Select at least one item to return',
        'returns.noItem': 'No item selected',
        'returns.noReason': 'No reason',
        'returns.success': 'Return recorded successfully',
        'returns.items': 'item(s)',
        'returns.value': 'worth',
        'returns.noReturns': 'No returns yet',
        'set.currencyDefault': 'EGP',
        'set.saved': 'Settings saved successfully',
        'set.receiptFooterDefault': 'Thank you for your business',
        'set.resetConfirm1': 'Are you sure? All data will be erased.',
        'set.resetConfirm2': 'Final confirmation? This cannot be undone!',
        'set.resetDone': 'Data cleared',
        'set.importSuccess': 'Data imported successfully',
        'set.importError': 'Error reading file',
        'set.backupDownloaded': 'Backup downloaded',
        'set.backupReminder': 'We recommend creating a data backup',
        'inventory.day': 'day',
        'inventory.updated': 'Updated ',
        'inventory.noExport': 'No medicines to export',
        'inventory.csvHeader': 'ID,Name,Scientific Name,Category,Price,Qty,Expiry,Barcode,Prescription',
        'inventory.rxYes': 'Yes',
        'inventory.rxNo': 'No',
        'inventory.exported': 'Inventory exported to CSV',
        'barcode.starting': 'Starting camera...',
        'barcode.unsupported': 'Auto-scan not supported, enter barcode manually',
        'barcode.aim': 'Point camera at barcode',
        'barcode.cameraReady': 'Camera running, enter barcode manually',
        'barcode.error': 'Error:',
        'barcode.cameraError': 'Could not start camera:',
        'customers.noCustomers': 'No customers found',
        'customers.addNew': 'Add New Customer',
        'customers.errNamePhone': 'Please enter customer name and phone',
        'customers.errNameLong': 'Customer name is too long',
        'customers.errPhoneLong': 'Phone number is too long',
        'customers.errPhoneShort': 'Phone number is too short',
        'customers.errPhoneInvalid': 'Invalid phone number',
        'customers.updated': 'Customer data updated',
        'customers.added': 'Customer added successfully',
        'nav.expenses': 'Expenses',
        'nav.insurance': 'Health Insurance',
        'nav.warehouses': 'Warehouses',
        'nav.po': 'Purchase Orders',
        'nav.doctors': 'Doctors',
        'nav.loyalty': 'Loyalty & Rewards',
        'nav.giftcards': 'Gift Cards',
        'nav.coupons': 'Discount Coupons',
        'nav.compounds': 'Compounds',
        'nav.targets': 'Sales Targets',
        'dash.expenseToday': "Today's Expenses",
        'dash.parkedSales': 'Parked Sales',
        'dash.noParkedSales': 'No parked sales',
        'dash.targetProgress': 'Monthly Target Progress',
        'dash.latestRx': 'Latest Prescriptions',
        'dash.systemHealth': 'System Health',
        'dash.welcomeVersion': 'v1.0 \u2014 Stable & Secure',
        'pos.cartTitle': 'Sale Invoice',
        'pos.prescriptionInfo': 'Prescription Info',
        'pos.doctorName': 'Doctor Name',
        'pos.diagnosis': 'Diagnosis',
        'pos.refills': 'Refills Count',
        'pos.rxDate': 'Prescription Date',
        'pos.couponCode': 'Coupon Code',
        'pos.giftCardCode': 'Card Code',
        'pos.paid': 'Paid',
        'pos.splitCash': 'Cash Amount',
        'pos.checkout': 'Checkout',
        'pos.park': 'Park',
        'pos.print': 'Print Receipt',
        'pos.priceTypeRetail': 'Retail',
        'pos.priceTypeWholesale': 'Wholesale',
        'inv.thScientific': 'Scientific Name',
        'inv.thCategory': 'Category',
        'inv.thPrice': 'Price',
        'inv.thQty': 'Qty',
        'inv.thExpiry': 'Expiry Date',
        'inv.thStatus': 'Status',
        'inv.thRx': 'Rx',
        'inv.thSchedule': 'Schedule',
        'inv.thActions': 'Actions',
        'inv.barcodeScan': 'Barcode Scan',
        'supp.thPhone': 'Phone',
        'supp.thAddress': 'Address',
        'supp.thNotes': 'Notes',
        'purch.thSupplier': 'Supplier',
        'purch.thDate': 'Date',
        'purch.thItems': 'Items',
        'purch.thTotal': 'Total',
        'purch.thDiscount': 'Discount',
        'purch.thNet': 'Net',
        'cust.thTotal': 'Total',
        'cust.thPoints': 'Points',
        'cust.thDebt': 'Debt',
        'cust.thLastPurchase': 'Last Purchase',
        'rep.totalExpenses': 'Total Expenses',
        'rep.closings': 'Daily Closings Log',
        'rep.hide': 'Hide',
        'exp.title': 'Expenses',
        'exp.add': 'Add Expense',
        'exp.total': 'Total Expenses',
        'exp.today': "Today's Expenses",
        'exp.month': "Month's Expenses",
        'exp.byCategory': 'By Category',
        'exp.filter': 'Filter',
        'ins.title': 'Health Insurance',
        'ins.add': 'New Insurance Company',
        'ins.edit': 'Edit Insurance Company',
        'set.usersManagement': 'User Management',
        'set.invoiceCustomization': 'Invoice Customization',
        'set.loyaltyLevels': 'Loyalty Levels',
        'set.dashboardCustomization': 'Dashboard Customization',
        'set.currencies': 'Currencies',
        'set.announcements': 'Announcements',
        'set.supplierPrices': 'Supplier Prices',
        'set.tools': 'Tools',
        'set.receiptHeader': 'Receipt Header',
        'set.paperSize': 'Paper Size',
        'set.showLogo': 'Show Logo',
        'set.showTax': 'Show Tax',
        'set.showPoints': 'Show Points',
        'set.saveReceipt': 'Save Receipt Settings',
        'set.pointsPer10': 'Points per 10 EGP',
        'set.redeemValue': 'Redemption Value (every X points)',
        'set.addTier': 'Add Tier',
        'set.saveTiers': 'Save Loyalty Tiers',
        'set.widgetRecentSales': 'Recent Sales',
        'set.widgetTopMeds': 'Top Selling Medicines',
        'set.widgetExpiryAlerts': 'Expiry Alerts',
        'set.widgetLowStock': 'Low Stock',
        'set.widgetTodayStats': "Today's Stats",
        'set.widgetProfitChart': 'Profit Chart',
        'set.widgetTargetProgress': 'Target Progress',
        'set.widgetDoctorRx': 'Doctor Prescriptions',
        'set.saveWidgets': 'Save Settings',
        'set.addCurrency': 'Add Currency',
        'set.addAnnouncement': 'Add Announcement',
        'set.addSupplierPrice': 'Add Price',
        'set.touchMode': 'Enable Touch Mode',
        'set.importCSV': 'Import CSV',
        'set.archiveInvoices': 'Archive Old Invoices',
        'set.clearAllData': 'Clear All Data',
        'set.quickLogin': 'Quick Login (PIN)',
        'set.filterBySupplier': 'Filter by Supplier',
        'user.add': 'Add User',
        'user.edit': 'Edit User',
        'user.roleAdmin': 'Admin',
        'user.roleCashier': 'Cashier',
        'user.rolePharmacist': 'Pharmacist',
        'status.available': 'Available',
        'status.low': 'Low',
        'status.outOfStock': 'Out of Stock',
        'status.expired': 'Expired',
        'status.completed': 'Completed',
        'status.cancelled': 'Cancelled',
        'status.active': 'Active',
        'status.used': 'Used',
        'status.pending': 'Pending',
        'pm.cash': 'Cash',
        'pm.vodafone': 'Vodafone Cash',
        'pm.instapay': 'InstaPay',
        'pm.card': 'Credit Card',
        'pm.split': 'Split',
        'pm.bank': 'Bank Transfer',
        'pm.cheque': 'Cheque',
        'schedule.normal': 'Normal',
        'schedule.schedule1': 'Schedule 1',
        'schedule.schedule2': 'Schedule 2',
        'schedule.schedule3': 'Schedule 3',
        'stock.addTitle': 'Add Stock',
        'stock.medicine': 'Medicine',
        'stock.qtyAdded': 'Quantity Added',
        'stock.sellingPrice': 'Selling Price',
        'stock.save': 'Save',
        'med.addTitle': 'Add New Medicine',
        'med.name': 'Medicine Name',
        'med.scientific': 'Scientific Name',
        'med.category': 'Category',
        'med.sellingPrice': 'Selling Price',
        'med.qty': 'Quantity',
        'med.expiry': 'Expiry Date',
        'med.barcode': 'Barcode',
        'med.schedule': 'Schedule Classification',
        'med.wholesalePrice': 'Wholesale Price',
        'med.minWholesaleQty': 'Min Wholesale Qty',
        'med.batch': 'Batch Number',
        'med.reorderPoint': 'Reorder Point',
        'med.needsRx': 'Needs Prescription',
        'med.add': 'Add Medicine',
        'wh.title': 'Warehouses',
        'wh.subtitle': 'Warehouse Management',
        'wh.add': 'Add Warehouse',
        'wh.transfer': 'Transfer Stock',
        'wh.list': 'Warehouse List',
        'wh.thLocation': 'Location',
        'wh.thItems': 'Items Count',
        'wh.transferLog': 'Stock Transfer Log',
        'po.title': 'Purchase Orders',
        'po.subtitle': 'Manage Supplier Purchase Orders',
        'po.add': 'New Purchase Order',
        'po.list': 'Purchase Orders List',
        'doc.title': 'Doctors',
        'doc.subtitle': 'Doctor & Prescription Records',
        'doc.add': 'Add Doctor',
        'doc.list': 'Doctor List',
        'loyalty.title': 'Loyalty & Rewards',
        'loyalty.subtitle': 'Customer Loyalty Points System',
        'loyalty.ranking': 'Points Ranking',
        'gc.title': 'Gift Cards',
        'gc.subtitle': 'Gift Card & Balance Management',
        'gc.add': 'Add Card',
        'gc.list': 'Card List',
        'coupon.title': 'Discount Coupons',
        'coupon.subtitle': 'Manage Discount Coupons & Vouchers',
        'coupon.add': 'Add Coupon',
        'coupon.list': 'Coupon List',
        'compound.title': 'Compounds',
        'compound.subtitle': 'Ready-made Medicine Compounds',
        'compound.add': 'Add Compound',
        'compound.list': 'Compound List',
        'target.title': 'Sales Targets',
        'target.subtitle': 'Set & Track Monthly Sales Targets',
        'target.add': 'Add Target',
        'target.list': 'Target List',
        'auth.username': 'Username',
        'auth.hintText': 'Default password:',
        'auth.quickLoginTitle': 'Quick Login',
        'auth.quickLoginDesc': 'Enter cashier PIN code',
        'auth.quickLoginBtn': 'Login',
        'sidebar.logoVersion': 'v1.0 \u2014 Pharmacy Management System',
        'sidebar.userName': 'Admin',
        'sidebar.logout': 'Logout',
    }
};

let currentLang = localStorage.getItem('valopos_lang') || 'ar';

function getText(key) {
    if (LANG[currentLang] && LANG[currentLang][key] !== undefined) {
        return LANG[currentLang][key];
    }
    if (LANG.ar && LANG.ar[key] !== undefined) {
        return LANG.ar[key];
    }
    return key;
}

function getCurrentLang() { return currentLang; }

function setLang(l) {
    if (l !== 'ar' && l !== 'en') l = 'ar';
    currentLang = l;
    localStorage.setItem('valopos_lang', l);
    document.documentElement.lang = l === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    let toggle = document.getElementById('langToggleBtn');
    if (toggle) {
        toggle.textContent = getText('lang.toggle');
        toggle.title = getText('lang.toggle');
    }
    translatePage();
    reRenderCurrentPage();
    updateDate();
}

function toggleLang() {
    setLang(currentLang === 'ar' ? 'en' : 'ar');
}

function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        let key = el.getAttribute('data-i18n');
        let translation = getText(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            if (el.hasAttribute('placeholder')) {
                el.setAttribute('placeholder', translation);
            }
        } else {
            el.textContent = translation;
        }
    });
}

function reRenderCurrentPage() {
    let activePage = document.querySelector('.page.active');
    if (!activePage) return;
    let id = activePage.id;
    if (id === 'page-dashboard') renderDashboard();
    else if (id === 'page-pos') { renderMedsGrid(); loadCustomerSelect(); renderCart(); }
    else if (id === 'page-inventory') renderInventory();
    else if (id === 'page-customers') renderCustomers();
    else if (id === 'page-suppliers') renderSuppliers();
    else if (id === 'page-purchases') renderPurchases();
    else if (id === 'page-reports') renderReports();
    else if (id === 'page-expenses') renderExpenses();
    else if (id === 'page-settings') { loadSettings(); }
    else if (id === 'page-warehouses') { renderWarehouses(); renderWarehouseTransfers(); }
    else if (id === 'page-po') { renderPurchaseOrders(); }
    else if (id === 'page-doctors') { renderDoctors(); }
    else if (id === 'page-loyalty') { renderLoyalty(); }
    else if (id === 'page-giftcards') { renderGiftCards(); }
    else if (id === 'page-coupons') { renderCoupons(); }
    else if (id === 'page-compounds') { renderCompounds(); }
    else if (id === 'page-targets') { renderSalesTargets(); }
}

let currentInvoice = null;

let appData = {
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
        currency: 'ج.م',
        taxNumber: '',
        receiptHeader: 'صيدلية فالوبوس',
        receiptShowLogo: false,
        receiptShowTax: true,
        receiptShowPoints: true,
        receiptPaperSize: '80mm',
        loyaltyRate: 1,
        loyaltyRedeemRate: 100,
        loyaltyTiers: [
            { name: 'عادي', minPoints: 0, discountPercent: 0, color: '#94a3b8' },
            { name: 'فضي', minPoints: 500, discountPercent: 5, color: '#64748b' },
            { name: 'ذهبي', minPoints: 2000, discountPercent: 10, color: '#f59e0b' },
            { name: 'بلاتيني', minPoints: 5000, discountPercent: 15, color: '#6366f1' }
        ],
        dashboardWidgets: { recentSales: true, topMeds: true, expiryAlerts: true, lowStockAlerts: true, todayStats: true, profitChart: true, targetProgress: true, doctorPrescriptions: true }
    },
    nextInvoiceId: 1,
    nextPurchaseId: 1,
    nextReturnId: 1,
    returns: [],
    stockChanges: [],
    nextExpenseId: 1,
    expenses: [],
    nextClosingId: 1,
    closings: [],
    scheduleSales: [],
    nextInsuranceId: 1,
    insurances: [],
    parkedSales: [],
    nextSupplierPaymentId: 1,
    supplierPayments: [],
    nextPurchaseReturnId: 1,
    purchaseReturns: [],
    nextUserId: 2,
    users: [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'المدير' }
    ],
    auditLog: [],
    // Feature 1: Multi-Warehouse
    nextWarehouseId: 1,
    warehouses: [{ id: 1, name: 'المخزن الرئيسي', location: '', phone: '', manager: '' }],
    medicineWarehouses: {},
    warehouseTransfers: [],
    nextWarehouseTransferId: 1,
    // Feature 2: Purchase Orders
    nextPurchaseOrderId: 1,
    purchaseOrders: [],
    poPayments: [],
    // Feature 3: Doctors
    nextDoctorId: 1,
    doctors: [],
    // Feature 5: Receipt Customization already in settings
    // Feature 9: Reorder points - added to medicine objects
    // Feature 10: Sales Targets
    salesTargets: [],
    nextSalesTargetId: 1,
    // Feature 14: Gift Cards + Coupons
    nextGiftCardId: 1,
    giftCards: [],
    nextCouponId: 1,
    coupons: [],
    // Feature 15: Compounds
    nextCompoundId: 1,
    compounds: [],
    // Feature 18: Announcements
    announcements: [],
    // Feature 19: Supplier Price Lists
    supplierPrices: [],
    // Feature 20: Multi-Currency
    currencies: [
        { code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م', rate: 1 },
        { code: 'USD', name: 'دولار', symbol: '$', rate: 30.5 },
        { code: 'EUR', name: 'يورو', symbol: '€', rate: 33.2 },
        { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س', rate: 8.1 }
    ],
    defaultCurrency: 'EGP',
    archived: null
};

function loadData() {
    let saved = localStorage.getItem('pharmacy_pos_data');
    if (saved) {
        try {
            let parsed = JSON.parse(saved);
            appData = { ...appData, ...parsed };
            appData.settings = { ...appData.settings, ...parsed.settings };
            if (!appData.users || appData.users.length === 0) {
                appData.users = [{ id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'المدير' }];
                appData.nextUserId = 2;
            }
        } catch (e) {
            console.error('Error loading data');
        }
    }
    loadMeds();
    updateCur();
}

function saveData() {
    try {
        localStorage.setItem('pharmacy_pos_data', JSON.stringify(appData));
    } catch (e) {
        console.error('Error saving data:', e);
        showToast('\u062E\u0637\u0623 \u0641\u064A \u062D\u0641\u0638 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A\u060C \u0627\u0644\u062A\u062E\u0632\u064A\u0646 \u0643\u0627\u0645\u0644', 'error');
    }
}

function loadMeds() {
    loadStock();
    normalizeMedicineFields();
}

function normalizeMedicineFields() {
    for (var i = 0; i < medicinesDB.length; i++) {
        var m = medicinesDB[i];
        if (m.name === undefined && m.n !== undefined) m.name = m.n;
        if (m.scientificName === undefined && m.s !== undefined) m.scientificName = m.s;
        if (m.category === undefined && m.c !== undefined) m.category = m.c;
        if (m.price === undefined && m.p !== undefined) m.price = m.p;
        if (m.manufacturer === undefined && m.m !== undefined) m.manufacturer = m.m;
        if (m.barcode === undefined && m.b !== undefined) m.barcode = m.b;
    }
}

var cur = '\u062C.\u0645';
function updateCur() { cur = escapeHtml(appData.settings.currency || '\u062C.\u0645'); }

function formatDate(d) {
    let date = new Date(d);
    let locale = currentLang === 'ar' ? 'ar-EG' : 'en-US';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(d) {
    let date = new Date(d);
    let locale = currentLang === 'ar' ? 'ar-EG' : 'en-US';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
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
    let d = new Date(dateStr);
    let now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function debounce(fn, delay) {
    let timer;
    return function() {
        let args = arguments;
        let ctx = this;
        clearTimeout(timer);
        timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
    };
}

function showToast(message, type) {
    if (!type) type = 'success';
    let container = document.getElementById('toastContainer');
    if (!container) return;
    let toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    let icons = { success: '\u2705', error: '\u274C', warning: '\u26A0\uFE0F', info: '\u2139\uFE0F' };
    toast.innerHTML = (icons[type] || '') + ' ' + escapeHtml(message);
    container.appendChild(toast);
    setTimeout(function() {
        toast.classList.add('toast-remove');
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

function highlightText(text, query) {
    if (!query) return escapeHtml(text);
    let escaped = query.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
    let re = new RegExp('(' + escaped + ')', 'gi');
    return escapeHtml(text).replace(re, '<mark>$1</mark>');
}

function getExpiryDays(expiryDate) {
    if (!expiryDate) return null;
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    let expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(expiryDate) {
    let days = getExpiryDays(expiryDate);
    if (days === null) return '';
    if (days <= 0) return 'expired';
    if (days <= 30) return 'soon';
    if (days <= 60) return 'warning';
    return 'ok';
}

function getStockStatus(med, threshold) {
    if (threshold === undefined) threshold = 10;
    let expiryStatus = getExpiryStatus(getExpiryDate(med.id));
    if (expiryStatus === 'expired') return 'منتهي';
    if (getQty(med.id) <= 0) return 'نفذ';
    if (getQty(med.id) <= threshold) return 'منخفض';
    return 'متوفر';
}

// ===== NAVIGATION =====

const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

navItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        let pageId = this.dataset.page;
        navItems.forEach(function(n) { n.classList.remove('active'); });
        this.classList.add('active');
        pages.forEach(function(p) { p.classList.remove('active'); });
        let target = document.getElementById('page-' + pageId);
        if (target) target.classList.add('active');
        if (pageId === 'inventory') renderInventory();
        if (pageId === 'reports') renderReports();
        if (pageId === 'dashboard') renderDashboard();
        if (pageId === 'pos') { renderMedsGrid(); loadCustomerSelect(); }
        if (pageId === 'customers') renderCustomers();
        if (pageId === 'suppliers') renderSuppliers();
        if (pageId === 'purchases') { renderPurchases(); loadPurchaseSelects(); }
        if (pageId === 'expenses') renderExpenses();
        if (pageId === 'warehouses') { renderWarehouses(); renderWarehouseTransfers(); }
        if (pageId === 'po') { renderPurchaseOrders(); }
        if (pageId === 'doctors') { renderDoctors(); }
        if (pageId === 'loyalty') { renderLoyalty(); }
        if (pageId === 'giftcards') { renderGiftCards(); }
        if (pageId === 'coupons') { renderCoupons(); }
        if (pageId === 'compounds') { renderCompounds(); }
        if (pageId === 'targets') { renderSalesTargets(); }
        if (pageId === 'settings') { loadSettings(); if (typeof checkTodayClosing === 'function') checkTodayClosing(); }
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
    let now = new Date();
    let locale = currentLang === 'ar' ? 'ar-EG' : 'en-US';
    document.getElementById('dateDisplay').textContent = now.toLocaleDateString(locale, {
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
    let posPage = document.getElementById('page-pos');
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
    let q = this.value.trim();
    if (q.length < 2) return;
    let results = searchMedicines(q);
    if (results.length > 0) {
        document.querySelector('[data-page="pos"]').click();
        document.getElementById('posSearch').value = q;
        renderMedsGrid(q);
    }
});

// ===== POS PAGE =====

function renderMedsGrid(query) {
    let grid = document.getElementById('medsGrid');
    let category = document.getElementById('posCategory').value;
    let meds = query ? searchMedicines(query) : null;
    if (!query) {
        let searchVal = document.getElementById('posSearch').value.trim();
        if (searchVal) { meds = searchMedicines(searchVal); }
    }
    if (!meds) {
        if (category !== '\u0627\u0644\u0643\u0644') {
            meds = getMedicinesByCategory(category);
        }
    }
    if (!meds) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">\uD83D\uDD0D</div><div class="empty-state-text">' + getText('pos.searchPlaceholder') + '</div></div>';
        return;
    }
    if (category !== '\u0627\u0644\u0643\u0644' && meds.length > 200) {
        meds = meds.filter(function(m) { return m.category === category || m.c === category; });
    }
    grid.innerHTML = '';
    if (meds.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">\uD83D\uDC8A</div><div class="empty-state-text">' + getText('pos.noMeds') + '</div></div>';
        return;
    }
    meds.forEach(function(m) {
        let div = document.createElement('div');
        let mQty = getQty(m.id);
        let expiryStatus = getExpiryStatus(getExpiryDate(m.id));
        let extraClass = mQty <= 0 ? ' out-of-stock' : '';
        if (expiryStatus === 'expired' && mQty > 0) extraClass += ' expired';
        else if (expiryStatus === 'soon' && mQty > 0) extraClass += ' expiring';
        div.className = 'med-item' + extraClass;
        div.innerHTML = '\n            <span class="med-name">' + escapeHtml(m.name) + '</span>\n            <span class="med-price">' + formatPrice(m.price) + ' ' + cur + '</span>\n            <span class="med-stock">' + getText('pos.stock') + ' ' + mQty + '</span>\n        ';
        if (mQty > 0 && expiryStatus !== 'expired') {
            div.addEventListener('click', function() { addToCart(m); });
        }
        grid.appendChild(div);
    });
}

function doSearch() {
    let input = document.getElementById('posSearch');
    let q = input.value.trim();
    let suggestions = document.getElementById('searchSuggestions');
    if (q.length < 1) {
        suggestions.classList.remove('active');
        renderMedsGrid();
        return;
    }
    if (/^\d+$/.test(q)) {
        let barcodeMatch = medicinesDB.find(function(m) { return m.barcode && m.barcode === q; });
        if (barcodeMatch) {
            if (getQty(barcodeMatch.id) > 0) {
                addToCart(barcodeMatch);
                showToast('\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 ' + escapeHtml(barcodeMatch.name) + ' \u0639\u0646 \u0637\u0631\u064A\u0642 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F', 'success');
                input.value = '';
                suggestions.classList.remove('active');
                renderMedsGrid();
                return;
            } else {
                showToast(escapeHtml(barcodeMatch.name) + ' \u0646\u0641\u0630 \u0645\u0646 \u0627\u0644\u0645\u062E\u0632\u0648\u0646', 'warning');
                input.value = '';
                suggestions.classList.remove('active');
                renderMedsGrid();
                return;
            }
        }
    }
    let results = searchMedicines(q);
    renderMedsGrid(q);
    if (results.length > 0) {
        suggestions.innerHTML = '';
        results.slice(0, 8).forEach(function(m) {
            let item = document.createElement('div');
            item.className = 'search-suggestion-item';
            let mQty = getQty(m.id);
            item.innerHTML = '\n                <div class="search-suggestion-info">\n                    <span class="search-suggestion-name">' + highlightText(m.name, q) + '</span>\n                    <span class="search-suggestion-sub">' + highlightText(m.scientificName, q) + ' | ' + highlightText(m.category, q) + '</span>\n                </div>\n                <div style="text-align:left;">\n                    <div class="search-suggestion-price">' + formatPrice(m.price) + ' ' + cur + '</div>\n                    <div class="search-suggestion-stock">' + getText('pos.stock') + ' ' + mQty + '</div>\n                </div>\n            ';
            if (mQty > 0) {
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

const debouncedSearch = debounce(function() { doSearch(); }, 300);

document.getElementById('posSearch').addEventListener('input', function() {
    let val = this.value.trim();
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
        let q = this.value.trim();
        if (/^\d+$/.test(q)) {
            let bm = medicinesDB.find(function(m) { return m.barcode && m.barcode === q; });
            if (bm) {
                if (getQty(bm.id) > 0) {
                    addToCart(bm);
                    showToast('\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 ' + escapeHtml(bm.name) + ' \u0639\u0646 \u0637\u0631\u064A\u0642 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F', 'success');
                } else {
                    showToast(escapeHtml(bm.name) + ' \u0646\u0641\u0630 \u0645\u0646 \u0627\u0644\u0645\u062E\u0632\u0648\u0646', 'warning');
                }
                this.value = '';
                document.getElementById('searchSuggestions').classList.remove('active');
                renderMedsGrid();
            }
        }
    }
});

document.addEventListener('click', function(e) {
    let wrap = document.querySelector('.pos-search-wrap');
    if (wrap && !wrap.contains(e.target)) {
        let sug = document.getElementById('searchSuggestions');
        if (sug) sug.classList.remove('active');
    }
});

document.getElementById('posCategory').addEventListener('change', function() {
    renderMedsGrid();
});

var cachedCategories = null;

function loadCategories() {
    if (!cachedCategories) {
        cachedCategories = getCategories();
    }
    let cats = cachedCategories;
    let selects = ['posCategory', 'invCategory'];
    selects.forEach(function(id) {
        let sel = document.getElementById(id);
        if (!sel) return;
        let html = '<option value="\u0627\u0644\u0643\u0644">' + getText('pos.allCategories') + '</option>';
        for (var ci = 0; ci < cats.length; ci++) {
            html += '<option value="' + escapeHtml(cats[ci]) + '">' + escapeHtml(cats[ci]) + '</option>';
        }
        sel.innerHTML = html;
    });
}

var cachedManufacturers = null;

function loadManufacturers() {
    if (!cachedManufacturers) {
        cachedManufacturers = getManufacturers();
    }
    var mfrs = cachedManufacturers;
    var sel = document.getElementById('invManufacturer');
    if (!sel) return;
    var html = '<option value="\u0627\u0644\u0643\u0644">\u0643\u0644 \u0627\u0644\u0634\u0631\u0643\u0627\u062A</option>';
    for (var mi = 0; mi < mfrs.length; mi++) {
        html += '<option value="' + escapeHtml(mfrs[mi]) + '">' + escapeHtml(mfrs[mi]) + '</option>';
    }
    sel.innerHTML = html;
}

// ===== CART =====

function addToCart(med) {
    if (med.schedule && med.schedule !== 'normal') {
        if (!confirm('\u0647\u0630\u0627 \u0627\u0644\u062F\u0648\u0627\u0621 \u0645\u0642\u064A\u062F \u0628\u0627\u0644\u062C\u062F\u0648\u0644. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u0629\u061F')) return;
    }
    let existing = appData.cart.find(function(item) { return item.id === med.id; });
    let stockQty = getQty(med.id);
    if (existing) {
        if (existing.qty < stockQty) existing.qty++;
        else { showToast('\u0643\u0645\u064A\u0629 ' + escapeHtml(med.name) + ' \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631\u0629 \u0628\u0627\u0644\u0645\u062E\u0632\u0648\u0646', 'warning'); return; }
    } else {
        var priceType = (document.getElementById('priceTypeToggle')?.value === 'wholesale' && med.wholesalePrice > 0) ? 'wholesale' : 'retail';
        var usePrice = priceType === 'wholesale' ? (med.wholesalePrice || med.price) : med.price;
        appData.cart.push({ id: med.id, name: med.name, price: usePrice, qty: 1, maxQty: stockQty, schedule: med.schedule || 'normal', priceType: priceType, wholesalePrice: med.wholesalePrice || 0, minWholesaleQty: med.minWholesaleQty || 10 });
    }
    saveData();
    renderCart();
    animateCartCount();
}

function animateCartCount() {
    let el = document.getElementById('cartCount');
    if (!el) return;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
}

function renderCart() {
    let container = document.getElementById('cartItems');
    let count = document.getElementById('cartCount');
    count.textContent = appData.cart.length;
    if (appData.cart.length === 0) {
        container.innerHTML = '<p class="text-center empty-cart">' + getText('pos.emptyCart') + '</p>';
        updateCartSummary();
        return;
    }
    container.innerHTML = '';
    appData.cart.forEach(function(item, idx) {
        let div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = '\n            <div class="cart-item-info">\n                <span class="cart-item-name">' + escapeHtml(item.name) + '</span>\n                <span class="cart-item-sub">' + formatPrice(item.price) + ' ' + cur + ' \u00D7 ' + item.qty + '</span>\n            </div>\n            <div class="cart-item-actions">\n                <input type="number" class="cart-item-qty" value="' + item.qty + '" min="1" max="' + item.maxQty + '" data-index="' + idx + '">\n                <span class="cart-item-remove" data-index="' + idx + '">&times;</span>\n            </div>\n        ';
        container.appendChild(div);
    });
    container.querySelectorAll('.cart-item-qty').forEach(function(inp) {
        inp.addEventListener('change', function() {
            let idx = parseInt(this.dataset.index);
            let val = parseInt(this.value);
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
            let idx = parseInt(this.dataset.index);
            appData.cart.splice(idx, 1);
            saveData();
            renderCart();
        });
    });
    updateCartSummary();
}

function updateCartSummary() {
    let subtotal = appData.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
    let discount = parseFloat(document.getElementById('discountInput').value) || 0;
    let taxRate = parseFloat(appData.settings.taxRate) || 0;
    let tax = subtotal * taxRate / 100;
    let net = Math.max(0, subtotal - discount + tax);
    let paid = parseFloat(document.getElementById('paidInput').value) || 0;
    let change = Math.max(0, paid - net);
    document.getElementById('cartTotal').textContent = formatPrice(subtotal) + ' ' + cur;
    document.getElementById('cartNet').textContent = formatPrice(net) + ' ' + cur;
    document.getElementById('cartChange').textContent = formatPrice(change) + ' ' + cur;
}

function togglePrescriptionSection() {
    let section = document.getElementById('rxSection');
    let arrow = document.getElementById('rxArrow');
    if (!section || !arrow) return;
    let isHidden = section.style.display === 'none' || !section.style.display;
    section.style.display = isHidden ? 'block' : 'none';
    arrow.innerHTML = isHidden ? '&#x25B2;' : '&#x25BC;';
}

function resetPrescriptionFields() {
    let fields = ['rxDoctor', 'rxDiagnosis', 'rxRefills', 'rxDate'];
    fields.forEach(function(id) {
        let el = document.getElementById(id);
        if (el) {
            if (id === 'rxRefills') el.value = '0';
            else if (id === 'rxDate') el.value = '';
            else el.value = '';
        }
    });
}

document.getElementById('discountInput').addEventListener('input', updateCartSummary);
document.getElementById('paidInput').addEventListener('input', updateCartSummary);

document.addEventListener('change', function(e) {
    if (e.target.id === 'paymentMethod') {
        let row = document.getElementById('splitAmountRow');
        if (row) {
            row.style.display = e.target.value === 'split' ? 'flex' : 'none';
        }
    }
});
document.addEventListener('input', function(e) {
    if (e.target.id === 'splitAmountInput' || e.target.id === 'paidInput' || e.target.id === 'paymentMethod') {
        updateCartSummary();
    }
});

function loadCustomerSelect() {
    let sel = document.getElementById('cartCustomer');
    if (!sel) return;
    let currentVal = sel.value;
    let html = '<option value="">' + getText('cart.withoutCustomer') + '</option>';
    appData.customers.forEach(function(c) {
        html += '<option value="' + c.id + '">' + escapeHtml(c.name) + ' - ' + escapeHtml(c.phone) + '</option>';
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
    let subtotal = appData.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
    let discount = parseFloat(document.getElementById('discountInput').value) || 0;
    let taxRate = parseFloat(appData.settings.taxRate) || 0;
    let tax = subtotal * taxRate / 100;
    let net = Math.max(0, subtotal - discount + tax);
    let paid = parseFloat(document.getElementById('paidInput').value) || 0;
    let content = document.getElementById('confirmSaleContent');
    let itemsHtml = '';
    appData.cart.forEach(function(item) {
        itemsHtml += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;border-bottom:1px solid var(--border-light);"><span>' + escapeHtml(item.name) + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + ' ' + cur + '</span></div>';
    });
    content.innerHTML = '\n        <div style="margin-bottom:12px;">' + itemsHtml + '</div>\n        <div style="border-top:2px solid var(--primary);padding-top:8px;">\n            <div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(subtotal) + ' ' + cur + '</span></div>\n            <div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(discount) + ' ' + cur + '</span></div>\n            ' + (taxRate > 0 ? '<div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629 (' + taxRate + '%)</span><span>' + formatPrice(tax) + ' ' + cur + '</span></div>' : '') + '\n            <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;margin-top:6px;"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(net) + ' ' + cur + '</span></div>\n            <div style="display:flex;justify-content:space-between;font-size:15px;color:var(--success);"><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(paid) + ' ' + cur + '</span></div>\n            <div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(paid - net) + ' ' + cur + '</span></div>\n        </div>\n    ';
    document.getElementById('confirmSaleModal').style.display = 'block';
    document.getElementById('confirmSaleYes').onclick = function() {
        document.getElementById('confirmSaleModal').style.display = 'none';
        completeSale(subtotal, discount, tax, net, paid);
    };
});

function completeSale(subtotal, discount, tax, net, paid) {
    let customerSelect = document.getElementById('cartCustomer');
    let customerId = customerSelect ? parseInt(customerSelect.value) || null : null;
    let paymentMethodEl = document.getElementById('paymentMethod');
    let paymentMethod = paymentMethodEl ? paymentMethodEl.value : 'cash';
    let splitAmount = 0;
    if (paymentMethod === 'split') {
        splitAmount = parseFloat(document.getElementById('splitAmountInput')?.value) || 0;
    }
    let insuranceId = parseInt(document.getElementById('cartInsurance')?.value) || null;
    let insuranceCoverage = 0;
    let patientCoPay = net;
    if (insuranceId) {
        let ins = appData.insurances.find(function(i) { return i.id === insuranceId; });
        if (ins) {
            insuranceCoverage = net * (ins.discountPercent || 0) / 100;
            patientCoPay = net - insuranceCoverage;
        }
    }
    let     invoice = {
        id: appData.nextInvoiceId++,
        date: new Date().toISOString(),
        items: appData.cart.map(function(item) {
            let med = medicinesDB.find(function(m) { return m.id === item.id; });
            return { ...item, buyPrice: med ? getBuyPrice(med.id) : 0 };
        }),
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        net: net,
        paid: paid,
        change: paid - net,
        customerId: customerId,
        status: 'مكتملة',
        paymentMethod: paymentMethod,
        splitAmount: splitAmount,
        insuranceId: insuranceId,
        insuranceCoverage: insuranceCoverage,
        patientCoPay: patientCoPay,
        prescription: {
            doctor: (document.getElementById('rxDoctor')?.value || '').trim(),
            diagnosis: (document.getElementById('rxDiagnosis')?.value || '').trim(),
            refills: parseInt(document.getElementById('rxRefills')?.value) || 0,
            date: document.getElementById('rxDate')?.value || ''
        },
        giftCardCode: document.getElementById('giftCardCodeInput')?.value || '',
        couponCode: document.getElementById('couponCodeInput')?.value || ''
    };
    // Deduct from gift card if used
    var gcCode = document.getElementById('giftCardCodeInput')?.value;
    if (gcCode) {
        var gc = (appData.giftCards || []).find(function(c) { return c.code === gcCode && c.status === 'نشطة'; });
        if (gc) {
            gc.balance = Math.max(0, (gc.balance || 0) - net);
            if (gc.balance <= 0) gc.status = 'منتهية';
        }
    }
    resetPrescriptionFields();
    appData.invoices.push(invoice);
    appData.cart.forEach(function(item) {
        if (item.schedule && item.schedule !== 'normal') {
            if (!appData.scheduleSales) appData.scheduleSales = [];
            appData.scheduleSales.push({
                id: (appData.scheduleSales.length || 0) + 1,
                invoiceId: invoice.id,
                medicineName: item.name,
                medicineId: item.id,
                qty: item.qty,
                schedule: item.schedule,
                customerId: customerId,
                customerName: customerId ? (appData.customers.find(function(cx) { return cx.id === customerId; })?.name || '') : '',
                date: invoice.date
            });
        }
    });
    appData.cart.forEach(function(item) {
        adjustStock(item.id, -item.qty);
    });
    if (customerId) {
        let customer = appData.customers.find(function(c) { return c.id === customerId; });
        if (customer) {
            customer.totalSpent = (customer.totalSpent || 0) + net;
            customer.lastPurchase = invoice.date;
            customer.points = (customer.points || 0) + Math.floor(net / 10);
        }
    }
    appData.cart = [];
    saveData();
    saveStock();
    renderCart();
    renderDashboard();
    updateCartSummary();
    document.getElementById('discountInput').value = 0;
    document.getElementById('paidInput').value = '';
    let pmEl = document.getElementById('paymentMethod');
    if (pmEl) pmEl.value = 'cash';
    let saEl = document.getElementById('splitAmountRow');
    if (saEl) saEl.style.display = 'none';
    let saInp = document.getElementById('splitAmountInput');
    if (saInp) saInp.value = '';
    if (customerSelect) customerSelect.value = '';
    showReceipt(invoice);
    showToast('تم إتمام البيع بنجاح!', 'success');
    audit('sale', 'بيع فاتورة #' + invoice.id + ' بقيمة ' + formatPrice(net));
}

document.getElementById('newSaleBtn').addEventListener('click', function() {
    appData.cart = [];
    saveData();
    renderCart();
    document.getElementById('discountInput').value = 0;
    document.getElementById('paidInput').value = '';
    let pmEl = document.getElementById('paymentMethod');
    if (pmEl) pmEl.value = 'cash';
    let saRow = document.getElementById('splitAmountRow');
    if (saRow) saRow.style.display = 'none';
    let saInp = document.getElementById('splitAmountInput');
    if (saInp) saInp.value = '';
    resetPrescriptionFields();
    showToast('فاتورة جديدة', 'info');
});

// ===== RECEIPT =====
function barcodeHTML(code) {
    if (!code) return '';
    let chars = code.split('');
    let bars = '';
    chars.forEach(function(c) {
        let w = 1 + parseInt(c) * 0.5;
        bars += '<span style="display:inline-block;width:' + w + 'px;height:30px;background:#000;margin-left:0.5px;"></span>';
    });
    return '<div class="receipt-barcode"><div style="text-align:center;overflow:hidden;white-space:nowrap;direction:ltr;">' + bars + '</div><div class="receipt-barcode-text">' + escapeHtml(code) + '</div></div>';
}

function showReceipt(invoice) {
    currentInvoice = invoice;
    let content = document.getElementById('receiptContent');
    let itemsHtml = '';
    invoice.items.forEach(function(item) {
        itemsHtml += '<div class="receipt-row"><span>' + escapeHtml(item.name) + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + '</span></div>';
    });
    let customerName = '';
    if (invoice.customerId) {
        let c = appData.customers.find(function(cx) { return cx.id === invoice.customerId; });
        if (c) customerName = c.name;
    }
    let firstBarcode = '';
    if (invoice.items.length > 0) {
        let firstMed = medicinesDB.find(function(m) { return m.name === invoice.items[0].name; });
        if (firstMed && firstMed.barcode) firstBarcode = barcodeHTML(firstMed.barcode);
    }
    let footer = appData.settings.receiptFooter || '\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0639\u0627\u0645\u0644\u0643\u0645 \u0645\u0639\u0646\u0627';
    let taxRate = parseFloat(appData.settings.taxRate) || 0;
    content.innerHTML = '\n        <div class="receipt">\n            <h3>' + escapeHtml(appData.settings.pharmacyName || 'ValoPOS') + '</h3>\n            <p>' + escapeHtml(appData.settings.address || '') + '</p>\n            <p>' + escapeHtml(appData.settings.phone || '') + '</p>\n            ' + firstBarcode + '\n            <div class="receipt-line"></div>\n            <p>\u0641\u0627\u062A\u0648\u0631\u0629 #' + invoice.id + '</p>\n            <p>' + formatDate(invoice.date) + '</p>\n            <p>' + (invoice.paymentMethod === 'cash' ? '\uD83D\uDCB0 \u0646\u0642\u062F\u0627\u064B' : invoice.paymentMethod === 'vodafone' ? '\uD83D\uDCF1 \u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634' : invoice.paymentMethod === 'instapay' ? '\uD83D\uDCB3 \u0625\u0646\u0633\u062A\u0627 \u0628\u0627\u064A' : invoice.paymentMethod === 'card' ? '\uD83D\uDCB3 \u0628\u0637\u0627\u0642\u0629 \u0627\u0626\u062A\u0645\u0627\u0646' : invoice.paymentMethod === 'split' ? '\uD83D\uDD00 \u0645\u0642\u0633\u0645 (\u0646\u0642\u062F\u064A + \u0643\u0627\u0634)' : '\uD83D\uDCB0 \u0646\u0642\u062F\u0627\u064B') + '</p>\n            ' + (customerName ? '<p class="receipt-customer">\u0627\u0644\u0639\u0645\u064A\u0644: ' + escapeHtml(customerName) + '</p>' : '') + '\n            ' + (invoice.prescription && invoice.prescription.doctor ? '<div class="receipt-line"></div><p style="font-weight:700;margin:4px 0;font-size:13px;">\uD83D\uDCCB \u0631\u0648\u0634\u062A\u0629 \u0637\u0628\u064A\u0629</p><p>\u0627\u0644\u0637\u0628\u064A\u0628: ' + escapeHtml(invoice.prescription.doctor) + '</p>' + (invoice.prescription.diagnosis ? '<p>\u0627\u0644\u062A\u0634\u062E\u064A\u0635: ' + escapeHtml(invoice.prescription.diagnosis) + '</p>' : '') + (invoice.prescription.refills ? '<p>\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0635\u0631\u0641: ' + invoice.prescription.refills + '</p>' : '') + (invoice.prescription.date ? '<p>\u0627\u0644\u062A\u0627\u0631\u064A\u062E: ' + invoice.prescription.date + '</p>' : '') : '') + '\n            <div class="receipt-line"></div>\n            ' + itemsHtml + '\n            <div class="receipt-line"></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(invoice.subtotal) + ' ' + cur + '</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(invoice.discount) + ' ' + cur + '</span></div>\n            ' + (taxRate > 0 ? '<div class="receipt-row"><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629 (' + taxRate + '%)</span><span>' + formatPrice(invoice.tax || 0) + ' ' + cur + '</span></div>' : '') + '\n            <div class="receipt-row receipt-total"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(invoice.net) + ' ' + cur + '</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(invoice.paid) + ' ' + cur + '</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(invoice.change) + ' ' + cur + '</span></div>\n            <div class="receipt-line"></div>\n            <p>' + escapeHtml(footer) + '</p>\n        </div>\n    ';
    var taxNumber = appData.settings.taxNumber || '';
    var qrData = escapeHtml(taxNumber) + '|' + formatDateShort(invoice.date) + '|' + formatPrice(invoice.net);
    var qrUrl = 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=' + encodeURIComponent(qrData) + '&choe=UTF-8';
    var qrContainer = document.getElementById('receiptQr');
    if (!qrContainer) {
        qrContainer = document.createElement('div');
        qrContainer.id = 'receiptQr';
        qrContainer.style.cssText = 'text-align:center;margin:8px 0;';
        document.querySelector('.receipt')?.appendChild(qrContainer);
    }
    qrContainer.innerHTML = '<img src="' + qrUrl + '" alt="QR" style="width:120px;height:120px;margin:0 auto;">';
    document.getElementById('receiptModal').style.display = 'block';
}

function printA4(invoice) {
    if (!invoice) return;
    let customerName = '';
    if (invoice.customerId) {
        let c = appData.customers.find(function(cx) { return cx.id === invoice.customerId; });
        if (c) customerName = c.name;
    }
    let itemsHtml = invoice.items.map(function(item) {
        return '<tr><td style="padding:8px 12px;border:1px solid #333;text-align:center;">' + escapeHtml(item.name) + '</td><td style="padding:8px 12px;border:1px solid #333;text-align:center;">' + item.qty + '</td><td style="padding:8px 12px;border:1px solid #333;text-align:center;">' + formatPrice(item.price) + '</td><td style="padding:8px 12px;border:1px solid #333;text-align:center;">' + formatPrice(item.price * item.qty) + '</td></tr>';
    }).join('');
    let footer = appData.settings.receiptFooter || '\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0639\u0627\u0645\u0644\u0643\u0645 \u0645\u0639\u0646\u0627';
    let taxRate = parseFloat(appData.settings.taxRate) || 0;
    let w = window.open('', '_blank', 'width=800,height=600');
    w.document.write('<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>\u0641\u0627\u062A\u0648\u0631\u0629 A4 - ' + invoice.id + '</title><style>@page{size:A4;margin:15mm}body{font-family:"Segoe UI",sans-serif;color:#222;padding:20px}h2{text-align:center;margin-bottom:5px}.pharmacy-info{text-align:center;margin-bottom:15px;color:#555;font-size:14px}.invoice-info{display:flex;justify-content:space-between;margin-bottom:15px;font-size:13px}table{width:100%;border-collapse:collapse;margin-bottom:15px}th{background:#2e1065;color:#fff;padding:10px 12px;font-size:13px;text-align:center}td{font-size:13px}tr:nth-child(even){background:#f9f9f9}.totals{width:300px;margin-right:auto}.totals div{display:flex;justify-content:space-between;padding:6px 10px;font-size:14px;border-bottom:1px solid #ddd}.totals .net{font-weight:700;font-size:16px;border-top:2px solid #2e1065;padding-top:8px;margin-top:4px}.prescription-info{background:#f0f4ff;padding:12px;border-radius:8px;margin:15px 0;border-right:4px solid #2e1065;font-size:13px}.footer{text-align:center;margin-top:30px;font-size:13px;color:#888;border-top:2px solid #eee;padding-top:15px}@media print{body{padding:0}.no-print{display:none!important}}</style></head><body><h2>' + escapeHtml(appData.settings.pharmacyName || 'ValoPOS') + '</h2><div class="pharmacy-info">' + (appData.settings.address ? escapeHtml(appData.settings.address) + '<br>' : '') + (appData.settings.phone ? escapeHtml(appData.settings.phone) + '<br>' : '') + '</div><div class="invoice-info"><div><strong>\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629:</strong> #' + invoice.id + '</div><div><strong>\u0627\u0644\u062A\u0627\u0631\u064A\u062E:</strong> ' + formatDate(invoice.date) + '</div><div><strong>\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639:</strong> ' + (invoice.paymentMethod === 'cash' ? '\uD83D\uDCB0 \u0646\u0642\u062F\u0627\u064B' : invoice.paymentMethod === 'vodafone' ? '\uD83D\uDCF1 \u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634' : invoice.paymentMethod === 'instapay' ? '\uD83D\uDCB3 \u0625\u0646\u0633\u062A\u0627 \u0628\u0627\u064A' : invoice.paymentMethod === 'card' ? '\uD83D\uDCB3 \u0628\u0637\u0627\u0642\u0629' : invoice.paymentMethod === 'split' ? '\uD83D\uDD00 \u0645\u0642\u0633\u0645' : '\uD83D\uDCB0 \u0646\u0642\u062F\u0627\u064B') + '</div></div>' + (customerName ? '<div style="margin-bottom:12px;font-size:13px;"><strong>\u0627\u0644\u0639\u0645\u064A\u0644:</strong> ' + escapeHtml(customerName) + '</div>' : '') + (invoice.prescription && invoice.prescription.doctor ? '<div class="prescription-info"><strong>\u0631\u0648\u0634\u062A\u0629 \u0637\u0628\u064A\u0629</strong><br><strong>\u0627\u0644\u0637\u0628\u064A\u0628:</strong> ' + escapeHtml(invoice.prescription.doctor) + (invoice.prescription.diagnosis ? '<br><strong>\u0627\u0644\u062A\u0634\u062E\u064A\u0635:</strong> ' + escapeHtml(invoice.prescription.diagnosis) : '') + (invoice.prescription.refills ? '<br><strong>\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0635\u0631\u0641:</strong> ' + invoice.prescription.refills : '') + (invoice.prescription.date ? '<br><strong>\u0627\u0644\u062A\u0627\u0631\u064A\u062E:</strong> ' + invoice.prescription.date : '') + '</div>' : '') + '<table><thead><tr><th>\u0627\u0633\u0645 \u0627\u0644\u062F\u0648\u0627\u0621</th><th>\u0627\u0644\u0643\u0645\u064A\u0629</th><th>\u0627\u0644\u0633\u0639\u0631</th><th>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</th></tr></thead><tbody>' + itemsHtml + '</tbody></table><div class="totals"><div><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(invoice.subtotal) + ' ' + cur + '</span></div><div><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(invoice.discount) + ' ' + cur + '</span></div>' + (taxRate > 0 ? '<div><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629 (' + taxRate + '%)</span><span>' + formatPrice(invoice.tax) + ' ' + cur + '</span></div>' : '') + '<div class="net"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(invoice.net) + ' ' + cur + '</span></div><div><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(invoice.paid) + ' ' + cur + '</span></div><div><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(invoice.change) + ' ' + cur + '</span></div></div><div class="footer">' + escapeHtml(footer) + '</div><div class="no-print" style="text-align:center;margin-top:20px;"><button onclick="window.print()" style="padding:10px 30px;background:#2e1065;color:#fff;border:none;border-radius:6px;font-size:16px;cursor:pointer;">\u0637\u0628\u0627\u0639\u0629</button></div></body></html>');
    var taxNoA4 = appData.settings.taxNumber || '';
    var qrA4 = 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=' + encodeURIComponent(escapeHtml(taxNoA4) + '|' + formatDateShort(invoice.date) + '|' + formatPrice(invoice.net)) + '&choe=UTF-8';
    w.document.body.innerHTML += '<div class="qr-wrap"><img src="' + qrA4 + '" style="width:120px;height:120px;"></div>';
    w.document.close();
}

function printThermal(invoice) {
    if (!invoice) return;
    let customerName = '';
    if (invoice.customerId) {
        let c = appData.customers.find(function(cx) { return cx.id === invoice.customerId; });
        if (c) customerName = c.name;
    }
    let itemsHtml = invoice.items.map(function(item) {
        return '<div style="display:flex;justify-content:space-between;font-size:12px;padding:3px 0;border-bottom:1px dashed #ccc;"><span>' + escapeHtml(item.name) + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + '</span></div>';
    }).join('');
    let footer = appData.settings.receiptFooter || '\u0634\u0643\u0631\u0627\u064B \u0644\u062A\u0639\u0627\u0645\u0644\u0643\u0645 \u0645\u0639\u0646\u0627';
    let taxRate = parseFloat(appData.settings.taxRate) || 0;
    let w = window.open('', '_blank', 'width=380,height=600');
    w.document.write('<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>\u0641\u0627\u062A\u0648\u0631\u0629 \u062D\u0631\u0627\u0631\u064A\u0629 - ' + invoice.id + '</title><style>@page{width:80mm;margin:0;padding:0}body{width:80mm;margin:0 auto;padding:10px 5px;font-family:"Courier New",monospace;font-size:12px;line-height:1.6;color:#000}h3{text-align:center;font-size:16px;margin:0 0 4px}.center{text-align:center;font-size:11px;margin:2px 0}.line{border-top:1px dashed #000;margin:8px 0}.row{display:flex;justify-content:space-between;font-size:12px;padding:2px 0}.total{font-weight:700;font-size:14px;padding-top:4px;border-top:1.5px solid #000}.footer{text-align:center;font-size:11px;margin-top:10px;padding-top:8px;border-top:1px dashed #000}.prescription-info{font-size:11px;padding:6px;border:1px dashed #000;margin:6px 0}@media print{body{width:80mm;margin:0;padding:5px}.no-print{display:none!important}}</style></head><body><h3>' + escapeHtml(appData.settings.pharmacyName || 'ValoPOS') + '</h3><div class="center">' + escapeHtml(appData.settings.address || '') + '</div><div class="center">' + escapeHtml(appData.settings.phone || '') + '</div><div class="line"></div><div class="center"><strong>\u0641\u0627\u062A\u0648\u0631\u0629 #' + invoice.id + '</strong></div><div class="center">' + formatDate(invoice.date) + '</div><div class="center">' + (invoice.paymentMethod === 'cash' ? '\uD83D\uDCB0 \u0646\u0642\u062F\u0627\u064B' : invoice.paymentMethod === 'vodafone' ? '\uD83D\uDCF1 \u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634' : invoice.paymentMethod === 'instapay' ? '\uD83D\uDCB3 \u0625\u0646\u0633\u062A\u0627 \u0628\u0627\u064A' : invoice.paymentMethod === 'card' ? '\uD83D\uDCB3 \u0628\u0637\u0627\u0642\u0629' : invoice.paymentMethod === 'split' ? '\uD83D\uDD00 \u0645\u0642\u0633\u0645' : '\uD83D\uDCB0 \u0646\u0642\u062F\u0627\u064B') + '</div>' + (customerName ? '<div class="center" style="font-weight:600;">\u0627\u0644\u0639\u0645\u064A\u0644: ' + escapeHtml(customerName) + '</div>' : '') + (invoice.prescription && invoice.prescription.doctor ? '<div class="prescription-info"><strong>\u0631\u0648\u0634\u062A\u0629</strong><br>\u0627\u0644\u0637\u0628\u064A\u0628: ' + escapeHtml(invoice.prescription.doctor) + (invoice.prescription.diagnosis ? '<br>\u0627\u0644\u062A\u0634\u062E\u064A\u0635: ' + escapeHtml(invoice.prescription.diagnosis) : '') + '</div>' : '') + '<div class="line"></div>' + itemsHtml + '<div class="line"></div><div class="row"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(invoice.subtotal) + '</span></div><div class="row"><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(invoice.discount) + '</span></div>' + (taxRate > 0 ? '<div class="row"><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629</span><span>' + formatPrice(invoice.tax) + '</span></div>' : '') + '<div class="row total"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(invoice.net) + '</span></div><div class="row"><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(invoice.paid) + '</span></div><div class="row"><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(invoice.change) + '</span></div><div class="footer">' + escapeHtml(footer) + '</div><div class="no-print" style="text-align:center;margin-top:10px;"><button onclick="window.print()" style="padding:8px 20px;background:#000;color:#fff;border:none;border-radius:4px;font-size:13px;cursor:pointer;">\u0637\u0628\u0627\u0639\u0629</button></div></body></html>');
    var taxNoTh = appData.settings.taxNumber || '';
    var qrTh = 'https://chart.googleapis.com/chart?chs=120x120&cht=qr&chl=' + encodeURIComponent(escapeHtml(taxNoTh) + '|' + formatDateShort(invoice.date) + '|' + formatPrice(invoice.net)) + '&choe=UTF-8';
    w.document.body.innerHTML += '<div style="text-align:center;margin:8px 0;"><img src="' + qrTh + '" style="width:100px;height:100px;"></div>';
    w.document.close();
}

window.addEventListener('afterprint', function() {
    let m = document.getElementById('receiptModal');
    if (m) m.style.display = 'none';
});

document.getElementById('printReceiptBtn').addEventListener('click', function() {
    if (appData.cart.length > 0) {
        let subtotal = appData.cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
        let discount = parseFloat(document.getElementById('discountInput').value) || 0;
        let taxRate = parseFloat(appData.settings.taxRate) || 0;
        let tax = subtotal * taxRate / 100;
        let net = Math.max(0, subtotal - discount + tax);
        let paid = parseFloat(document.getElementById('paidInput').value) || 0;
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

function viewRx(invoiceId) {
    let inv = appData.invoices.find(function(i) { return i.id === invoiceId; });
    if (!inv || !inv.prescription) return;
    let p = inv.prescription;
    let content = document.getElementById('rxDetailContent');
    content.innerHTML = '\n        <div style="padding:10px 0;">\n            <p style="margin:6px 0;"><strong>\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629:</strong> #' + inv.id + '</p>\n            <p style="margin:6px 0;"><strong>\u0627\u0644\u0637\u0628\u064A\u0628:</strong> ' + escapeHtml(p.doctor || '-') + '</p>\n            ' + (p.diagnosis ? '<p style="margin:6px 0;"><strong>\u0627\u0644\u062A\u0634\u062E\u064A\u0635:</strong> ' + escapeHtml(p.diagnosis) + '</p>' : '') + '\n            <p style="margin:6px 0;"><strong>\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0635\u0631\u0641:</strong> ' + (p.refills || 0) + '</p>\n            ' + (p.date ? '<p style="margin:6px 0;"><strong>\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0631\u0648\u0634\u062A\u0629:</strong> ' + p.date + '</p>' : '') + '\n            <div style="margin:12px 0;border-top:1px solid var(--border-light);padding-top:10px;">\n                <strong style="font-size:13px;">\u0627\u0644\u0623\u0635\u0646\u0627\u0641:</strong>\n                ' + inv.items.map(function(item) { return '<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;border-bottom:1px solid var(--border-light);"><span>' + escapeHtml(item.name) + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + ' ' + cur + '</span></div>'; }).join('') + '\n            </div>\n        </div>\n    ';
    document.getElementById('rxModal').style.display = 'block';
}

// ===== INVENTORY PAGE =====
function renderInventory() {
    let search = (document.getElementById('invSearch').value || '').trim();
    let category = document.getElementById('invCategory').value;
    let status = document.getElementById('invStatus').value;
    let meds = medicinesDB.slice();
    if (search) meds = searchMedicines(search);
    if (category !== '\u0627\u0644\u0643\u0644') meds = meds.filter(function(m) { return m.category === category; });
    if (status !== '\u0627\u0644\u0643\u0644') {
        meds = meds.filter(function(m) {
            let s = getStockStatus(m);
            return s === status;
        });
    }
    let state = paginationState.inventory;
    let paged = paginate(meds, state.page, state.perPage);
    if (state.page > paged.pages) state.page = 1;
    paged = paginate(meds, state.page, state.perPage);
    let tbody = document.getElementById('inventoryBody');
    tbody.innerHTML = '';
    if (meds.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center empty-state">' + getText('inventory.noResults') + '</td></tr>';
        renderPagination('invPagination', paged.page, paged.pages, 'renderInventory');
        return;
    }
    paged.items.forEach(function(m) {
        let statusText = getStockStatus(m);
        let statusClass = statusText === '\u0645\u062A\u0648\u0641\u0631' ? 'badge-success' : statusText === '\u0645\u0646\u062E\u0641\u0636' ? 'badge-warning' : 'badge-danger';
        let expiryDays = getExpiryDays(getExpiryDate(m.id));
        let expiryStatus = getExpiryStatus(getExpiryDate(m.id));
        let expiryDisplay = getExpiryDate(m.id) ? formatDateShort(getExpiryDate(m.id)) : '-';
        let expiryBadge = 'green';
        if (expiryStatus === 'expired' || expiryStatus === 'soon') expiryBadge = 'red';
        else if (expiryStatus === 'warning') expiryBadge = 'yellow';
        let tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + m.id + '</td>\n            <td><strong class="inline-edit" data-field="name" data-id="' + m.id + '">' + escapeHtml(m.name) + '</strong></td>\n            <td class="inline-edit" data-field="scientificName" data-id="' + m.id + '">' + escapeHtml(m.scientificName) + '</td>\n            <td>' + escapeHtml(m.category) + '</td>\n            <td><strong class="inline-edit" data-field="price" data-id="' + m.id + '">' + formatPrice(m.price) + '</strong></td>\n            <td>' + getQty(m.id) + '</td>\n            <td><span class="expiry-badge ' + expiryBadge + '">' + expiryDisplay + (expiryDays !== null && expiryDays <= 60 ? ' (' + expiryDays + ' ' + getText('inventory.day') + ')' : '') + '</span></td>\n            <td><span class="badge ' + statusClass + '">' + statusText + '</span></td>\n            <td>' + (m.rx ? getText('inventory.rxYes') : getText('inventory.rxNo')) + '</td>\n            <td><span class="schedule-badge ' + (m.schedule || 'normal') + '">' + (m.schedule === 'schedule1' ? '🔴 جدول أول' : m.schedule === 'schedule2' ? '🟠 جدول ثاني' : m.schedule === 'schedule3' ? '🟡 جدول ثالث' : 'عادي') + '</span></td>\n            <td><button class="btn btn-sm btn-primary" onclick="editStock(' + m.id + ')">' + getText('inventory.edit') + '</button> <button class="btn btn-sm btn-info" onclick="printBarcodeLabel(' + m.id + ')"><i class="fas fa-barcode"></i></button></td>\n        ';
        tbody.appendChild(tr);
    });
    renderPagination('invPagination', paged.page, paged.pages, 'renderInventory');
    document.querySelectorAll('.inline-edit').forEach(function(el) {
        el.addEventListener('dblclick', function() {
            if (this.classList.contains('editing')) return;
            let field = this.dataset.field;
            let id = parseInt(this.dataset.id);
            let med = getMedicineById(id);
            if (!med) return;
            let current = med[field] !== undefined ? med[field] : this.textContent.trim();
            this.classList.add('editing');
            let input = document.createElement('input');
            input.type = field === 'price' || field === 'qty' ? 'number' : 'text';
            input.value = current;
            input.step = field === 'price' ? '0.5' : '1';
            input.min = '0';
            this.innerHTML = '';
            this.appendChild(input);
            input.focus();
            input.select();
            function saveInline() {
                let val = field === 'price' || field === 'qty' ? parseFloat(input.value) : input.value.trim();
                if (field === 'price' || field === 'qty') {
                    if (isNaN(val)) { renderInventory(); return; }
                    if (field === 'qty') val = parseInt(val) || 0;
                    if (field === 'price') val = Math.max(0, val);
                }
                if (val !== undefined && val !== '') {
                    if (field === 'qty') {
                        adjustStock(med.id, val - getQty(med.id));
                    } else {
                        med[field] = val;
                    }
                    saveData();
                    saveStock();
                    renderInventory();
                    renderMedsGrid();
                    showToast(getText('inventory.updated') + ' ' + escapeHtml(med.name), 'success');
                    audit('medicine_edit', 'تعديل ' + escapeHtml(med.name) + ': ' + field + ' = ' + val);
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

// ===== BARCODE SCANNER =====
let barcodeStream = null;
let barcodeScanInterval = null;

function startBarcodeScanner() {
    let modal = document.getElementById('barcodeScannerModal');
    let video = document.getElementById('barcodeVideo');
    let manualWrap = document.getElementById('barcodeManualWrap');
    let manualInput = document.getElementById('barcodeManualInput');
    let statusEl = document.getElementById('barcodeStatus');

    modal.style.display = 'block';
    manualInput.value = '';
    manualWrap.style.display = 'none';
    statusEl.textContent = getText('barcode.starting');

    let useDetector = false;
    let detector = null;
    if (window.BarcodeDetector) {
        try {
            detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'codabar', 'itf', 'qr_code'] });
            useDetector = true;
        } catch (e) {
            useDetector = false;
        }
    }

    if (!useDetector) {
        manualWrap.style.display = 'flex';
        statusEl.textContent = getText('barcode.unsupported');
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } })
        .then(function(stream) {
            barcodeStream = stream;
            video.srcObject = stream;
            video.play();
            statusEl.textContent = useDetector ? getText('barcode.aim') : getText('barcode.cameraReady');

            if (useDetector && detector) {
                barcodeScanInterval = setInterval(function() {
                    if (video.readyState >= 2) {
                        detector.detect(video)
                            .then(function(barcodes) {
                                if (barcodes.length > 0) {
                                    let code = barcodes[0].rawValue;
                                    if (code) {
                                        stopBarcodeScanner(code);
                                    }
                                }
                            })
                            .catch(function(err) { showToast(getText('barcode.error') + ' ' + escapeHtml(err.message), 'error'); });
                    }
                }, 400);
            }
        })
        .catch(function(err) {
            statusEl.textContent = getText('barcode.error') + ' ' + escapeHtml(err.message);
            manualWrap.style.display = 'flex';
            showToast(getText('barcode.cameraError') + ' ' + err.message, 'error');
        });
}

function stopBarcodeScanner(barcode) {
    if (barcodeScanInterval) {
        clearInterval(barcodeScanInterval);
        barcodeScanInterval = null;
    }
    if (barcodeStream) {
        barcodeStream.getTracks().forEach(function(t) { t.stop(); });
        barcodeStream = null;
    }
    let video = document.getElementById('barcodeVideo');
    if (video) video.srcObject = null;

    document.getElementById('barcodeScannerModal').style.display = 'none';

    if (barcode) {
        let input = document.getElementById('invSearch');
        if (input) {
            input.value = barcode;
            input.dispatchEvent(new Event('input'));
            showToast('تم مسح الباركود: ' + escapeHtml(barcode), 'success');
        }
    }
}

document.getElementById('barcodeScanInvBtn').addEventListener('click', startBarcodeScanner);
document.getElementById('barcodeCloseBtn').addEventListener('click', function() { stopBarcodeScanner(); });
document.getElementById('barcodeModalClose').addEventListener('click', function() { stopBarcodeScanner(); });
document.getElementById('barcodeManualConfirm').addEventListener('click', function() {
    let val = document.getElementById('barcodeManualInput').value.trim();
    if (val) stopBarcodeScanner(val);
});
document.getElementById('barcodeScannerModal').addEventListener('click', function(e) {
    if (e.target === this) stopBarcodeScanner();
});

function editStock(id) {
    let med = getMedicineById(id);
    if (!med) return;
    let sel = document.getElementById('stockMedSelect');
    sel.innerHTML = '<option value="' + med.id + '">' + escapeHtml(med.name) + ' (\u0645\u062E\u0632\u0648\u0646: ' + getQty(med.id) + ')</option>';
    document.getElementById('stockQtyInput').value = 10;
    document.getElementById('stockPriceInput').value = med.price;
    document.getElementById('stockExpiryInput').value = getExpiryDate(med.id) || '';
    document.getElementById('stockModal').style.display = 'block';
}

document.getElementById('addStockBtn').addEventListener('click', function() {
    let sel = document.getElementById('stockMedSelect');
    sel.innerHTML = '';
    medicinesDB.forEach(function(m) {
        sel.innerHTML += '<option value="' + m.id + '">' + escapeHtml(m.name) + ' (\u0645\u062E\u0632\u0648\u0646: ' + getQty(m.id) + ')</option>';
    });
    document.getElementById('stockQtyInput').value = 10;
    document.getElementById('stockPriceInput').value = '';
    document.getElementById('stockExpiryInput').value = '';
    document.getElementById('stockModal').style.display = 'block';
});

document.getElementById('saveStockBtn').addEventListener('click', function() {
    let id = parseInt(document.getElementById('stockMedSelect').value);
    let qty = parseInt(document.getElementById('stockQtyInput').value);
    let price = parseFloat(document.getElementById('stockPriceInput').value);
    let expiry = document.getElementById('stockExpiryInput').value;
    let med = getMedicineById(id);
    if (!med) return;
    if (qty > 0) adjustStock(med.id, qty);
    if (price > 0) med.price = price;
    if (expiry) updateStock(med.id, undefined, undefined, expiry);
    saveData();
    saveStock();
    renderInventory();
    renderMedsGrid();
    document.getElementById('stockModal').style.display = 'none';
    showToast('تم تحديث المخزون بنجاح', 'success');
    audit('stock_update', 'تحديث مخزون ' + escapeHtml(med.name) + ' (+' + qty + ') بسعر ' + formatPrice(price));
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
    let name = document.getElementById('newMedName').value.trim();
    let scientific = document.getElementById('newMedScientific').value.trim();
    let category = document.getElementById('newMedCategory').value;
    let price = parseFloat(document.getElementById('newMedPrice').value);
    let qty = parseInt(document.getElementById('newMedQty').value) || 0;
    let expiry = document.getElementById('newMedExpiry').value;
    let barcode = document.getElementById('newMedBarcode').value.trim();
    let rx = document.getElementById('newMedRx').checked;
    var schedule = document.getElementById('medSchedule')?.value || 'normal';
    var wholesalePrice = parseFloat(document.getElementById('newMedWholesalePrice')?.value) || 0;
    var minWholesaleQty = parseInt(document.getElementById('newMedMinWholesaleQty')?.value) || 10;
    var batchNumber = document.getElementById('newMedBatch')?.value.trim() || '';
    var reorderPoint = parseInt(document.getElementById('newMedReorderPoint')?.value) || 0;
    if (!name) { showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u062F\u0648\u0627\u0621', 'error'); return; }
    if (name.length > 200) { showToast('\u0627\u0633\u0645 \u0627\u0644\u062F\u0648\u0627\u0621 \u0637\u0648\u064A\u0644 \u062C\u062F\u0627\u064B', 'error'); return; }
    if (barcode && barcode.length > 50) { showToast('\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u0637\u0648\u064A\u0644 \u062C\u062F\u0627\u064B', 'error'); return; }
    if (!price || price <= 0) { showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0633\u0639\u0631 \u0635\u0627\u0644\u062D', 'error'); return; }
    if (barcode && medicinesDB.some(function(m) { return m.barcode === barcode; })) {
        showToast('\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u0645\u0648\u062C\u0648\u062F \u0645\u0633\u0628\u0642\u0627\u064B', 'error');
        return;
    }
    let maxId = 0;
    medicinesDB.forEach(function(m) { if (m.id > maxId) maxId = m.id; });
    var newId = maxId + 1;
    var newMed = {
        id: newId,
        name: name,
        scientificName: scientific || '-',
        category: category,
        price: price,
        barcode: barcode,
        rx: rx,
        schedule: schedule,
        wholesalePrice: wholesalePrice,
        minWholesaleQty: minWholesaleQty
    };
    medicinesDB.push(newMed);
    medIndexById[newId] = newMed;
    updateStock(newId, qty, 0, expiry, batchNumber);
    setStock(newId, { rp: reorderPoint });
    saveData();
    saveStock();
    renderInventory();
    renderMedsGrid();
    loadCategories();
    document.getElementById('addMedModal').style.display = 'none';
    showToast('تم إضافة ' + escapeHtml(name) + ' بنجاح', 'success');
    audit('medicine_add', 'إضافة دواء: ' + name);
});

// ===== CUSTOMER PAGE =====
function renderCustomers() {
    let search = (document.getElementById('customerSearch').value || '').trim().toLowerCase();
    let customers = appData.customers.slice();
    if (search) {
        customers = customers.filter(function(c) {
            return c.name.toLowerCase().includes(search) || c.phone.includes(search);
        });
    }
    let state = paginationState.customers;
    let paged = paginate(customers, state.page, state.perPage);
    if (state.page > paged.pages) state.page = 1;
    paged = paginate(customers, state.page, state.perPage);
    let tbody = document.getElementById('customersBody');
    tbody.innerHTML = '';
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center empty-state"><div class="empty-state-icon">\uD83D\uDC65</div><div class="empty-state-text">' + getText('customers.noCustomers') + '</div></td></tr>';
        renderPagination('customersPagination', paged.page, paged.pages, 'renderCustomers');
        return;
    }
    paged.items.forEach(function(c) {
        let debt = c.debt || 0;
        let debtClass = debt > 0 ? 'positive' : 'zero';
        let tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + c.id + '</td>\n            <td><strong>' + escapeHtml(c.name) + '</strong></td>\n            <td>' + escapeHtml(c.phone) + '</td>\n            <td>' + formatPrice(c.totalSpent || 0) + ' ' + cur + '</td>\n            <td>' + (c.points || 0) + '</td>\n            <td><span class="debt-badge ' + debtClass + '">' + formatPrice(debt) + ' ' + cur + '</span></td>\n            <td>' + (c.lastPurchase ? formatDate(c.lastPurchase) : '-') + '</td>\n            <td class="customer-actions">\n                <button class="btn btn-sm btn-info" onclick="viewCustomer(' + c.id + ')">' + getText('customers.view') + '</button>\n                <button class="btn btn-sm btn-primary" onclick="editCustomer(' + c.id + ')">' + getText('customers.edit') + '</button>\n                <button class="btn btn-sm btn-warning" onclick="addDebtPayment(' + c.id + ')">' + getText('customers.payDebt') + '</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(' + c.id + ')">' + getText('customers.delete') + '</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
    renderPagination('customersPagination', paged.page, paged.pages, 'renderCustomers');
}

document.getElementById('customerSearch').addEventListener('input', renderCustomers);

document.getElementById('addCustomerBtn').addEventListener('click', function() {
    document.getElementById('customerEditId').value = '';
    document.getElementById('customerModalTitle').textContent = getText('customers.addNew');
    document.getElementById('customerNameInput').value = '';
    document.getElementById('customerPhoneInput').value = '';
    document.getElementById('customerEmailInput').value = '';
    document.getElementById('customerNotesInput').value = '';
    document.getElementById('customerModal').style.display = 'block';
});

document.getElementById('saveCustomerBtn').addEventListener('click', function() {
    let editId = document.getElementById('customerEditId').value;
    let name = document.getElementById('customerNameInput').value.trim();
    let phone = document.getElementById('customerPhoneInput').value.trim();
    let email = document.getElementById('customerEmailInput').value.trim();
    let notes = document.getElementById('customerNotesInput').value.trim();
    if (!name || !phone) {
        showToast(getText('customers.errNamePhone'), 'error');
        return;
    }
    if (name.length > 100) { showToast(getText('customers.errNameLong'), 'error'); return; }
    if (phone.length > 20) { showToast(getText('customers.errPhoneLong'), 'error'); return; }
    if (phone.length < 8) { showToast(getText('customers.errPhoneShort'), 'error'); return; }
    if (!/^[\d+\- ]+$/.test(phone)) { showToast(getText('customers.errPhoneInvalid'), 'error'); return; }
    if (editId) {
        let c = appData.customers.find(function(cx) { return cx.id === parseInt(editId); });
        if (c) { c.name = name; c.phone = phone; c.email = email; c.notes = notes; }
        showToast(getText('customers.updated'), 'success');
    } else {
        let maxId = appData.customers.reduce(function(max, cx) { return Math.max(max, cx.id); }, 0);
        appData.customers.push({
            id: maxId + 1, name: name, phone: phone, email: email, notes: notes,
            points: 0, totalSpent: 0, debt: 0,             lastPurchase: null, createdAt: new Date().toISOString()
        });
        showToast(getText('customers.added'), 'success');
    }
    saveData();
    renderCustomers();
    loadCustomerSelect();
    document.getElementById('customerModal').style.display = 'none';
});

function viewCustomer(id) {
    let c = appData.customers.find(function(cx) { return cx.id === id; });
    if (!c) return;
    let invoices = appData.invoices.filter(function(inv) { return inv.customerId === id; });
    let invoicesHtml = '';
    if (invoices.length === 0) {
        invoicesHtml = '<tr><td colspan="5" class="text-center empty-state">' + getText('customers.noPurchases') + '</td></tr>';
    } else {
        invoices.slice().reverse().forEach(function(inv) {
            invoicesHtml += '<tr><td>#' + inv.id + '</td><td>' + formatDate(inv.date) + '</td><td>' + inv.items.length + '</td><td>' + formatPrice(inv.net) + ' ' + cur + '</td><td><span class="badge badge-success">\u0645\u0643\u062A\u0645\u0644\u0629</span>' + (inv.prescription && inv.prescription.doctor ? ' <span class="rx-badge" onclick="viewRx(' + inv.id + ')" title="\u0639\u0631\u0636 \u0627\u0644\u0631\u0648\u0634\u062A\u0629">\uD83D\uDCCB \u0631\u0648\u0634\u062A\u0629</span>' : '') + '</td></tr>';
        });
    }
    let debt = c.debt || 0;
    let content = document.getElementById('customerDetailContent');
    content.innerHTML = '\n        <div class="customer-detail-card">\n            <div class="customer-detail-header">\n                <div>\n                    <div class="customer-detail-name">' + escapeHtml(c.name) + '</div>\n                    <div class="customer-detail-phone">' + escapeHtml(c.phone) + (c.email ? ' | ' + escapeHtml(c.email) : '') + '</div>\n                </div>\n                <button class="btn btn-sm btn-primary" onclick="editCustomer(' + c.id + '); document.getElementById(\'customerDetailModal\').style.display=\'none\';">\u062A\u0639\u062F\u064A\u0644</button>\n            </div>\n            <div class="customer-detail-stats">\n                <div class="customer-stat"><span class="customer-stat-value">' + formatPrice(c.totalSpent || 0) + ' ' + cur + '</span><span class="customer-stat-label">\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A</span></div>\n                <div class="customer-stat"><span class="customer-stat-value">' + (c.points || 0) + '</span><span class="customer-stat-label">\u0646\u0642\u0627\u0637</span></div>\n                <div class="customer-stat"><span class="customer-stat-value">' + invoices.length + '</span><span class="customer-stat-label">\u0639\u062F\u062F \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631</span></div>\n                <div class="customer-stat"><span class="customer-stat-value" style="color:' + (debt > 0 ? 'var(--danger)' : 'var(--success)') + ';">' + formatPrice(debt) + ' ' + cur + '</span><span class="customer-stat-label">\u0627\u0644\u0645\u062F\u064A\u0648\u0646\u064A\u0629</span></div>\n            </div>\n            <h4 style="margin-bottom:10px;font-size:14px;color:var(--text-light);">\u0633\u062C\u0644 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A</h4>\n            <div class="table-responsive">\n                <table class="table">\n                    <thead><tr><th>\u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629</th><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0639\u062F\u062F \u0627\u0644\u0623\u0635\u0646\u0627\u0641</th><th>\u0627\u0644\u0645\u0628\u0644\u063A</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th></tr></thead>\n                    <tbody>' + invoicesHtml + '</tbody>\n                </table>\n            </div>\n        </div>\n    ';
    document.getElementById('customerDetailModal').style.display = 'block';
}

function editCustomer(id) {
    let c = appData.customers.find(function(cx) { return cx.id === id; });
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
    let c = appData.customers.find(function(cx) { return cx.id === id; });
    if (!c) return;
    let amount = prompt('\u0627\u0644\u0645\u062F\u064A\u0648\u0646\u064A\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629: ' + formatPrice(c.debt || 0) + '\n\u0623\u062F\u062E\u0644 \u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639:', '0');
    if (amount === null) return;
    let val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0645\u0628\u0644\u063A \u0635\u0627\u0644\u062D', 'error'); return; }
    if (val > (c.debt || 0)) {
        if (!confirm('\u0627\u0644\u0645\u0628\u0644\u063A \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0645\u062F\u064A\u0648\u0646\u064A\u0629. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0633\u062A\u0645\u0631\u0627\u0631\u061F')) return;
    }
    c.debt = Math.max(0, (c.debt || 0) - val);
    if (!appData.debtPayments) appData.debtPayments = [];
    appData.debtPayments.push({ customerId: id, amount: val, date: new Date().toISOString() });
    saveData();
    renderCustomers();
    showToast('\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u0641\u0639 \u0628\u0646\u062C\u0627\u062D: ' + formatPrice(val) + ' ' + cur, 'success');
}

// Allow customer debt on checkout
const origCompleteSale = completeSale;
completeSale = function(subtotal, discount, tax, net, paid) {
    let customerSelect = document.getElementById('cartCustomer');
    let customerId = customerSelect ? parseInt(customerSelect.value) || null : null;
    if (paid < net && customerId) {
        let debtAmount = net - paid;
        if (confirm('\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u0635\u0627\u0641\u064A. \u0647\u0644 \u062A\u0631\u064A\u062F \u062A\u0633\u062C\u064A\u0644 ' + formatPrice(debtAmount) + ' \u0643\u0645\u062F\u064A\u0648\u0646\u064A\u0629 \u0639\u0644\u0649 \u0627\u0644\u0639\u0645\u064A\u0644\u061F')) {
            let c = appData.customers.find(function(cx) { return cx.id === customerId; });
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
    let search = (document.getElementById('supplierSearch').value || '').trim().toLowerCase();
    let suppliers = appData.suppliers || [];
    if (search) {
        suppliers = suppliers.filter(function(s) {
            return s.name.toLowerCase().includes(search) || s.phone.includes(search);
        });
    }
    let state = paginationState.suppliers;
    let paged = paginate(suppliers, state.page, state.perPage);
    if (state.page > paged.pages) state.page = 1;
    paged = paginate(suppliers, state.page, state.perPage);
    let tbody = document.getElementById('suppliersBody');
    tbody.innerHTML = '';
    if (suppliers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0631\u062F\u0648\u0646</td></tr>';
        renderPagination('suppliersPagination', paged.page, paged.pages, 'renderSuppliers');
        return;
    }
    paged.items.forEach(function(s) {
        let tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + s.id + '</td>\n            <td><strong>' + escapeHtml(s.name) + '</strong></td>\n            <td>' + escapeHtml(s.phone || '') + '</td>\n            <td>' + escapeHtml(s.address || '') + '</td>\n            <td>' + escapeHtml(s.notes || '') + '</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="editSupplier(' + s.id + ')">\u062A\u0639\u062F\u064A\u0644</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteSupplier(' + s.id + ')">\u062D\u0630\u0641</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
    renderPagination('suppliersPagination', paged.page, paged.pages, 'renderSuppliers');
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
    let editId = document.getElementById('supplierEditId').value;
    let name = document.getElementById('supplierNameInput').value.trim();
    let phone = document.getElementById('supplierPhoneInput').value.trim();
    let address = document.getElementById('supplierAddressInput').value.trim();
    let notes = document.getElementById('supplierNotesInput').value.trim();
    if (!name) { showToast('\u0627\u0644\u0631\u062C\u0627\u0621 \u0625\u062F\u062E\u0627\u0644 \u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0631\u062F', 'error'); return; }
    if (name.length > 100) { showToast('\u0627\u0633\u0645 \u0627\u0644\u0645\u0648\u0631\u062F \u0637\u0648\u064A\u0644 \u062C\u062F\u0627\u064B', 'error'); return; }
    if (phone && phone.length > 20) { showToast('\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641 \u0637\u0648\u064A\u0644 \u062C\u062F\u0627\u064B', 'error'); return; }
    if (editId) {
        let s = appData.suppliers.find(function(sx) { return sx.id === parseInt(editId); });
        if (s) { s.name = name; s.phone = phone; s.address = address; s.notes = notes; }
        showToast('\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0645\u0648\u0631\u062F', 'success');
    } else {
        let maxId = (appData.suppliers || []).reduce(function(max, sx) { return Math.max(max, sx.id); }, 0);
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
    let s = appData.suppliers.find(function(sx) { return sx.id === id; });
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
let purchaseItems = [];

function loadPurchaseSelects() {
    let sel = document.getElementById('purchaseSupplierSelect');
    if (!sel) return;
    let html = '<option value="">\u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0648\u0631\u062F</option>';
    (appData.suppliers || []).forEach(function(s) {
        html += '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>';
    });
    sel.innerHTML = html;
    let medSel = document.getElementById('purchaseMedSelect');
    if (medSel) {
        let mHtml = '<option value="">\u0627\u062E\u062A\u0631 \u062F\u0648\u0627\u0621</option>';
        medicinesDB.forEach(function(m) {
            mHtml += '<option value="' + m.id + '">' + escapeHtml(m.name) + '</option>';
        });
        medSel.innerHTML = mHtml;
    }
    let filterSel = document.getElementById('purchaseSupplierFilter');
    if (filterSel) {
        let fHtml = '<option value="\u0627\u0644\u0643\u0644">\u0643\u0644 \u0627\u0644\u0645\u0648\u0631\u062F\u064A\u0646</option>';
        (appData.suppliers || []).forEach(function(s) {
            fHtml += '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>';
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
    let medId = parseInt(document.getElementById('purchaseMedSelect').value);
    let qty = parseInt(document.getElementById('purchaseMedQty').value) || 1;
    let price = parseFloat(document.getElementById('purchaseMedPrice').value);
    let expiry = document.getElementById('purchaseMedExpiry').value;
    if (!medId) { showToast('\u0627\u062E\u062A\u0631 \u062F\u0648\u0627\u0621', 'error'); return; }
    if (!price || price <= 0) { showToast('\u0623\u062F\u062E\u0644 \u0633\u0639\u0631 \u0634\u0631\u0627\u0621 \u0635\u0627\u0644\u062D', 'error'); return; }
    let med = getMedicineById(medId);
    if (!med) return;
    let existing = purchaseItems.find(function(p) { return p.medId === medId; });
    if (existing) {
        existing.qty += qty;
        if (expiry) existing.expiry = expiry;
    } else {
        purchaseItems.push({ medId: medId, name: med.name, qty: qty, price: price, buyPrice: price, expiry: expiry });
    }
    document.getElementById('purchaseMedQty').value = '1';
    document.getElementById('purchaseMedPrice').value = '';
    document.getElementById('purchaseMedExpiry').value = '';
    renderPurchaseItems();
    showToast('\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 ' + escapeHtml(med.name), 'success');
});

function renderPurchaseItems() {
    let tbody = document.getElementById('purchaseItemsBody');
    if (purchaseItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">\u0644\u0645 \u062A\u0636\u0641 \u0623\u0635\u0646\u0627\u0641\u0627\u064B \u0628\u0639\u062F</td></tr>';
        document.getElementById('purchaseTotal').textContent = '0.00';
        return;
    }
    tbody.innerHTML = '';
    let total = 0;
    purchaseItems.forEach(function(p, idx) {
        let lineTotal = p.qty * p.price;
        total += lineTotal;
        let tr = document.createElement('tr');
        tr.className = 'purchase-item-row';
        tr.innerHTML = '\n            <td>' + escapeHtml(p.name) + '</td>\n            <td>' + p.qty + '</td>\n            <td>' + formatPrice(p.price) + '</td>\n            <td>' + (p.expiry || '-') + '</td>\n            <td>' + formatPrice(lineTotal) + '</td>\n            <td><span class="remove-item" data-index="' + idx + '">&times;</span></td>\n        ';
        tbody.appendChild(tr);
    });
    document.getElementById('purchaseTotal').textContent = formatPrice(total);
    tbody.querySelectorAll('.remove-item').forEach(function(btn) {
        btn.addEventListener('click', function() {
            let idx = parseInt(this.dataset.index);
            purchaseItems.splice(idx, 1);
            renderPurchaseItems();
        });
    });
}

document.getElementById('savePurchaseBtn').addEventListener('click', function() {
    let supplierId = parseInt(document.getElementById('purchaseSupplierSelect').value) || null;
    let discount = parseFloat(document.getElementById('purchaseDiscount').value) || 0;
    let notes = document.getElementById('purchaseNotes').value.trim();
    if (purchaseItems.length === 0) { showToast('\u0623\u0636\u0641 \u0623\u0635\u0646\u0627\u0641\u0627\u064B \u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0634\u0631\u0627\u0621', 'error'); return; }
    let subtotal = purchaseItems.reduce(function(sum, p) { return sum + p.qty * p.price; }, 0);
    let net = Math.max(0, subtotal - discount);
    if (!appData.purchases) appData.purchases = [];
    let purchase = {
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
        let med = getMedicineById(p.medId);
        if (med) {
            adjustStock(p.medId, p.qty);
            if (p.price > 0) {
                med.price = p.price;
                updateStock(p.medId, undefined, p.price);
            }
            if (p.expiry) updateStock(p.medId, undefined, undefined, p.expiry);
        }
    });
    saveData();
    saveStock();
    purchaseItems = [];
    renderPurchases();
    renderInventory();
    renderMedsGrid();
    document.getElementById('purchaseModal').style.display = 'none';
    showToast('\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u0634\u0631\u0627\u0621 \u0628\u0646\u062C\u0627\u062D', 'success');
});

function renderPurchases() {
    let search = (document.getElementById('purchaseSearch').value || '').trim().toLowerCase();
    let filterSupplier = document.getElementById('purchaseSupplierFilter').value;
    let purchases = appData.purchases || [];
    if (filterSupplier !== '\u0627\u0644\u0643\u0644') {
        purchases = purchases.filter(function(p) { return p.supplierId === parseInt(filterSupplier); });
    }
    if (search) {
        purchases = purchases.filter(function(p) {
            let s = p.supplierId ? appData.suppliers.find(function(sx) { return sx.id === p.supplierId; }) : null;
            return (s && s.name.toLowerCase().includes(search)) || p.id.toString().includes(search);
        });
    }
    purchases = purchases.slice().reverse();
    let state = paginationState.purchases;
    let paged = paginate(purchases, state.page, state.perPage);
    if (state.page > paged.pages) state.page = 1;
    paged = paginate(purchases, state.page, state.perPage);
    let tbody = document.getElementById('purchasesBody');
    tbody.innerHTML = '';
    if (purchases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center empty-state">\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0648\u0627\u062A\u064A\u0631 \u0634\u0631\u0627\u0621</td></tr>';
        renderPagination('purchasesPagination', paged.page, paged.pages, 'renderPurchases');
        return;
    }
    paged.items.forEach(function(p) {
        let s = p.supplierId ? appData.suppliers.find(function(sx) { return sx.id === p.supplierId; }) : null;
        let tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>#' + p.id + '</td>\n            <td>' + (s ? escapeHtml(s.name) : '-') + '</td>\n            <td>' + formatDate(p.date) + '</td>\n            <td>' + p.items.length + '</td>\n            <td>' + formatPrice(p.subtotal) + ' ' + cur + '</td>\n            <td>' + formatPrice(p.discount) + ' ' + cur + '</td>\n            <td><strong>' + formatPrice(p.net) + ' ' + cur + '</strong></td>\n            <td><button class="btn btn-sm btn-danger" onclick="deletePurchase(' + p.id + ')">\u062D\u0630\u0641</button></td>\n        ';
        tbody.appendChild(tr);
    });
    renderPagination('purchasesPagination', paged.page, paged.pages, 'renderPurchases');
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
    let id = parseInt(document.getElementById('cancelInvoiceId').value);
    let invoice = appData.invoices.find(function(inv) { return inv.id === id; });
    if (!invoice) return;
    invoice.items.forEach(function(item) {
        adjustStock(item.id, item.qty);
    });
    invoice.status = '\u0645\u0644\u063A\u064A\u0629';
    saveData();
    saveStock();
    renderDashboard();
    renderReports();
    renderMedsGrid();
    document.getElementById('cancelInvoiceModal').style.display = 'none';
    showToast('\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 #' + id + ' \u0648\u0625\u0631\u062C\u0627\u0639 \u0627\u0644\u0645\u062E\u0632\u0648\u0646', 'warning');
});

// ===== DASHBOARD =====
function renderDashboard() {
    let todaySales = appData.invoices
        .filter(function(inv) { return isToday(inv.date) && inv.status !== '\u0645\u0644\u063A\u064A\u0629'; })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    let monthlySales = appData.invoices
        .filter(function(inv) { return isThisMonth(inv.date) && inv.status !== '\u0645\u0644\u063A\u064A\u0629'; })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    let lowStock = medicinesDB.filter(function(m) { return getQty(m.id) > 0 && getQty(m.id) <= 10; }).length;
    let outOfStock = medicinesDB.filter(function(m) { return getQty(m.id) <= 0; }).length;
    let expiringMeds = medicinesDB.filter(function(m) {
        let days = getExpiryDays(getExpiryDate(m.id));
        return days !== null && days >= 0 && days <= 30;
    }).length;

    document.getElementById('todaySales').textContent = formatPrice(todaySales) + ' ' + cur;
    document.getElementById('totalMeds').textContent = medicinesDB.length;
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('outOfStock').textContent = outOfStock;
    document.getElementById('monthlySales').textContent = formatPrice(monthlySales) + ' ' + cur;
    document.getElementById('expiringMedsCount').textContent = expiringMeds;

    let todayExpenses = appData.expenses.filter(function(e) { return isToday(e.date); });
    let expenseToday = todayExpenses.reduce(function(s, e) { return s + e.amount; }, 0);
    let expenseTodayEl = document.getElementById('expenseTodayCard');
    if (expenseTodayEl) expenseTodayEl.textContent = formatPrice(expenseToday) + ' ' + cur;

    let tbody = document.getElementById('recentSalesBody');
    let recent = appData.invoices.slice().reverse().slice(0, 10);
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state"><div class="empty-state-icon">\uD83D\uDCB0</div><div class="empty-state-text">' + getText('dash.noSales') + '</div></td></tr>';
    } else {
        tbody.innerHTML = '';
        recent.forEach(function(inv) {
            let statusText = getInvoiceStatusText(inv);
            let statusBadge = getInvoiceStatusBadge(statusText);
            let tr2 = document.createElement('tr');
            tr2.innerHTML = '\n                <td>#' + inv.id + '</td>\n                <td>' + formatPrice(inv.net) + ' ' + cur + '</td>\n                <td>' + formatDate(inv.date) + '</td>\n                <td><span class="badge ' + statusBadge + '">' + statusText + '</span>' + (inv.prescription && inv.prescription.doctor ? ' <span class="rx-icon" title="' + getText('dash.prescription') + '">\uD83D\uDCCB</span>' : '') + '</td>\n                <td>' + (statusText !== '\u0645\u0644\u063A\u064A\u0629' ? '<button class="btn btn-sm btn-danger" onclick="cancelInvoice(' + inv.id + ');renderDashboard();">' + getText('dash.cancel') + '</button>' : '') + '</td>\n            ';
            tbody.appendChild(tr2);
        });
    }

    let medCounts = {};
    appData.invoices.forEach(function(inv) {
        if (inv.status === '\u0645\u0644\u063A\u064A\u0629') return;
        inv.items.forEach(function(item) {
            medCounts[item.name] = (medCounts[item.name] || 0) + item.qty;
        });
    });
    let topMeds = Object.entries(medCounts).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
    let list = document.getElementById('topMedsList');
    if (topMeds.length === 0) {
        list.innerHTML = '<li class="text-center empty-state" style="padding:10px"><div class="empty-state-text">' + getText('dash.noData') + '</div></li>';
    } else {
        list.innerHTML = '';
        topMeds.forEach(function(entry) {
            let name = entry[0], count = entry[1];
            list.innerHTML += '<li><span>' + escapeHtml(name) + '</span><span style="color:var(--primary);font-weight:700;">' + count + '</span></li>';
        });
    }

    let expiryTbody = document.getElementById('expiryAlertBody');
    let expiryMeds = medicinesDB.filter(function(m) {
        let days = getExpiryDays(getExpiryDate(m.id));
        return days !== null && days >= 0 && days <= 30;
    }).sort(function(a, b) { return getExpiryDays(getExpiryDate(a.id)) - getExpiryDays(getExpiryDate(b.id)); });
    let expiryCount = document.getElementById('expiryAlertCount');
    if (expiryCount) expiryCount.textContent = expiryMeds.length;
    if (expiryTbody) {
        if (expiryMeds.length === 0) {
            expiryTbody.innerHTML = '<tr><td colspan="4" class="text-center empty-state">' + getText('dash.noExpiring') + '</td></tr>';
        } else {
            expiryTbody.innerHTML = '';
            expiryMeds.forEach(function(m) {
                let days = getExpiryDays(getExpiryDate(m.id));
                let tr3 = document.createElement('tr');
                tr3.innerHTML = '\n                    <td><strong>' + escapeHtml(m.name) + '</strong></td>\n                    <td>' + formatDateShort(getExpiryDate(m.id)) + '</td>\n                    <td><span class="expiry-badge ' + (days <= 0 ? 'red' : 'yellow') + '">' + days + ' ' + getText('dash.day') + '</span></td>\n                    <td>' + getQty(m.id) + '</td>\n                ';
                expiryTbody.appendChild(tr3);
            });
        }
    }
}

// ===== REPORTS =====
let reportDateFrom = null;
let reportDateTo = null;

function getFilteredInvoices() {
    let invoices = appData.invoices.slice();
    if (reportDateFrom) {
        invoices = invoices.filter(function(inv) { return inv.date >= reportDateFrom; });
    }
    if (reportDateTo) {
        let endDate = reportDateTo + 'T23:59:59';
        invoices = invoices.filter(function(inv) { return inv.date <= endDate; });
    }
    let pmFilter = document.getElementById('reportPaymentMethod')?.value || 'الكل';
    if (pmFilter !== 'الكل') {
        invoices = invoices.filter(function(inv) { return (inv.paymentMethod || 'cash') === pmFilter; });
    }
    return invoices;
}

function renderReports() {
    let invoices = getFilteredInvoices();
    let activeInvoices = invoices.filter(function(inv) { return inv.status !== '\u0645\u0644\u063A\u064A\u0629'; });
    let totalSales = activeInvoices.reduce(function(sum, inv) { return sum + inv.net; }, 0);
    let totalCount = activeInvoices.length;
    let todayInvs = activeInvoices.filter(function(inv) { return isToday(inv.date); });
    let todaySales = todayInvs.reduce(function(sum, inv) { return sum + inv.net; }, 0);
    let todayCount = todayInvs.length;
    let monthInvs = activeInvoices.filter(function(inv) { return isThisMonth(inv.date); });
    let monthSales = monthInvs.reduce(function(sum, inv) { return sum + inv.net; }, 0);
    let monthCount = monthInvs.length;

    document.getElementById('reportTodaySales').textContent = formatPrice(todaySales) + ' ' + cur;
    document.getElementById('reportTodayCount').textContent = todayCount;
    document.getElementById('reportMonthSales').textContent = formatPrice(monthSales) + ' ' + cur;
    document.getElementById('reportMonthCount').textContent = monthCount;
    document.getElementById('reportTotalSales').textContent = formatPrice(totalSales) + ' ' + cur;
    document.getElementById('reportTotalCount').textContent = totalCount;

    // Expense totals for period
    let filteredExpenses = appData.expenses.slice();
    if (reportDateFrom) filteredExpenses = filteredExpenses.filter(function(e) { return e.date >= reportDateFrom; });
    if (reportDateTo) filteredExpenses = filteredExpenses.filter(function(e) { return e.date <= reportDateTo + 'T23:59:59'; });
    let totalExpenses = filteredExpenses.reduce(function(s, e) { return s + e.amount; }, 0);
    let todayExpenses = filteredExpenses.filter(function(e) { return isToday(e.date); });
    let todayExpTotal = todayExpenses.reduce(function(s, e) { return s + e.amount; }, 0);
    let monthExpenses = filteredExpenses.filter(function(e) { return isThisMonth(e.date); });
    let monthExpTotal = monthExpenses.reduce(function(s, e) { return s + e.amount; }, 0);

    // Profit calculations (net = gross - expenses)
    let totalGrossProfit = activeInvoices.reduce(function(sum, inv) { return sum + calcProfit(inv); }, 0);
    let todayGrossProfit = todayInvs.reduce(function(sum, inv) { return sum + calcProfit(inv); }, 0);
    let monthGrossProfit = monthInvs.reduce(function(sum, inv) { return sum + calcProfit(inv); }, 0);
    let totalProfit = totalGrossProfit - totalExpenses;
    let todayProfit = todayGrossProfit - todayExpTotal;
    let monthProfit = monthGrossProfit - monthExpTotal;
    let profitMargin = totalSales > 0 ? (totalGrossProfit / totalSales) * 100 : 0;

    let profitTotalEl = document.getElementById('reportTotalProfit');
    let profitMarginEl = document.getElementById('reportProfitMargin');
    let profitTodayEl = document.getElementById('reportTodayProfit');
    let profitMonthEl = document.getElementById('reportMonthProfit');
    if (profitTotalEl) profitTotalEl.textContent = formatPrice(totalProfit) + ' ' + cur;
    if (profitMarginEl) profitMarginEl.textContent = formatPrice(profitMargin) + '%';
    if (profitTodayEl) profitTodayEl.textContent = formatPrice(todayProfit) + ' ' + cur;
    if (profitMonthEl) profitMonthEl.textContent = formatPrice(monthProfit) + ' ' + cur;
    let reportExpTotalEl = document.getElementById('reportTotalExpenses');
    if (reportExpTotalEl) reportExpTotalEl.textContent = formatPrice(totalExpenses) + ' ' + cur;

    // Invoices table
    let sortedInvoices = invoices.slice().reverse();
    let state = paginationState.invoices;
    let paged = paginate(sortedInvoices, state.page, state.perPage);
    if (state.page > paged.pages) state.page = 1;
    paged = paginate(sortedInvoices, state.page, state.perPage);
    let tbody = document.getElementById('allInvoicesBody');
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center empty-state">' + getText('reports.noInvoices') + '</td></tr>';
        renderPagination('invoicesPagination', paged.page, paged.pages, 'renderReports');
        return;
    }
    tbody.innerHTML = '';
    let pmLabels = { cash: '💰 نقداً', vodafone: '📱 فودافون كاش', instapay: '💳 إنستا باي', card: '💳 بطاقة', split: '🔀 مقسم' };
    paged.items.forEach(function(inv) {
        let statusText = getInvoiceStatusText(inv);
        let statusBadge = getInvoiceStatusBadge(statusText);
        let canCancel = statusText !== '\u0645\u0644\u063A\u064A\u0629';
        let canReturn = statusText !== '\u0645\u0644\u063A\u064A\u0629' && statusText !== '\u0645\u0631\u062A\u062C\u0639 \u0643\u0644\u064A';
        let pm = inv.paymentMethod || 'cash';
        let pmLabel = pmLabels[pm] || '💰 نقداً';
        let tr3 = document.createElement('tr');
        tr3.innerHTML = '\n            <td>#' + inv.id + '</td>\n            <td>' + formatDate(inv.date) + '</td>\n            <td>' + inv.items.length + '</td>\n            <td>' + formatPrice(inv.subtotal) + ' ' + cur + '</td>\n            <td>' + formatPrice(inv.discount) + ' ' + cur + '</td>\n            <td><strong>' + formatPrice(inv.net) + ' ' + cur + '</strong></td>\n            <td>' + pmLabel + '</td>\n            <td><span class="badge ' + statusBadge + '">' + statusText + '</span></td>\n            <td style="white-space:nowrap;">\n                ' + (canReturn ? '<button class="btn btn-sm btn-warning" onclick="showReturnModal(' + inv.id + ');" style="margin-' + (document.documentElement.dir === 'rtl' ? 'left' : 'right') + ':4px;">' + getText('reports.return') + '</button>' : '') + '\n                ' + (canCancel ? '<button class="btn btn-sm btn-danger" onclick="cancelInvoice(' + inv.id + ');renderReports();">' + getText('reports.cancel') + '</button>' : '') + '\n            </td>\n        ';
        tbody.appendChild(tr3);
    });
    renderPagination('invoicesPagination', paged.page, paged.pages, 'renderReports');
    renderReturnsTable();
    renderProfitChart();
    renderClosings();
}

document.getElementById('filterReportsBtn').addEventListener('click', function() {
    reportDateFrom = document.getElementById('reportDateFrom').value;
    reportDateTo = document.getElementById('reportDateTo').value;
    renderReports();
});

document.getElementById('exportCsvBtn').addEventListener('click', function() {
    let invoices = getFilteredInvoices();
    if (invoices.length === 0) { showToast(getText('reports.noExport'), 'warning'); return; }
    let csv = getText('reports.csvHeader') + '\n';
    invoices.forEach(function(inv) {
        csv += '#' + inv.id + ',' + inv.date + ',' + inv.items.length + ',' + inv.subtotal + ',' + inv.discount + ',' + inv.net + ',' + (inv.status || '\u0645\u0643\u062A\u0645\u0644\u0629') + '\n';
    });
    let blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'invoices_report_' + todayStr() + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast(getText('reports.exported'), 'success');
});

// ===== PROFIT CALCULATIONS =====
function calcProfit(invoice) {
    if (invoice.status === '\u0645\u0644\u063A\u064A\u0629' || invoice.status === '\u0645\u0631\u062A\u062C\u0639 \u0643\u0644\u064A') return 0;
    let profit = 0;
    invoice.items.forEach(function(item) {
        let returned = getReturnedQtyForItem(invoice.id, item.id);
        let soldQty = item.qty - returned;
        if (soldQty > 0) {
            let cost = item.buyPrice || 0;
            profit += (item.price - cost) * soldQty;
        }
    });
    return Math.max(0, profit);
}

function getReturnedQtyForItem(invoiceId, medId) {
    let total = 0;
    (appData.returns || []).forEach(function(r) {
        if (r.invoiceId === invoiceId) {
            r.items.forEach(function(ri) {
                if (ri.medId === medId) total += ri.qty;
            });
        }
    });
    return total;
}

function getDailyProfits(days) {
    let result = [];
    for (let i = days - 1; i >= 0; i--) {
        let d = new Date();
        d.setDate(d.getDate() - i);
        let dateStr = d.toISOString().split('T')[0];
        let dayInvs = appData.invoices.filter(function(inv) {
            return inv.date.startsWith(dateStr) && inv.status !== '\u0645\u0644\u063A\u064A\u0629';
        });
        let profit = dayInvs.reduce(function(sum, inv) { return sum + calcProfit(inv); }, 0);
        let dayName = d.toLocaleDateString('ar-EG', { weekday: 'short' });
        result.push({ date: dateStr, label: dayName, profit: profit });
    }
    return result;
}

function getInvoiceStatusText(invoice) {
    if (invoice.status === '\u0645\u0644\u063A\u064A\u0629') return '\u0645\u0644\u063A\u064A\u0629';
    let totalQty = 0, returnedQty = 0;
    invoice.items.forEach(function(item) {
        totalQty += item.qty;
        returnedQty += getReturnedQtyForItem(invoice.id, item.id);
    });
    if (returnedQty <= 0) return '\u0645\u0643\u062A\u0645\u0644\u0629';
    if (returnedQty >= totalQty) return '\u0645\u0631\u062A\u062C\u0639 \u0643\u0644\u064A';
    return '\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A';
}

function getInvoiceStatusBadge(statusText) {
    if (statusText === '\u0645\u0644\u063A\u064A\u0629') return 'badge-danger';
    if (statusText === '\u0645\u0631\u062A\u062C\u0639 \u0643\u0644\u064A') return 'badge-info';
    if (statusText === '\u0645\u0631\u062A\u062C\u0639 \u062C\u0632\u0626\u064A') return 'badge-warning';
    return 'badge-success';
}

// ===== RETURNS SYSTEM =====
function showReturnModal(invoiceId) {
    let invoice = appData.invoices.find(function(inv) { return inv.id === invoiceId; });
    if (!invoice) return;
    document.getElementById('returnInvoiceId').textContent = invoiceId;
    let list = document.getElementById('returnItemsList');
    list.innerHTML = '';
    let hasItems = false;
    invoice.items.forEach(function(item) {
        let returned = getReturnedQtyForItem(invoice.id, item.id);
        let available = item.qty - returned;
        if (available <= 0) return;
        hasItems = true;
        let div = document.createElement('div');
        div.className = 'return-item';
        div.innerHTML = '\n            <label class="return-item-label">\n                <input type="checkbox" class="return-item-cb" data-id="' + item.id + '" data-max="' + available + '" checked>\n                <span class="return-item-name">' + escapeHtml(item.name) + '</span>\n                <span class="return-item-price">' + formatPrice(item.price * available) + ' ' + cur + '</span>\n            </label>\n            <div class="return-item-qty-wrap">\n                <label>' + getText('returns.qtyLabel') + ' </label>\n                <input type="number" class="return-item-qty form-input" value="' + available + '" min="1" max="' + available + '" style="width:70px;">\n            </div>\n        ';
        list.appendChild(div);
    });
    if (!hasItems) {
        list.innerHTML = '<p class="text-center empty-state" style="padding:20px;">' + getText('returns.allReturned') + '</p>';
        document.getElementById('confirmReturnBtn').disabled = true;
    } else {
        document.getElementById('confirmReturnBtn').disabled = false;
    }
    document.getElementById('returnReason').value = '';
    document.getElementById('returnModal').style.display = 'block';
    document.getElementById('confirmReturnBtn').onclick = function() { confirmReturn(invoiceId); };
}

function confirmReturn(invoiceId) {
    let invoice = appData.invoices.find(function(inv) { return inv.id === invoiceId; });
    if (!invoice) return;
    let cbList = document.querySelectorAll('#returnItemsList .return-item-cb:checked');
    if (cbList.length === 0) {
        showToast(getText('returns.selectItem'), 'error');
        return;
    }
    let reason = document.getElementById('returnReason').value.trim();
    let returnItems = [];
    cbList.forEach(function(cb) {
        let medId = parseInt(cb.dataset.id);
        let maxQty = parseInt(cb.dataset.max);
        let qtyInput = cb.closest('.return-item').querySelector('.return-item-qty');
        let qty = parseInt(qtyInput.value) || maxQty;
        if (qty < 1 || qty > maxQty) qty = maxQty;
        let item = invoice.items.find(function(i) { return i.id === medId; });
        if (item) {
            returnItems.push({ medId: medId, name: item.name, qty: qty, price: item.price, buyPrice: item.buyPrice || 0 });
            adjustStock(medId, qty);
        }
    });
    if (returnItems.length === 0) { showToast(getText('returns.noItem'), 'error'); return; }
    if (!appData.returns) appData.returns = [];
    let totalReturn = returnItems.reduce(function(sum, ri) { return sum + ri.price * ri.qty; }, 0);
    appData.returns.push({
        id: appData.nextReturnId++,
        invoiceId: invoiceId,
        date: new Date().toISOString(),
        items: returnItems,
        reason: reason || getText('returns.noReason'),
        total: totalReturn
    });
    invoice.status = getInvoiceStatusText(invoice);
    saveData();
    saveStock();
    renderDashboard();
    renderReports();
    renderMedsGrid();
    renderInventory();
    document.getElementById('returnModal').style.display = 'none';
    showToast(getText('returns.success') + ' - ' + returnItems.length + ' ' + getText('returns.items') + ' ' + getText('returns.value') + ' ' + formatPrice(totalReturn) + ' ' + cur, 'success');
}

function renderReturnsTable() {
    let tbody = document.getElementById('returnsBody');
    let returns = (appData.returns || []).slice().reverse();
    if (returns.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">' + getText('returns.noReturns') + '</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    returns.forEach(function(r) {
        let itemsStr = r.items.map(function(ri) { return escapeHtml(ri.name) + ' \u00D7' + ri.qty; }).join(', ');
        let tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>#' + r.id + '</td>\n            <td>#' + r.invoiceId + '</td>\n            <td>' + formatDate(r.date) + '</td>\n            <td style="font-size:12px;">' + itemsStr + '</td>\n            <td>' + formatPrice(r.total) + ' ' + cur + '</td>\n            <td style="font-size:12px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + escapeHtml(r.reason) + '">' + escapeHtml(r.reason) + '</td>\n        ';
        tbody.appendChild(tr);
    });
}

function renderProfitChart() {
    let container = document.getElementById('profitChart');
    if (!container) return;
    let dailyProfits = getDailyProfits(7);
    let maxProfit = Math.max.apply(null, dailyProfits.map(function(d) { return d.profit; }), 1);
    container.innerHTML = '';
    dailyProfits.forEach(function(d) {
        let pct = Math.max((d.profit / maxProfit) * 100, 2);
        let wrap = document.createElement('div');
        wrap.className = 'profit-chart-bar-wrap';
        wrap.innerHTML = '\n            <div class="profit-chart-bar" style="height:' + pct + '%">\n                <span class="profit-chart-val">' + formatPrice(d.profit) + '</span>\n            </div>\n            <span class="profit-chart-label">' + escapeHtml(d.label) + '</span>\n        ';
        container.appendChild(wrap);
    });
}

// ===== SETTINGS =====
function loadSettings() {
    let s = appData.settings;
    document.getElementById('pharmacyName').value = s.pharmacyName || 'ValoPOS';
    document.getElementById('pharmacyAddress').value = s.address || '';
    document.getElementById('pharmacyPhone').value = s.phone || '';
    document.getElementById('receiptFooter').value = s.receiptFooter || '';
    document.getElementById('taxRate').value = s.taxRate || 0;
    document.getElementById('currency').value = s.currency || getText('settings.currencyDefault');
    var taxEl = document.getElementById('taxNumberInput');
    if (taxEl) taxEl.value = s.taxNumber || '';
    var rh = document.getElementById('receiptHeader');
    if (rh) rh.value = s.receiptHeader || '';
    var rps = document.getElementById('receiptPaperSize');
    if (rps) rps.value = s.receiptPaperSize || '80mm';
    var rsl = document.getElementById('receiptShowLogo');
    if (rsl) rsl.checked = s.receiptShowLogo || false;
    var rst = document.getElementById('receiptShowTax');
    if (rst) rst.checked = s.receiptShowTax !== false;
    var rsp = document.getElementById('receiptShowPoints');
    if (rsp) rsp.checked = s.receiptShowPoints !== false;
    var lr = document.getElementById('loyaltyRate');
    if (lr) lr.value = s.loyaltyRate || 1;
    var lrr = document.getElementById('loyaltyRedeemRate');
    if (lrr) lrr.value = s.loyaltyRedeemRate || 100;
    loadLoyaltyTierSettings();
    // Load widget settings checkboxes
    var w = s.dashboardWidgets || {};
    var widgetChecks = {
        widgetRecentSales: 'recentSales', widgetTopMeds: 'topMeds', widgetExpiryAlerts: 'expiryAlerts',
        widgetLowStock: 'lowStockAlerts', widgetTodayStats: 'todayStats', widgetProfitChart: 'profitChart',
        widgetTargetProgress: 'targetProgress', widgetDoctorRx: 'doctorPrescriptions'
    };
    Object.keys(widgetChecks).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.checked = w[widgetChecks[id]] !== false;
    });
    renderUsersTable();
    renderInsurances();
    loadInsuranceSelect();
    renderCurrencies();
    renderAnnouncements();
    renderSupplierPrices();
    // Load supplier filter dropdown
    var spf = document.getElementById('spSupplierFilter');
    if (spf) {
        spf.innerHTML = '<option value="">الكل</option>';
        (appData.suppliers || []).forEach(function(sup) {
            spf.innerHTML += '<option value="' + sup.id + '">' + escapeHtml(sup.name) + '</option>';
        });
    }
    updateBackupDateDisplay();
}

function saveSettings() {
    appData.settings.pharmacyName = document.getElementById('pharmacyName').value;
    appData.settings.address = document.getElementById('pharmacyAddress').value;
    appData.settings.phone = document.getElementById('pharmacyPhone').value;
    appData.settings.receiptFooter = document.getElementById('receiptFooter').value;
    appData.settings.taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    appData.settings.currency = document.getElementById('currency').value || getText('settings.currencyDefault');
    var taxEl = document.getElementById('taxNumberInput');
    if (taxEl) appData.settings.taxNumber = taxEl.value;
    // Also save receipt settings
    var rh = document.getElementById('receiptHeader');
    if (rh) appData.settings.receiptHeader = rh.value;
    var rps = document.getElementById('receiptPaperSize');
    if (rps) appData.settings.receiptPaperSize = rps.value;
    var rsl = document.getElementById('receiptShowLogo');
    if (rsl) appData.settings.receiptShowLogo = rsl.checked;
    var rst = document.getElementById('receiptShowTax');
    if (rst) appData.settings.receiptShowTax = rst.checked;
    var rsp = document.getElementById('receiptShowPoints');
    if (rsp) appData.settings.receiptShowPoints = rsp.checked;
    // Loyalty rate
    var lr = document.getElementById('loyaltyRate');
    if (lr) appData.settings.loyaltyRate = parseFloat(lr.value) || 1;
    var lrr = document.getElementById('loyaltyRedeemRate');
    if (lrr) appData.settings.loyaltyRedeemRate = parseFloat(lrr.value) || 100;
    updateCur();
    saveData();
    showToast(getText('settings.saved'), 'success');
    audit('settings', 'تعديل الإعدادات');
}

function resetData() {
    if (confirm(getText('settings.resetConfirm1'))) {
        if (confirm(getText('settings.resetConfirm2'))) {
            localStorage.removeItem('pharmacy_pos_data');
            appData = {
                cart: [], invoices: [], customers: [], suppliers: [], purchases: [],
                settings: { pharmacyName: 'ValoPOS', address: '', phone: '',         receiptFooter: getText('settings.receiptFooterDefault'), taxRate: 0, currency: '\u062C.\u0645' },
                nextInvoiceId: 1, nextPurchaseId: 1, nextReturnId: 1, returns: [], stockChanges: [],
                nextExpenseId: 1, expenses: [], nextClosingId: 1, closings: []
            };
            saveData();
            renderDashboard();
            renderInventory();
            renderReports();
            renderCustomers();
            renderSuppliers();
            renderPurchases();
            showToast(getText('settings.resetDone'), 'info');
        }
    }
}

function exportAllData() {
    var backup = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        appData: JSON.parse(JSON.stringify(appData)),
        medStock: getAllStock()
    };
    var json = JSON.stringify(backup, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'valopos-backup-' + todayStr() + '.json';
    a.click();
    URL.revokeObjectURL(url);
    var sizeKB = (blob.size / 1024).toFixed(1);
    localStorage.setItem('valopos_last_backup', Date.now().toString());
    updateBackupDateDisplay();
    showToast(getText('set.backupExported') + ' ' + sizeKB + ' KB', 'success');
}

function importAllData(file) {
    var reader = new FileReader();
    reader.onload = function(ev) {
        try {
            var data = JSON.parse(ev.target.result);
            if (!data || !data.appData || !data.medStock) {
                showToast(getText('set.invalidBackupFile'), 'error');
                return;
            }
            appData = data.appData;
            medStock = data.medStock;
            saveData();
            saveStock();
            showToast(getText('set.restoreSuccess'), 'success');
            setTimeout(function() {
                location.reload();
            }, 2000);
        } catch (err) {
            showToast(getText('set.importError'), 'error');
        }
    };
    reader.readAsText(file);
}

function updateBackupDateDisplay() {
    var el = document.getElementById('lastBackupDate');
    if (!el) return;
    var ts = localStorage.getItem('valopos_last_backup');
    if (ts) {
        var d = new Date(parseInt(ts));
        el.textContent = d.toLocaleString();
    } else {
        el.textContent = getText('set.noBackup');
    }
}

function escapeHtmlCSV(str) {
    if (!str) return '';
    let s = String(str);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

function exportInventoryCSV() {
    let meds = medicinesDB;
    if (meds.length === 0) { showToast(getText('inventory.noExport'), 'warning'); return; }
    let csv = getText('inventory.csvHeader') + '\n';
    meds.forEach(function(m) {
        csv += m.id + ',' + escapeHtmlCSV(m.name) + ',' + escapeHtmlCSV(m.scientificName) + ',' + escapeHtmlCSV(m.category) + ',' + m.price + ',' + getQty(m.id) + ',' + (getExpiryDate(m.id) || '') + ',' + (m.barcode || '') + ',' + (m.rx ? getText('inventory.rxYes') : getText('inventory.rxNo')) + '\n';
    });
    let blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_' + todayStr() + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast(getText('inventory.exported'), 'success');
}

function checkBackupReminder() {
    let lastBackup = localStorage.getItem('valopos_last_backup');
    if (lastBackup) {
        let days = Math.floor((Date.now() - parseInt(lastBackup)) / (1000 * 60 * 60 * 24));
        if (days >= 7) {
            setTimeout(function() {
                showToast(getText('settings.backupReminder'), 'warning');
            }, 4000);
        }
    } else {
        setTimeout(function() {
            showToast(getText('settings.backupReminder'), 'warning');
        }, 4000);
    }
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

document.getElementById('exportBtn').addEventListener('click', exportAllData);

// ===== RIPPLE EFFECT =====
(function() {
    document.addEventListener('click', function(e) {
        let btn = e.target.closest('.btn');
        if (!btn) return;
        let ripple = document.createElement('span');
        let rect = btn.getBoundingClientRect();
        let size = Math.max(rect.width, rect.height);
        let x = e.clientX - rect.left - size / 2;
        let y = e.clientY - rect.top - size / 2;
        ripple.style.cssText = 'position:absolute;left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(255,255,255,0.3);transform:scale(0);animation:ripple 0.6s ease-out;pointer-events:none;';
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(function() { ripple.remove(); }, 700);
    });
})();

// ===== DARK MODE =====
(function() {
    let toggleIds = ['valoposThemeToggle', 'headerThemeToggle'];
    let toggles = toggleIds.map(function(id) { return document.getElementById(id); });
    let icons = toggles.map(function(t) { return t ? t.querySelector('i') : null; });
    let saved = localStorage.getItem('valopos_theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        icons.forEach(function(ic) { if (ic) ic.className = 'fas fa-sun'; });
    }
    function applyTheme(isDark) {
        let html = document.documentElement;
        if (isDark) {
            html.setAttribute('data-theme', 'dark');
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
                let html = document.documentElement;
                let isDark = html.getAttribute('data-theme') === 'dark';
                applyTheme(!isDark);
            });
        }
    });
})();

// ===== KEYBOARD HINT =====
const kh = document.createElement('div');
kh.className = 'keyboard-hint';
kh.innerHTML = '\n    <button class="keyboard-hint-close" onclick="this.parentElement.remove()">&times;</button>\n    <span><kbd>F1</kbd> ' + getText('keyboard.search') + '</span>\n    <span><kbd>F2</kbd> ' + getText('keyboard.newInvoice') + '</span>\n    <span><kbd>F8</kbd> ' + getText('keyboard.checkout') + '</span>\n    <span><kbd>Esc</kbd> ' + getText('keyboard.closeSearch') + '</span>\n';
document.body.appendChild(kh);

// ===== PAGINATION HELPERS =====
const paginationState = { inventory: {page:1, perPage:50}, customers: {page:1, perPage:50}, suppliers: {page:1, perPage:50}, purchases: {page:1, perPage:50}, invoices: {page:1, perPage:50}, expenses: {page:1, perPage:50}, closings: {page:1, perPage:50} };

function paginate(data, page, perPage) {
    const start = (page-1)*perPage;
    return { items: data.slice(start, start+perPage), total: data.length, page: page, pages: Math.ceil(data.length/perPage) };
}

function renderPagination(containerId, currentPage, totalPages, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    const keyMap = { 'invPagination': 'inventory', 'customersPagination': 'customers', 'suppliersPagination': 'suppliers', 'purchasesPagination': 'purchases', 'invoicesPagination': 'invoices' };
    let stateKey = keyMap[containerId] || containerId.replace('Pagination','');
    let html = '<div class="pagination-controls">';
    html += '<button class="btn btn-sm" onclick="paginationState.' + stateKey + '.page=1;(' + callback + ')();" ' + (currentPage === 1 ? 'disabled' : '') + '\u00AB</button>';
    html += '<button class="btn btn-sm" onclick="paginationState.' + stateKey + '.page=' + (currentPage-1) + ';(' + callback + ')();" ' + (currentPage === 1 ? 'disabled' : '') + '\u2039</button>';
    html += '<span style="margin:0 8px;font-size:13px;">' + currentPage + ' / ' + totalPages + '</span>';
    html += '<button class="btn btn-sm" onclick="paginationState.' + stateKey + '.page=' + (currentPage+1) + ';(' + callback + ')();" ' + (currentPage === totalPages ? 'disabled' : '') + '\u203A</button>';
    html += '<button class="btn btn-sm" onclick="paginationState.' + stateKey + '.page=' + totalPages + ';(' + callback + ')();" ' + (currentPage === totalPages ? 'disabled' : '') + '\u00BB</button>';
    html += '</div>';
    container.innerHTML = html;
}

// ===== EXPENSE TRACKING =====
function addExpense() {
    let modal = document.getElementById('expenseModal');
    document.getElementById('expenseEditId').value = '';
    document.getElementById('expenseModalTitle').textContent = 'إضافة مصروف';
    document.getElementById('expenseCategory').value = 'أخرى';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseNotes').value = '';
    document.getElementById('expenseDate').value = todayStr();
    modal.style.display = 'block';
}

function editExpense(id) {
    let exp = appData.expenses.find(function(e) { return e.id === id; });
    if (!exp) return;
    document.getElementById('expenseEditId').value = id;
    document.getElementById('expenseModalTitle').textContent = 'تعديل مصروف';
    document.getElementById('expenseCategory').value = exp.category;
    document.getElementById('expenseAmount').value = exp.amount;
    document.getElementById('expenseNotes').value = exp.notes || '';
    document.getElementById('expenseDate').value = exp.date.split('T')[0];
    document.getElementById('expenseModal').style.display = 'block';
}

function saveExpense() {
    let editId = document.getElementById('expenseEditId').value;
    let category = document.getElementById('expenseCategory').value;
    let amount = parseFloat(document.getElementById('expenseAmount').value);
    let notes = document.getElementById('expenseNotes').value.trim();
    let date = document.getElementById('expenseDate').value;
    if (!amount || amount <= 0) { showToast('الرجاء إدخال مبلغ صحيح', 'error'); return; }
    if (!date) { showToast('الرجاء إدخال التاريخ', 'error'); return; }
    if (editId) {
        let exp = appData.expenses.find(function(e) { return e.id === parseInt(editId); });
        if (exp) { exp.category = category; exp.amount = amount; exp.notes = notes; exp.date = date + 'T00:00:00'; }
        showToast('تم تعديل المصروف', 'success');
    } else {
        appData.expenses.push({
            id: appData.nextExpenseId++,
            date: date + 'T00:00:00',
            category: category,
            amount: amount,
            notes: notes,
            createdBy: 'admin'
        });
        showToast('تم إضافة المصروف', 'success');
    }
    saveData();
    renderExpenses();
    renderReports();
    renderDashboard();
    document.getElementById('expenseModal').style.display = 'none';
}

function deleteExpense(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المصروف؟')) return;
    appData.expenses = appData.expenses.filter(function(e) { return e.id !== id; });
    saveData();
    renderExpenses();
    renderReports();
    renderDashboard();
    showToast('تم حذف المصروف', 'info');
}

function renderExpenses() {
    let searchCat = document.getElementById('expenseCatFilter')?.value || 'الكل';
    let dateFrom = document.getElementById('expenseDateFrom')?.value || '';
    let dateTo = document.getElementById('expenseDateTo')?.value || '';
    let expenses = appData.expenses.slice();
    if (searchCat !== 'الكل') {
        expenses = expenses.filter(function(e) { return e.category === searchCat; });
    }
    if (dateFrom) {
        expenses = expenses.filter(function(e) { return e.date >= dateFrom; });
    }
    if (dateTo) {
        expenses = expenses.filter(function(e) { return e.date <= dateTo + 'T23:59:59'; });
    }
    let totalAmount = expenses.reduce(function(s, e) { return s + e.amount; }, 0);
    let todayExp = expenses.filter(function(e) { return isToday(e.date); });
    let todayTotal = todayExp.reduce(function(s, e) { return s + e.amount; }, 0);
    let thisMonthExp = expenses.filter(function(e) { return isThisMonth(e.date); });
    let monthTotal = thisMonthExp.reduce(function(s, e) { return s + e.amount; }, 0);
    let catTotals = {};
    expenses.forEach(function(e) { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
    let totalEl = document.getElementById('expenseTotal');
    if (totalEl) totalEl.textContent = formatPrice(totalAmount) + ' ' + cur;
    let todayEl = document.getElementById('expenseTodayTotal');
    if (todayEl) todayEl.textContent = formatPrice(todayTotal) + ' ' + cur;
    let monthEl = document.getElementById('expenseMonthTotal');
    if (monthEl) monthEl.textContent = formatPrice(monthTotal) + ' ' + cur;
    let catHtml = '';
    for (let cat in catTotals) {
        catHtml += '<span class="badge badge-info" style="margin:2px;">' + escapeHtml(cat) + ': ' + formatPrice(catTotals[cat]) + ' ' + cur + '</span>';
    }
    let catEl = document.getElementById('expenseCategorySummary');
    if (catEl) catEl.innerHTML = catHtml || '<span class="text-muted">لا توجد مصروفات</span>';
    let sorted = expenses.slice().reverse();
    let state = paginationState.expenses;
    let paged = paginate(sorted, state.page, state.perPage);
    if (state.page > paged.pages) state.page = 1;
    paged = paginate(sorted, state.page, state.perPage);
    let tbody = document.getElementById('expensesBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">لا توجد مصروفات</td></tr>';
        renderPagination('expensesPagination', paged.page, paged.pages, 'renderExpenses');
        return;
    }
    paged.items.forEach(function(e) {
        let tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + e.id + '</td>\n            <td>' + formatDate(e.date) + '</td>\n            <td><span class="badge badge-info">' + escapeHtml(e.category) + '</span></td>\n            <td><strong>' + formatPrice(e.amount) + ' ' + cur + '</strong></td>\n            <td>' + escapeHtml(e.notes || '') + '</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="editExpense(' + e.id + ')">تعديل</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteExpense(' + e.id + ')">حذف</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
    renderPagination('expensesPagination', paged.page, paged.pages, 'renderExpenses');
}

// ===== DAILY CLOSING (Cash Register) =====
function openDailyClosing() {
    let today = todayStr();
    let existing = appData.closings.find(function(c) { return c.date === today; });
    if (existing) {
        showToast('تم إقفال اليوم بالفعل', 'warning');
        return;
    }
    let todayInvs = appData.invoices.filter(function(inv) { return isToday(inv.date) && inv.status !== 'ملغية'; });
    let expectedCash = 0, expectedCard = 0, expectedVodafone = 0, expectedInstaPay = 0;
    todayInvs.forEach(function(inv) {
        let pm = inv.paymentMethod || 'cash';
        if (pm === 'split') {
            expectedCash += inv.splitAmount || 0;
            expectedVodafone += (inv.net - (inv.splitAmount || 0));
        } else if (pm === 'cash') { expectedCash += inv.net; }
        else if (pm === 'card') { expectedCard += inv.net; }
        else if (pm === 'vodafone') { expectedVodafone += inv.net; }
        else if (pm === 'instapay') { expectedInstaPay += inv.net; }
        else { expectedCash += inv.net; }
    });
    let todayExpenses = appData.expenses.filter(function(e) { return isToday(e.date); });
    let expensesTotal = todayExpenses.reduce(function(s, e) { return s + e.amount; }, 0);
    document.getElementById('closingDate').value = today;
    document.getElementById('closingExpectedCash').value = formatPrice(expectedCash);
    document.getElementById('closingActualCash').value = formatPrice(expectedCash);
    document.getElementById('closingExpectedCard').value = formatPrice(expectedCard);
    document.getElementById('closingActualCard').value = formatPrice(expectedCard);
    document.getElementById('closingExpectedVodafone').value = formatPrice(expectedVodafone);
    document.getElementById('closingActualVodafone').value = formatPrice(expectedVodafone);
    document.getElementById('closingExpectedInstaPay').value = formatPrice(expectedInstaPay);
    document.getElementById('closingActualInstaPay').value = formatPrice(expectedInstaPay);
    document.getElementById('closingExpensesToday').value = formatPrice(expensesTotal);
    document.getElementById('closingNotes').value = '';
    document.getElementById('closingDiff').textContent = '0.00';
    document.getElementById('dailyClosingModal').style.display = 'block';
}

function calcClosingDiff() {
    let expected = parseFloat(document.getElementById('closingExpectedCash').value) || 0;
    let actual = parseFloat(document.getElementById('closingActualCash').value) || 0;
    let diff = actual - expected;
    document.getElementById('closingDiff').textContent = formatPrice(diff);
    let el = document.getElementById('closingDiff');
    if (diff > 0) el.style.color = 'var(--success)';
    else if (diff < 0) el.style.color = 'var(--danger)';
    else el.style.color = 'var(--text)';
}

function confirmDailyClosing() {
    let today = todayStr();
    if (appData.closings.find(function(c) { return c.date === today; })) {
        showToast('تم إقفال اليوم بالفعل', 'warning');
        document.getElementById('dailyClosingModal').style.display = 'none';
        return;
    }
    let expectedCash = parseFloat(document.getElementById('closingExpectedCash').value) || 0;
    let actualCash = parseFloat(document.getElementById('closingActualCash').value) || 0;
    let expectedCard = parseFloat(document.getElementById('closingExpectedCard').value) || 0;
    let actualCard = parseFloat(document.getElementById('closingActualCard').value) || 0;
    let expectedVodafone = parseFloat(document.getElementById('closingExpectedVodafone').value) || 0;
    let actualVodafone = parseFloat(document.getElementById('closingActualVodafone').value) || 0;
    let expectedInstaPay = parseFloat(document.getElementById('closingExpectedInstaPay').value) || 0;
    let actualInstaPay = parseFloat(document.getElementById('closingActualInstaPay').value) || 0;
    let expensesToday = parseFloat(document.getElementById('closingExpensesToday').value) || 0;
    let notes = document.getElementById('closingNotes').value.trim();
    let difference = actualCash - expectedCash;
    let diffText = difference >= 0 ? ' فائض: ' + formatPrice(difference) : ' عجز: ' + formatPrice(Math.abs(difference));
    appData.closings.push({
        id: appData.nextClosingId++,
        date: today,
        expectedCash: expectedCash, actualCash: actualCash,
        expectedCard: expectedCard, actualCard: actualCard,
        expectedVodafone: expectedVodafone, actualVodafone: actualVodafone,
        expectedInstaPay: expectedInstaPay, actualInstaPay: actualInstaPay,
        expensesToday: expensesToday,
        difference: difference,
        notes: notes,
        createdBy: 'admin',
        closedAt: new Date().toISOString()
    });
    saveData();
    document.getElementById('dailyClosingModal').style.display = 'none';
    showToast('تم إقفال اليوم بنجاح -' + diffText, difference >= 0 ? 'success' : 'warning');
    renderReports();
    renderDashboard();
}

function checkTodayClosing() {
    let today = todayStr();
    if (appData.closings.find(function(c) { return c.date === today; })) {
        showToast('اليوم مقفل بالفعل', 'info');
    }
}

function renderClosings() {
    let closings = (appData.closings || []).slice().reverse();
    let state = paginationState.closings;
    let paged = paginate(closings, state.page, state.perPage);
    if (state.page > paged.pages) state.page = 1;
    paged = paginate(closings, state.page, state.perPage);
    let tbody = document.getElementById('closingsBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (closings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center empty-state">لا توجد إقفالات سابقة</td></tr>';
        renderPagination('closingsPagination', paged.page, paged.pages, 'renderClosings');
        return;
    }
    paged.items.forEach(function(c) {
        let diffText = c.difference >= 0 ? 'فائض' : 'عجز';
        let diffClass = c.difference >= 0 ? 'badge-success' : 'badge-danger';
        let tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>#' + c.id + '</td>\n            <td>' + c.date + '</td>\n            <td>' + formatPrice(c.expectedCash) + ' ' + cur + '</td>\n            <td>' + formatPrice(c.actualCash) + ' ' + cur + '</td>\n            <td>' + formatPrice(c.expensesToday) + ' ' + cur + '</td>\n            <td><span class="badge ' + diffClass + '">' + diffText + ' ' + formatPrice(Math.abs(c.difference)) + '</span></td>\n            <td>' + escapeHtml(c.notes || '') + '</td>\n            <td>' + formatDate(c.closedAt) + '</td>\n        ';
        tbody.appendChild(tr);
    });
    renderPagination('closingsPagination', paged.page, paged.pages, 'renderClosings');
}

// ===== INSURANCE FUNCTIONS =====
function showInsuranceModal(id) {
    document.getElementById('insuranceEditId').value = id || '';
    document.getElementById('insuranceModalTitle').textContent = id ? 'تعديل شركة تأمين' : 'إضافة شركة تأمين';
    if (id) {
        var ins = appData.insurances.find(function(i) { return i.id === id; });
        if (ins) {
            document.getElementById('insuranceNameInput').value = ins.name;
            document.getElementById('insuranceDiscountInput').value = ins.discountPercent || 0;
            document.getElementById('insurancePhoneInput').value = ins.phone || '';
            document.getElementById('insuranceNotesInput').value = ins.notes || '';
        }
    } else {
        document.getElementById('insuranceNameInput').value = '';
        document.getElementById('insuranceDiscountInput').value = '0';
        document.getElementById('insurancePhoneInput').value = '';
        document.getElementById('insuranceNotesInput').value = '';
    }
    document.getElementById('insuranceModal').style.display = 'block';
}

function saveInsurance() {
    var editId = document.getElementById('insuranceEditId').value;
    var name = document.getElementById('insuranceNameInput').value.trim();
    if (!name) { showToast('الرجاء إدخال اسم الشركة', 'error'); return; }
    var discountPercent = parseFloat(document.getElementById('insuranceDiscountInput').value) || 0;
    var phone = document.getElementById('insurancePhoneInput').value.trim();
    var notes = document.getElementById('insuranceNotesInput').value.trim();
    if (editId) {
        var ins = appData.insurances.find(function(i) { return i.id === parseInt(editId); });
        if (ins) { ins.name = name; ins.discountPercent = discountPercent; ins.phone = phone; ins.notes = notes; }
        showToast('تم تعديل شركة التأمين', 'success');
    } else {
        if (!appData.insurances) appData.insurances = [];
        appData.insurances.push({ id: appData.nextInsuranceId++, name: name, discountPercent: discountPercent, phone: phone, notes: notes });
        showToast('تم إضافة شركة التأمين', 'success');
    }
    saveData();
    renderInsurances();
    loadInsuranceSelect();
    document.getElementById('insuranceModal').style.display = 'none';
    audit('insurance', (editId ? 'تعديل' : 'إضافة') + ' شركة تأمين: ' + name);
}

function deleteInsurance(id) {
    if (!confirm('هل أنت متأكد من حذف شركة التأمين؟')) return;
    appData.insurances = appData.insurances.filter(function(i) { return i.id !== id; });
    saveData();
    renderInsurances();
    loadInsuranceSelect();
    showToast('تم حذف شركة التأمين', 'info');
}

function renderInsurances() {
    var tbody = document.getElementById('insuranceBody');
    if (!tbody) return;
    var insurances = appData.insurances || [];
    if (insurances.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">لا توجد شركات تأمين</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    insurances.forEach(function(ins) {
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + ins.id + '</td>\n            <td><strong>' + escapeHtml(ins.name) + '</strong></td>\n            <td>' + (ins.discountPercent || 0) + '%</td>\n            <td>' + escapeHtml(ins.phone || '') + '</td>\n            <td>' + escapeHtml(ins.notes || '') + '</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="showInsuranceModal(' + ins.id + ')">تعديل</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteInsurance(' + ins.id + ')">حذف</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

function loadInsuranceSelect() {
    var sel = document.getElementById('cartInsurance');
    if (!sel) return;
    var html = '<option value="">بدون تأمين</option>';
    (appData.insurances || []).forEach(function(ins) {
        html += '<option value="' + ins.id + '">' + escapeHtml(ins.name) + ' (' + (ins.discountPercent || 0) + '%)</option>';
    });
    sel.innerHTML = html;
}

document.getElementById('cartInsurance')?.addEventListener('change', function() {
    var infoEl = document.getElementById('insuranceInfo');
    if (!infoEl) return;
    var id = parseInt(this.value);
    if (id) {
        var ins = appData.insurances.find(function(i) { return i.id === id; });
        if (ins) {
            infoEl.style.display = 'block';
            infoEl.textContent = 'خصم: ' + (ins.discountPercent || 0) + '% | ' + escapeHtml(ins.phone || '');
        }
    } else {
        infoEl.style.display = 'none';
    }
    updateCartSummary();
});

// ===== PARK SALE FUNCTIONS =====
document.getElementById('parkSaleBtn')?.addEventListener('click', function() {
    if (appData.cart.length === 0) { showToast('الفاتورة فارغة!', 'warning'); return; }
    if (!confirm('هل تريد تعليق هذه الفاتورة؟')) return;
    var park = {
        id: (appData.parkedSales.length || 0) + 1,
        date: new Date().toISOString(),
        items: appData.cart.map(function(item) { return { ...item }; }),
        customerId: parseInt(document.getElementById('cartCustomer')?.value) || null,
        discount: parseFloat(document.getElementById('discountInput')?.value) || 0,
        note: ''
    };
    if (!appData.parkedSales) appData.parkedSales = [];
    appData.parkedSales.push(park);
    appData.cart = [];
    saveData();
    renderCart();
    renderParkedSales();
    document.getElementById('discountInput').value = 0;
    document.getElementById('paidInput').value = '';
    showToast('تم تعليق الفاتورة #' + park.id, 'info');
    audit('park_sale', 'تعليق فاتورة #' + park.id);
});

function resumeSale(parkId) {
    var park = (appData.parkedSales || []).find(function(p) { return p.id === parkId; });
    if (!park) return;
    if (appData.cart.length > 0) {
        if (!confirm('الفاتورة الحالية غير فارغة. هل تريد استبدالها؟')) return;
    }
    appData.cart = park.items.map(function(item) { return { ...item }; });
    appData.parkedSales = appData.parkedSales.filter(function(p) { return p.id !== parkId; });
    saveData();
    renderCart();
    renderParkedSales();
    if (park.customerId) {
        var sel = document.getElementById('cartCustomer');
        if (sel) sel.value = park.customerId;
    }
    if (park.discount) {
        var dEl = document.getElementById('discountInput');
        if (dEl) dEl.value = park.discount;
    }
    showToast('تم استئناف الفاتورة #' + parkId, 'success');
    audit('resume_sale', 'استئناف فاتورة #' + parkId);
}

function deleteParkedSale(parkId) {
    if (!confirm('هل تريد حذف الفاتورة المعلقة؟')) return;
    appData.parkedSales = (appData.parkedSales || []).filter(function(p) { return p.id !== parkId; });
    saveData();
    renderParkedSales();
    showToast('تم حذف الفاتورة المعلقة', 'info');
}

function renderParkedSales() {
    var container = document.getElementById('parkedSalesList');
    var countEl = document.getElementById('parkedSalesCount');
    if (!container) return;
    var parked = appData.parkedSales || [];
    if (countEl) countEl.textContent = parked.length;
    if (parked.length === 0) {
        container.innerHTML = '<p class="text-center empty-state">لا توجد فواتير معلقة</p>';
        return;
    }
    container.innerHTML = '';
    parked.forEach(function(p) {
        var total = p.items.reduce(function(s, item) { return s + item.price * item.qty; }, 0);
        var div = document.createElement('div');
        div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid var(--border-light);font-size:13px;';
        div.innerHTML = '\n            <div>\n                <strong>#' + p.id + '</strong>\n                <span style="color:var(--text-light);font-size:11px;display:block;">' + formatDate(p.date) + ' - ' + p.items.length + ' صنف</span>\n            </div>\n            <div style="text-align:left;">\n                <strong>' + formatPrice(total) + ' ' + cur + '</strong>\n                <div style="display:flex;gap:4px;margin-top:4px;">\n                    <button class="btn btn-sm btn-success" onclick="resumeSale(' + p.id + ')" style="padding:2px 8px;font-size:11px;">استئناف</button>\n                    <button class="btn btn-sm btn-danger" onclick="deleteParkedSale(' + p.id + ')" style="padding:2px 8px;font-size:11px;">حذف</button>\n                </div>\n            </div>\n        ';
        container.appendChild(div);
    });
}

// ===== SUPPLIER PAYMENT FUNCTIONS =====
function showSupplierPaymentModal(supplierId) {
    document.getElementById('supplierPaymentSupplierId').value = supplierId;
    document.getElementById('supplierPaymentAmount').value = '';
    document.getElementById('supplierPaymentMethod').value = 'cash';
    document.getElementById('supplierPaymentNotes').value = '';
    document.getElementById('supplierPaymentModal').style.display = 'block';
}

function saveSupplierPayment() {
    var supplierId = parseInt(document.getElementById('supplierPaymentSupplierId').value);
    var amount = parseFloat(document.getElementById('supplierPaymentAmount').value);
    var method = document.getElementById('supplierPaymentMethod').value;
    var notes = document.getElementById('supplierPaymentNotes').value.trim();
    if (!amount || amount <= 0) { showToast('الرجاء إدخال مبلغ صحيح', 'error'); return; }
    if (!appData.supplierPayments) appData.supplierPayments = [];
    appData.supplierPayments.push({
        id: appData.nextSupplierPaymentId++,
        supplierId: supplierId,
        amount: amount,
        date: new Date().toISOString(),
        method: method,
        notes: notes
    });
    saveData();
    document.getElementById('supplierPaymentModal').style.display = 'none';
    showToast('تم تسجيل الدفعة بنجاح', 'success');
    renderSuppliers();
    audit('supplier_payment', 'دفعة مورد #' + supplierId + ' بمبلغ ' + formatPrice(amount));
}

function renderSupplierPayments(supplierId) {
    var payments = (appData.supplierPayments || []).filter(function(p) { return p.supplierId === supplierId; });
    var container = document.getElementById('supplierPaymentsList');
    if (!container) return;
    if (payments.length === 0) {
        container.innerHTML = '<p class="text-center empty-state">لا توجد مدفوعات</p>';
        return;
    }
    container.innerHTML = '';
    payments.slice().reverse().forEach(function(p) {
        var div = document.createElement('div');
        div.style.cssText = 'display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-light);font-size:13px;';
        div.innerHTML = '\n            <span>' + formatDate(p.date) + '</span>\n            <span><strong>' + formatPrice(p.amount) + ' ' + cur + '</strong></span>\n            <span>' + (p.method === 'cash' ? 'نقداً' : p.method === 'bank' ? 'تحويل بنكي' : 'شيك') + '</span>\n            <span style="color:var(--text-light);font-size:11px;">' + escapeHtml(p.notes || '') + '</span>\n        ';
        container.appendChild(div);
    });
}

function getSupplierDebt(supplierId) {
    var purchases = (appData.purchases || []).filter(function(p) { return p.supplierId === supplierId; });
    var totalPurchases = purchases.reduce(function(s, p) { return s + p.net; }, 0);
    var payments = (appData.supplierPayments || []).filter(function(p) { return p.supplierId === supplierId; });
    var totalPayments = payments.reduce(function(s, p) { return s + p.amount; }, 0);
    var returns = (appData.purchaseReturns || []).filter(function(r) { return r.supplierId === supplierId; });
    var totalReturns = returns.reduce(function(s, r) { return s + r.total; }, 0);
    return totalPurchases - totalPayments - totalReturns;
}

// ===== PURCHASE RETURN FUNCTIONS =====
function showPurchaseReturn(purchaseId) {
    var purchase = appData.purchases.find(function(p) { return p.id === purchaseId; });
    if (!purchase) return;
    document.getElementById('purchaseReturnPurchaseId').textContent = purchaseId;
    var list = document.getElementById('purchaseReturnItemsList');
    list.innerHTML = '';
    var hasItems = false;
    purchase.items.forEach(function(item) {
        hasItems = true;
        var div = document.createElement('div');
        div.className = 'return-item';
        div.innerHTML = '\n            <label class="return-item-label">\n                <input type="checkbox" class="return-item-cb" data-id="' + item.medId + '" data-max="' + item.qty + '" checked>\n                <span class="return-item-name">' + escapeHtml(item.name) + '</span>\n                <span class="return-item-price">' + formatPrice(item.price * item.qty) + ' ' + cur + '</span>\n            </label>\n            <div class="return-item-qty-wrap">\n                <label>الكمية: </label>\n                <input type="number" class="return-item-qty form-input" value="' + item.qty + '" min="1" max="' + item.qty + '" style="width:70px;">\n            </div>\n        ';
        list.appendChild(div);
    });
    if (!hasItems) {
        list.innerHTML = '<p class="text-center empty-state">لا توجد أصناف للإرجاع</p>';
    }
    document.getElementById('purchaseReturnReason').value = '';
    document.getElementById('purchaseReturnModal').style.display = 'block';
}

function confirmPurchaseReturn() {
    var purchaseId = parseInt(document.getElementById('purchaseReturnPurchaseId').textContent);
    var purchase = appData.purchases.find(function(p) { return p.id === purchaseId; });
    if (!purchase) return;
    var items = [];
    document.querySelectorAll('#purchaseReturnItemsList .return-item-cb:checked').forEach(function(cb) {
        var medId = parseInt(cb.dataset.id);
        var maxQty = parseInt(cb.dataset.max);
        var qtyInput = cb.closest('.return-item').querySelector('.return-item-qty');
        var qty = parseInt(qtyInput.value) || maxQty;
        if (qty < 1 || qty > maxQty) qty = maxQty;
        var item = purchase.items.find(function(i) { return i.medId === medId; });
        if (item) {
            items.push({ medicineId: medId, name: item.name, qty: qty, price: item.price });
            adjustStock(medId, -qty);
        }
    });
    if (items.length === 0) { showToast('اختر عنصراً واحداً على الأقل', 'error'); return; }
    var reason = document.getElementById('purchaseReturnReason').value.trim() || 'بدون سبب';
    var total = items.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
    if (!appData.purchaseReturns) appData.purchaseReturns = [];
    appData.purchaseReturns.push({
        id: appData.nextPurchaseReturnId++,
        purchaseId: purchaseId,
        supplierId: purchase.supplierId,
        date: new Date().toISOString(),
        items: items,
        reason: reason,
        total: total
    });
    saveData();
    saveStock();
    document.getElementById('purchaseReturnModal').style.display = 'none';
    showToast('تم تسجيل مرتجع الشراء بنجاح', 'success');
    renderPurchases();
    renderInventory();
    audit('purchase_return', 'مرتجع فاتورة شراء #' + purchaseId + ' بقيمة ' + formatPrice(total));
}

// ===== SCHEDULE REPORT =====
function showScheduleReport() {
    var card = document.getElementById('scheduleReportCard');
    var tbody = document.getElementById('scheduleReportBody');
    if (!card || !tbody) return;
    var sales = appData.scheduleSales || [];
    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">لا توجد مبيعات جدول</td></tr>';
    } else {
        tbody.innerHTML = '';
        sales.slice().reverse().forEach(function(s) {
            var scheduleLabel = s.schedule === 'schedule1' ? '🔴 جدول أول' : s.schedule === 'schedule2' ? '🟠 جدول ثاني' : s.schedule === 'schedule3' ? '🟡 جدول ثالث' : s.schedule;
            var tr = document.createElement('tr');
            tr.innerHTML = '\n                <td>#' + s.id + '</td>\n                <td>' + escapeHtml(s.medicineName) + '</td>\n                <td>' + scheduleLabel + '</td>\n                <td>' + s.qty + '</td>\n                <td>' + escapeHtml(s.customerName || '-') + '</td>\n                <td>' + formatDate(s.date) + '</td>\n            ';
            tbody.appendChild(tr);
        });
    }
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth' });
}

// ===== AUDIT LOG =====
function showAuditLog() {
    var card = document.getElementById('auditLogCard');
    var tbody = document.getElementById('auditLogBody');
    if (!card || !tbody) return;
    var log = appData.auditLog || [];
    if (log.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state">لا توجد نشاطات</td></tr>';
    } else {
        tbody.innerHTML = '';
        log.slice().reverse().slice(0, 100).forEach(function(entry) {
            var tr = document.createElement('tr');
            tr.innerHTML = '\n                <td>#' + entry.id + '</td>\n                <td>' + formatDate(entry.timestamp) + '</td>\n                <td>' + escapeHtml(entry.username) + '</td>\n                <td>' + escapeHtml(entry.action) + '</td>\n                <td>' + escapeHtml(entry.details || '') + '</td>\n            ';
            tbody.appendChild(tr);
        });
    }
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth' });
}

// ===== USER MANAGEMENT =====
function renderUsersTable() {
    var tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    var users = appData.users || [];
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state">لا يوجد مستخدمون</td></tr>';
        return;
    }
    tbody.innerHTML = '';
    users.forEach(function(u) {
        var roleLabel = u.role === 'admin' ? 'مدير' : u.role === 'cashier' ? 'كاشير' : 'صيدلي';
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + u.id + '</td>\n            <td>' + escapeHtml(u.name) + '</td>\n            <td>' + escapeHtml(u.username) + '</td>\n            <td>' + roleLabel + '</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="showUserModal(' + u.id + ')">تعديل</button>\n                ' + (currentUser && currentUser.id !== u.id ? '<button class="btn btn-sm btn-danger" onclick="deleteUser(' + u.id + ')">حذف</button>' : '') + '\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

function showUserModal(id) {
    document.getElementById('userEditId').value = id || '';
    document.getElementById('userModalTitle').textContent = id ? 'تعديل مستخدم' : 'إضافة مستخدم';
    if (id) {
        var u = (appData.users || []).find(function(ux) { return ux.id === id; });
        if (u) {
            document.getElementById('userNameInput').value = u.name;
            document.getElementById('userUsernameInput').value = u.username;
            document.getElementById('userPasswordInput').value = '';
            document.getElementById('userRoleInput').value = u.role;
        }
    } else {
        document.getElementById('userNameInput').value = '';
        document.getElementById('userUsernameInput').value = '';
        document.getElementById('userPasswordInput').value = '';
        document.getElementById('userRoleInput').value = 'cashier';
    }
    document.getElementById('userModal').style.display = 'block';
}

function saveUser() {
    var editId = document.getElementById('userEditId').value;
    var name = document.getElementById('userNameInput').value.trim();
    var username = document.getElementById('userUsernameInput').value.trim();
    var password = document.getElementById('userPasswordInput').value;
    var role = document.getElementById('userRoleInput').value;
    if (!name || !username) { showToast('الرجاء إدخال الاسم واسم المستخدم', 'error'); return; }
    if (editId) {
        var u = (appData.users || []).find(function(ux) { return ux.id === parseInt(editId); });
        if (u) {
            u.name = name;
            u.username = username;
            if (password) u.password = password;
            u.role = role;
        }
        showToast('تم تعديل المستخدم', 'success');
    } else {
        if (!appData.users) appData.users = [];
        if ((appData.users || []).find(function(ux) { return ux.username === username; })) {
            showToast('اسم المستخدم موجود مسبقاً', 'error'); return;
        }
        if (!password || password.length < 6) { showToast('كلمة المرور يجب أن تكون 6 أحرف أو أكثر', 'error'); return; }
        appData.users.push({ id: appData.nextUserId++, username: username, password: password, role: role, name: name });
        showToast('تم إضافة المستخدم', 'success');
    }
    saveData();
    renderUsersTable();
    document.getElementById('userModal').style.display = 'none';
    audit('user_' + (editId ? 'edit' : 'add'), (editId ? 'تعديل' : 'إضافة') + ' مستخدم: ' + username);
}

function deleteUser(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    if (currentUser && currentUser.id === id) { showToast('لا يمكن حذف نفسك', 'error'); return; }
    appData.users = (appData.users || []).filter(function(u) { return u.id !== id; });
    saveData();
    renderUsersTable();
    showToast('تم حذف المستخدم', 'info');
    audit('user_delete', 'حذف مستخدم #' + id);
}

function authLogout() {
    currentUser = null;
    authData.locked = true;
    document.getElementById('authOverlay').style.display = 'flex';
    document.getElementById('authPassword').value = '';
    document.getElementById('authUsername').value = 'admin';
    showToast('تم تسجيل الخروج', 'info');
}

function renderUserSpecificUI() {
    var usersCard = document.getElementById('usersManagementCard');
    if (usersCard) usersCard.style.display = can('admin') ? 'block' : 'none';
    var insuranceNav = document.querySelector('[data-page="insurance"]');
    if (insuranceNav) insuranceNav.style.display = can('admin') ? '' : 'none';
}

// ===== BARCODE LABEL PRINTING =====
function printBarcodeLabel(medId) {
    var meds = medId ? [getMedicineById(medId)] : medicinesDB;
    meds = meds.filter(function(m) { return m && getQty(m.id) > 0; });
    if (meds.length === 0) { showToast('لا توجد أدوية متاحة', 'warning'); return; }
    var w = window.open('', '_blank', 'width=600,height=800');
    var labelsHtml = '';
    meds.forEach(function(m) {
        labelsHtml += '\n            <div class="barcode-label">\n                <div class="label-pharmacy">' + escapeHtml(appData.settings.pharmacyName || 'ValoPOS') + '</div>\n                <div class="label-name">' + escapeHtml(m.name) + '</div>\n                <div class="label-price">' + formatPrice(m.price) + ' ' + cur + '</div>\n                <div class="label-barcode">' + escapeHtml(m.barcode || m.id.toString().padStart(8, '0')) + '</div>\n            </div>\n        ';
    });
    w.document.write('<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>طباعة باركود</title><style>\n        @page{margin:5mm;}\n        body{font-family:"Segoe UI",sans-serif;padding:10px;}\n        .labels-wrap{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}\n        .barcode-label{border:1px dashed #999;padding:10px;text-align:center;border-radius:4px;page-break-inside:avoid;}\n        .label-pharmacy{font-size:10px;color:#666;margin-bottom:2px;}\n        .label-name{font-size:14px;font-weight:700;margin-bottom:4px;}\n        .label-price{font-size:18px;font-weight:800;color:var(--primary,#6366f1);margin-bottom:4px;}\n        .label-barcode{font-family:monospace;font-size:12px;letter-spacing:2px;color:#333;margin-top:4px;border-top:1px solid #ddd;padding-top:4px;}\n        @media print{\n            body{padding:0;margin:0;}\n            .barcode-label{border-color:#ccc;}\n            .no-print{display:none!important;}\n        }\n        </style></head><body>\n        <div class="no-print" style="text-align:center;margin-bottom:12px;"><button onclick="window.print()" style="padding:8px 24px;font-size:16px;">🖨️ طباعة</button></div>\n        <div class="labels-wrap">' + labelsHtml + '</div>\n    </body></html>');
    w.document.close();
}

// ===== WHOLESALE PRICE UPDATE =====
document.getElementById('priceTypeToggle')?.addEventListener('change', function() {
    renderMedsGrid();
});

// Update cart to handle wholesale pricing
var origAddToCart = addToCart;

// ===== KEYBOARD SHORTCUTS ENHANCED =====
document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    switch(e.key) {
        case 'F2': e.preventDefault(); var posPage = document.querySelector('[data-page="pos"]'); if (posPage) posPage.click(); break;
        case 'F3': e.preventDefault(); var invPage = document.querySelector('[data-page="inventory"]'); if (invPage) invPage.click(); break;
        case 'F4': e.preventDefault(); var custPage = document.querySelector('[data-page="customers"]'); if (custPage) custPage.click(); break;
        case 'F5': e.preventDefault(); var repPage = document.querySelector('[data-page="reports"]'); if (repPage) repPage.click(); break;
        case 'F9': e.preventDefault(); newSale(); break;
        case 'Escape': closeAllModals(); break;
    }
});

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(function(m) { m.style.display = 'none'; });
}

// ===== SMART SEARCH AUTOCOMPLETE =====
function setupAutocomplete(inputId, sourceData, displayField, onSelect) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var container = document.createElement('div');
    container.className = 'autocomplete-dropdown';
    container.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:var(--bg-card);border:1px solid var(--border);border-radius:0 0 8px 8px;box-shadow:var(--shadow-lg);z-index:500;max-height:200px;overflow-y:auto;display:none;';
    input.parentNode.style.position = 'relative';
    input.parentNode.appendChild(container);
    input.addEventListener('input', debounce(function() {
        var val = this.value.trim().toLowerCase();
        if (val.length < 1) { container.innerHTML = ''; container.style.display = 'none'; return; }
        var matches = sourceData.filter(function(item) {
            return (item[displayField] || '').toLowerCase().includes(val);
        }).slice(0, 5);
        if (matches.length === 0) { container.style.display = 'none'; return; }
        container.style.display = 'block';
        container.innerHTML = matches.map(function(item) {
            return '<div class="autocomplete-item" data-id="' + item.id + '" style="padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border-light);font-size:13px;transition:var(--transition);">' + escapeHtml(item[displayField]) + '</div>';
        }).join('');
    }, 300));
    container.addEventListener('click', function(e) {
        var item = e.target.closest('.autocomplete-item');
        if (item) {
            input.value = item.textContent;
            container.style.display = 'none';
            input.dispatchEvent(new Event('input'));
            if (onSelect) onSelect(parseInt(item.dataset.id));
        }
    });
    document.addEventListener('click', function(e) {
        if (!container.contains(e.target) && e.target !== input) {
            container.style.display = 'none';
        }
    });
}

// ===== THEME TOGGLE =====
function toggleTheme() {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme');
    var isDark = current === 'dark';
    if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('valopos_theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('valopos_theme', 'dark');
    }
    updateThemeIcons(!isDark);
}

function updateThemeIcons(isDark) {
    document.querySelectorAll('#valoposThemeToggle i, #headerThemeToggle i').forEach(function(ic) {
        ic.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// ===== ENHANCED NEW SALE =====
function newSale() {
    appData.cart = [];
    saveData();
    renderCart();
    document.getElementById('discountInput').value = 0;
    document.getElementById('paidInput').value = '';
    var pmEl = document.getElementById('paymentMethod');
    if (pmEl) pmEl.value = 'cash';
    var saRow = document.getElementById('splitAmountRow');
    if (saRow) saRow.style.display = 'none';
    var saInp = document.getElementById('splitAmountInput');
    if (saInp) saInp.value = '';
    resetPrescriptionFields();
    showToast('فاتورة جديدة', 'info');
}

// ===== INIT =====
try {
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
    checkBackupReminder();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(function(err) {
            console.log('SW registration failed:', err);
        });
    }
} catch (e) {
    console.error('Init error:', e);
}

// ===== AUTH SYSTEM =====
let authData = { password: localStorage.getItem('valopos_auth_pass') || 'admin123', locked: true };

function authLogin() {
    try {
        var username = 'admin';
        var userInput = document.getElementById('authUsername');
        if (userInput) username = userInput.value.trim();
        if (!username) username = 'admin';
        var passInput = document.getElementById('authPassword');
        var pass = passInput ? passInput.value.trim() : '';
        if (!pass) { var e = document.getElementById('authError'); if (e) e.textContent = 'أدخل كلمة المرور'; return; }
        var error = document.getElementById('authError');
        if (!appData.users || appData.users.length === 0) {
            appData.users = [{ id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'المدير' }];
            appData.nextUserId = 2;
        }
        var user = appData.users.find(function(u) { return u.username === username && u.password === pass; });
        if (!user) {
            user = appData.users.find(function(u) { return u.username === 'admin' && u.password === pass; });
        }
        if (user) {
            currentUser = user;
            authData.locked = false;
            var overlay = document.getElementById('authOverlay');
            if (overlay) overlay.style.display = 'none';
            if (error) error.textContent = '';
            if (passInput) passInput.value = '';
            var avatar = document.getElementById('headerAvatar');
            if (avatar) avatar.textContent = user.name.charAt(0);
            var sname = document.querySelector('.sidebar-user-name');
            if (sname) sname.textContent = user.name + ' (' + (user.role === 'admin' ? 'مدير' : user.role === 'cashier' ? 'كاشير' : 'صيدلي') + ')';
            audit('login', 'تسجيل دخول المستخدم: ' + user.name);
            renderUserSpecificUI();
        } else {
            if (error) error.textContent = 'كلمة المرور غير صحيحة';
        }
    } catch (e) {
        console.error('Login error:', e);
        var el = document.getElementById('authError');
        if (el) el.textContent = 'خطأ في تسجيل الدخول';
    }
}

function authChangePassword() {
    try {
        var oldPassInput = document.getElementById('authOldPass');
        var newPassInput = document.getElementById('authNewPass');
        var confirmPassInput = document.getElementById('authConfirmPass');
        var error = document.getElementById('authChangeError');
        var oldPass = oldPassInput ? oldPassInput.value.trim() : '';
        var newPass = newPassInput ? newPassInput.value.trim() : '';
        var confirmPass = confirmPassInput ? confirmPassInput.value.trim() : '';
        if (oldPass !== authData.password) { if (error) error.textContent = 'كلمة المرور الحالية غير صحيحة'; return; }
        if (newPass.length < 6) { if (error) error.textContent = 'كلمة المرور الجديدة يجب أن تكون 6 أحرف أو أكثر'; return; }
        if (newPass !== confirmPass) { if (error) error.textContent = 'كلمة المرور غير متطابقة'; return; }
        authData.password = newPass;
        localStorage.setItem('valopos_auth_pass', newPass);
        if (error) error.textContent = '';
        if (oldPassInput) oldPassInput.value = '';
        if (newPassInput) newPassInput.value = '';
        if (confirmPassInput) confirmPassInput.value = '';
        var changeForm = document.getElementById('changePassForm');
        var loginForm = document.getElementById('loginForm');
        var hint = document.getElementById('authHint');
        var modeBtn = document.getElementById('authModeBtn');
        var pwdField = document.getElementById('authPassword');
        if (changeForm) changeForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
        if (hint) hint.style.display = 'none';
        if (modeBtn) modeBtn.textContent = 'تغيير كلمة المرور';
        if (pwdField) pwdField.focus();
    } catch (e) {
        console.error('Change password error:', e);
    }
}

document.getElementById('authLoginBtn').addEventListener('click', authLogin);
document.getElementById('authPassword').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') authLogin();
});
document.getElementById('authChangePassBtn').addEventListener('click', authChangePassword);
document.getElementById('authBackBtn').addEventListener('click', function() {
    document.getElementById('changePassForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('authModeBtn').textContent = getText('auth.switchToChange');
    document.getElementById('authPassword').focus();
});
document.getElementById('authModeBtn').addEventListener('click', function() {
    const loginForm = document.getElementById('loginForm');
    const changeForm = document.getElementById('changePassForm');
    if (loginForm.style.display !== 'none') {
        loginForm.style.display = 'none';
        changeForm.style.display = 'block';
        this.textContent = getText('auth.switchToLogin');
        document.getElementById('authOldPass').focus();
    } else {
        changeForm.style.display = 'none';
        loginForm.style.display = 'block';
        this.textContent = getText('auth.switchToChange');
        document.getElementById('authPassword').focus();
    }
});

// ======================================================================
// FEATURE 1: Multi-Warehouse Management
// ======================================================================
function renderWarehouses() {
    var tbody = document.getElementById('warehouseBody');
    if (!tbody) return;
    var warehouses = appData.warehouses || [];
    tbody.innerHTML = '';
    if (warehouses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state">لا توجد مستودعات</td></tr>';
        return;
    }
    warehouses.forEach(function(w) {
        var medCount = Object.keys(appData.medicineWarehouses || {}).filter(function(id) {
            return appData.medicineWarehouses[id] && appData.medicineWarehouses[id][w.id] > 0;
        }).length;
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + w.id + '</td>\n            <td><strong>' + escapeHtml(w.name) + '</strong></td>\n            <td>' + escapeHtml(w.location || '') + '</td>\n            <td>' + (medCount || 0) + '</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="editWarehouse(' + w.id + ')">تعديل</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteWarehouse(' + w.id + ')">حذف</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

function showAddWarehouse() {
    var modal = document.getElementById('warehouseModal');
    if (!modal) return;
    document.getElementById('warehouseEditId').value = '';
    document.getElementById('warehouseModalTitle').textContent = 'إضافة مستودع';
    document.getElementById('warehouseName').value = '';
    document.getElementById('warehouseLocation').value = '';
    document.getElementById('warehousePhone').value = '';
    document.getElementById('warehouseManager').value = '';
    modal.style.display = 'block';
}

function editWarehouse(id) {
    var w = (appData.warehouses || []).find(function(x) { return x.id === id; });
    if (!w) return;
    document.getElementById('warehouseEditId').value = id;
    document.getElementById('warehouseModalTitle').textContent = 'تعديل مستودع';
    document.getElementById('warehouseName').value = w.name;
    document.getElementById('warehouseLocation').value = w.location || '';
    document.getElementById('warehousePhone').value = w.phone || '';
    document.getElementById('warehouseManager').value = w.manager || '';
    document.getElementById('warehouseModal').style.display = 'block';
}

function saveWarehouse() {
    var id = document.getElementById('warehouseEditId').value;
    var name = document.getElementById('warehouseName').value.trim();
    var location = document.getElementById('warehouseLocation').value.trim();
    var phone = document.getElementById('warehousePhone').value.trim();
    var manager = document.getElementById('warehouseManager').value.trim();
    if (!name) { showToast('الرجاء إدخال اسم المستودع', 'warning'); return; }
    if (id) {
        var w = (appData.warehouses || []).find(function(x) { return x.id === parseInt(id); });
        if (w) { w.name = name; w.location = location; w.phone = phone; w.manager = manager; }
    } else {
        if (!appData.nextWarehouseId) appData.nextWarehouseId = 1;
        if (!appData.warehouses) appData.warehouses = [];
        appData.warehouses.push({ id: appData.nextWarehouseId++, name: name, location: location, phone: phone, manager: manager });
    }
    saveData();
    renderWarehouses();
    document.getElementById('warehouseModal').style.display = 'none';
    showToast('تم حفظ المستودع بنجاح', 'success');
    audit('warehouse', id ? 'تعديل مستودع: ' + name : 'إضافة مستودع: ' + name);
}

function deleteWarehouse(id) {
    if (!confirm('هل أنت متأكد من حذف هذا المستودع؟')) return;
    appData.warehouses = (appData.warehouses || []).filter(function(w) { return w.id !== id; });
    if (appData.medicineWarehouses) {
        Object.keys(appData.medicineWarehouses).forEach(function(mid) {
            if (appData.medicineWarehouses[mid]) delete appData.medicineWarehouses[mid][id];
        });
    }
    saveData();
    renderWarehouses();
    showToast('تم حذف المستودع', 'success');
}

function renderWarehouseTransfers() {
    var tbody = document.getElementById('transferBody');
    if (!tbody) return;
    var transfers = appData.warehouseTransfers || [];
    tbody.innerHTML = '';
    if (transfers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center empty-state">لا يوجد تحويلات مخزون</td></tr>';
        return;
    }
    transfers.slice().reverse().forEach(function(t) {
        var fromName = 'غير معروف', toName = 'غير معروف';
        var wFrom = (appData.warehouses || []).find(function(w) { return w.id === t.fromWarehouse; });
        var wTo = (appData.warehouses || []).find(function(w) { return w.id === t.toWarehouse; });
        if (wFrom) fromName = wFrom.name;
        if (wTo) toName = wTo.name;
        var badge = t.status === 'مكتمل' ? 'badge-success' : t.status === 'معلق' ? 'badge-warning' : 'badge-info';
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>#' + t.id + '</td>\n            <td>' + escapeHtml(fromName) + '</td>\n            <td>' + escapeHtml(toName) + '</td>\n            <td>' + escapeHtml(t.medicineName || '') + '</td>\n            <td>' + (t.qty || 0) + '</td>\n            <td><span class="badge ' + badge + '">' + escapeHtml(t.status) + '</span></td>\n            <td>' + formatDate(t.date) + '</td>\n        ';
        tbody.appendChild(tr);
    });
}

function showNewTransfer() {
    var modal = document.getElementById('transferModal');
    if (!modal) return;
    var fromSelect = document.getElementById('transferFrom');
    var toSelect = document.getElementById('transferTo');
    var medSelect = document.getElementById('transferMedicine');
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    medSelect.innerHTML = '';
    (appData.warehouses || []).forEach(function(w) {
        fromSelect.innerHTML += '<option value="' + w.id + '">' + escapeHtml(w.name) + '</option>';
        toSelect.innerHTML += '<option value="' + w.id + '">' + escapeHtml(w.name) + '</option>';
    });
    medicinesDB.forEach(function(m) {
        medSelect.innerHTML += '<option value="' + m.id + '">' + escapeHtml(m.name) + ' (متوفر: ' + getQty(m.id) + ')</option>';
    });
    document.getElementById('transferQty').value = 1;
    modal.style.display = 'block';
}

function saveTransfer() {
    var fromId = parseInt(document.getElementById('transferFrom').value);
    var toId = parseInt(document.getElementById('transferTo').value);
    var medId = parseInt(document.getElementById('transferMedicine').value);
    var qty = parseInt(document.getElementById('transferQty').value) || 0;
    if (fromId === toId) { showToast('المستودع المصدر والهدف يجب أن يكونا مختلفين', 'warning'); return; }
    if (qty <= 0) { showToast('الرجاء إدخال كمية صحيحة', 'warning'); return; }
    var med = getMedicineById(medId);
    if (!med) { showToast('الدواء غير موجود', 'error'); return; }
    if (getQty(med.id) < qty) { showToast('الكمية غير متوفرة في المخزون الكلي', 'error'); return; }
    if (!appData.nextWarehouseTransferId) appData.nextWarehouseTransferId = 1;
    if (!appData.warehouseTransfers) appData.warehouseTransfers = [];
    if (!appData.medicineWarehouses) appData.medicineWarehouses = {};
    var mw = appData.medicineWarehouses;
    if (!mw[medId]) mw[medId] = {};
    var fromQty = mw[medId][fromId] || 0;
    var toQty = mw[medId][toId] || 0;
    if (fromQty < qty && fromQty > 0) { showToast('الكمية غير متوفرة في المستودع المصدر', 'error'); return; }
    mw[medId][fromId] = Math.max(0, fromQty - qty);
    mw[medId][toId] = (toQty || 0) + qty;
    appData.warehouseTransfers.push({
        id: appData.nextWarehouseTransferId++,
        fromWarehouse: fromId, toWarehouse: toId,
        medicineId: medId, medicineName: med.name,
        qty: qty, status: 'مكتمل',
        date: new Date().toISOString()
    });
    saveData();
    renderWarehouseTransfers();
    document.getElementById('transferModal').style.display = 'none';
    showToast('تم تحويل المخزون بنجاح', 'success');
    audit('transfer', 'تحويل ' + qty + ' من ' + med.name);
}

// ======================================================================
// FEATURE 2: Purchase Orders
// ======================================================================
function renderPurchaseOrders() {
    var tbody = document.getElementById('poBody');
    if (!tbody) return;
    var pos = appData.purchaseOrders || [];
    tbody.innerHTML = '';
    if (pos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center empty-state">لا يوجد أوامر شراء</td></tr>';
        return;
    }
    pos.slice().reverse().forEach(function(po) {
        var supplierName = '';
        if (po.supplierId) {
            var sup = (appData.suppliers || []).find(function(s) { return s.id === po.supplierId; });
            if (sup) supplierName = sup.name;
        }
        var badge = po.status === 'مستلم' ? 'badge-success' : po.status === 'معلق' ? 'badge-warning' : 'badge-info';
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>#' + po.id + '</td>\n            <td>' + escapeHtml(supplierName) + '</td>\n            <td>' + (po.items || []).length + ' أصناف</td>\n            <td>' + formatPrice(po.total || 0) + ' ' + cur + '</td>\n            <td><span class="badge ' + badge + '">' + escapeHtml(po.status) + '</span></td>\n            <td>' + formatDate(po.date) + '</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="viewPO(' + po.id + ')">عرض</button>\n                ' + (po.status !== 'مستلم' ? '<button class="btn btn-sm btn-success" onclick="receivePO(' + po.id + ')">استلام</button>' : '') + '\n                <button class="btn btn-sm btn-danger" onclick="deletePO(' + po.id + ')">حذف</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

function showAddPO() {
    var modal = document.getElementById('poModal');
    if (!modal) return;
    document.getElementById('poEditId').value = '';
    document.getElementById('poModalTitle').textContent = 'أمر شراء جديد';
    document.getElementById('poDate').value = new Date().toISOString().slice(0, 10);
    var supSelect = document.getElementById('poSupplier');
    supSelect.innerHTML = '<option value="">اختر المورد</option>';
    (appData.suppliers || []).forEach(function(s) {
        supSelect.innerHTML += '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>';
    });
    document.getElementById('poItemsContainer').innerHTML = '';
    addPOItemRow();
    modal.style.display = 'block';
}

function addPOItemRow() {
    var container = document.getElementById('poItemsContainer');
    var div = document.createElement('div');
    div.className = 'po-item-row';
    div.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center;';
    var select = document.createElement('select');
    select.className = 'form-input';
    select.style.cssText = 'flex:1;';
    select.innerHTML = '<option value="">اختر دواء</option>';
    medicinesDB.forEach(function(m) {
        select.innerHTML += '<option value="' + m.id + '">' + escapeHtml(m.name) + ' (' + getQty(m.id) + ')</option>';
    });
    var qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'form-input';
    qtyInput.style.cssText = 'width:70px;';
    qtyInput.placeholder = 'الكمية';
    qtyInput.min = 1;
    qtyInput.value = 1;
    var priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.className = 'form-input';
    priceInput.style.cssText = 'width:90px;';
    priceInput.placeholder = 'السعر';
    priceInput.step = '0.5';
    priceInput.min = 0;
    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-sm btn-danger';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', function() { div.remove(); });
    div.appendChild(select);
    div.appendChild(qtyInput);
    div.appendChild(priceInput);
    div.appendChild(removeBtn);
    container.appendChild(div);
}

function savePO() {
    var supplierId = parseInt(document.getElementById('poSupplier').value) || null;
    var date = document.getElementById('poDate').value || new Date().toISOString().slice(0, 10);
    var itemRows = document.querySelectorAll('#poItemsContainer > div');
    var items = [];
    var total = 0;
    itemRows.forEach(function(row) {
        var selects = row.querySelectorAll('select');
        var inputs = row.querySelectorAll('input');
        if (selects.length < 1 || inputs.length < 2) return;
        var medId = parseInt(selects[0].value);
        var qty = parseInt(inputs[0].value) || 0;
        var price = parseFloat(inputs[1].value) || 0;
        if (!medId || qty <= 0) return;
        var med = getMedicineById(medId);
        items.push({ medicineId: medId, medicineName: med ? med.name : '', qty: qty, price: price, subtotal: qty * price });
        total += qty * price;
    });
    if (items.length === 0) { showToast('الرجاء إضافة صنف واحد على الأقل', 'warning'); return; }
    if (!appData.nextPurchaseOrderId) appData.nextPurchaseOrderId = 1;
    if (!appData.purchaseOrders) appData.purchaseOrders = [];
    var po = { id: appData.nextPurchaseOrderId++, supplierId: supplierId, date: date, items: items, total: total, status: 'معلق', createdAt: new Date().toISOString() };
    appData.purchaseOrders.push(po);
    saveData();
    renderPurchaseOrders();
    document.getElementById('poModal').style.display = 'none';
    showToast('تم إنشاء أمر الشراء', 'success');
    audit('po', 'إنشاء أمر شراء #' + po.id);
}

function viewPO(id) {
    var po = (appData.purchaseOrders || []).find(function(p) { return p.id === id; });
    if (!po) return;
    var supplierName = '';
    if (po.supplierId) {
        var sup = (appData.suppliers || []).find(function(s) { return s.id === po.supplierId; });
        if (sup) supplierName = sup.name;
    }
    var html = '<div class="detail-card"><h4>أمر شراء #' + po.id + '</h4>';
    html += '<p>المورد: ' + escapeHtml(supplierName || 'غير محدد') + '</p>';
    html += '<p>التاريخ: ' + formatDate(po.date) + '</p>';
    html += '<p>الحالة: <span class="badge badge-' + (po.status === 'مستلم' ? 'success' : 'warning') + '">' + escapeHtml(po.status) + '</span></p>';
    html += '<table class="table"><thead><tr><th>الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead><tbody>';
    (po.items || []).forEach(function(item) {
        html += '<tr><td>' + escapeHtml(item.medicineName || '') + '</td><td>' + item.qty + '</td><td>' + formatPrice(item.price) + '</td><td>' + formatPrice(item.subtotal) + '</td></tr>';
    });
    html += '</tbody></table>';
    html += '<p style="font-weight:700;text-align:left;margin-top:8px;">الإجمالي: ' + formatPrice(po.total || 0) + ' ' + cur + '</p></div>';
    document.getElementById('poDetailContent').innerHTML = html;
    document.getElementById('poDetailModal').style.display = 'block';
}

function receivePO(id) {
    if (!confirm('هل أنت متأكد من استلام هذا الأمر؟ سيتم إضافة الأصناف إلى المخزون.')) return;
    var po = (appData.purchaseOrders || []).find(function(p) { return p.id === id; });
    if (!po) return;
    (po.items || []).forEach(function(item) {
        adjustStock(item.medicineId, item.qty);
    });
    po.status = 'مستلم';
    saveData();
    saveStock();
    renderPurchaseOrders();
    showToast('تم استلام الأمر رقم #' + po.id, 'success');
    audit('po_receive', 'استلام أمر شراء #' + po.id);
}

function deletePO(id) {
    if (!confirm('هل أنت متأكد من حذف أمر الشراء؟')) return;
    appData.purchaseOrders = (appData.purchaseOrders || []).filter(function(p) { return p.id !== id; });
    saveData();
    renderPurchaseOrders();
    showToast('تم حذف أمر الشراء', 'success');
}

// ======================================================================
// FEATURE 3: Doctor Management
// ======================================================================
function renderDoctors() {
    var tbody = document.getElementById('doctorBody');
    if (!tbody) return;
    var doctors = appData.doctors || [];
    tbody.innerHTML = '';
    if (doctors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">لا يوجد أطباء</td></tr>';
        return;
    }
    doctors.forEach(function(d) {
        var invoiceCount = (appData.invoices || []).filter(function(inv) { return inv.prescription && inv.prescription.doctor === d.name; }).length;
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + d.id + '</td>\n            <td><strong>' + escapeHtml(d.name) + '</strong></td>\n            <td>' + escapeHtml(d.specialty || '') + '</td>\n            <td>' + escapeHtml(d.phone || '') + '</td>\n            <td>' + invoiceCount + ' وصفات</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="editDoctor(' + d.id + ')">تعديل</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteDoctor(' + d.id + ')">حذف</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

function showAddDoctor() {
    document.getElementById('doctorEditId').value = '';
    document.getElementById('doctorModalTitle').textContent = 'إضافة طبيب';
    document.getElementById('doctorName').value = '';
    document.getElementById('doctorSpecialty').value = '';
    document.getElementById('doctorPhone').value = '';
    document.getElementById('doctorEmail').value = '';
    document.getElementById('doctorModal').style.display = 'block';
}

function editDoctor(id) {
    var d = (appData.doctors || []).find(function(x) { return x.id === id; });
    if (!d) return;
    document.getElementById('doctorEditId').value = id;
    document.getElementById('doctorModalTitle').textContent = 'تعديل طبيب';
    document.getElementById('doctorName').value = d.name;
    document.getElementById('doctorSpecialty').value = d.specialty || '';
    document.getElementById('doctorPhone').value = d.phone || '';
    document.getElementById('doctorEmail').value = d.email || '';
    document.getElementById('doctorModal').style.display = 'block';
}

function saveDoctor() {
    var id = document.getElementById('doctorEditId').value;
    var name = document.getElementById('doctorName').value.trim();
    var specialty = document.getElementById('doctorSpecialty').value.trim();
    var phone = document.getElementById('doctorPhone').value.trim();
    var email = document.getElementById('doctorEmail').value.trim();
    if (!name) { showToast('الرجاء إدخال اسم الطبيب', 'warning'); return; }
    if (id) {
        var d = (appData.doctors || []).find(function(x) { return x.id === parseInt(id); });
        if (d) { d.name = name; d.specialty = specialty; d.phone = phone; d.email = email; }
    } else {
        if (!appData.nextDoctorId) appData.nextDoctorId = 1;
        if (!appData.doctors) appData.doctors = [];
        appData.doctors.push({ id: appData.nextDoctorId++, name: name, specialty: specialty, phone: phone, email: email });
    }
    saveData();
    renderDoctors();
    document.getElementById('doctorModal').style.display = 'none';
    showToast('تم حفظ الطبيب', 'success');
    audit('doctor', id ? 'تعديل طبيب: ' + name : 'إضافة طبيب: ' + name);
}

function deleteDoctor(id) {
    if (!confirm('هل أنت متأكد من حذف الطبيب؟')) return;
    appData.doctors = (appData.doctors || []).filter(function(d) { return d.id !== id; });
    saveData();
    renderDoctors();
    showToast('تم حذف الطبيب', 'success');
}

// ======================================================================
// FEATURE 4: Customer Loyalty & Rewards
// ======================================================================
function getCustomerTier(points) {
    var tiers = appData.settings.loyaltyTiers || [];
    var best = tiers[0] || { name: 'عادي', minPoints: 0, discountPercent: 0, color: '#94a3b8' };
    tiers.forEach(function(t) {
        if (points >= (t.minPoints || 0) && (t.minPoints || 0) >= (best.minPoints || 0)) best = t;
    });
    return best;
}

function renderLoyalty() {
    var tbody = document.getElementById('loyaltyBody');
    if (!tbody) return;
    var customers = (appData.customers || []).filter(function(c) { return c.points && c.points > 0; }).sort(function(a, b) { return (b.points || 0) - (a.points || 0); });
    tbody.innerHTML = '';
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state">لا توجد نقاط للعملاء</td></tr>';
        return;
    }
    customers.forEach(function(c) {
        var tier = getCustomerTier(c.points || 0);
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td><strong>' + escapeHtml(c.name) + '</strong></td>\n            <td>' + (c.points || 0) + '</td>\n            <td><span class="badge" style="background:' + (tier.color || '#94a3b8') + ';color:#fff;">' + escapeHtml(tier.name) + '</span></td>\n            <td>' + (tier.discountPercent || 0) + '%</td>\n            <td><button class="btn btn-sm btn-primary" onclick="redeemPoints(' + c.id + ')">استبدال</button></td>\n        ';
        tbody.appendChild(tr);
    });
}

function redeemPoints(customerId) {
    var c = (appData.customers || []).find(function(cx) { return cx.id === customerId; });
    if (!c || !c.points || c.points < 100) { showToast('النقاط غير كافية (الحد الأدنى 100 نقطة)', 'warning'); return; }
    var rate = appData.settings.loyaltyRedeemRate || 100;
    var value = Math.floor((c.points || 0) / rate);
    if (!confirm('سيتم استبدال ' + c.points + ' نقطة بقيمة ' + value + ' ' + cur + ' للعميل ' + c.name + '. هل أنت متأكد؟')) return;
    c.points -= value * rate;
    saveData();
    renderLoyalty();
    showToast('تم استبدال النقاط بقيمة ' + value + ' ' + cur, 'success');
    audit('loyalty', 'استبدال نقاط للعميل ' + c.name + ' بقيمة ' + value);
}

function loadLoyaltyTierSettings() {
    var container = document.getElementById('loyaltyTierSettings');
    if (!container) return;
    var tiers = appData.settings.loyaltyTiers || [];
    container.innerHTML = '';
    tiers.forEach(function(t, i) {
        var div = document.createElement('div');
        div.className = 'tier-row';
        div.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center;';
        div.innerHTML = '\n            <input class="form-input" style="width:100px;" value="' + escapeHtml(t.name) + '" placeholder="الاسم" data-tier="name" data-index="' + i + '">\n            <input class="form-input" style="width:70px;" type="number" value="' + (t.minPoints || 0) + '" placeholder="الحد الأدنى" data-tier="minPoints" data-index="' + i + '">\n            <input class="form-input" style="width:70px;" type="number" value="' + (t.discountPercent || 0) + '" placeholder="الخصم %" data-tier="discountPercent" data-index="' + i + '">\n            <input class="form-input" style="width:80px;" type="color" value="' + (t.color || '#94a3b8') + '" data-tier="color" data-index="' + i + '">\n            <button class="btn btn-sm btn-danger" onclick="removeTier(' + i + ')"><i class="fas fa-times"></i></button>\n        ';
        container.appendChild(div);
    });
}

function addTier() {
    if (!appData.settings.loyaltyTiers) appData.settings.loyaltyTiers = [];
    appData.settings.loyaltyTiers.push({ name: 'مستوى جديد', minPoints: 0, discountPercent: 0, color: '#6366f1' });
    loadLoyaltyTierSettings();
}

function removeTier(index) {
    appData.settings.loyaltyTiers.splice(index, 1);
    loadLoyaltyTierSettings();
}

function saveLoyaltyTiers() {
    var inputs = document.querySelectorAll('#loyaltyTierSettings [data-tier]');
    var tiers = [];
    var map = {};
    inputs.forEach(function(inp) {
        var field = inp.dataset.tier;
        var idx = parseInt(inp.dataset.index);
        if (!map[idx]) map[idx] = {};
        map[idx][field] = inp.type === 'number' ? parseFloat(inp.value) || 0 : inp.value;
    });
    Object.keys(map).sort().forEach(function(k) { tiers.push(map[k]); });
    appData.settings.loyaltyTiers = tiers;
    saveData();
    showToast('تم حفظ مستويات الولاء', 'success');
}

// ======================================================================
// FEATURE 5: Receipt Customization (in settings)
// ======================================================================
function loadReceiptSettings() {
    var s = appData.settings;
    var els = {
        'receiptHeader': s.receiptHeader || '',
        'receiptFooter': s.receiptFooter || '',
        'receiptShowLogo': s.receiptShowLogo ? 'checked' : '',
        'receiptShowTax': s.receiptShowTax !== false ? 'checked' : '',
        'receiptShowPoints': s.receiptShowPoints !== false ? 'checked' : '',
        'receiptPaperSize': s.receiptPaperSize || '80mm'
    };
    Object.keys(els).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
            if (el.type === 'checkbox') el.checked = !!els[id];
            else el.value = els[id];
        }
    });
}

function saveReceiptSettings() {
    var s = appData.settings;
    s.receiptHeader = document.getElementById('receiptHeader') ? document.getElementById('receiptHeader').value : '';
    s.receiptFooter = document.getElementById('receiptFooter') ? document.getElementById('receiptFooter').value : '';
    s.receiptShowLogo = document.getElementById('receiptShowLogo') ? document.getElementById('receiptShowLogo').checked : false;
    s.receiptShowTax = document.getElementById('receiptShowTax') ? document.getElementById('receiptShowTax').checked : true;
    s.receiptShowPoints = document.getElementById('receiptShowPoints') ? document.getElementById('receiptShowPoints').checked : true;
    s.receiptPaperSize = document.getElementById('receiptPaperSize') ? document.getElementById('receiptPaperSize').value : '80mm';
    saveData();
    showToast('تم حفظ إعدادات الفاتورة', 'success');
}

// ======================================================================
// FEATURE 6: Touch Mode
// ======================================================================
function toggleTouchMode() {
    document.body.classList.toggle('touch-mode');
    var isTouch = document.body.classList.contains('touch-mode');
    localStorage.setItem('valopos_touch_mode', isTouch ? '1' : '0');
    var btn = document.getElementById('touchModeBtn');
    if (btn) btn.innerHTML = isTouch ? '<i class="fas fa-mouse"></i> وضع اللمس: نشط' : '<i class="fas fa-hand-pointer"></i> تفعيل وضع اللمس';
    showToast(isTouch ? 'تم تفعيل وضع اللمس' : 'تم إلغاء وضع اللمس', 'info');
}

function loadTouchMode() {
    if (localStorage.getItem('valopos_touch_mode') === '1') {
        document.body.classList.add('touch-mode');
        var btn = document.getElementById('touchModeBtn');
        if (btn) btn.innerHTML = '<i class="fas fa-mouse"></i> وضع اللمس: نشط';
    }
}

// ======================================================================
// FEATURE 7: Quick Cashier Login (PIN)
// ======================================================================
function showQuickLogin() {
    document.getElementById('quickLoginModal').style.display = 'block';
    document.getElementById('quickPinInput').value = '';
    document.getElementById('quickPinInput').focus();
}

function quickLogin() {
    var pin = document.getElementById('quickPinInput').value.trim();
    if (!pin) { showToast('الرجاء إدخال الرقم السري', 'warning'); return; }
    var user = (appData.users || []).find(function(u) { return u.password === pin && u.role === 'cashier'; });
    if (!user) { showToast('الرقم السري غير صحيح', 'error'); return; }
    currentUser = user;
    document.getElementById('quickLoginModal').style.display = 'none';
    document.getElementById('headerAvatar').textContent = user.name.charAt(0);
    document.querySelector('.sidebar-user-name').textContent = user.name + ' (كاشير)';
    showToast('مرحباً ' + user.name, 'success');
    audit('quick_login', 'تسجيل دخول سريع: ' + user.name);
}

// ======================================================================
// FEATURE 8: Batch & Expiry Tracking (added to inventory)
// ======================================================================
function renderBatchInfo(medicineId) {
    var med = getMedicineById(medicineId);
    if (!med) return '';
    return '<small style="color:#64748b;">الباتش: ' + escapeHtml(getBatchNumber(medicineId) || '-') + ' | الصلاحية: ' + (getExpiryDate(medicineId) || '-') + '</small>';
}

// ======================================================================
// FEATURE 9: Reorder Point Alerts
// ======================================================================
function checkReorderAlerts() {
    var lowMeds = medicinesDB.filter(function(m) { var s = getStock(m.id); return s.rp && getQty(m.id) <= s.rp; });
    if (lowMeds.length > 0 && lowMeds.length <= 5) {
        lowMeds.forEach(function(m) {
            showToast('تنبيه: ' + escapeHtml(m.name) + ' وصل لنقطة إعادة الطلب (' + getQty(m.id) + ' / ' + getStock(m.id).rp + ')', 'warning');
        });
    }
}

// ======================================================================
// FEATURE 10: Sales Targets
// ======================================================================
function renderSalesTargets() {
    var tbody = document.getElementById('targetBody');
    if (!tbody) return;
    var targets = appData.salesTargets || [];
    tbody.innerHTML = '';
    if (targets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state">لا توجد أهداف مبيعات</td></tr>';
        return;
    }
    targets.forEach(function(t) {
        var targetDate = new Date(t.year || new Date().getFullYear(), (t.month || 1) - 1);
        var monthName = targetDate.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
        var achieved = (appData.invoices || []).filter(function(inv) {
            var d = new Date(inv.date);
            return d.getMonth() === targetDate.getMonth() && d.getFullYear() === targetDate.getFullYear() && inv.status !== 'ملغية';
        }).reduce(function(s, inv) { return s + inv.net; }, 0);
        var progress = t.target > 0 ? Math.min(100, Math.round(achieved / t.target * 100)) : 0;
        var badge = progress >= 100 ? 'badge-success' : progress >= 50 ? 'badge-warning' : 'badge-danger';
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + escapeHtml(monthName) + '</td>\n            <td>' + formatPrice(t.target) + ' ' + cur + '</td>\n            <td>' + formatPrice(achieved) + ' ' + cur + '</td>\n            <td>\n                <div class="progress-bar" style="direction:ltr;">\n                    <div class="progress-fill" style="width:' + progress + '%;background:' + (progress >= 100 ? '#10b981' : progress >= 50 ? '#f59e0b' : '#ef4444') + ';"></div>\n                </div>\n                <small>' + progress + '%</small>\n            </td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="editTarget(' + t.id + ')">تعديل</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteTarget(' + t.id + ')">حذف</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

function showAddTarget() {
    document.getElementById('targetEditId').value = '';
    document.getElementById('targetModalTitle').textContent = 'إضافة هدف';
    document.getElementById('targetMonth').value = new Date().getMonth() + 1;
    document.getElementById('targetYear').value = new Date().getFullYear();
    document.getElementById('targetAmount').value = '';
    document.getElementById('targetModal').style.display = 'block';
}

function editTarget(id) {
    var t = (appData.salesTargets || []).find(function(x) { return x.id === id; });
    if (!t) return;
    document.getElementById('targetEditId').value = id;
    document.getElementById('targetModalTitle').textContent = 'تعديل هدف';
    document.getElementById('targetMonth').value = t.month;
    document.getElementById('targetYear').value = t.year;
    document.getElementById('targetAmount').value = t.target;
    document.getElementById('targetModal').style.display = 'block';
}

function saveTarget() {
    var id = document.getElementById('targetEditId').value;
    var month = parseInt(document.getElementById('targetMonth').value) || 1;
    var year = parseInt(document.getElementById('targetYear').value) || new Date().getFullYear();
    var target = parseFloat(document.getElementById('targetAmount').value) || 0;
    if (target <= 0) { showToast('الرجاء إدخال قيمة الهدف', 'warning'); return; }
    if (id) {
        var t = (appData.salesTargets || []).find(function(x) { return x.id === parseInt(id); });
        if (t) { t.month = month; t.year = year; t.target = target; }
    } else {
        if (!appData.nextSalesTargetId) appData.nextSalesTargetId = 1;
        if (!appData.salesTargets) appData.salesTargets = [];
        appData.salesTargets.push({ id: appData.nextSalesTargetId++, month: month, year: year, target: target });
    }
    saveData();
    renderSalesTargets();
    document.getElementById('targetModal').style.display = 'none';
    showToast('تم حفظ الهدف', 'success');
}

function deleteTarget(id) {
    if (!confirm('حذف الهدف؟')) return;
    appData.salesTargets = (appData.salesTargets || []).filter(function(t) { return t.id !== id; });
    saveData();
    renderSalesTargets();
    showToast('تم حذف الهدف', 'success');
}

// ======================================================================
// FEATURE 11: System Health Dashboard
// ======================================================================
function renderSystemHealth() {
    var panel = document.getElementById('systemHealthPanel');
    if (!panel) return;
    var dbSize = new Blob([JSON.stringify(appData)]).size;
    var stockSize = new Blob([JSON.stringify(medStock)]).size;
    var totalSize = dbSize + stockSize;
    var sizeStr = totalSize > 1048576 ? (totalSize / 1048576).toFixed(1) + ' MB' : totalSize > 1024 ? (totalSize / 1024).toFixed(1) + ' KB' : totalSize + ' B';
    var invCount = (appData.invoices || []).length;
    var medCount = medicinesDB.length;
    var userCount = (appData.users || []).length;
    var lastBackup = localStorage.getItem('valopos_last_backup') || 'لم يتم';
    var healthScore = 100;
    var issues = [];
    if (medCount === 0) { healthScore -= 15; issues.push('لا توجد أدوية في قاعدة البيانات'); }
    if (invCount === 0) { healthScore -= 5; issues.push('لا توجد فواتير'); }
    var expCount = medicinesDB.filter(function(m) { var d = getExpiryDays(getExpiryDate(m.id)); return d !== null && d >= 0 && d <= 7; }).length;
    if (expCount > 0) { healthScore -= expCount * 2; issues.push(expCount + ' دواء منتهي الصلاحية'); }
    var lowCount = medicinesDB.filter(function(m) { return getQty(m.id) <= 10 && getQty(m.id) > 0; }).length;
    if (lowCount > 5) { healthScore -= 10; issues.push(lowCount + ' دواء منخفض المخزون'); }
    healthScore = Math.max(0, healthScore);
    var healthColor = healthScore >= 80 ? '#10b981' : healthScore >= 50 ? '#f59e0b' : '#ef4444';
    var html = '<div class="health-card" style="border-right:4px solid ' + healthColor + ';">';
    html += '<div class="health-score" style="color:' + healthColor + ';">' + healthScore + '%</div>';
    html += '<div class="health-label">صحة النظام</div></div>';
    html += '<div class="health-stats">';
    html += '<div class="health-stat"><span class="health-stat-label">حجم البيانات</span><span>' + sizeStr + '</span></div>';
    html += '<div class="health-stat"><span class="health-stat-label">إجمالي الفواتير</span><span>' + invCount + '</span></div>';
    html += '<div class="health-stat"><span class="health-stat-label">إجمالي الأدوية</span><span>' + medCount + '</span></div>';
    html += '<div class="health-stat"><span class="health-stat-label">المستخدمين</span><span>' + userCount + '</span></div>';
    html += '<div class="health-stat"><span class="health-stat-label">آخر نسخة احتياطية</span><span>' + escapeHtml(lastBackup) + '</span></div>';
    html += '</div>';
    if (issues.length > 0) {
        html += '<div class="health-issues"><h5>المشاكل:</h5><ul>';
        issues.forEach(function(issue) { html += '<li style="color:#ef4444;">' + escapeHtml(issue) + '</li>'; });
        html += '</ul></div>';
    }
    panel.innerHTML = html;
}

// ======================================================================
// FEATURE 12: Onboarding / Welcome Wizard
// ======================================================================
function showOnboarding() {
    var seen = localStorage.getItem('valopos_onboarding_seen');
    if (seen) return;
    document.getElementById('onboardingModal').style.display = 'block';
}

function completeOnboarding() {
    localStorage.setItem('valopos_onboarding_seen', '1');
    document.getElementById('onboardingModal').style.display = 'none';
    appData.settings.pharmacyName = document.getElementById('onboardName').value.trim() || 'ValoPOS';
    appData.settings.address = document.getElementById('onboardAddress').value.trim() || '';
    appData.settings.phone = document.getElementById('onboardPhone').value.trim() || '';
    saveData();
    showToast('مرحباً بك في ValoPOS! تم حفظ الإعدادات.', 'success');
}

// ======================================================================
// FEATURE 13: CSV/Excel Import
// ======================================================================
function showImportModal() {
    document.getElementById('importModal').style.display = 'block';
    document.getElementById('importFile').value = '';
    document.getElementById('importPreview').innerHTML = '';
    document.getElementById('importStatus').textContent = '';
}

function previewImport() {
    var fileInput = document.getElementById('importFile');
    var file = fileInput.files[0];
    if (!file) { showToast('الرجاء اختيار ملف', 'warning'); return; }
    var reader = new FileReader();
    reader.onload = function(e) {
        var text = e.target.result;
        var lines = text.split('\n').filter(function(l) { return l.trim(); });
        if (lines.length < 2) { showToast('الملف فارغ أو غير صالح', 'error'); return; }
        var headers = lines[0].split(',').map(function(h) { return h.trim().replace(/"/g, ''); });
        var preview = document.getElementById('importPreview');
        var html = '<table class="table"><thead><tr>';
        headers.forEach(function(h) { html += '<th>' + escapeHtml(h) + '</th>'; });
        html += '</tr></thead><tbody>';
        for (var i = 1; i < Math.min(lines.length, 6); i++) {
            html += '<tr>';
            var cols = lines[i].split(',').map(function(c) { return c.trim().replace(/"/g, ''); });
            cols.forEach(function(c) { html += '<td>' + escapeHtml(c) + '</td>'; });
            html += '</tr>';
        }
        html += '</tbody></table>';
        html += '<p style="margin-top:8px;">سيتم استيراد ' + (lines.length - 1) + ' صف</p>';
        preview.innerHTML = html;
        document.getElementById('importStatus').textContent = 'جاهز للاستيراد';
    };
    reader.readAsText(file);
}

function doImport() {
    var fileInput = document.getElementById('importFile');
    var type = document.getElementById('importType').value;
    var file = fileInput.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        var text = e.target.result;
        if (type === 'medicines') {
            var lines = text.split('\n').filter(function(l) { return l.trim(); });
            for (var i = 1; i < lines.length; i++) {
                var cols = lines[i].split(',').map(function(c) { return c.trim().replace(/"/g, ''); });
                if (cols.length < 3) continue;
                var nextId = medicinesDB.length > 0 ? Math.max.apply(Math, medicinesDB.map(function(m) { return m.id; })) + 1 : 1;
                var existing = medicinesDB.find(function(m) { return m.barcode === cols[0] || m.name === cols[1]; });
                if (existing) {
                    adjustStock(existing.id, parseInt(cols[3]) || 0);
                    existing.price = parseFloat(cols[4]) || existing.price;
                } else {
                    medicinesDB.push({
                        id: nextId, name: cols[1] || cols[0], scientificName: cols[2] || '',
                        category: cols[5] || 'عام', price: parseFloat(cols[4]) || 0,
                        barcode: cols[0] || '',
                        rx: cols[8] === 'rx' || cols[8] === 'true', schedule: cols[9] || 'normal'
                    });
                    updateStock(nextId, parseInt(cols[3]) || 0, parseFloat(cols[6]) || 0, cols[7] || '');
                    setStock(nextId, { rp: parseInt(cols[10]) || 0, bn: cols[11] || '' });
                }
            }
            saveStock();
            showToast('تم استيراد الأدوية بنجاح', 'success');
        } else if (type === 'customers') {
            var lines = text.split('\n').filter(function(l) { return l.trim(); });
            for (var i = 1; i < lines.length; i++) {
                var cols = lines[i].split(',').map(function(c) { return c.trim().replace(/"/g, ''); });
                if (cols.length < 1) continue;
                if (!appData.nextCustomerId) appData.nextCustomerId = (appData.customers || []).length + 1;
                appData.customers.push({
                    id: appData.nextCustomerId++, name: cols[0], phone: cols[1] || '',
                    email: cols[2] || '', address: cols[3] || '',
                    points: parseInt(cols[4]) || 0, totalSpent: parseFloat(cols[5]) || 0,
                    createdAt: new Date().toISOString()
                });
            }
            saveData();
            showToast('تم استيراد العملاء بنجاح', 'success');
        }
        document.getElementById('importModal').style.display = 'none';
        if (type === 'medicines') renderInventory();
        if (type === 'customers') renderCustomers();
        audit('import', 'استيراد بيانات من CSV');
    };
    reader.readAsText(file);
}

// ======================================================================
// FEATURE 14: Gift Cards & Coupons
// ======================================================================
function renderGiftCards() {
    var tbody = document.getElementById('giftCardBody');
    if (!tbody) return;
    var cards = appData.giftCards || [];
    tbody.innerHTML = '';
    if (cards.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">لا توجد بطاقات هدايا</td></tr>';
        return;
    }
    cards.forEach(function(c) {
        var badge = c.status === 'نشطة' ? 'badge-success' : c.status === 'منتهية' ? 'badge-danger' : 'badge-warning';
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>#' + c.id + '</td>\n            <td>' + escapeHtml(c.code) + '</td>\n            <td>' + formatPrice(c.balance) + ' ' + cur + '</td>\n            <td>' + formatDate(c.expiryDate) + '</td>\n            <td><span class="badge ' + badge + '">' + escapeHtml(c.status) + '</span></td>\n            <td><button class="btn btn-sm btn-danger" onclick="deleteGiftCard(' + c.id + ')">حذف</button></td>\n        ';
        tbody.appendChild(tr);
    });
}

function showAddGiftCard() {
    document.getElementById('giftCardEditId').value = '';
    document.getElementById('giftCardModalTitle').textContent = 'إضافة بطاقة هدايا';
    document.getElementById('giftCardCode').value = 'GIFT-' + Date.now().toString(36).toUpperCase();
    document.getElementById('giftCardBalance').value = '';
    document.getElementById('giftCardExpiry').value = '';
    document.getElementById('giftCardModal').style.display = 'block';
}

function saveGiftCard() {
    var code = document.getElementById('giftCardCode').value.trim();
    var balance = parseFloat(document.getElementById('giftCardBalance').value) || 0;
    var expiryDate = document.getElementById('giftCardExpiry').value;
    if (!code) { showToast('الرجاء إدخال كود البطاقة', 'warning'); return; }
    if (balance <= 0) { showToast('الرجاء إدخال رصيد صحيح', 'warning'); return; }
    if (!appData.nextGiftCardId) appData.nextGiftCardId = 1;
    if (!appData.giftCards) appData.giftCards = [];
    appData.giftCards.push({ id: appData.nextGiftCardId++, code: code, balance: balance, initialBalance: balance, expiryDate: expiryDate, status: 'نشطة', createdAt: new Date().toISOString() });
    saveData();
    renderGiftCards();
    document.getElementById('giftCardModal').style.display = 'none';
    showToast('تم إضافة بطاقة الهدايا', 'success');
}

function deleteGiftCard(id) {
    if (!confirm('حذف بطاقة الهدايا؟')) return;
    appData.giftCards = (appData.giftCards || []).filter(function(c) { return c.id !== id; });
    saveData();
    renderGiftCards();
    showToast('تم الحذف', 'success');
}

function renderCoupons() {
    var tbody = document.getElementById('couponBody');
    if (!tbody) return;
    var coupons = appData.coupons || [];
    tbody.innerHTML = '';
    if (coupons.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center empty-state">لا توجد كوبونات خصم</td></tr>';
        return;
    }
    coupons.forEach(function(c) {
        var badge = c.status === 'نشط' ? 'badge-success' : 'badge-danger';
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>#' + c.id + '</td>\n            <td>' + escapeHtml(c.code) + '</td>\n            <td>' + (c.type === 'percent' ? c.value + '%' : formatPrice(c.value) + ' ' + cur) + '</td>\n            <td>' + formatPrice(c.minPurchase || 0) + ' ' + cur + '</td>\n            <td><span class="badge ' + badge + '">' + escapeHtml(c.status || 'نشط') + '</span></td>\n            <td><button class="btn btn-sm btn-danger" onclick="deleteCoupon(' + c.id + ')">حذف</button></td>\n        ';
        tbody.appendChild(tr);
    });
}

function showAddCoupon() {
    document.getElementById('couponEditId').value = '';
    document.getElementById('couponModalTitle').textContent = 'إضافة كوبون خصم';
    document.getElementById('couponCode').value = '';
    document.getElementById('couponType').value = 'percent';
    document.getElementById('couponValue').value = '';
    document.getElementById('couponMinPurchase').value = '';
    document.getElementById('couponModal').style.display = 'block';
}

function saveCoupon() {
    var code = document.getElementById('couponCode').value.trim();
    var type = document.getElementById('couponType').value;
    var value = parseFloat(document.getElementById('couponValue').value) || 0;
    var minPurchase = parseFloat(document.getElementById('couponMinPurchase').value) || 0;
    if (!code) { showToast('الرجاء إدخال كود الكوبون', 'warning'); return; }
    if (value <= 0) { showToast('الرجاء إدخال قيمة صحيحة', 'warning'); return; }
    if (!appData.nextCouponId) appData.nextCouponId = 1;
    if (!appData.coupons) appData.coupons = [];
    appData.coupons.push({ id: appData.nextCouponId++, code: code, type: type, value: value, minPurchase: minPurchase, status: 'نشط', createdAt: new Date().toISOString() });
    saveData();
    renderCoupons();
    document.getElementById('couponModal').style.display = 'none';
    showToast('تم إضافة الكوبون', 'success');
}

function deleteCoupon(id) {
    if (!confirm('حذف الكوبون؟')) return;
    appData.coupons = (appData.coupons || []).filter(function(c) { return c.id !== id; });
    saveData();
    renderCoupons();
    showToast('تم الحذف', 'success');
}

// ======================================================================
// FEATURE 15: Compounds (Pre-made Medicine Kits)
// ======================================================================
function renderCompounds() {
    var tbody = document.getElementById('compoundBody');
    if (!tbody) return;
    var compounds = appData.compounds || [];
    tbody.innerHTML = '';
    if (compounds.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state">لا توجد تركيبات</td></tr>';
        return;
    }
    compounds.forEach(function(c) {
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + c.id + '</td>\n            <td><strong>' + escapeHtml(c.name) + '</strong></td>\n            <td>' + (c.ingredients || []).length + ' مكونات</td>\n            <td>' + formatPrice(c.totalCost || 0) + ' ' + cur + '</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="viewCompound(' + c.id + ')">عرض</button>\n                <button class="btn btn-sm btn-success" onclick="sellCompound(' + c.id + ')">بيع</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteCompound(' + c.id + ')">حذف</button>\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

function showAddCompound() {
    document.getElementById('compoundEditId').value = '';
    document.getElementById('compoundModalTitle').textContent = 'إضافة تركيبة';
    document.getElementById('compoundName').value = '';
    document.getElementById('compoundPrice').value = '';
    document.getElementById('compoundIngredientsContainer').innerHTML = '';
    addCompoundIngredient();
    document.getElementById('compoundModal').style.display = 'block';
}

function addCompoundIngredient() {
    var container = document.getElementById('compoundIngredientsContainer');
    var div = document.createElement('div');
    div.className = 'compound-ing-row';
    div.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center;';
    var select = document.createElement('select');
    select.className = 'form-input';
    select.style.cssText = 'flex:1;';
    select.innerHTML = '<option value="">اختر دواء</option>';
    medicinesDB.forEach(function(m) {
        select.innerHTML += '<option value="' + m.id + '">' + escapeHtml(m.name) + ' (متوفر: ' + getQty(m.id) + ')</option>';
    });
    var qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'form-input';
    qtyInput.style.cssText = 'width:70px;';
    qtyInput.placeholder = 'الكمية';
    qtyInput.min = 1;
    qtyInput.value = 1;
    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-sm btn-danger';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', function() { div.remove(); });
    div.appendChild(select);
    div.appendChild(qtyInput);
    div.appendChild(removeBtn);
    container.appendChild(div);
}

function saveCompound() {
    var name = document.getElementById('compoundName').value.trim();
    var price = parseFloat(document.getElementById('compoundPrice').value) || 0;
    if (!name) { showToast('الرجاء إدخال اسم التركيبة', 'warning'); return; }
    var ingRows = document.querySelectorAll('#compoundIngredientsContainer > div');
    var ingredients = [];
    var totalCost = 0;
    ingRows.forEach(function(row) {
        var sel = row.querySelector('select');
        var inp = row.querySelector('input');
        if (!sel || !inp) return;
        var medId = parseInt(sel.value);
        var qty = parseInt(inp.value) || 0;
        if (!medId || qty <= 0) return;
        var med = getMedicineById(medId);
        var cost = med ? (getBuyPrice(med.id) || med.price || 0) * qty : 0;
        ingredients.push({ medicineId: medId, medicineName: med ? med.name : '', qty: qty, cost: cost });
        totalCost += cost;
    });
    if (ingredients.length === 0) { showToast('الرجاء إضافة مكون واحد على الأقل', 'warning'); return; }
    if (!appData.nextCompoundId) appData.nextCompoundId = 1;
    if (!appData.compounds) appData.compounds = [];
    appData.compounds.push({ id: appData.nextCompoundId++, name: name, price: price || totalCost * 1.3, ingredients: ingredients, totalCost: totalCost, createdAt: new Date().toISOString() });
    saveData();
    renderCompounds();
    document.getElementById('compoundModal').style.display = 'none';
    showToast('تم إضافة التركيبة', 'success');
    audit('compound', 'إضافة تركيبة: ' + name);
}

function viewCompound(id) {
    var c = (appData.compounds || []).find(function(x) { return x.id === id; });
    if (!c) return;
    var html = '<div class="detail-card"><h4>' + escapeHtml(c.name) + '</h4>';
    html += '<p>سعر البيع: ' + formatPrice(c.price) + ' ' + cur + '</p>';
    html += '<p>تكلفة المكونات: ' + formatPrice(c.totalCost || 0) + ' ' + cur + '</p>';
    html += '<p>الربح: ' + formatPrice((c.price || 0) - (c.totalCost || 0)) + ' ' + cur + '</p>';
    html += '<h5>المكونات:</h5><table class="table"><thead><tr><th>الصنف</th><th>الكمية</th><th>التكلفة</th></tr></thead><tbody>';
    (c.ingredients || []).forEach(function(ing) {
        html += '<tr><td>' + escapeHtml(ing.medicineName || '') + '</td><td>' + ing.qty + '</td><td>' + formatPrice(ing.cost || 0) + '</td></tr>';
    });
    html += '</tbody></table></div>';
    document.getElementById('compoundDetailContent').innerHTML = html;
    document.getElementById('compoundDetailModal').style.display = 'block';
}

function sellCompound(id) {
    var c = (appData.compounds || []).find(function(x) { return x.id === id; });
    if (!c) return;
    var canMake = true;
    (c.ingredients || []).forEach(function(ing) {
        var med = getMedicineById(ing.medicineId);
        if (!med || getQty(med.id) < ing.qty) canMake = false;
    });
    if (!canMake) { showToast('المكونات غير كافية لتحضير هذه التركيبة', 'error'); return; }
    (c.ingredients || []).forEach(function(ing) {
        adjustStock(ing.medicineId, -ing.qty);
    });
    var invoice = {
        id: appData.nextInvoiceId++,
        date: new Date().toISOString(),
        items: [{ id: 'compound_' + c.id, name: c.name + ' (تركيبة)', qty: 1, price: c.price, total: c.price }],
        subtotal: c.price, discount: 0, tax: 0, net: c.price, paid: c.price, change: 0,
        customerId: null, status: 'مكتملة', paymentMethod: 'cash', splitAmount: 0
    };
    appData.invoices.push(invoice);
    saveData();
    saveStock();
    renderCompounds();
    showToast('تم بيع التركيبة ' + escapeHtml(c.name), 'success');
    audit('compound_sale', 'بيع تركيبة: ' + c.name + ' بقيمة ' + formatPrice(c.price));
}

function deleteCompound(id) {
    if (!confirm('حذف التركيبة؟')) return;
    appData.compounds = (appData.compounds || []).filter(function(c) { return c.id !== id; });
    saveData();
    renderCompounds();
    showToast('تم الحذف', 'success');
}

// ======================================================================
// FEATURE 16: Dashboard Customization
// ======================================================================
function saveWidgetSettings() {
    var widgets = appData.settings.dashboardWidgets || {};
    var checkboxIds = {
        widgetRecentSales: 'recentSales',
        widgetTopMeds: 'topMeds',
        widgetExpiryAlerts: 'expiryAlerts',
        widgetLowStock: 'lowStockAlerts',
        widgetTodayStats: 'todayStats',
        widgetProfitChart: 'profitChart',
        widgetTargetProgress: 'targetProgress',
        widgetDoctorRx: 'doctorPrescriptions'
    };
    Object.keys(checkboxIds).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) widgets[checkboxIds[id]] = el.checked;
    });
    appData.settings.dashboardWidgets = widgets;
    saveData();
    showToast('تم حفظ إعدادات لوحة التحكم', 'success');
}

function updateDashboardWidgets() {
    var w = appData.settings.dashboardWidgets || {};
    var widgetMap = {
        recentSalesWidget: w.recentSales,
        topMedsWidget: w.topMeds,
        expiryAlertWidget: w.expiryAlerts,
        lowStockWidget: w.lowStockAlerts,
        todayStatsWidget: w.todayStats,
        profitChartWidget: w.profitChart,
        targetProgressWidget: w.targetProgress,
        doctorRxWidget: w.doctorPrescriptions
    };
    Object.keys(widgetMap).forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.style.display = widgetMap[id] !== false ? '' : 'none';
    });
}

// Wrap renderDashboard for widget visibility
(function() {
    var orig = renderDashboard;
    renderDashboard = function() {
        updateDashboardWidgets();
        orig();
        var w = appData.settings.dashboardWidgets || {};
        if (w.targetProgress !== false) {
            var now = new Date();
            var targets = (appData.salesTargets || []).filter(function(t) { return t.year === now.getFullYear() && t.month === (now.getMonth() + 1); });
            if (targets.length > 0) {
                var tgt = targets[0].target || 0;
                var achieved = (appData.invoices || []).filter(function(inv) {
                    var d = new Date(inv.date);
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && inv.status !== 'ملغية';
                }).reduce(function(s, inv) { return s + inv.net; }, 0);
                var pct = tgt > 0 ? Math.min(100, Math.round(achieved / tgt * 100)) : 0;
                var pf = document.getElementById('targetProgressFill');
                var pt = document.getElementById('targetProgressText');
                if (pf) pf.style.width = pct + '%';
                if (pt) pt.textContent = pct + '% (' + formatPrice(achieved) + ' / ' + formatPrice(tgt) + ' ' + cur + ')';
            } else {
                var pt = document.getElementById('targetProgressText');
                if (pt) pt.textContent = 'لا يوجد هدف للشهر الحالي';
            }
        }
        if (w.doctorPrescriptions !== false) {
            var tbody = document.getElementById('rxWidgetBody');
            if (tbody) {
                var rxInvs = (appData.invoices || []).filter(function(inv) { return inv.prescription && inv.prescription.doctor; }).slice(-10).reverse();
                if (rxInvs.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="3" class="empty-state text-center">لا توجد وصفات حديثة</td></tr>';
                } else {
                    tbody.innerHTML = '';
                    rxInvs.forEach(function(inv) {
                        var tr = document.createElement('tr');
                        tr.innerHTML = '<td>#' + inv.id + '</td><td>' + escapeHtml(inv.prescription.doctor) + '</td><td>' + formatDate(inv.date) + '</td>';
                        tbody.appendChild(tr);
                    });
                }
            }
        }
        renderSystemHealth();
    };
})();

// ======================================================================
// FEATURE 17: Archive / Purge Old Data
// ======================================================================
function showArchiveModal() {
    document.getElementById('archiveModal').style.display = 'block';
}

function doArchive() {
    var days = parseInt(document.getElementById('archiveDays').value) || 365;
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    var cutoffStr = cutoff.toISOString();
    var oldInvoices = (appData.invoices || []).filter(function(inv) { return inv.date < cutoffStr && inv.status === 'مكتملة'; });
    if (oldInvoices.length === 0) { showToast('لا توجد فواتير قديمة للأرشفة', 'info'); return; }
    if (!confirm('سيتم أرشفة ' + oldInvoices.length + ' فاتورة. هل أنت متأكد؟')) return;
    appData.archived = appData.archived || { invoices: [] };
    oldInvoices.forEach(function(inv) { appData.archived.invoices.push(inv); });
    appData.invoices = (appData.invoices || []).filter(function(inv) { return inv.date >= cutoffStr || inv.status !== 'مكتملة'; });
    saveData();
    document.getElementById('archiveModal').style.display = 'none';
    showToast('تم أرشفة ' + oldInvoices.length + ' فاتورة', 'success');
    renderDashboard();
    audit('archive', 'أرشفة ' + oldInvoices.length + ' فاتورة أقدم من ' + days + ' يوم');
}

function showPurgeModal() {
    document.getElementById('purgeModal').style.display = 'block';
}

function doPurge() {
    if (!confirm('سيتم حذف جميع البيانات بشكل دائم! هل أنت متأكد؟')) return;
    if (!confirm('تأكيد نهائي: لا يمكن التراجع عن هذا الإجراء!')) return;
    localStorage.removeItem('pharmacy_pos_data');
    localStorage.removeItem('pharmacy_pos_meds');
    localStorage.removeItem('pharmacy_pos_data_backup');
    location.reload();
}

// ======================================================================
// FEATURE 18: Announcements Banner
// ======================================================================
function renderAnnouncements() {
    var container = document.getElementById('announcementsContainer');
    if (!container) return;
    var announcements = appData.announcements || [];
    if (announcements.length === 0) {
        container.innerHTML = '<div class="empty-state" style="padding:20px;"><div class="empty-state-text">لا توجد إعلانات</div></div>';
        return;
    }
    container.innerHTML = '';
    announcements.slice().reverse().forEach(function(a) {
        var div = document.createElement('div');
        div.className = 'announcement-card';
        var icon = a.type === 'important' ? '🔴' : a.type === 'info' ? '🔵' : '🟢';
        div.innerHTML = '\n            <div class="announcement-icon">' + icon + '</div>\n            <div class="announcement-content">\n                <div class="announcement-title">' + escapeHtml(a.title) + '</div>\n                <div class="announcement-body">' + escapeHtml(a.body) + '</div>\n                <div class="announcement-date">' + formatDate(a.date) + '</div>\n            </div>\n            <button class="btn btn-sm btn-danger" onclick="deleteAnnouncement(' + a.id + ')"><i class="fas fa-times"></i></button>\n        ';
        container.appendChild(div);
    });
    var banner = document.getElementById('announcementBanner');
    if (banner && announcements.length > 0) {
        var latest = announcements[announcements.length - 1];
        banner.innerHTML = '<span>' + escapeHtml(latest.title) + ': ' + escapeHtml(latest.body) + '</span>';
        banner.style.display = 'flex';
    }
}

function showAddAnnouncement() {
    document.getElementById('announcementModal').style.display = 'block';
    document.getElementById('announcementTitle').value = '';
    document.getElementById('announcementBody').value = '';
    document.getElementById('announcementType').value = 'info';
}

function saveAnnouncement() {
    var title = document.getElementById('announcementTitle').value.trim();
    var body = document.getElementById('announcementBody').value.trim();
    var type = document.getElementById('announcementType').value;
    if (!title || !body) { showToast('الرجاء إدخال العنوان والمحتوى', 'warning'); return; }
    if (!appData.announcements) appData.announcements = [];
    var nextId = appData.announcements.length > 0 ? Math.max.apply(Math, appData.announcements.map(function(a) { return a.id; })) + 1 : 1;
    appData.announcements.push({ id: nextId, title: title, body: body, type: type, date: new Date().toISOString() });
    saveData();
    renderAnnouncements();
    document.getElementById('announcementModal').style.display = 'none';
    showToast('تم إضافة الإعلان', 'success');
}

function deleteAnnouncement(id) {
    if (!confirm('حذف الإعلان؟')) return;
    appData.announcements = (appData.announcements || []).filter(function(a) { return a.id !== id; });
    saveData();
    renderAnnouncements();
    showToast('تم الحذف', 'success');
}

// ======================================================================
// FEATURE 19: Supplier Price Lists
// ======================================================================
function renderSupplierPrices() {
    var tbody = document.getElementById('supplierPriceBody');
    if (!tbody) return;
    var prices = appData.supplierPrices || [];
    var supFilter = document.getElementById('spSupplierFilter');
    if (supFilter && supFilter.value) prices = prices.filter(function(p) { return p.supplierId === parseInt(supFilter.value); });
    tbody.innerHTML = '';
    if (prices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center empty-state">لا توجد أسعار موردين</td></tr>';
        return;
    }
    prices.forEach(function(p) {
        var supName = '';
        var sup = (appData.suppliers || []).find(function(s) { return s.id === p.supplierId; });
        if (sup) supName = sup.name;
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + escapeHtml(supName) + '</td>\n            <td>' + escapeHtml(p.medicineName || '') + '</td>\n            <td>' + formatPrice(p.price) + ' ' + cur + '</td>\n            <td>' + formatDate(p.date) + '</td>\n            <td><button class="btn btn-sm btn-danger" onclick="deleteSupplierPrice(' + p.id + ')">حذف</button></td>\n        ';
        tbody.appendChild(tr);
    });
}

function showAddSupplierPrice() {
    document.getElementById('spModal').style.display = 'block';
    document.getElementById('spMedicineName').value = '';
    document.getElementById('spPrice').value = '';
    var supSelect = document.getElementById('spSupplier');
    supSelect.innerHTML = '<option value="">اختر المورد</option>';
    (appData.suppliers || []).forEach(function(s) {
        supSelect.innerHTML += '<option value="' + s.id + '">' + escapeHtml(s.name) + '</option>';
    });
    var medSelect = document.getElementById('spMedicine');
    medSelect.innerHTML = '<option value="">اختر دواء</option>';
    medicinesDB.forEach(function(m) {
        medSelect.innerHTML += '<option value="' + m.id + '" data-name="' + escapeHtml(m.name) + '">' + escapeHtml(m.name) + '</option>';
    });
}

function spSelectMedicine() {
    var select = document.getElementById('spMedicine');
    var name = select.options[select.selectedIndex] ? select.options[select.selectedIndex].dataset.name : '';
    document.getElementById('spMedicineName').value = name || '';
}

function saveSupplierPrice() {
    var supplierId = parseInt(document.getElementById('spSupplier').value);
    var medicineId = parseInt(document.getElementById('spMedicine').value);
    var price = parseFloat(document.getElementById('spPrice').value) || 0;
    if (!supplierId || !medicineId || price <= 0) { showToast('الرجاء إكمال البيانات', 'warning'); return; }
    var med = getMedicineById(medicineId);
    if (!appData.supplierPrices) appData.supplierPrices = [];
    appData.supplierPrices.push({
        id: (appData.supplierPrices.length || 0) + 1,
        supplierId: supplierId, medicineId: medicineId,
        medicineName: med ? med.name : '',
        price: price, date: new Date().toISOString()
    });
    saveData();
    renderSupplierPrices();
    document.getElementById('spModal').style.display = 'none';
    showToast('تم إضافة سعر المورد', 'success');
}

function deleteSupplierPrice(id) {
    if (!confirm('حذف سعر المورد؟')) return;
    appData.supplierPrices = (appData.supplierPrices || []).filter(function(p) { return p.id !== id; });
    saveData();
    renderSupplierPrices();
    showToast('تم الحذف', 'success');
}

// ======================================================================
// FEATURE 20: Multi-Currency
// ======================================================================
function renderCurrencies() {
    var tbody = document.getElementById('currencyBody');
    if (!tbody) return;
    var currencies = appData.currencies || [];
    tbody.innerHTML = '';
    if (currencies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center empty-state">لا توجد عملات</td></tr>';
        return;
    }
    var defaultCur = appData.defaultCurrency || 'EGP';
    currencies.forEach(function(c) {
        var isDefault = c.code === defaultCur;
        var tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + escapeHtml(c.code) + '</td>\n            <td>' + escapeHtml(c.name) + ' (' + escapeHtml(c.symbol) + ')' + (isDefault ? ' <span class="badge badge-primary">افتراضي</span>' : '') + '</td>\n            <td>' + c.rate + '</td>\n            <td>\n                <button class="btn btn-sm btn-primary" onclick="editCurrency(\'' + c.code + '\')">تعديل</button>\n                ' + (c.code !== 'EGP' ? '<button class="btn btn-sm btn-danger" onclick="deleteCurrency(\'' + c.code + '\')">حذف</button>' : '') + '\n            </td>\n        ';
        tbody.appendChild(tr);
    });
}

function showAddCurrency() {
    document.getElementById('currencyEditCode').value = '';
    document.getElementById('currencyModalTitle').textContent = 'إضافة عملة';
    document.getElementById('currencyCode').value = '';
    document.getElementById('currencyName').value = '';
    document.getElementById('currencySymbol').value = '';
    document.getElementById('currencyRate').value = '1';
    document.getElementById('currencyModal').style.display = 'block';
}

function editCurrency(code) {
    var c = (appData.currencies || []).find(function(x) { return x.code === code; });
    if (!c) return;
    document.getElementById('currencyEditCode').value = code;
    document.getElementById('currencyModalTitle').textContent = 'تعديل عملة: ' + code;
    document.getElementById('currencyCode').value = c.code;
    document.getElementById('currencyName').value = c.name;
    document.getElementById('currencySymbol').value = c.symbol;
    document.getElementById('currencyRate').value = c.rate;
    document.getElementById('currencyModal').style.display = 'block';
}

function saveCurrency() {
    var editCode = document.getElementById('currencyEditCode').value;
    var code = document.getElementById('currencyCode').value.trim().toUpperCase();
    var name = document.getElementById('currencyName').value.trim();
    var symbol = document.getElementById('currencySymbol').value.trim();
    var rate = parseFloat(document.getElementById('currencyRate').value) || 1;
    if (!code || !name || !symbol) { showToast('الرجاء إكمال البيانات', 'warning'); return; }
    if (!appData.currencies) appData.currencies = [];
    if (editCode) {
        var existing = appData.currencies.find(function(c) { return c.code === editCode; });
        if (existing) { existing.code = code; existing.name = name; existing.symbol = symbol; existing.rate = rate; }
        if (appData.defaultCurrency === editCode) appData.defaultCurrency = code;
    } else {
        if (appData.currencies.find(function(c) { return c.code === code; })) { showToast('كود العملة موجود مسبقاً', 'warning'); return; }
        appData.currencies.push({ code: code, name: name, symbol: symbol, rate: rate });
    }
    saveData();
    renderCurrencies();
    document.getElementById('currencyModal').style.display = 'none';
    showToast('تم حفظ العملة', 'success');
}

function deleteCurrency(code) {
    if (!confirm('حذف العملة ' + code + '؟')) return;
    appData.currencies = (appData.currencies || []).filter(function(c) { return c.code !== code; });
    if (appData.defaultCurrency === code) appData.defaultCurrency = 'EGP';
    saveData();
    renderCurrencies();
    showToast('تم الحذف', 'success');
}

function formatPriceMulti(amount, currencyCode) {
    var currencies = appData.currencies || [];
    var currency = currencies.find(function(c) { return c.code === (currencyCode || appData.defaultCurrency || 'EGP'); });
    var symbol = currency ? (currency.symbol || '') : appData.settings.currency || 'ج.م';
    return formatPrice(amount) + ' ' + escapeHtml(symbol);
}

function convertCurrency(amount, fromCode, toCode) {
    var currencies = appData.currencies || [];
    var from = currencies.find(function(c) { return c.code === fromCode; });
    var to = currencies.find(function(c) { return c.code === toCode; });
    if (!from || !to) return amount;
    var egpAmount = amount * (from.rate || 1);
    return egpAmount / (to.rate || 1);
}

// ======================================================================
// Additional helper: Pagination state for new pages
// ======================================================================
paginationState.warehouses = { page: 1, perPage: 50 };
paginationState.warehouseTransfers = { page: 1, perPage: 50 };
paginationState.purchaseOrders = { page: 1, perPage: 50 };
paginationState.doctors = { page: 1, perPage: 50 };
paginationState.giftCards = { page: 1, perPage: 50 };
paginationState.coupons = { page: 1, perPage: 50 };
paginationState.compounds = { page: 1, perPage: 50 };
paginationState.salesTargets = { page: 1, perPage: 50 };

// Load touch mode on startup
loadTouchMode();

// Reorder alert on load (after init)
setTimeout(checkReorderAlerts, 2000);
