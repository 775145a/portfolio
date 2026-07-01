// ===== AI SUPPORT CHATBOT KNOWLEDGE BASE =====
var supportKB = {
  'البيع': {
    keywords: ['بيع', 'فاتورة', 'شراء', 'كاشير', 'point of sale', 'pos', 'checkout', 'customer', 'عميل', 'الدفع', 'payment', 'كارت'],
    answer: 'لإنهاء فاتورة بيع:\n1. ابحث عن الدواء بالاسم أو الباركود في حقل البحث\n2. اختر الدواء من القائمة (يضاف تلقائياً للسلة)\n3. كرر حتى إضافة كل الأدوية\n4. أدخل الخصم إن وجد\n5. اختر طريقة الدفع (نقدي/كارت/محفظة)\n6. أدخل المبلغ المدفوع\n7. اضغط "تأكيد البيع"\n\n⌨️ اختصار: F7 للدفع، F8 لفاتورة جديدة'
  },
  'المخزون': {
    keywords: ['مخزون', 'inventory', 'تخزين', 'stock', 'كمية', 'quantity', 'دواء', 'دوية', 'منتج', 'صنف'],
    answer: 'لإدارة المخزون:\n1. اذهب إلى صفحة المخزون (F3)\n2. يمكنك البحث والفلترة حسب التصنيف أو الشركة\n3.双击 أي خلية للتعديل المباشر (الاسم، السعر، الكمية)\n4. استخدم زر "تعديل المخزون" لتغيير كميات دواء معين\n5. تصدير CSV متاح للنسخ الاحتياطي\n\nيمكنك أيضاً فلترة الأدوية في نقطة البيع حسب التصنيف أو الشركة المصنعة.'
  },
  'الباركود': {
    keywords: ['باركود', 'barcode', 'باركود', 'اسكانر', 'scanner', 'barcode scanner', 'مسح'],
    answer: 'يدعم النظام الباركود بثلاث طرق:\n1. ماسح ضوئي USB: يكتب الباركود تلقائياً في حقل البحث\n2. كاميرا الموبايل: استخدم زر 📷 في نقطة البيع\n3. كتابة الرقم يدوياً في حقل البحث\n\nالباركود المصري يبدأ بـ 622. النظام يولّد باركود لكل دواء تلقائياً.\n\nطباعة باركود: من المخزون > زر 🏷️ على أي دواء.'
  },
  'التقارير': {
    keywords: ['تقرير', 'report', 'ربح', 'profit', 'مبيعات', 'sales', 'إحصائيات', 'statistics', 'تحليل'],
    answer: 'صفحة التقارير (F5) توفر:\n- مبيعات اليوم/الأسبوع/الشهر\n- الأرباح (إجمالي - صافي)\n- أفضل الأدوية مبيعاً\n- المصروفات\n- سجل المرتجعات\n- سجل الإقفالات اليومية (الندرة)\n- رسم بياني للربح اليومي (آخر 7 أيام)\n\nيمكن تصدير أي تقرير كـ CSV.'
  },
  'العملاء': {
    keywords: ['عميل', 'customer', 'زبون', 'عملاء', 'customers', 'account', 'حساب'],
    answer: 'إدارة العملاء:\n1. أضف عميل جديد بالاسم ورقم التليفون\n2. سجل مشتريات كل عميل\n3. نظام ولاء (نقاط) يمكن تفعيله من الإعدادات\n4. ديون العملاء متتبعة\n5. يمكن إضافة عميل سريعاً من الفاتورة'
  },
  'الموردين': {
    keywords: ['مورد', 'supplier', 'توريد', 'مشتريات', 'شراء', 'purchase'],
    answer: 'إدارة الموردين:\n1. أضف مورد بالاسم ورقم التليفون\n2. سجل فواتير الشراء من صفحة المشتريات\n3. أدوية الموردين وأسعارهم\n4. أوامر شراء (Purchase Orders) للموردين\n5. تصدير تقارير للموردين'
  },
  'الإعدادات': {
    keywords: ['إعدادات', 'settings', 'ضبط', 'تهيئة', 'config', 'options', 'خيارات'],
    answer: 'من الإعدادات (F10) يمكنك:\n- تغيير اسم الصيدلية والعنوان\n- إدارة المستخدمين (مدير/كاشير/صيدلي)\n- إدارة شركات التأمين\n- نظام النقاط والولاء\n- تخصيص الفاتورة\n- تغيير اللغة (عربي/English)\n- النسخ الاحتياطي\n- إدارة وكلاء الشركات والمندوبين\n- إدارة المستودعات'
  },
  'النسخ الاحتياطي': {
    keywords: ['نسخ', 'backup', 'احتياطي', 'استيراد', 'import', 'export', 'تصدير'],
    answer: 'النسخ الاحتياطي:\n1. اذهب للإعدادات > البيانات والنسخ الاحتياطي\n2. اضغط "تصدير كل البيانات" لتحميل نسخة\n3. للاستيراد، اختر ملف JSON صحيح\n⚠️ تحذير: الاستيراد يحل محل جميع البيانات الحالية!\n\nتظهر آخر نسخة احتياطية وتاريخها.'
  },
  'المستخدمين': {
    keywords: ['مستخدم', 'user', 'admin', 'مدير', 'كاشير', 'صيدلي', 'صلاحيات', 'permissions', 'login', 'تسجيل'],
    answer: 'إدارة المستخدمين:\n- الإعدادات > المستخدمين\n- الأدوار: مدير (كل الصلاحيات)، كاشير (بيع وعملاء فقط)، صيدلي (بيع + مخزون + روشتات)\n- الحساب الافتراضي: admin / admin123\n- يمكن تغيير كلمة المرور من شاشة الدخول'
  },
  'الجدول': {
    keywords: ['جدول', 'schedule', 'مخدرات', 'controlled', 'مقيد', 'صرف'],
    answer: 'يدعم النظام الأدوية المقيدة بالجدول:\n- جدول أول (مخدرات) 🟣\n- جدول ثاني 🟠\n- جدول ثالث 🟡\nعند إضافة دواء مقيد، يظهر تأكيد إضافي. توجد تقارير خاصة للمتابعة.'
  },
  'التأمين': {
    keywords: ['تأمين', 'insurance', 'مطالبات', 'شركة تأمين', 'خصم'],
    answer: 'نظام التأمين:\n1. أضف شركات التأمين من الإعدادات\n2. اختر شركة التأمين في الفاتورة\n3. يطبق الخصم المتفق عليه تلقائياً\n4. تقارير مطالبات التأمين متاحة\n5. يمكن تصدير تقارير التأمين'
  },
  'الطباعة': {
    keywords: ['طباعة', 'print', 'فاتورة', 'receipt', 'طابعة', 'printer', 'حراري', 'thermal'],
    answer: 'الطباعة في ValoPOS:\n- فاتورة بيع: بعد تأكيد الفاتورة تظهر طباعة حرارية\n- باركود: من المخزون > طباعة باركود (يدعم A4 وحراري)\n- يمكن تخصيص رأس وتذييل الفاتورة من الإعدادات\n- مقاسات: 80mm و 58mm\n- ظهور الشعار والضريبة قابل للتخصيص'
  },
  'الاختصارات': {
    keywords: ['اختصار', 'shortcut', 'keyboard', 'كيبورد', 'مفاتيح', 'keys', 'hotkey', 'F1', 'F2', 'F3', 'F4', 'F5'],
    answer: '⌨️ اختصارات لوحة المفاتيح:\nF1 - المساعدة والاختصارات\nF2 - نقطة البيع\nF3 - المخزون\nF4 - العملاء\nF5 - التقارير\nF6 - التركيز على البحث\nF7 - إنهاء الفاتورة\nF8 - فاتورة جديدة\nF9 - التركيز على المبلغ المدفوع\nF10 - الإعدادات\nEsc - إغلاق النوافذ'
  },
  'الضرائب': {
    keywords: ['ضريبة', 'tax', 'vAT', 'ضريبي', 'QR', 'كود', 'الفاتورة الإلكترونية', 'egyptian tax'],
    answer: 'نظام الضرائب:\n- ادخل نسبة الضريبة من الإعدادات\n- تظهر الضريبة تلقائياً في الفاتورة\n- الفاتورة النهائية تحتوي على QR code ضريبي متوافق مع هيئة الضرائب المصرية\n- QR code يحتوي: اسم البائع، رقم التسجيل الضريبي، التاريخ، الإجمالي، الضريبة'
  },
  'المستودعات': {
    keywords: ['مستودع', 'warehouse', 'مخزن', 'تحويل', 'transfer', 'مخازن'],
    answer: 'إدارة المستودعات:\n- أضف مستودعات متعددة\n- حول المخزون بين المستودعات\n- تابع كمية كل صنف في كل مستودع\n- تقارير المخزون لكل مستودع'
  },
  'الوكلاء': {
    keywords: ['وكيل', 'مندوب', 'agent', 'شركة', 'manufacturer', 'company', 'representative'],
    answer: 'وكلاء الشركات والمندوبين:\n- أضف مندوبين لشركات الأدوية\n- سجل بيانات التواصل (تليفون - إيميل)\n- تصدير CSV لبيانات المندوبين\n- الإدارة من الإعدادات > وكلاء الشركات والمندوبين'
  },
  'الربح': {
    keywords: ['ربح', 'profit', 'مكسب', 'هامش', 'margin', 'سعر', 'price', 'تكلفة'],
    answer: 'حساب الأرباح:\n- سجل تكلفة كل دواء عند الشراء\n- الأرباح = سعر البيع - التكلفة\n- تقارير الأرباح اليومية/الشهرية\n- تصدير تقارير الأرباح'
  },
  'المصروفات': {
    keywords: ['مصروف', 'expense', 'إيجار', 'مرتب', 'فاتورة كهرباء', 'مصاريف'],
    answer: 'إدارة المصروفات:\n1. أضف مصروف (إيجار، مرتب، كهرباء، ...)\n2. اختر التصنيف والتاريخ\n3. تقارير المصروفات متاحة\n4. تظهر المصروفات في لوحة التحكم والتقارير'
  },
  'اللغة': {
    keywords: ['لغة', 'language', 'english', 'عربي', 'arabic', 'ترجمة', 'lang'],
    answer: 'يدعم النظام اللغة العربية والإنجليزية بشكل كامل:\n- التبديل من رأس الصفحة (English/عربي)\n- جميع القوائم والتقارير والتنبيهات مترجمة\n- الأسماء العلمية للأدوية بالإنجليزية\n- الأسماء التجارية بالعربية والإنجليزية'
  },
  'الإقفال اليومي': {
    keywords: ['إقفال', 'closing', 'ندرة', 'نهاية اليوم', 'تسوية', 'day close'],
    answer: 'الإقفال اليومي (الندرة):\n1. اذهب للتقارير\n2. اضغط "إقفال اليوم"\n3. سجل المبلغ الفعلي والمتوقع\n4. سجل المصروفات\n5. يحسب الفرق تلقائياً\n6. سجل الإقفالات متاح للرجوع'
  },
  'التثبيت': {
    keywords: ['تثبيت', 'install', 'تحميل', 'download', 'app', 'تطبيق', 'pwa', 'install app'],
    answer: 'تثبيت التطبيق:\n1. من متصفح Chrome/Edge على الكمبيوتر أو الموبايل\n2. اضغط على زر التثبيت في شريط العنوان\n3. أو من القائمة > تثبيت التطبيق\n4. سيشتغل بشكل كامل بدون إنترنت (بعد تحميل البيانات)\n\nيدعم Screen Lock (قفل الشاشة) للأمان.'
  },
  'القفل': {
    keywords: ['قفل', 'lock', 'screen lock', 'أمان', 'security', 'screen'],
    answer: 'ميزة قفل الشاشة:\n- اضغط على زر القفل 🔒 في رأس الصفحة\n- يتم قفل النظام لحين إدخال كلمة المرور\n- مثالية للحفاظ على أمان الصيدلية عند الابتعاد'
  },
  'الروشتات': {
    keywords: ['روشتة', 'prescription', 'وصفة', 'method', 'صرف'],
    answer: 'نظام الروشتات:\n- أضف روشتة برقم المريض والأدوية\n- تسجيل الجرعات والتعليمات\n- طباعة الروشتة\n- سجل الروشتات المصروفة'
  },
  'المرتجعات': {
    keywords: ['مرتجع', 'return', 'استرجاع', 'مرتجعات', 'مرتجع'],
    answer: 'المرتجعات:\n1. اذهب للتقارير > سجل المرتجعات\n2. سجل مرتجع دواء مع ذكر السبب\n3. يخصم تلقائياً من مبيعات اليوم\n4. تقارير المرتجعات متاحة'
  },
  'السحابة': {
    keywords: ['سحابة', 'cloud', 'sync', 'مزامنة', 'server', 'api', 'backup'],
    answer: 'المزامنة السحابية:\n- يقوم النظام بحفظ البيانات تلقائياً على السحابة\n- يمكن استعادة البيانات من أي جهاز\n- المزامنة تلقائية عند الاتصال بالإنترنت\n- تشفير البيانات قبل الإرسال\n\nتأكد من تشغيل الخادم (server.js) للمزامنة.'
  }
};

