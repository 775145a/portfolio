// Build medicines.js from Egyptian drugs CSV
// Maps: drug_class -> Arabic categories, generates barcodes, assigns IDs

const fs = require('fs');
const path = require('path');

// Read CSV
const csv = fs.readFileSync(path.join(__dirname, 'egyptian-drugs.csv'), 'utf8');
const lines = csv.trim().split('\n');
const header = lines[0].split(',');
console.log('Header:', header);
console.log('Total records:', lines.length - 1);

// Parse CSV
const records = [];
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  if (parts.length >= 7) {
    // Remove trailing \r from last field
    let priceStr = parts[6].replace(/\r$/, '').trim();
    records.push({
      nameEn: parts[0].trim(),
      nameAr: parts[1].trim(),
      scientificName: parts[2].trim(),
      manufacturer: parts[3].trim(),
      drugClass: parts[4].trim(),
      route: parts[5].trim(),
      price: parseFloat(priceStr) || 0
    });
  }
}
console.log('Parsed records:', records.length);

// Drug class -> Arabic category mapping (prefix-based)
// Keys are matched as prefixes (case-insensitive): exact match first, 
// then prefix with '.' or ' ' separator, then prefix match fallback
const categoryRules = [
  // ===== جلد (Skin) =====
  ['SKIN', 'جلد'],
  ['ANTIFUNGAL', 'جلد'],
  ['ANTIFUNGALS', 'جلد'],
  ['ANTI-ACNE', 'جلد'],
  ['ANTI-AGING', 'جلد'],
  ['ANTI-WRINKLE', 'جلد'],
  ['ANTI-DANDRUFF', 'شعر'],
  ['ACNE', 'جلد'],
  ['LICE', 'جلد'],
  ['BURN', 'جلد'],
  ['BURNS', 'جلد'],
  ['WOUND', 'جلد'],
  ['SCAR', 'جلد'],
  ['ANTISCAR', 'جلد'],
  ['HEALING', 'جلد'],
  ['WHITENING', 'جلد'],
  ['MOISTURIZING', 'جلد'],
  ['MOISTURISING', 'جلد'],
  ['MOISTURIZER', 'جلد'],
  ['SUN', 'جلد'],
  ['SUNSCREEN', 'جلد'],
  ['SUNBLOCK', 'جلد'],
  ['COLLAGEN', 'جلد'],
  ['HYALURONIC', 'جلد'],
  ['PANTHENOL', 'جلد'],
  ['CLEANSER', 'جلد'],
  ['PSORIASIS', 'جلد'],
  ['SCABICIDE', 'جلد'],
  ['HAEMORRHOIDS', 'جلد'],
  ['HEMORRHOIDS', 'جلد'],
  ['PILES', 'جلد'],
  ['ANAL', 'جلد'],
  ['TOPICAL', 'جلد'],
  ['SOOTHING', 'جلد'],
  ['GEL', 'جلد'],
  ['CREAM', 'جلد'],
  ['OINTMENT', 'جلد'],
  ['LOTION', 'جلد'],
  ['SERUM', 'جلد'],
  ['OIL', 'جلد'],
  ['POWDER', 'جلد'],
  ['SPRAY', 'جلد'],
  ['FOOT', 'جلد'],
  ['NAIL', 'جلد'],
  ['LIP', 'جلد'],
  ['LIPS', 'جلد'],
  ['FACIAL', 'جلد'],
  ['FACE', 'جلد'],
  ['BODY', 'جلد'],
  ['HAND', 'جلد'],
  ['MASSAGE', 'عناية'],
  ['SOAP', 'عناية'],

  // ===== فيتامينات (Vitamins) =====
  ['MULTIVITAMIN', 'فيتامينات'],
  ['VITAMIN', 'فيتامينات'],
  ['IRON', 'فيتامينات'],
  ['CALCIUM', 'فيتامينات'],
  ['MAGNESIUM', 'فيتامينات'],
  ['ZINC', 'فيتامينات'],
  ['OMEGA', 'فيتامينات'],
  ['ANTIOXIDANT', 'فيتامينات'],
  ['ANTI-OXIDANT', 'فيتامينات'],
  ['ANEMIA', 'فيتامينات'],
  ['FOLIC', 'فيتامينات'],
  ['FOLATE', 'فيتامينات'],
  ['FOLICO', 'فيتامينات'],
  ['HEMATINIC', 'فيتامينات'],
  ['HAEMATINIC', 'فيتامينات'],
  ['HAEMATINICS', 'فيتامينات'],
  ['HEMATOPOIETIC', 'فيتامينات'],
  ['LIPOSOMAL', 'فيتامينات'],
  ['MINERALS', 'فيتامينات'],
  ['SUPPLEMENT', 'فيتامينات'],
  ['IMMUNITY', 'فيتامينات'],

  // ===== مسكنات (Analgesics) =====
  ['NSAID', 'مسكنات'],
  ['ANALGESIC', 'مسكنات'],
  ['ANTIPYRETIC', 'مسكنات'],
  ['OPIOID', 'مسكنات'],
  ['ANTI-INFLAMMATORY', 'مسكنات'],
  ['ANTIINFLAMMATORY', 'مسكنات'],
  ['MUSCLE', 'مسكنات'],
  ['PROTEOLYTIC', 'مسكنات'],

  // ===== مضادات حيوية (Antibiotics) =====
  ['ANTIBIOTIC', 'مضادات حيوية'],
  ['PENICILLINS', 'مضادات حيوية'],
  ['AMINOGLYCOSIDE', 'مضادات حيوية'],
  ['ANTIMALARIAL', 'مضادات حيوية'],
  ['ANTITUBERCULAR', 'مضادات حيوية'],
  ['ANTIPROTOZOAL', 'مضادات حيوية'],

  // ===== قلب (Heart) =====
  ['ANTIHYPERLIPIDEMIC', 'قلب'],
  ['ANTIHYPERLIPIDEMIA', 'قلب'],
  ['ANTI-ISCHEMIC', 'قلب'],
  ['CARDIOTONIC', 'قلب'],
  ['CARDIAC', 'قلب'],
  ['HEART', 'قلب'],
  ['ANTIARRHYTHMIAS', 'قلب'],
  ['ANTIANGINAL', 'قلب'],
  ['ANTI-ANGINAL', 'قلب'],
  ['ANTIANGINA', 'قلب'],
  ['VASODILATOR', 'قلب'],
  ['VASOACTIVE', 'قلب'],
  ['VASOPROTECTIVE', 'قلب'],
  ['VASOPROTECTOR', 'قلب'],
  ['VEINOTONIC', 'قلب'],
  ['VENOTONIC', 'قلب'],
  ['VASCULAR', 'قلب'],
  ['HYPOLIPIDEMIC', 'قلب'],
  ['STATINS', 'قلب'],
  ['CHOLESTEROL', 'قلب'],
  ['BETA', 'قلب'],
  ['ALPHA', 'قلب'],
  ['DIURETIC', 'قلب'],
  ['DIURETICS', 'قلب'],

  // ===== ضغط (Blood Pressure) =====
  ['ANTI-HYPERTENSIVE', 'ضغط'],
  ['ANTIHYPERTENSIVE', 'ضغط'],
  ['ANTIHYPOGLYCEMIC', 'سكر'],
  ['ALPHA1', 'ضغط'],

  // ===== سكر (Diabetes) =====
  ['ANTI-DIABETIC', 'سكر'],
  ['ANTIDIABETIC', 'سكر'],
  ['DIABETIC', 'سكر'],

  // ===== أعصاب (Neurology) =====
  ['ANTI-EPILEPTIC', 'أعصاب'],
  ['CEREBRAL', 'أعصاب'],
  ['CNS', 'أعصاب'],
  ['DOPAMINE', 'أعصاب'],
  ['PARKINSON', 'أعصاب'],
  ['ALZHEIMER', 'أعصاب'],
  ['ANTIMIGRAINE', 'أعصاب'],
  ['MIGRAINE', 'أعصاب'],
  ['ANTIVERTIGO', 'أعصاب'],
  ['NOOTROPIC', 'أعصاب'],
  ['NEUROPATHIC', 'أعصاب'],
  ['NEUROPROTECTIVE', 'أعصاب'],
  ['NEUROTONIC', 'أعصاب'],
  ['NERVE', 'أعصاب'],
  ['BRAIN', 'أعصاب'],
  ['MEMORY', 'أعصاب'],
  ['COGNITIVE', 'أعصاب'],
  ['SLEEP', 'أعصاب'],

  // ===== معدة (Stomach/Digestive) =====
  ['PEPTIC', 'معدة'],
  ['ANTACID', 'معدة'],
  ['GIT', 'معدة'],
  ['DIGESTIVE', 'معدة'],
  ['DIGESTANT', 'معدة'],
  ['ANTIEMETIC', 'معدة'],
  ['ANTISPASMODIC', 'معدة'],
  ['ANTIDIARRHOEAL', 'معدة'],
  ['ANTHELMINTIC', 'معدة'],
  ['ANTHELMENTIC', 'معدة'],
  ['ANTIHELMINTHIC', 'معدة'],
  ['ANTIPROTOZOAL', 'معدة'],
  ['ANTIFLATULENT', 'معدة'],
  ['ANTIFLATULANCE', 'معدة'],
  ['ANTIFLATULANT', 'معدة'],
  ['CARMINATIVE', 'معدة'],
  ['CHOLERETIC', 'معدة'],
  ['MOTILITY', 'معدة'],
  ['PROKINETIC', 'معدة'],
  ['LAXATIVE', 'معدة'],
  ['LIVER', 'معدة'],
  ['LACTOSE', 'معدة'],
  ['ENZYME', 'معدة'],
  ['PROBIOTIC', 'معدة'],
  ['TRAVELERS', 'معدة'],

  // ===== هرمونات (Hormones) =====
  ['GLUCOCORTICOID', 'هرمونات'],
  ['CORTICOSTEROID', 'هرمونات'],
  ['STEROIDAL', 'هرمونات'],
  ['HORMONE', 'هرمونات'],
  ['HORMONAL', 'هرمونات'],
  ['ANDROGEN', 'هرمونات'],
  ['THYROID', 'غدة درقية'],

  // ===== برد وكحة (Cold & Cough) =====
  ['COLD', 'برد وكحة'],
  ['COUGH', 'برد وكحة'],
  ['MUCOLYTIC', 'برد وكحة'],
  ['DECONGESTANT', 'برد وكحة'],
  ['ANTI-COUGH', 'برد وكحة'],

  // ===== ربو (Asthma) =====
  ['ASTHMA', 'ربو'],
  ['BRONCHODILATOR', 'ربو'],
  ['RESPIRATORY', 'ربو'],

  // ===== نفسية (Psychiatric) =====
  ['PSYCHIATRIC', 'نفسية'],
  ['ANTIDEPRESSANT', 'نفسية'],
  ['ANTIPSYCHOTIC', 'نفسية'],
  ['ANTIPSYCHOTICS', 'نفسية'],
  ['ANXIOLYTIC', 'نفسية'],

  // ===== حساسية (Allergy) =====
  ['ANTI-HISTAMINE', 'حساسية'],
  ['ANTIALLERGIC', 'حساسية'],
  ['ALLERGY', 'حساسية'],

  // ===== نسائية (Gynecology) =====
  ['VAGINAL', 'نسائية'],
  ['INFERTILITY', 'نسائية'],
  ['FERTILITY', 'نسائية'],
  ['CONTRACEPTION', 'نسائية'],
  ['CONTRACEPTIVE', 'نسائية'],
  ['CONTRACEPTIVES', 'نسائية'],
  ['UTERINE', 'نسائية'],
  ['PROGESTERONE', 'نسائية'],
  ['ESTROGEN', 'نسائية'],
  ['MENOPAUSAL', 'نسائية'],
  ['FEMALE', 'نسائية'],
  ['FEMININE', 'نسائية'],
  ['GYNECOLOGY', 'نسائية'],
  ['GYNAECOLOGY', 'نسائية'],
  ['LABOUR', 'نسائية'],
  ['LABOR', 'نسائية'],
  ['LACTATION', 'نسائية'],
  ['BREASTFEEDING', 'نسائية'],
  ['LACTAGOGUE', 'نسائية'],
  ['LACTOGOGUE', 'نسائية'],

  // ===== أورام (Oncology) =====
  ['ANTINEOPLASTIC', 'أورام'],

  // ===== شعر (Hair) =====
  ['HAIR', 'شعر'],
  ['SHAMPOO', 'شعر'],
  ['HAIRTONIC', 'شعر'],

  // ===== قطرة (Eye/Ear Drops) =====
  ['EYE', 'قطرة'],
  ['EAR', 'قطرة'],
  ['OTIC', 'قطرة'],
  ['OPHTHALMIC', 'قطرة'],
  ['CONTACT', 'قطرة'],
  ['INTRAOCULAR', 'قطرة'],
  ['MYDRIATIC', 'قطرة'],
  ['ANTIGLAUCOMA', 'قطرة'],
  ['GLAUCOMA', 'قطرة'],

  // ===== محاليل (Solutions/Fluids) =====
  ['STERILE', 'محاليل'],
  ['SALINE', 'محاليل'],
  ['RINGER', 'محاليل'],
  ['ELECTROLYTE', 'محاليل'],
  ['IRRIGATION', 'محاليل'],
  ['PLASMA', 'محاليل'],
  ['PARENTERAL', 'محاليل'],
  ['PARENTRAL', 'محاليل'],

  // ===== مضادات فيروسية (Antivirals) =====
  ['ANTI-VIRAL', 'مضادات فيروسية'],
  ['ANTIVIRAL', 'مضادات فيروسية'],
  ['ANTIRETROVIRAL', 'مضادات فيروسية'],
  ['HEPATITIS', 'مضادات فيروسية'],

  // ===== مضادات تخثر (Anticoagulants) =====
  ['ANTICOAGULANT', 'مضادات تخثر'],
  ['ANTIPLATELET', 'مضادات تخثر'],
  ['ANTIPLATLET', 'مضادات تخثر'],
  ['ANTITHROMBOTIC', 'مضادات تخثر'],
  ['BLEEDDING', 'مضادات تخثر'],
  ['BLOOD-COAGULATION', 'مضادات تخثر'],

  // ===== روماتيزم (Rheumatology) =====
  ['ANTI-RHEUMATIC', 'روماتيزم'],
  ['ANTIRHEUMATIC', 'روماتيزم'],
  ['ANTIGOUT', 'روماتيزم'],
  ['ARTHRITIS', 'روماتيزم'],

  // ===== عظام (Bones) =====
  ['OSTEOPOROSIS', 'عظام'],
  ['BONE', 'عظام'],
  ['JOINT', 'عظام'],
  ['CHONDROPROTECTIVE', 'عظام'],
  ['CONDROPROTECTIVE', 'عظام'],
  ['OSTEOARTHRITIS', 'عظام'],

  // ===== مسالك بولية (Urinary) =====
  ['SEXUAL', 'مسالك بولية'],
  ['URINARY', 'مسالك بولية'],
  ['URGE', 'مسالك بولية'],
  ['OVERACTIVE', 'مسالك بولية'],
  ['UTI', 'مسالك بولية'],
  ['ENURESIS', 'مسالك بولية'],
  ['PROSTATE', 'مسالك بولية'],
  ['KIDNEY', 'مسالك بولية'],
  ['NEPHROLITHIASIS', 'مسالك بولية'],
  ['UROLITHIAC', 'مسالك بولية'],
  ['ANTI-MUSCARINIC', 'مسالك بولية'],
  ['PREMATURE', 'مسالك بولية'],

  // ===== فم (Dental/Oral) =====
  ['ORAL', 'فم'],
  ['MOUTH', 'فم'],
  ['DENTAL', 'فم'],
  ['MOUTHWASH', 'فم'],
  ['TOOTH', 'فم'],
  ['LOZENGES', 'فم'],

  // ===== أطفال (Pediatric) =====
  ['BABY', 'أطفال'],
  ['INFANT', 'أطفال'],
  ['APPETIZER', 'أطفال'],
  ['DIAPER', 'أطفال'],
  ['MILK', 'أطفال'],
  ['ORS', 'أطفال'],

  // ===== تغذية (Nutrition) =====
  ['DIETARY', 'تغذية'],
  ['DIET', 'تغذية'],
  ['WEIGHT', 'تغذية'],
  ['SWEETENER', 'تغذية'],
  ['DRINKS', 'تغذية'],
  ['FOOD', 'تغذية'],
  ['PROTEIN', 'تغذية'],
  ['NUTRITIVE', 'تغذية'],

  // ===== مطهرات (Antiseptics) =====
  ['ANTISEPTIC', 'مطهرات'],

  // ===== مناعية (Immunology) =====
  ['IMMUNOSUPPRESSANT', 'مناعية'],
  ['IMMUNOSUPPRESSIVE', 'مناعية'],
  ['IMMUNOSUPPRESSANTS', 'مناعية'],
  ['IMMUNOGLOBULIN', 'مناعية'],
  ['IMMUNOMODULATOR', 'مناعية'],
  ['IMMUNOSTIMULANT', 'مناعية'],
  ['IMMUNE', 'مناعية'],
  ['VACCINE', 'مناعية'],

  // ===== أنف (Nasal) =====
  ['NASAL', 'أنف'],
];

