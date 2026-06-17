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
    let toggle = document.getElementById('langToggle');
    if (toggle) {
        toggle.textContent = getText('lang.toggle');
        toggle.title = getText('lang.toggle');
    }
    translatePage();
    reRenderCurrentPage();
    updateDate();
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
    else if (id === 'page-settings') { loadSettings(); }
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
        currency: 'ج.م'
    },
    nextInvoiceId: 1,
    nextPurchaseId: 1,
    nextReturnId: 1,
    returns: [],
    stockChanges: []
};

function loadData() {
    let saved = localStorage.getItem('pharmacy_pos_data');
    if (saved) {
        try {
            let parsed = JSON.parse(saved);
            appData = { ...appData, ...parsed };
            appData.settings = { ...appData.settings, ...parsed.settings };
        } catch (e) {
            console.error('Error loading data');
        }
    }
}

function saveData() {
    try {
        localStorage.setItem('pharmacy_pos_data', JSON.stringify(appData));
    } catch (e) {
        console.error('Error saving data:', e);
        showToast('\u062E\u0637\u0623 \u0641\u064A \u062D\u0641\u0638 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A\u060C \u0627\u0644\u062A\u062E\u0632\u064A\u0646 \u0643\u0627\u0645\u0644', 'error');
    }
}

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
    let expiryStatus = getExpiryStatus(med.expiryDate);
    if (expiryStatus === 'expired') return 'منتهي';
    if (med.qty <= 0) return 'نفذ';
    if (med.qty <= threshold) return 'منخفض';
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
    let meds = query ? searchMedicines(query) : medicinesDB;
    if (category !== '\u0627\u0644\u0643\u0644') {
        meds = meds.filter(function(m) { return m.category === category; });
    }
    if (!query) {
        let searchVal = document.getElementById('posSearch').value.trim();
        if (searchVal) meds = searchMedicines(searchVal);
    }
    grid.innerHTML = '';
    if (meds.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state-icon">\uD83D\uDC8A</div><div class="empty-state-text">' + getText('pos.noMeds') + '</div></div>';
        return;
    }
    meds.forEach(function(m) {
        let div = document.createElement('div');
        let expiryStatus = getExpiryStatus(m.expiryDate);
        let extraClass = m.qty <= 0 ? ' out-of-stock' : '';
        if (expiryStatus === 'expired' && m.qty > 0) extraClass += ' expired';
        else if (expiryStatus === 'soon' && m.qty > 0) extraClass += ' expiring';
        div.className = 'med-item' + extraClass;
        div.innerHTML = '\n            <span class="med-name">' + escapeHtml(m.name) + '</span>\n            <span class="med-price">' + formatPrice(m.price) + ' ' + appData.settings.currency + '</span>\n            <span class="med-stock">' + getText('pos.stock') + ' ' + m.qty + '</span>\n        ';
        if (m.qty > 0 && expiryStatus !== 'expired') {
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
            if (barcodeMatch.qty > 0) {
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
            item.innerHTML = '\n                <div class="search-suggestion-info">\n                    <span class="search-suggestion-name">' + highlightText(m.name, q) + '</span>\n                    <span class="search-suggestion-sub">' + highlightText(m.scientificName, q) + ' | ' + highlightText(m.category, q) + '</span>\n                </div>\n                <div style="text-align:left;">\n                    <div class="search-suggestion-price">' + formatPrice(m.price) + ' ' + appData.settings.currency + '</div>\n                    <div class="search-suggestion-stock">' + getText('pos.stock') + ' ' + m.qty + '</div>\n                </div>\n            ';
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
                if (bm.qty > 0) {
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

function loadCategories() {
    let cats = getCategories();
    let selects = ['posCategory', 'invCategory'];
    selects.forEach(function(id) {
        let sel = document.getElementById(id);
        if (!sel) return;
        let html = '<option value="\u0627\u0644\u0643\u0644">' + getText('pos.allCategories') + '</option>';
        cats.forEach(function(c) {
            html += '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
        });
        sel.innerHTML = html;
    });
}

// ===== CART =====

function addToCart(med) {
    let existing = appData.cart.find(function(item) { return item.id === med.id; });
    if (existing) {
        if (existing.qty < med.qty) existing.qty++;
        else { showToast('\u0643\u0645\u064A\u0629 ' + escapeHtml(med.name) + ' \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631\u0629 \u0628\u0627\u0644\u0645\u062E\u0632\u0648\u0646', 'warning'); return; }
    } else {
        appData.cart.push({ id: med.id, name: med.name, price: med.price, qty: 1, maxQty: med.qty });
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
        div.innerHTML = '\n            <div class="cart-item-info">\n                <span class="cart-item-name">' + escapeHtml(item.name) + '</span>\n                <span class="cart-item-sub">' + formatPrice(item.price) + ' ' + appData.settings.currency + ' \u00D7 ' + item.qty + '</span>\n            </div>\n            <div class="cart-item-actions">\n                <input type="number" class="cart-item-qty" value="' + item.qty + '" min="1" max="' + item.maxQty + '" data-index="' + idx + '">\n                <span class="cart-item-remove" data-index="' + idx + '">&times;</span>\n            </div>\n        ';
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
    document.getElementById('cartTotal').textContent = formatPrice(subtotal) + ' ' + appData.settings.currency;
    document.getElementById('cartNet').textContent = formatPrice(net) + ' ' + appData.settings.currency;
    document.getElementById('cartChange').textContent = formatPrice(change) + ' ' + appData.settings.currency;
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
    if (paid < net) {
        showToast('\u0627\u0644\u0645\u0628\u0644\u063A \u0627\u0644\u0645\u062F\u0641\u0648\u0639 \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u0635\u0627\u0641\u064A!', 'error');
        return;
    }
    let content = document.getElementById('confirmSaleContent');
    let itemsHtml = '';
    appData.cart.forEach(function(item) {
        itemsHtml += '<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;border-bottom:1px solid var(--border-light);"><span>' + escapeHtml(item.name) + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + ' ' + appData.settings.currency + '</span></div>';
    });
    content.innerHTML = '\n        <div style="margin-bottom:12px;">' + itemsHtml + '</div>\n        <div style="border-top:2px solid var(--primary);padding-top:8px;">\n            <div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(subtotal) + ' ' + appData.settings.currency + '</span></div>\n            <div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(discount) + ' ' + appData.settings.currency + '</span></div>\n            ' + (taxRate > 0 ? '<div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629 (' + taxRate + '%)</span><span>' + formatPrice(tax) + ' ' + appData.settings.currency + '</span></div>' : '') + '\n            <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;margin-top:6px;"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(net) + ' ' + appData.settings.currency + '</span></div>\n            <div style="display:flex;justify-content:space-between;font-size:15px;color:var(--success);"><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(paid) + ' ' + appData.settings.currency + '</span></div>\n            <div style="display:flex;justify-content:space-between;font-size:15px;"><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(paid - net) + ' ' + appData.settings.currency + '</span></div>\n        </div>\n    ';
    document.getElementById('confirmSaleModal').style.display = 'block';
    document.getElementById('confirmSaleYes').onclick = function() {
        document.getElementById('confirmSaleModal').style.display = 'none';
        completeSale(subtotal, discount, tax, net, paid);
    };
});

function completeSale(subtotal, discount, tax, net, paid) {
    let customerSelect = document.getElementById('cartCustomer');
    let customerId = customerSelect ? parseInt(customerSelect.value) || null : null;
    let     invoice = {
        id: appData.nextInvoiceId++,
        date: new Date().toISOString(),
        items: appData.cart.map(function(item) {
            let med = medicinesDB.find(function(m) { return m.id === item.id; });
            return { ...item, buyPrice: med ? (med.buyPrice || 0) : 0 };
        }),
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        net: net,
        paid: paid,
        change: paid - net,
        customerId: customerId,
        status: 'مكتملة',
        prescription: {
            doctor: (document.getElementById('rxDoctor')?.value || '').trim(),
            diagnosis: (document.getElementById('rxDiagnosis')?.value || '').trim(),
            refills: parseInt(document.getElementById('rxRefills')?.value) || 0,
            date: document.getElementById('rxDate')?.value || ''
        }
    };
    resetPrescriptionFields();
    appData.invoices.push(invoice);
    appData.cart.forEach(function(item) {
        let med = medicinesDB.find(function(m) { return m.id === item.id; });
        if (med) med.qty = Math.max(0, med.qty - item.qty);
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
    resetPrescriptionFields();
    showToast('\u0641\u0627\u062A\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629', 'info');
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
    content.innerHTML = '\n        <div class="receipt">\n            <h3>' + escapeHtml(appData.settings.pharmacyName || 'ValoPOS') + '</h3>\n            <p>' + escapeHtml(appData.settings.address || '') + '</p>\n            <p>' + escapeHtml(appData.settings.phone || '') + '</p>\n            ' + firstBarcode + '\n            <div class="receipt-line"></div>\n            <p>\u0641\u0627\u062A\u0648\u0631\u0629 #' + invoice.id + '</p>\n            <p>' + formatDate(invoice.date) + '</p>\n            ' + (customerName ? '<p class="receipt-customer">\u0627\u0644\u0639\u0645\u064A\u0644: ' + escapeHtml(customerName) + '</p>' : '') + '\n            ' + (invoice.prescription && invoice.prescription.doctor ? '<div class="receipt-line"></div><p style="font-weight:700;margin:4px 0;font-size:13px;">\uD83D\uDCCB \u0631\u0648\u0634\u062A\u0629 \u0637\u0628\u064A\u0629</p><p>\u0627\u0644\u0637\u0628\u064A\u0628: ' + escapeHtml(invoice.prescription.doctor) + '</p>' + (invoice.prescription.diagnosis ? '<p>\u0627\u0644\u062A\u0634\u062E\u064A\u0635: ' + escapeHtml(invoice.prescription.diagnosis) + '</p>' : '') + (invoice.prescription.refills ? '<p>\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0635\u0631\u0641: ' + invoice.prescription.refills + '</p>' : '') + (invoice.prescription.date ? '<p>\u0627\u0644\u062A\u0627\u0631\u064A\u062E: ' + invoice.prescription.date + '</p>' : '') : '') + '\n            <div class="receipt-line"></div>\n            ' + itemsHtml + '\n            <div class="receipt-line"></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(invoice.subtotal) + ' ' + appData.settings.currency + '</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(invoice.discount) + ' ' + appData.settings.currency + '</span></div>\n            ' + (taxRate > 0 ? '<div class="receipt-row"><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629 (' + taxRate + '%)</span><span>' + formatPrice(invoice.tax || 0) + ' ' + appData.settings.currency + '</span></div>' : '') + '\n            <div class="receipt-row receipt-total"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(invoice.net) + ' ' + appData.settings.currency + '</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(invoice.paid) + ' ' + appData.settings.currency + '</span></div>\n            <div class="receipt-row"><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(invoice.change) + ' ' + appData.settings.currency + '</span></div>\n            <div class="receipt-line"></div>\n            <p>' + escapeHtml(footer) + '</p>\n        </div>\n    ';
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
    w.document.write('<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>\u0641\u0627\u062A\u0648\u0631\u0629 A4 - ' + invoice.id + '</title><style>@page{size:A4;margin:15mm}body{font-family:"Segoe UI",sans-serif;color:#222;padding:20px}h2{text-align:center;margin-bottom:5px}.pharmacy-info{text-align:center;margin-bottom:15px;color:#555;font-size:14px}.invoice-info{display:flex;justify-content:space-between;margin-bottom:15px;font-size:13px}table{width:100%;border-collapse:collapse;margin-bottom:15px}th{background:#2e1065;color:#fff;padding:10px 12px;font-size:13px;text-align:center}td{font-size:13px}tr:nth-child(even){background:#f9f9f9}.totals{width:300px;margin-right:auto}.totals div{display:flex;justify-content:space-between;padding:6px 10px;font-size:14px;border-bottom:1px solid #ddd}.totals .net{font-weight:700;font-size:16px;border-top:2px solid #2e1065;padding-top:8px;margin-top:4px}.prescription-info{background:#f0f4ff;padding:12px;border-radius:8px;margin:15px 0;border-right:4px solid #2e1065;font-size:13px}.footer{text-align:center;margin-top:30px;font-size:13px;color:#888;border-top:2px solid #eee;padding-top:15px}@media print{body{padding:0}.no-print{display:none!important}}</style></head><body><h2>' + escapeHtml(appData.settings.pharmacyName || 'ValoPOS') + '</h2><div class="pharmacy-info">' + (appData.settings.address ? escapeHtml(appData.settings.address) + '<br>' : '') + (appData.settings.phone ? escapeHtml(appData.settings.phone) + '<br>' : '') + '</div><div class="invoice-info"><div><strong>\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629:</strong> #' + invoice.id + '</div><div><strong>\u0627\u0644\u062A\u0627\u0631\u064A\u062E:</strong> ' + formatDate(invoice.date) + '</div></div>' + (customerName ? '<div style="margin-bottom:12px;font-size:13px;"><strong>\u0627\u0644\u0639\u0645\u064A\u0644:</strong> ' + escapeHtml(customerName) + '</div>' : '') + (invoice.prescription && invoice.prescription.doctor ? '<div class="prescription-info"><strong>\u0631\u0648\u0634\u062A\u0629 \u0637\u0628\u064A\u0629</strong><br><strong>\u0627\u0644\u0637\u0628\u064A\u0628:</strong> ' + escapeHtml(invoice.prescription.doctor) + (invoice.prescription.diagnosis ? '<br><strong>\u0627\u0644\u062A\u0634\u062E\u064A\u0635:</strong> ' + escapeHtml(invoice.prescription.diagnosis) : '') + (invoice.prescription.refills ? '<br><strong>\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0635\u0631\u0641:</strong> ' + invoice.prescription.refills : '') + (invoice.prescription.date ? '<br><strong>\u0627\u0644\u062A\u0627\u0631\u064A\u062E:</strong> ' + invoice.prescription.date : '') + '</div>' : '') + '<table><thead><tr><th>\u0627\u0633\u0645 \u0627\u0644\u062F\u0648\u0627\u0621</th><th>\u0627\u0644\u0643\u0645\u064A\u0629</th><th>\u0627\u0644\u0633\u0639\u0631</th><th>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</th></tr></thead><tbody>' + itemsHtml + '</tbody></table><div class="totals"><div><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(invoice.subtotal) + ' ' + appData.settings.currency + '</span></div><div><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(invoice.discount) + ' ' + appData.settings.currency + '</span></div>' + (taxRate > 0 ? '<div><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629 (' + taxRate + '%)</span><span>' + formatPrice(invoice.tax) + ' ' + appData.settings.currency + '</span></div>' : '') + '<div class="net"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(invoice.net) + ' ' + appData.settings.currency + '</span></div><div><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(invoice.paid) + ' ' + appData.settings.currency + '</span></div><div><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(invoice.change) + ' ' + appData.settings.currency + '</span></div></div><div class="footer">' + escapeHtml(footer) + '</div><div class="no-print" style="text-align:center;margin-top:20px;"><button onclick="window.print()" style="padding:10px 30px;background:#2e1065;color:#fff;border:none;border-radius:6px;font-size:16px;cursor:pointer;">\u0637\u0628\u0627\u0639\u0629</button></div></body></html>');
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
    w.document.write('<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>\u0641\u0627\u062A\u0648\u0631\u0629 \u062D\u0631\u0627\u0631\u064A\u0629 - ' + invoice.id + '</title><style>@page{width:80mm;margin:0;padding:0}body{width:80mm;margin:0 auto;padding:10px 5px;font-family:"Courier New",monospace;font-size:12px;line-height:1.6;color:#000}h3{text-align:center;font-size:16px;margin:0 0 4px}.center{text-align:center;font-size:11px;margin:2px 0}.line{border-top:1px dashed #000;margin:8px 0}.row{display:flex;justify-content:space-between;font-size:12px;padding:2px 0}.total{font-weight:700;font-size:14px;padding-top:4px;border-top:1.5px solid #000}.footer{text-align:center;font-size:11px;margin-top:10px;padding-top:8px;border-top:1px dashed #000}.prescription-info{font-size:11px;padding:6px;border:1px dashed #000;margin:6px 0}@media print{body{width:80mm;margin:0;padding:5px}.no-print{display:none!important}}</style></head><body><h3>' + escapeHtml(appData.settings.pharmacyName || 'ValoPOS') + '</h3><div class="center">' + escapeHtml(appData.settings.address || '') + '</div><div class="center">' + escapeHtml(appData.settings.phone || '') + '</div><div class="line"></div><div class="center"><strong>\u0641\u0627\u062A\u0648\u0631\u0629 #' + invoice.id + '</strong></div><div class="center">' + formatDate(invoice.date) + '</div>' + (customerName ? '<div class="center" style="font-weight:600;">\u0627\u0644\u0639\u0645\u064A\u0644: ' + escapeHtml(customerName) + '</div>' : '') + (invoice.prescription && invoice.prescription.doctor ? '<div class="prescription-info"><strong>\u0631\u0648\u0634\u062A\u0629</strong><br>\u0627\u0644\u0637\u0628\u064A\u0628: ' + escapeHtml(invoice.prescription.doctor) + (invoice.prescription.diagnosis ? '<br>\u0627\u0644\u062A\u0634\u062E\u064A\u0635: ' + escapeHtml(invoice.prescription.diagnosis) : '') + '</div>' : '') + '<div class="line"></div>' + itemsHtml + '<div class="line"></div><div class="row"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>' + formatPrice(invoice.subtotal) + '</span></div><div class="row"><span>\u0627\u0644\u062E\u0635\u0645</span><span>' + formatPrice(invoice.discount) + '</span></div>' + (taxRate > 0 ? '<div class="row"><span>\u0627\u0644\u0636\u0631\u064A\u0628\u0629</span><span>' + formatPrice(invoice.tax) + '</span></div>' : '') + '<div class="row total"><span>\u0627\u0644\u0635\u0627\u0641\u064A</span><span>' + formatPrice(invoice.net) + '</span></div><div class="row"><span>\u0627\u0644\u0645\u062F\u0641\u0648\u0639</span><span>' + formatPrice(invoice.paid) + '</span></div><div class="row"><span>\u0627\u0644\u0628\u0627\u0642\u064A</span><span>' + formatPrice(invoice.change) + '</span></div><div class="footer">' + escapeHtml(footer) + '</div><div class="no-print" style="text-align:center;margin-top:10px;"><button onclick="window.print()" style="padding:8px 20px;background:#000;color:#fff;border:none;border-radius:4px;font-size:13px;cursor:pointer;">\u0637\u0628\u0627\u0639\u0629</button></div></body></html>');
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
    content.innerHTML = '\n        <div style="padding:10px 0;">\n            <p style="margin:6px 0;"><strong>\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629:</strong> #' + inv.id + '</p>\n            <p style="margin:6px 0;"><strong>\u0627\u0644\u0637\u0628\u064A\u0628:</strong> ' + escapeHtml(p.doctor || '-') + '</p>\n            ' + (p.diagnosis ? '<p style="margin:6px 0;"><strong>\u0627\u0644\u062A\u0634\u062E\u064A\u0635:</strong> ' + escapeHtml(p.diagnosis) + '</p>' : '') + '\n            <p style="margin:6px 0;"><strong>\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0635\u0631\u0641:</strong> ' + (p.refills || 0) + '</p>\n            ' + (p.date ? '<p style="margin:6px 0;"><strong>\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0631\u0648\u0634\u062A\u0629:</strong> ' + p.date + '</p>' : '') + '\n            <div style="margin:12px 0;border-top:1px solid var(--border-light);padding-top:10px;">\n                <strong style="font-size:13px;">\u0627\u0644\u0623\u0635\u0646\u0627\u0641:</strong>\n                ' + inv.items.map(function(item) { return '<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:13px;border-bottom:1px solid var(--border-light);"><span>' + escapeHtml(item.name) + ' \u00D7' + item.qty + '</span><span>' + formatPrice(item.price * item.qty) + ' ' + appData.settings.currency + '</span></div>'; }).join('') + '\n            </div>\n        </div>\n    ';
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
        tbody.innerHTML = '<tr><td colspan="10" class="text-center empty-state">' + getText('inventory.noResults') + '</td></tr>';
        renderPagination('invPagination', paged.page, paged.pages, 'renderInventory');
        return;
    }
    paged.items.forEach(function(m) {
        let statusText = getStockStatus(m);
        let statusClass = statusText === '\u0645\u062A\u0648\u0641\u0631' ? 'badge-success' : statusText === '\u0645\u0646\u062E\u0641\u0636' ? 'badge-warning' : 'badge-danger';
        let expiryDays = getExpiryDays(m.expiryDate);
        let expiryStatus = getExpiryStatus(m.expiryDate);
        let expiryDisplay = m.expiryDate ? formatDateShort(m.expiryDate) : '-';
        let expiryBadge = 'green';
        if (expiryStatus === 'expired' || expiryStatus === 'soon') expiryBadge = 'red';
        else if (expiryStatus === 'warning') expiryBadge = 'yellow';
        let tr = document.createElement('tr');
        tr.innerHTML = '\n            <td>' + m.id + '</td>\n            <td><strong class="inline-edit" data-field="name" data-id="' + m.id + '">' + escapeHtml(m.name) + '</strong></td>\n            <td class="inline-edit" data-field="scientificName" data-id="' + m.id + '">' + escapeHtml(m.scientificName) + '</td>\n            <td>' + escapeHtml(m.category) + '</td>\n            <td><strong class="inline-edit" data-field="price" data-id="' + m.id + '">' + formatPrice(m.price) + '</strong></td>\n            <td class="inline-edit" data-field="qty" data-id="' + m.id + '">' + m.qty + '</td>\n            <td><span class="expiry-badge ' + expiryBadge + '">' + expiryDisplay + (expiryDays !== null && expiryDays <= 60 ? ' (' + expiryDays + ' ' + getText('inventory.day') + ')' : '') + '</span></td>\n            <td><span class="badge ' + statusClass + '">' + statusText + '</span></td>\n            <td>' + (m.rx ? getText('inventory.rxYes') : getText('inventory.rxNo')) + '</td>\n            <td><button class="btn btn-sm btn-primary" onclick="editStock(' + m.id + ')">' + getText('inventory.edit') + '</button></td>\n        ';
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
                if (field === 'qty') val = parseInt(val) || 0;
                if (field === 'price') val = Math.max(0, val);
                if (val !== undefined && val !== '') {
                    med[field] = val;
                    saveData();
                    renderInventory();
                    renderMedsGrid();
                    showToast(getText('inventory.updated') + ' ' + escapeHtml(med.name), 'success');
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
                            .catch(function() {});
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
    sel.innerHTML = '<option value="' + med.id + '">' + escapeHtml(med.name) + ' (\u0645\u062E\u0632\u0648\u0646: ' + med.qty + ')</option>';
    document.getElementById('stockQtyInput').value = 10;
    document.getElementById('stockPriceInput').value = med.price;
    document.getElementById('stockExpiryInput').value = med.expiryDate || '';
    document.getElementById('stockModal').style.display = 'block';
}

document.getElementById('addStockBtn').addEventListener('click', function() {
    let sel = document.getElementById('stockMedSelect');
    sel.innerHTML = '';
    medicinesDB.forEach(function(m) {
        sel.innerHTML += '<option value="' + m.id + '">' + escapeHtml(m.name) + ' (\u0645\u062E\u0632\u0648\u0646: ' + m.qty + ')</option>';
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
    let name = document.getElementById('newMedName').value.trim();
    let scientific = document.getElementById('newMedScientific').value.trim();
    let category = document.getElementById('newMedCategory').value;
    let price = parseFloat(document.getElementById('newMedPrice').value);
    let qty = parseInt(document.getElementById('newMedQty').value) || 0;
    let expiry = document.getElementById('newMedExpiry').value;
    let barcode = document.getElementById('newMedBarcode').value.trim();
    let rx = document.getElementById('newMedRx').checked;
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
    medicinesDB.push({
        id: maxId + 1,
        name: name,
        scientificName: scientific || '-',
        category: category,
        price: price,
        buyPrice: 0,
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
    showToast('\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 ' + escapeHtml(name) + ' \u0628\u0646\u062C\u0627\u062D', 'success');
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
        tr.innerHTML = '\n            <td>' + c.id + '</td>\n            <td><strong>' + escapeHtml(c.name) + '</strong></td>\n            <td>' + escapeHtml(c.phone) + '</td>\n            <td>' + formatPrice(c.totalSpent || 0) + ' ' + appData.settings.currency + '</td>\n            <td>' + (c.points || 0) + '</td>\n            <td><span class="debt-badge ' + debtClass + '">' + formatPrice(debt) + ' ' + appData.settings.currency + '</span></td>\n            <td>' + (c.lastPurchase ? formatDate(c.lastPurchase) : '-') + '</td>\n            <td class="customer-actions">\n                <button class="btn btn-sm btn-info" onclick="viewCustomer(' + c.id + ')">' + getText('customers.view') + '</button>\n                <button class="btn btn-sm btn-primary" onclick="editCustomer(' + c.id + ')">' + getText('customers.edit') + '</button>\n                <button class="btn btn-sm btn-warning" onclick="addDebtPayment(' + c.id + ')">' + getText('customers.payDebt') + '</button>\n                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(' + c.id + ')">' + getText('customers.delete') + '</button>\n            </td>\n        ';
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
            invoicesHtml += '<tr><td>#' + inv.id + '</td><td>' + formatDate(inv.date) + '</td><td>' + inv.items.length + '</td><td>' + formatPrice(inv.net) + ' ' + appData.settings.currency + '</td><td><span class="badge badge-success">\u0645\u0643\u062A\u0645\u0644\u0629</span>' + (inv.prescription && inv.prescription.doctor ? ' <span class="rx-badge" onclick="viewRx(' + inv.id + ')" title="\u0639\u0631\u0636 \u0627\u0644\u0631\u0648\u0634\u062A\u0629">\uD83D\uDCCB \u0631\u0648\u0634\u062A\u0629</span>' : '') + '</td></tr>';
        });
    }
    let debt = c.debt || 0;
    let content = document.getElementById('customerDetailContent');
    content.innerHTML = '\n        <div class="customer-detail-card">\n            <div class="customer-detail-header">\n                <div>\n                    <div class="customer-detail-name">' + escapeHtml(c.name) + '</div>\n                    <div class="customer-detail-phone">' + escapeHtml(c.phone) + (c.email ? ' | ' + escapeHtml(c.email) : '') + '</div>\n                </div>\n                <button class="btn btn-sm btn-primary" onclick="editCustomer(' + c.id + '); document.getElementById(\'customerDetailModal\').style.display=\'none\';">\u062A\u0639\u062F\u064A\u0644</button>\n            </div>\n            <div class="customer-detail-stats">\n                <div class="customer-stat"><span class="customer-stat-value">' + formatPrice(c.totalSpent || 0) + ' ' + appData.settings.currency + '</span><span class="customer-stat-label">\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A</span></div>\n                <div class="customer-stat"><span class="customer-stat-value">' + (c.points || 0) + '</span><span class="customer-stat-label">\u0646\u0642\u0627\u0637</span></div>\n                <div class="customer-stat"><span class="customer-stat-value">' + invoices.length + '</span><span class="customer-stat-label">\u0639\u062F\u062F \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631</span></div>\n                <div class="customer-stat"><span class="customer-stat-value" style="color:' + (debt > 0 ? 'var(--danger)' : 'var(--success)') + ';">' + formatPrice(debt) + ' ' + appData.settings.currency + '</span><span class="customer-stat-label">\u0627\u0644\u0645\u062F\u064A\u0648\u0646\u064A\u0629</span></div>\n            </div>\n            <h4 style="margin-bottom:10px;font-size:14px;color:var(--text-light);">\u0633\u062C\u0644 \u0627\u0644\u0645\u0634\u062A\u0631\u064A\u0627\u062A</h4>\n            <div class="table-responsive">\n                <table class="table">\n                    <thead><tr><th>\u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629</th><th>\u0627\u0644\u062A\u0627\u0631\u064A\u062E</th><th>\u0639\u062F\u062F \u0627\u0644\u0623\u0635\u0646\u0627\u0641</th><th>\u0627\u0644\u0645\u0628\u0644\u063A</th><th>\u0627\u0644\u062D\u0627\u0644\u0629</th></tr></thead>\n                    <tbody>' + invoicesHtml + '</tbody>\n                </table>\n            </div>\n        </div>\n    ';
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
    showToast('\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u0641\u0639 \u0628\u0646\u062C\u0627\u062D: ' + formatPrice(val) + ' ' + appData.settings.currency, 'success');
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
            med.qty = (med.qty || 0) + p.qty;
            if (p.price > 0) {
                med.price = p.price;
                med.buyPrice = p.price;
            }
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
        tr.innerHTML = '\n            <td>#' + p.id + '</td>\n            <td>' + (s ? escapeHtml(s.name) : '-') + '</td>\n            <td>' + formatDate(p.date) + '</td>\n            <td>' + p.items.length + '</td>\n            <td>' + formatPrice(p.subtotal) + ' ' + appData.settings.currency + '</td>\n            <td>' + formatPrice(p.discount) + ' ' + appData.settings.currency + '</td>\n            <td><strong>' + formatPrice(p.net) + ' ' + appData.settings.currency + '</strong></td>\n            <td><button class="btn btn-sm btn-danger" onclick="deletePurchase(' + p.id + ')">\u062D\u0630\u0641</button></td>\n        ';
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
        let med = medicinesDB.find(function(m) { return m.id === item.id; });
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
    let todaySales = appData.invoices
        .filter(function(inv) { return isToday(inv.date) && inv.status !== '\u0645\u0644\u063A\u064A\u0629'; })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    let monthlySales = appData.invoices
        .filter(function(inv) { return isThisMonth(inv.date) && inv.status !== '\u0645\u0644\u063A\u064A\u0629'; })
        .reduce(function(sum, inv) { return sum + inv.net; }, 0);
    let lowStock = medicinesDB.filter(function(m) { return m.qty > 0 && m.qty <= 10; }).length;
    let outOfStock = medicinesDB.filter(function(m) { return m.qty <= 0; }).length;
    let expiringMeds = medicinesDB.filter(function(m) {
        let days = getExpiryDays(m.expiryDate);
        return days !== null && days >= 0 && days <= 30;
    }).length;

    document.getElementById('todaySales').textContent = formatPrice(todaySales) + ' ' + appData.settings.currency;
    document.getElementById('totalMeds').textContent = medicinesDB.length;
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('outOfStock').textContent = outOfStock;
    document.getElementById('monthlySales').textContent = formatPrice(monthlySales) + ' ' + appData.settings.currency;
    document.getElementById('expiringMedsCount').textContent = expiringMeds;

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
            tr2.innerHTML = '\n                <td>#' + inv.id + '</td>\n                <td>' + formatPrice(inv.net) + ' ' + appData.settings.currency + '</td>\n                <td>' + formatDate(inv.date) + '</td>\n                <td><span class="badge ' + statusBadge + '">' + statusText + '</span>' + (inv.prescription && inv.prescription.doctor ? ' <span class="rx-icon" title="' + getText('dash.prescription') + '">\uD83D\uDCCB</span>' : '') + '</td>\n                <td>' + (statusText !== '\u0645\u0644\u063A\u064A\u0629' ? '<button class="btn btn-sm btn-danger" onclick="cancelInvoice(' + inv.id + ');renderDashboard();">' + getText('dash.cancel') + '</button>' : '') + '</td>\n            ';
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
        let days = getExpiryDays(m.expiryDate);
        return days !== null && days >= 0 && days <= 30;
    }).sort(function(a, b) { return getExpiryDays(a.expiryDate) - getExpiryDays(b.expiryDate); });
    let expiryCount = document.getElementById('expiryAlertCount');
    if (expiryCount) expiryCount.textContent = expiryMeds.length;
    if (expiryTbody) {
        if (expiryMeds.length === 0) {
            expiryTbody.innerHTML = '<tr><td colspan="4" class="text-center empty-state">' + getText('dash.noExpiring') + '</td></tr>';
        } else {
            expiryTbody.innerHTML = '';
            expiryMeds.forEach(function(m) {
                let days = getExpiryDays(m.expiryDate);
                let tr3 = document.createElement('tr');
                tr3.innerHTML = '\n                    <td><strong>' + escapeHtml(m.name) + '</strong></td>\n                    <td>' + formatDateShort(m.expiryDate) + '</td>\n                    <td><span class="expiry-badge ' + (days <= 0 ? 'red' : 'yellow') + '">' + days + ' ' + getText('dash.day') + '</span></td>\n                    <td>' + m.qty + '</td>\n                ';
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

    let cur = appData.settings.currency;
    document.getElementById('reportTodaySales').textContent = formatPrice(todaySales) + ' ' + cur;
    document.getElementById('reportTodayCount').textContent = todayCount;
    document.getElementById('reportMonthSales').textContent = formatPrice(monthSales) + ' ' + cur;
    document.getElementById('reportMonthCount').textContent = monthCount;
    document.getElementById('reportTotalSales').textContent = formatPrice(totalSales) + ' ' + cur;
    document.getElementById('reportTotalCount').textContent = totalCount;

    // Profit calculations
    let totalProfit = activeInvoices.reduce(function(sum, inv) { return sum + calcProfit(inv); }, 0);
    let todayProfit = todayInvs.reduce(function(sum, inv) { return sum + calcProfit(inv); }, 0);
    let monthProfit = monthInvs.reduce(function(sum, inv) { return sum + calcProfit(inv); }, 0);
    let profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    let profitTotalEl = document.getElementById('reportTotalProfit');
    let profitMarginEl = document.getElementById('reportProfitMargin');
    let profitTodayEl = document.getElementById('reportTodayProfit');
    let profitMonthEl = document.getElementById('reportMonthProfit');
    if (profitTotalEl) profitTotalEl.textContent = formatPrice(totalProfit) + ' ' + cur;
    if (profitMarginEl) profitMarginEl.textContent = formatPrice(profitMargin) + '%';
    if (profitTodayEl) profitTodayEl.textContent = formatPrice(todayProfit) + ' ' + cur;
    if (profitMonthEl) profitMonthEl.textContent = formatPrice(monthProfit) + ' ' + cur;

    // Invoices table
    let sortedInvoices = invoices.slice().reverse();
    let state = paginationState.invoices;
    let paged = paginate(sortedInvoices, state.page, state.perPage);
    if (state.page > paged.pages) state.page = 1;
    paged = paginate(sortedInvoices, state.page, state.perPage);
    let tbody = document.getElementById('allInvoicesBody');
    if (invoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center empty-state">' + getText('reports.noInvoices') + '</td></tr>';
        renderPagination('invoicesPagination', paged.page, paged.pages, 'renderReports');
        return;
    }
    tbody.innerHTML = '';
    paged.items.forEach(function(inv) {
        let statusText = getInvoiceStatusText(inv);
        let statusBadge = getInvoiceStatusBadge(statusText);
        let canCancel = statusText !== '\u0645\u0644\u063A\u064A\u0629';
        let canReturn = statusText !== '\u0645\u0644\u063A\u064A\u0629' && statusText !== '\u0645\u0631\u062A\u062C\u0639 \u0643\u0644\u064A';
        let tr3 = document.createElement('tr');
        tr3.innerHTML = '\n            <td>#' + inv.id + '</td>\n            <td>' + formatDate(inv.date) + '</td>\n            <td>' + inv.items.length + '</td>\n            <td>' + formatPrice(inv.subtotal) + ' ' + cur + '</td>\n            <td>' + formatPrice(inv.discount) + ' ' + cur + '</td>\n            <td><strong>' + formatPrice(inv.net) + ' ' + cur + '</strong></td>\n            <td><span class="badge ' + statusBadge + '">' + statusText + '</span></td>\n            <td style="white-space:nowrap;">\n                ' + (canReturn ? '<button class="btn btn-sm btn-warning" onclick="showReturnModal(' + inv.id + ');" style="margin-' + (document.documentElement.dir === 'rtl' ? 'left' : 'right') + ':4px;">' + getText('reports.return') + '</button>' : '') + '\n                ' + (canCancel ? '<button class="btn btn-sm btn-danger" onclick="cancelInvoice(' + inv.id + ');renderReports();">' + getText('reports.cancel') + '</button>' : '') + '\n            </td>\n        ';
        tbody.appendChild(tr3);
    });
    renderPagination('invoicesPagination', paged.page, paged.pages, 'renderReports');
    renderReturnsTable();
    renderProfitChart();
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
        div.innerHTML = '\n            <label class="return-item-label">\n                <input type="checkbox" class="return-item-cb" data-id="' + item.id + '" data-max="' + available + '" checked>\n                <span class="return-item-name">' + escapeHtml(item.name) + '</span>\n                <span class="return-item-price">' + formatPrice(item.price * available) + ' ' + appData.settings.currency + '</span>\n            </label>\n            <div class="return-item-qty-wrap">\n                <label>' + getText('returns.qtyLabel') + ' </label>\n                <input type="number" class="return-item-qty form-input" value="' + available + '" min="1" max="' + available + '" style="width:70px;">\n            </div>\n        ';
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
            let med = medicinesDB.find(function(m) { return m.id === medId; });
            if (med) med.qty += qty;
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
    renderDashboard();
    renderReports();
    document.getElementById('returnModal').style.display = 'none';
    showToast(getText('returns.success') + ' - ' + returnItems.length + ' ' + getText('returns.items') + ' ' + getText('returns.value') + ' ' + formatPrice(totalReturn) + ' ' + appData.settings.currency, 'success');
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
        tr.innerHTML = '\n            <td>#' + r.id + '</td>\n            <td>#' + r.invoiceId + '</td>\n            <td>' + formatDate(r.date) + '</td>\n            <td style="font-size:12px;">' + itemsStr + '</td>\n            <td>' + formatPrice(r.total) + ' ' + appData.settings.currency + '</td>\n            <td style="font-size:12px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + escapeHtml(r.reason) + '">' + escapeHtml(r.reason) + '</td>\n        ';
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
}

function saveSettings() {
    appData.settings.pharmacyName = document.getElementById('pharmacyName').value;
    appData.settings.address = document.getElementById('pharmacyAddress').value;
    appData.settings.phone = document.getElementById('pharmacyPhone').value;
    appData.settings.receiptFooter = document.getElementById('receiptFooter').value;
    appData.settings.taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    appData.settings.currency = document.getElementById('currency').value || getText('settings.currencyDefault');
    saveData();
    showToast(getText('settings.saved'), 'success');
}

function resetData() {
    if (confirm(getText('settings.resetConfirm1'))) {
        if (confirm(getText('settings.resetConfirm2'))) {
            localStorage.removeItem('pharmacy_pos_data');
            appData = {
                cart: [], invoices: [], customers: [], suppliers: [], purchases: [],
                settings: { pharmacyName: 'ValoPOS', address: '', phone: '',         receiptFooter: getText('settings.receiptFooterDefault'), taxRate: 0, currency: '\u062C.\u0645' },
                nextInvoiceId: 1, nextPurchaseId: 1, nextReturnId: 1, returns: [], stockChanges: []
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

function exportData() {
    let dataStr = JSON.stringify(appData, null, 2);
    let blob = new Blob([dataStr], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'pharmacy_backup_' + todayStr() + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = function(ev) {
            try {
                let data = JSON.parse(ev.target.result);
                appData = { ...appData, ...data };
                appData.settings = { ...appData.settings, ...data.settings };
                saveData();
                renderDashboard();
                renderInventory();
                renderReports();
                renderCustomers();
                renderSuppliers();
                renderPurchases();
                showToast(getText('settings.importSuccess'), 'success');
            } catch (err) {
                showToast(getText('settings.importError'), 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function downloadBackup() {
    localStorage.setItem('valopos_last_backup', Date.now().toString());
    exportData();
    showToast(getText('settings.backupDownloaded'), 'success');
}

function importBackup() {
    importData();
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
        csv += m.id + ',' + escapeHtmlCSV(m.name) + ',' + escapeHtmlCSV(m.scientificName) + ',' + escapeHtmlCSV(m.category) + ',' + m.price + ',' + m.qty + ',' + (m.expiryDate || '') + ',' + (m.barcode || '') + ',' + (m.rx ? getText('inventory.rxYes') : getText('inventory.rxNo')) + '\n';
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

document.getElementById('exportBtn').addEventListener('click', exportData);

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
        document.documentElement.setAttribute('data-theme', 'valopos-dark');
        icons.forEach(function(ic) { if (ic) ic.className = 'fas fa-sun'; });
    }
    function applyTheme(isDark) {
        let html = document.documentElement;
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
                let html = document.documentElement;
                let isDark = html.getAttribute('data-theme') === 'valopos-dark';
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
const paginationState = { inventory: {page:1, perPage:50}, customers: {page:1, perPage:50}, suppliers: {page:1, perPage:50}, purchases: {page:1, perPage:50}, invoices: {page:1, perPage:50} };

function paginate(data, page, perPage) {
    const start = (page-1)*perPage;
    return { items: data.slice(start, start+perPage), total: data.length, page: page, pages: Math.ceil(data.length/perPage) };
}

function renderPagination(containerId, currentPage, totalPages, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    let html = '<div class="pagination-controls">';
    html += '<button class="btn btn-sm" onclick="paginationState.' + containerId.replace('Pagination','') + '.page=1;(' + callback + ')();" ' + (currentPage === 1 ? 'disabled' : '') + '>\u00AB</button>';
    html += '<button class="btn btn-sm" onclick="paginationState.' + containerId.replace('Pagination','') + '.page=' + (currentPage-1) + ';(' + callback + ')();" ' + (currentPage === 1 ? 'disabled' : '') + '>\u2039</button>';
    html += '<span style="margin:0 8px;font-size:13px;">' + currentPage + ' / ' + totalPages + '</span>';
    html += '<button class="btn btn-sm" onclick="paginationState.' + containerId.replace('Pagination','') + '.page=' + (currentPage+1) + ';(' + callback + ')();" ' + (currentPage === totalPages ? 'disabled' : '') + '>\u203A</button>';
    html += '<button class="btn btn-sm" onclick="paginationState.' + containerId.replace('Pagination','') + '.page=' + totalPages + ';(' + callback + ')();" ' + (currentPage === totalPages ? 'disabled' : '') + '>\u00BB</button>';
    html += '</div>';
    container.innerHTML = html;
}

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
    checkBackupReminder();
    if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function(err) {
        console.log('SW registration failed:', err);
    });
}

// ===== AUTH SYSTEM =====
let authData = { password: localStorage.getItem('valopos_auth_pass') || 'admin123', locked: true };

function authLogin() {
    const pass = document.getElementById('authPassword').value.trim();
    const error = document.getElementById('authError');
    if (pass === authData.password) {
        authData.locked = false;
        document.getElementById('authOverlay').style.display = 'none';
        error.textContent = '';
        document.getElementById('authPassword').value = '';
    } else {
        error.textContent = getText('auth.errorWrong');
    }
}

function authChangePassword() {
    const oldPass = document.getElementById('authOldPass').value.trim();
    const newPass = document.getElementById('authNewPass').value.trim();
    const confirmPass = document.getElementById('authConfirmPass').value.trim();
    const error = document.getElementById('authChangeError');
    if (oldPass !== authData.password) { error.textContent = getText('auth.changeErrorWrong'); return; }
    if (newPass.length < 6) { error.textContent = getText('auth.changeErrorLength'); return; }
    if (newPass !== confirmPass) { error.textContent = getText('auth.changeErrorMatch'); return; }
    authData.password = newPass;
    localStorage.setItem('valopos_auth_pass', newPass);
    error.textContent = '';
    document.getElementById('authOldPass').value = '';
    document.getElementById('authNewPass').value = '';
    document.getElementById('authConfirmPass').value = '';
    document.getElementById('changePassForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('authHint').style.display = 'none';
    document.getElementById('authModeBtn').textContent = getText('auth.switchToChange');
    document.getElementById('authPassword').focus();
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