var supportCategories = [
  { name: '💰 البيع والفواتير', key: 'البيع' },
  { name: '📦 المخزون', key: 'المخزون' },
  { name: '🏷️ الباركود', key: 'الباركود' },
  { name: '📊 التقارير', key: 'التقارير' },
  { name: '👥 العملاء', key: 'العملاء' },
  { name: '🚚 الموردين', key: 'الموردين' },
  { name: '⚙️ الإعدادات', key: 'الإعدادات' },
  { name: '💾 النسخ الاحتياطي', key: 'النسخ الاحتياطي' },
  { name: '👤 المستخدمين', key: 'المستخدمين' },
  { name: '🔒 الجدول والمخدرات', key: 'الجدول' },
  { name: '🏥 التأمين', key: 'التأمين' },
  { name: '🖨️ الطباعة', key: 'الطباعة' },
  { name: '⌨️ الاختصارات', key: 'الاختصارات' },
  { name: '🧾 الضرائب و QR', key: 'الضرائب' },
  { name: '🏢 المستودعات', key: 'المستودعات' },
  { name: '🤝 الوكلاء والمندوبين', key: 'الوكلاء' },
  { name: '💵 الربح', key: 'الربح' },
  { name: '📋 المصروفات', key: 'المصروفات' },
  { name: '🌐 اللغة', key: 'اللغة' },
  { name: '🔐 الإقفال اليومي', key: 'الإقفال اليومي' },
  { name: '📱 التثبيت', key: 'التثبيت' },
  { name: '🔒 قفل الشاشة', key: 'القفل' },
  { name: '📝 الروشتات', key: 'الروشتات' },
  { name: '↩️ المرتجعات', key: 'المرتجعات' },
  { name: '☁️ السحابة', key: 'السحابة' }
];