// Build lookup structures
// 1. Exact match map
const catExact = {};
categoryRules.forEach(function(r) { catExact[r[0]] = r[1]; });
// 2. Prefix match list (longest first for priority)
const catPrefix = categoryRules.slice().sort(function(a,b) { return b[0].length - a[0].length; });
// 3. Special multi-word direct matches for compound classes that aren't caught by prefix
const catDirect = {
  'ANTI-ISCHEMIC': 'قلب',
  'IMMUNOSUPPRESSANT': 'مناعية',
  'WHITENING TOPICAL': 'جلد',
  'HEALING TOPICAL': 'جلد',
  'SOOTHING TOPICAL': 'جلد',
  'MASSAGE CREAM': 'عناية',
  'MASSAGE GEL': 'عناية',
  'DIETARY SUPPLEMENT': 'تغذية',
  'IRON SUPPLEMENT': 'فيتامينات',
  'CALCIUM SUPPLEMENT': 'فيتامينات',
  'SEXUAL TONIC': 'مسالك بولية',
  'ORAL CARE': 'فم',
  'VAGINAL CARE': 'نسائية',
  'VAGINAL WASH': 'نسائية',
  'SUN BLOCK': 'جلد',
  'FIRMING TOPICAL': 'جلد',
  'NORMAL SALINE': 'محاليل',
  'SORE THROAT': 'برد وكحة',
  'ULCERATIVE COLITIS': 'معدة',
  'MULTI VITAMIN': 'فيتامينات',
  'MULTI-VITAMINS.COMINATION': 'فيتامينات',
  'MULTI-VITAMINS.COMBINATION': 'فيتامينات',
  'MULTIVITAMINS': 'فيتامينات',
  'OSMOTIC DIURETIC': 'قلب',
  'BLOOD CIRCULATION INHANCER': 'قلب',
  'ATTENTION-DEFICIT HYPERACTIVITY DISORDER': 'أعصاب',
  'ATTENTION DEFICIT HYPERACTIVITY DISORDER': 'أعصاب',
  'LUBRICANT': 'عناية',
  'URINATION-DIFFICULTY.ALPHA BLOCKER': 'مسالك بولية',
  'MANAGEMENT OF NEUROPATHIC PAIN': 'أعصاب',
  'TABLET FOR NEUROPATHIC PAIN': 'أعصاب',
  'LEUKOTRIENE D4 AND E4 ANTAGONIST': 'ربو',
  'GRANULOCYTE COLONY-STIMULATING FACTOR (G-CSF)': 'مناعية',
  'ANTI-FUNGAL': 'جلد',
  'CHOCOLATE-FLAVORED CANDY': 'تغذية',
  'GENERAL ANESTHETIC': 'متنوع',
  'RADIOGRAPHIC PROCEDURES.CONTRAST AGENT': 'متنوع',
};