var supportChatOpen = false;
var supportContext = [];

function toggleSupportChat() {
  var chat = document.getElementById('supportChat');
  var btn = document.getElementById('supportFloat');
  if (!chat) return;
  supportChatOpen = !supportChatOpen;
  chat.style.display = supportChatOpen ? 'flex' : 'none';
  if (supportChatOpen) {
    setTimeout(function() {
      var input = document.getElementById('supportInput');
      if (input) input.focus();
    }, 300);
  }
}

function addSupportMessage(text, isBot) {
  var msgs = document.getElementById('supportMessages');
  if (!msgs) return;
  var div = document.createElement('div');
  div.className = 'support-msg ' + (isBot ? 'support-msg-bot' : 'support-msg-user');
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addSupportHTML(html, isBot) {
  var msgs = document.getElementById('supportMessages');
  if (!msgs) return;
  var div = document.createElement('div');
  div.className = 'support-msg ' + (isBot ? 'support-msg-bot' : 'support-msg-user');
  div.innerHTML = html;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function sendSupportMessage() {
  var input = document.getElementById('supportInput');
  if (!input) return;
  var text = input.value.trim();
  if (!text) return;
  addSupportMessage(text, false);
  input.value = '';
  supportContext.push({ role: 'user', content: text });
  setTimeout(function() {
    var response = getSupportResponse(text);
    addSupportMessage(response, true);
    supportContext.push({ role: 'bot', content: response });
  }, 300 + Math.random() * 400);
}

function getSupportResponse(query) {
  var q = query.toLowerCase().trim();

  if (q.includes('السلام') || q.includes('مرحبا') || q.includes('hi') || q.includes('hello') || q.includes('salem')) {
    return 'وعليكم السلام! 👋 أنا مساعد ValoPOS الذكي. اسألني عن أي ميزة في النظام:\n- البيع والفواتير\n- المخزون\n- الباركود\n- التقارير\n- العملاء\n- الإعدادات\n... أو اكتب "تصنيفات" لرؤية كل المواضيع.';
  }

  if (q.includes('شكر') || q.includes('thanks') || q.includes('thank')) {
    return 'العفو! 😊 لو عندك أي سؤال تاني، أنا موجود.';

  }

  if (q.includes('تصنيف') || q.includes('category') || q.includes('categories') || q.includes('موضوع') || q.includes('ايه') && q.includes('تقدر')) {
    var html = 'إليك تصنيفات المساعدة:<br><br>';
    for (var i = 0; i < supportCategories.length; i++) {
      html += '• ' + supportCategories[i].name + '<br>';
    }
    html += '<br>اكتب اسم التصنيف أو سؤالك للمساعدة.';
    return html;
  }

  if (q.includes('خطأ') || q.includes('error') || q.includes('مشكلة') || q.includes('bug') || q.includes('مش') && q.includes('شغال') || q.includes('لا يعمل')) {
    return 'عذراً على المشكلة! 🤔 جرب:\n1. تحديث الصفحة (F5)\n2. مسح ذاكرة التخزين المؤقت (Ctrl+F5)\n3. تأكد من اتصال الإنترنت\n\nلو المشكلة مستمرة، وصفها بالتفصيل:\n- إيه اللي كنت تحاول تعمله؟\n- إيه الظبط اللي ظهر؟\n- في أي صفحة؟';
  }

  if (q.includes('تحديث') || q.includes('update') || q.includes('version') || q.includes('إصدار') || q.includes('جديد')) {
    return 'آخر تحديث: 1 يوليو 2026 ✅\nالإصدار: ValoPOS v1.0\n\nالمميزات الحديثة:\n- 🔍 Fuzzy Search (Fuse.js)\n- 🏭 فلتر شركات في البيع\n- 👥 وكلاء ومندوبين\n- ⌨️ اختصارات لوحة مفاتيح (F1-F10)\n- 🧾 QR ضريبي\n- 🤖 نظام الدعم الذكي';
  }

  if (q.includes('سعر') || q.includes('price') || q.includes('كام') || q.includes('بكام') || q.includes('ثمن')) {
    return 'أسعار الأدوية محدثة من هيئة الدواء المصرية (آخر تحديث مايو 2026).\n\nللبحث عن دواء:\n1. اذهب لنقطة البيع (F2)\n2. اكتب اسم الدواء\n3. يظهر السعر الحالي\n\nيمكن تعديل الأسعار من:\n- المخزون (双击 السعر للتعديل)\n- زر "تحديث الأسعار" (تغيير بنسبة مئوية)';
  }

  var bestKey = null;
  var bestScore = 0;

  for (var key in supportKB) {
    var entry = supportKB[key];
    var score = 0;
    for (var k = 0; k < entry.keywords.length; k++) {
      var kw = entry.keywords[k].toLowerCase();
      if (q.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  if (bestKey && bestScore > 2) {
    return supportKB[bestKey].answer;
  }

  // If no match, try to find partial matches
  for (var key2 in supportKB) {
    if (q.includes(key2.toLowerCase())) {
      return supportKB[key2].answer;
    }
  }

  // Show categories as fallback
  return 'لم أفهم السؤال تماماً 🤔\n\nاختر موضوعاً للمساعدة:\n' + supportCategories.map(function(c) { return '• ' + c.name; }).join('\n') + '\n\nأو اكتب سؤالك بطريقة أخرى.';
}

function showSupportCategories() {
  var html = '📋 تصنيفات المساعدة:<br><br>';
  for (var i = 0; i < supportCategories.length; i++) {
    html += '• ' + supportCategories[i].name + '<br>';
  }
  html += '<br>اكتب اسم التصنيف للمساعدة.';
  addSupportHTML(html, true);
}

function clearSupportChat() {
  var msgs = document.getElementById('supportMessages');
  if (msgs) {
    msgs.innerHTML = '<div class="support-msg support-msg-bot">👋 مرحباً! أنا مساعد ValoPOS الذكي. اسألني عن أي ميزة أو مشكلة في النظام.</div>';
  }
  supportContext = [];
}