function mapCategory(drugClass) {
  var dc = drugClass.toUpperCase().trim();
  if (!dc || dc === '.') return 'متنوع';
  
  // Direct match
  if (catDirect[dc]) return catDirect[dc];
  
  // Exact match
  if (catExact[dc]) return catExact[dc];
  
  // Prefix match (check if drugClass starts with prefix + '.' or prefix + ' ')
  for (var i = 0; i < catPrefix.length; i++) {
    var prefix = catPrefix[i][0];
    var cat = catPrefix[i][1];
    if (dc === prefix || dc.startsWith(prefix + '.') || dc.startsWith(prefix + ' ') || dc.startsWith(prefix + '-')) {
      return cat;
    }
  }
  
  // Substring match
  for (var j = 0; j < catPrefix.length; j++) {
    var p = catPrefix[j][0];
    var c = catPrefix[j][1];
    if (dc.indexOf(p) === 0 || dc.indexOf(p + '.') >= 0 || dc.indexOf(p + ' ') >= 0 || dc.indexOf(' ' + p) >= 0) {
      return c;
    }
  }
  
  return 'متنوع';
}

// Check if a drug class requires prescription
function isRx(drugClass) {
  var dc = drugClass.toUpperCase().trim();
  if (!dc || dc === '.') return false;
  var rxPrefixes = ['ANTIBIOTIC', 'PSYCHIATRIC', 'ANTI-HYPERTENSIVE', 'ANTI-DIABETIC',
    'ANTI-EPILEPTIC', 'ANTINEOPLASTIC', 'PENICILLINS', 'ANTICOAGULANT',
    'ANTIDEPRESSANT', 'ANTIPSYCHOTIC', 'ANTIARRHYTHMIAS', 'ANTIHYPERLIPIDEMIC',
    'IMMUNOSUPPRESSANT', 'IMMUNOSUPPRESSIVE', 'IMMUNOGLOBULIN', 'IMMUNOMODULATOR',
    'CORTICOSTEROID', 'STEROIDAL', 'HORMONE', 'HORMONAL', 'ANDROGEN',
    'PROGESTERONE', 'ESTROGEN', 'OPIOID', 'ANTIMALARIAL', 'ANTITUBERCULAR',
    'ANTIRETROVIRAL', 'ANTIVIRAL', 'ANTI-VIRAL', 'HEPATITIS', 'THYROID',
    'PARKINSON', 'ALZHEIMER', 'ANTIMIGRAINE', 'ANTIGOUT', 'ANTIGLAUCOMA',
    'GLAUCOMA', 'ANTIDIABETIC', 'ANTIHYPOGLYCEMIC', 'CARDIOTONIC',
    'ANTIARRHYTHMIAS', 'ANTICOAGULANT', 'ANTIPLATLET', 'ANTIPLATELET',
    'ANTITHROMBOTIC', 'AMINOGLYCOSIDE', 'ANTIFUNGAL', 'ANTIFUNGALS',
    'ANTIPROTOZOAL', 'ANTHELMINTIC', 'ANTI-RHEUMATIC', 'ANTIRHEUMATIC',
    'DIABETIC', 'ANTIDIABETIC', 'ANTIPSYCHOTICS', 'ANTINEOPLASTIC',
    'ANTIEPILEPTIC', 'ANESTHETIC', 'ANTI-HISTAMINE'];
  for (var i = 0; i < rxPrefixes.length; i++) {
    var p = rxPrefixes[i];
    if (dc === p || dc.startsWith(p + '.') || dc.startsWith(p + ' ')) return true;
  }
  return false;
}
// Check digit calculation (EAN-13)
function calcCheckDigit(code12) {
  var sum = 0;
  for (var i = 0; i < 12; i++) {
    var d = parseInt(code12[i]) || 0;
    sum += (i % 2 === 0) ? d * 3 : d;
  }
  var check = (10 - (sum % 10)) % 10;
  return check;
}

// Generate unique IDs and barcodes
var id = 1;
const usedBarcodes = new Set();

function generateBarcode(numericId) {
  // Egyptian GS1 prefix: 622
  // Format: 622 + 9-digit zero-padded ID + check digit
  var idStr = String(numericId).padStart(9, '0');
  var code12 = '622' + idStr;
  var check = calcCheckDigit(code12);
  var barcode = code12 + check;
  return barcode;
}

// Arabic name cleanup
function cleanArabicName(name) {
  // Remove garbage characters that look like truncated UTF-8
  var cleaned = name.replace(/[O�U�\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  // If after cleaning, name is empty or too short, fall back to English name
  if (!cleaned || cleaned.length < 2) return null;
  return cleaned.trim();
}

// Build the output
var output = '// ==========================================\n';
output += '// قاعدة بيانات الأدوية المصرية الشاملة\n';
output += '// آخر تحديث: 30 يونيو 2026\n';
output += '// المصدر: هيئة الدواء المصرية + karem505/egyptian-drug-database\n';
output += '// إجمالي الأدوية: ' + records.length + '\n';
output += '// ==========================================\n\n';
output += 'const medicinesDB = [\n';

var count = 0;
var skipped = 0;

records.forEach(function(rec) {
  var arabicName = cleanArabicName(rec.nameAr);
  if (!arabicName) {
    arabicName = rec.nameEn;
  }
  
  var category = mapCategory(rec.drugClass);
  var rx = isRx(rec.drugClass);
  var barcode = generateBarcode(count + 1);
  
  // Escape single quotes in strings
  var safeName = arabicName.replace(/'/g, "\\'");
  var safeNameEn = rec.nameEn.replace(/'/g, "\\'");
  var safeScientific = rec.scientificName.replace(/'/g, "\\'");
  var safeMfr = rec.manufacturer.replace(/'/g, "\\'");
  
  // Build compact record
  output += '  {id:' + (count + 1) + ',n:\'' + safeName + '\',e:\'' + safeNameEn + '\',s:\'' + safeScientific + '\',m:\'' + safeMfr + '\',c:\'' + category + '\',dc:\'' + rec.drugClass + '\',r:\'' + rec.route + '\',p:' + rec.price + ',b:\'' + barcode + '\',rx:' + rx + '},\n';
  
  count++;
});

output += '];\n\n';

// Helper functions (optimized for large dataset)
output += `
// ===== دوال مساعدة سريعة للبحث =====
const medIndexById = {};
medicinesDB.forEach(function(m) { medIndexById[m.id] = m; });

function searchMedicines(query) {
  query = query.toLowerCase().trim();
  if (!query) return [];
  return medicinesDB.filter(function(m) {
    return m.n.toLowerCase().includes(query) ||
      m.e.toLowerCase().includes(query) ||
      (m.s && m.s.toLowerCase().includes(query)) ||
      (m.b && m.b.includes(query)) ||
      (m.c && m.c.toLowerCase().includes(query));
  }).slice(0, 50);
}

function getMedicinesByCategory(category) {
  if (!category || category === 'الكل') return medicinesDB.slice(0, 200);
  return medicinesDB.filter(function(m) { return m.c === category; }).slice(0, 200);
}

function getMedicineById(id) {
  return medIndexById[id] || null;
}

function getCategories() {
  var cats = {};
  medicinesDB.forEach(function(m) { if (m.c) cats[m.c] = true; });
  return Object.keys(cats).sort();
}

function getStockStatus(m) {
  // Stock status is now determined from stock levels, use this as fallback
  return 'غير متوفر';
}
`;

fs.writeFileSync(path.join(__dirname, 'js', 'medicines.js'), output, 'utf8');
console.log('Generated medicines.js with ' + count + ' records');
console.log('Skipped:', skipped);

// Print some stats
var cats = {};
var rxCount = 0;
records.forEach(function(rec) {
  var cat = mapCategory(rec.drugClass);
  cats[cat] = (cats[cat] || 0) + 1;
  if (isRx(rec.drugClass)) rxCount++;
});
console.log('\nCategory distribution:');
Object.keys(cats).sort(function(a,b){return cats[b]-cats[a];}).forEach(function(c) {
  console.log('  ' + c + ': ' + cats[c]);
});
console.log('\nPrescription (Rx) items:', rxCount);
console.log('Non-prescription items:', records.length - rxCount);
