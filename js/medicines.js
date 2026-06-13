// ==========================================
// قاعدة بيانات الأدوية المصرية
// آخر تحديث: يونيو 2026
// ==========================================

const medicinesDB = [
    // ===== مسكنات وخوافض حرارة =====
    { id: 1, name: 'بانادول أقراص', scientificName: 'باراسيتامول 500 مجم', category: 'مسكنات', price: 8.50, qty: 200, rx: false , barcode: '6221000000010', expiryDate: '2026-09-02' },
    { id: 2, name: 'بانادول إكسترا', scientificName: 'باراسيتامول + كافيين', category: 'مسكنات', price: 12.00, qty: 150, rx: false , barcode: '6221000000011', expiryDate: '2026-09-06' },
    { id: 3, name: 'بانادول كولد آند فلو', scientificName: 'باراسيتامول + مضاد احتقان', category: 'مسكنات', price: 15.00, qty: 100, rx: false , barcode: '6221000000012', expiryDate: '2026-09-11' },
    { id: 4, name: 'بروفين أقراص', scientificName: 'ايبوبروفين 400 مجم', category: 'مسكنات', price: 10.50, qty: 180, rx: false , barcode: '6221000000013', expiryDate: '2026-09-16' },
    { id: 5, name: 'كاتافلام أقراص', scientificName: 'ديكلوفيناك 50 مجم', category: 'مسكنات', price: 15.00, qty: 120, rx: true , barcode: '6221000000014', expiryDate: '2026-09-21' },
    { id: 6, name: 'فولتارين أقراص', scientificName: 'ديكلوفيناك 50 مجم', category: 'مسكنات', price: 18.00, qty: 100, rx: true , barcode: '6221000000015', expiryDate: '2026-09-26' },
    { id: 7, name: 'فولتارين جل', scientificName: 'ديكلوفيناك 1%', category: 'مسكنات', price: 35.00, qty: 50, rx: false , barcode: '6221000000016', expiryDate: '2026-10-01' },
    { id: 8, name: 'أبيدون أقراص', scientificName: 'باراسيتامول 500 مجم', category: 'مسكنات', price: 5.00, qty: 300, rx: false , barcode: '6221000000017', expiryDate: '2026-10-06' },
    { id: 9, name: 'برالجين أقراص', scientificName: 'ميتاميزول 500 مجم', category: 'مسكنات', price: 6.00, qty: 200, rx: false , barcode: '6221000000018', expiryDate: '2026-10-11' },
    { id: 10, name: 'موف أقراص', scientificName: 'ميلوكسيكام 15 مجم', category: 'مسكنات', price: 22.00, qty: 70, rx: true , barcode: '6221000000019', expiryDate: '2026-10-16' },
    { id: 11, name: 'سيليبركس كبسول', scientificName: 'سيليكوكسيب 200 مجم', category: 'مسكنات', price: 45.00, qty: 40, rx: true , barcode: '6221000000020', expiryDate: '2026-10-21' },
    { id: 12, name: 'نالفجين أقراص', scientificName: 'باراسيتامول + اورفينادرين', category: 'مسكنات', price: 18.00, qty: 90, rx: true , barcode: '6221000000021', expiryDate: '2026-10-25' },

    // ===== مضادات حيوية =====
    { id: 13, name: 'أوجمنتين أقراص 1جم', scientificName: 'أموكسيسيلين + كلافولانيك', category: 'مضادات حيوية', price: 65.00, qty: 60, rx: true , barcode: '6221000000022', expiryDate: '2026-10-30' },
    { id: 14, name: 'أموكسيل كبسول 500مجم', scientificName: 'أموكسيسيلين 500 مجم', category: 'مضادات حيوية', price: 12.00, qty: 150, rx: true , barcode: '6221000000023', expiryDate: '2026-11-04' },
    { id: 15, name: 'أزيثروميسين كبسول', scientificName: 'أزيثروميسين 500 مجم', category: 'مضادات حيوية', price: 40.00, qty: 50, rx: true , barcode: '6221000000024', expiryDate: '2026-11-09' },
    { id: 16, name: 'سيبروفار أقراص 500مجم', scientificName: 'سيبروفلوكساسين 500 مجم', category: 'مضادات حيوية', price: 18.00, qty: 90, rx: true , barcode: '6221000000025', expiryDate: '2026-11-14' },
    { id: 17, name: 'سيفالكسين كبسول 500مجم', scientificName: 'سيفالكسين 500 مجم', category: 'مضادات حيوية', price: 22.00, qty: 70, rx: true , barcode: '6221000000026', expiryDate: '2026-11-19' },
    { id: 18, name: 'فلاجيل أقراص', scientificName: 'ميترونيدازول 500 مجم', category: 'مضادات حيوية', price: 10.00, qty: 100, rx: true , barcode: '6221000000027', expiryDate: '2026-11-24' },
    { id: 19, name: 'كلاريثروميسين أقراص', scientificName: 'كلاريثروميسين 500 مجم', category: 'مضادات حيوية', price: 30.00, qty: 55, rx: true , barcode: '6221000000028', expiryDate: '2026-11-29' },
    { id: 20, name: 'ليفوفلوكساسين أقراص', scientificName: 'ليفوفلوكساسين 500 مجم', category: 'مضادات حيوية', price: 35.00, qty: 40, rx: true , barcode: '6221000000029', expiryDate: '2026-12-04' },
    { id: 21, name: 'سيفوترياكسون حقن', scientificName: 'سيفوترياكسون 1 جم', category: 'مضادات حيوية', price: 50.00, qty: 25, rx: true , barcode: '6221000000030', expiryDate: '2026-12-09' },

    // ===== أدوية الضغط =====
    { id: 22, name: 'كونكور أقراص 5مجم', scientificName: 'بيسوبرولول 5 مجم', category: 'ضغط', price: 42.00, qty: 60, rx: true , barcode: '6221000000031', expiryDate: '2026-12-14' },
    { id: 23, name: 'أملوديبين أقراص 5مجم', scientificName: 'أملوديبين 5 مجم', category: 'ضغط', price: 15.00, qty: 100, rx: true , barcode: '6221000000032', expiryDate: '2026-12-18' },
    { id: 24, name: 'كابتوبريل أقراص 25مجم', scientificName: 'كابتوبريل 25 مجم', category: 'ضغط', price: 12.00, qty: 100, rx: true , barcode: '6221000000033', expiryDate: '2026-12-23' },
    { id: 25, name: 'لوسارتان أقراص 50مجم', scientificName: 'لوسارتان 50 مجم', category: 'ضغط', price: 25.00, qty: 80, rx: true , barcode: '6221000000034', expiryDate: '2026-12-28' },
    { id: 26, name: 'فالسارتان أقراص 80مجم', scientificName: 'فالسارتان 80 مجم', category: 'ضغط', price: 30.00, qty: 50, rx: true , barcode: '6221000000035', expiryDate: '2027-01-02' },

    // ===== أدوية السكر =====
    { id: 27, name: 'جلوكوفاج أقراص 500مجم', scientificName: 'ميتفورمين 500 مجم', category: 'سكر', price: 12.00, qty: 150, rx: true , barcode: '6221000000036', expiryDate: '2027-01-07' },
    { id: 28, name: 'جلوكوفاج أقراص 1000مجم', scientificName: 'ميتفورمين 1000 مجم', category: 'سكر', price: 18.00, qty: 120, rx: true , barcode: '6221000000037', expiryDate: '2027-01-12' },
    { id: 29, name: 'أمريل أقراص 2مجم', scientificName: 'جليمبيريد 2 مجم', category: 'سكر', price: 32.00, qty: 50, rx: true , barcode: '6221000000038', expiryDate: '2027-01-17' },
    { id: 30, name: 'دياميكرون أقراص 60مجم', scientificName: 'جليكلازيد 60 مجم', category: 'سكر', price: 40.00, qty: 45, rx: true , barcode: '6221000000039', expiryDate: '2027-01-22' },
    { id: 31, name: 'جانوفيا أقراص 100مجم', scientificName: 'سيتاجليبتين 100 مجم', category: 'سكر', price: 120.00, qty: 25, rx: true , barcode: '6221000000040', expiryDate: '2027-01-27' },
    { id: 32, name: 'إنجاباج أقراص 10مجم', scientificName: 'إمباجليفلوزين 10 مجم', category: 'سكر', price: 95.00, qty: 30, rx: true , barcode: '6221000000041', expiryDate: '2027-02-01' },
    { id: 33, name: 'أوزمبيك حقن', scientificName: 'سيماجلوتايد', category: 'سكر', price: 950.00, qty: 6, rx: true , barcode: '6221000000042', expiryDate: '2027-02-06' },
    { id: 34, name: 'لانتوس حقن', scientificName: 'أنسولين جلارجين', category: 'سكر', price: 280.00, qty: 20, rx: true , barcode: '6221000000043', expiryDate: '2027-02-10' },
    { id: 35, name: 'نوفورابيد حقن', scientificName: 'أنسولين أسبارت', category: 'سكر', price: 260.00, qty: 20, rx: true , barcode: '6221000000044', expiryDate: '2027-02-15' },
    { id: 36, name: 'داونيل أقراص 5مجم', scientificName: 'جليبنكلاميد 5 مجم', category: 'سكر', price: 8.00, qty: 120, rx: true , barcode: '6221000000045', expiryDate: '2027-02-20' },

    // ===== أدوية المعدة =====
    { id: 37, name: 'أوميز كبسول 20مجم', scientificName: 'أوميبرازول 20 مجم', category: 'معدة', price: 18.00, qty: 100, rx: false , barcode: '6221000000046', expiryDate: '2027-02-25' },
    { id: 38, name: 'نيكسيوم أقراص 40مجم', scientificName: 'إيزوميبرازول 40 مجم', category: 'معدة', price: 55.00, qty: 40, rx: false , barcode: '6221000000047', expiryDate: '2027-03-02' },
    { id: 39, name: 'سبازموكانولاز كبسول', scientificName: 'سيميثيكون + بلادونا', category: 'معدة', price: 22.00, qty: 80, rx: false , barcode: '6221000000048', expiryDate: '2027-03-07' },
    { id: 40, name: 'بوسكوبان أقراص', scientificName: 'هيوسين 10 مجم', category: 'معدة', price: 20.00, qty: 90, rx: false , barcode: '6221000000049', expiryDate: '2027-03-12' },
    { id: 41, name: 'أنتينا كبسول', scientificName: 'نيفوروكسازيد 200 مجم', category: 'معدة', price: 28.00, qty: 60, rx: true , barcode: '6221000000050', expiryDate: '2027-03-17' },
    { id: 42, name: 'موتيليوم أقراص', scientificName: 'دومبيريدون 10 مجم', category: 'معدة', price: 18.00, qty: 80, rx: false , barcode: '6221000000051', expiryDate: '2027-03-22' },
    { id: 43, name: 'بريماكسان كبسول', scientificName: 'أوميبرازول + دومبيريدون', category: 'معدة', price: 25.00, qty: 60, rx: false , barcode: '6221000000052', expiryDate: '2027-03-27' },
    { id: 44, name: 'كونترولوك أقراص 40مجم', scientificName: 'بانتوبرازول 40 مجم', category: 'معدة', price: 35.00, qty: 50, rx: false , barcode: '6221000000053', expiryDate: '2027-04-01' },
    { id: 45, name: 'اموديوم كبسول', scientificName: 'لوبيراميد 2 مجم', category: 'معدة', price: 12.00, qty: 70, rx: false , barcode: '6221000000054', expiryDate: '2027-04-05' },
    { id: 46, name: 'لاكتولوز شراب', scientificName: 'لاكتولوز', category: 'معدة', price: 20.00, qty: 40, rx: false , barcode: '6221000000055', expiryDate: '2027-04-10' },

    // ===== أدوية الحساسية =====
    { id: 47, name: 'تلفاست أقراص 120مجم', scientificName: 'فيكسوفينادين 120 مجم', category: 'حساسية', price: 35.00, qty: 60, rx: false , barcode: '6221000000056', expiryDate: '2027-04-15' },
    { id: 48, name: 'كلاريتين أقراص', scientificName: 'لوراتادين 10 مجم', category: 'حساسية', price: 28.00, qty: 70, rx: false , barcode: '6221000000057', expiryDate: '2027-04-20' },
    { id: 49, name: 'زيرتك أقراص', scientificName: 'سيتريزين 10 مجم', category: 'حساسية', price: 25.00, qty: 80, rx: false , barcode: '6221000000058', expiryDate: '2027-04-25' },
    { id: 50, name: 'كزستال أقراص', scientificName: 'ليفوسيتريزين 5 مجم', category: 'حساسية', price: 30.00, qty: 50, rx: false , barcode: '6221000000059', expiryDate: '2027-04-30' },
    { id: 51, name: 'إيريوس أقراص', scientificName: 'ديسلوراتادين 5 مجم', category: 'حساسية', price: 38.00, qty: 45, rx: false , barcode: '6221000000060', expiryDate: '2027-05-05' },
    { id: 52, name: 'بولارامين أقراص', scientificName: 'كلورفينيرامين 4 مجم', category: 'حساسية', price: 5.00, qty: 120, rx: false , barcode: '6221000000061', expiryDate: '2027-05-10' },
    { id: 53, name: 'بريدنيزولون أقراص 5مجم', scientificName: 'بريدنيزولون 5 مجم', category: 'حساسية', price: 8.00, qty: 80, rx: true , barcode: '6221000000062', expiryDate: '2027-05-15' },

    // ===== فيتامينات =====
    { id: 54, name: 'بي كومبلكس أقراص', scientificName: 'فيتامين ب المركب', category: 'فيتامينات', price: 18.00, qty: 100, rx: false , barcode: '6221000000063', expiryDate: '2027-05-20' },
    { id: 55, name: 'نيوروفيت أقراص', scientificName: 'فيتامين ب1+ب6+ب12', category: 'فيتامينات', price: 25.00, qty: 80, rx: false , barcode: '6221000000064', expiryDate: '2027-05-25' },
    { id: 56, name: 'فيتامين سي أقراص 1000مجم', scientificName: 'فيتامين ج 1000 مجم', category: 'فيتامينات', price: 22.00, qty: 90, rx: false , barcode: '6221000000065', expiryDate: '2027-05-29' },
    { id: 57, name: 'فيتامين د أقراص 5000وحدة', scientificName: 'فيتامين د 5000 وحدة', category: 'فيتامينات', price: 35.00, qty: 60, rx: false , barcode: '6221000000066', expiryDate: '2027-06-03' },
    { id: 58, name: 'أوسوفورتين أقراص', scientificName: 'كالسيوم+فيتامين د', category: 'فيتامينات', price: 30.00, qty: 70, rx: false , barcode: '6221000000067', expiryDate: '2027-06-08' },
    { id: 59, name: 'فيروجلوبين كبسول', scientificName: 'حديد+ب12+فوليك', category: 'فيتامينات', price: 35.00, qty: 50, rx: false , barcode: '6221000000068', expiryDate: '2027-06-13' },
    { id: 60, name: 'أوميغا 3 كبسول', scientificName: 'أوميغا 3', category: 'فيتامينات', price: 45.00, qty: 40, rx: false , barcode: '6221000000069', expiryDate: '2027-06-18' },
    { id: 61, name: 'زنك أقراص 50مجم', scientificName: 'زنك 50 مجم', category: 'فيتامينات', price: 15.00, qty: 80, rx: false , barcode: '6221000000070', expiryDate: '2027-06-23' },
    { id: 62, name: 'مولتي فيتامين أقراص', scientificName: 'فيتامينات متعددة', category: 'فيتامينات', price: 35.00, qty: 60, rx: false , barcode: '6221000000071', expiryDate: '2027-06-28' },
    { id: 63, name: 'ماغنسيوم أقراص 400مجم', scientificName: 'ماغنسيوم 400 مجم', category: 'فيتامينات', price: 28.00, qty: 60, rx: false , barcode: '6221000000072', expiryDate: '2027-07-03' },
    { id: 64, name: 'ميلاتونين أقراص 3مجم', scientificName: 'ميلاتونين 3 مجم', category: 'فيتامينات', price: 25.00, qty: 45, rx: false , barcode: '6221000000073', expiryDate: '2027-07-08' },

    // ===== أدوية القلب =====
    { id: 65, name: 'أسبرين أقراص 100مجم', scientificName: 'أسبرين 100 مجم', category: 'قلب', price: 5.00, qty: 200, rx: true , barcode: '6221000000074', expiryDate: '2027-07-13' },
    { id: 66, name: 'بلافيكس أقراص 75مجم', scientificName: 'كلوبيدوجريل 75 مجم', category: 'قلب', price: 55.00, qty: 40, rx: true , barcode: '6221000000075', expiryDate: '2027-07-18' },
    { id: 67, name: 'ديجوكسين أقراص', scientificName: 'ديجوكسين 0.25 مجم', category: 'قلب', price: 12.00, qty: 50, rx: true , barcode: '6221000000076', expiryDate: '2027-07-22' },
    { id: 68, name: 'نيتروجليسرين بخاخ', scientificName: 'نيتروجليسرين', category: 'قلب', price: 85.00, qty: 15, rx: true , barcode: '6221000000077', expiryDate: '2027-07-27' },
    { id: 69, name: 'أتورفاستاتين أقراص 20مجم', scientificName: 'أتورفاستاتين 20 مجم', category: 'قلب', price: 35.00, qty: 60, rx: true , barcode: '6221000000078', expiryDate: '2027-08-01' },
    { id: 70, name: 'كريستور أقراص 10مجم', scientificName: 'روسوفاستاتين 10 مجم', category: 'قلب', price: 65.00, qty: 35, rx: true , barcode: '6221000000079', expiryDate: '2027-08-06' },
    { id: 71, name: 'فوروسيميد أقراص 40مجم', scientificName: 'فوروسيميد 40 مجم', category: 'قلب', price: 8.00, qty: 120, rx: true , barcode: '6221000000080', expiryDate: '2027-08-11' },
    { id: 72, name: 'سبيرونولاكتون أقراص 25مجم', scientificName: 'سبيرونولاكتون 25 مجم', category: 'قلب', price: 12.00, qty: 80, rx: true , barcode: '6221000000081', expiryDate: '2027-08-16' },
    { id: 73, name: 'إيزوسوربيد أقراص', scientificName: 'إيزوسوربيد ثنائي النترات', category: 'قلب', price: 15.00, qty: 50, rx: true , barcode: '6221000000082', expiryDate: '2027-08-21' },
    { id: 74, name: 'أميودارون أقراص 200مجم', scientificName: 'أميودارون 200 مجم', category: 'قلب', price: 30.00, qty: 30, rx: true , barcode: '6221000000083', expiryDate: '2027-08-26' },

    // ===== برد وكحة =====
    { id: 75, name: 'كونجيستال أقراص', scientificName: 'باراسيتامول+سودوإيفيدرين', category: 'برد وكحة', price: 12.00, qty: 80, rx: false , barcode: '6221000000084', expiryDate: '2027-08-31' },
    { id: 76, name: 'برونشيكم شراب', scientificName: 'أمبروكسول', category: 'برد وكحة', price: 15.00, qty: 50, rx: false , barcode: '6221000000085', expiryDate: '2027-09-05' },
    { id: 77, name: 'ميكوليت شراب', scientificName: 'أمبروكسول', category: 'برد وكحة', price: 10.00, qty: 60, rx: false , barcode: '6221000000086', expiryDate: '2027-09-09' },
    { id: 78, name: 'سولفين أقراص', scientificName: 'برومهيكسين 8 مجم', category: 'برد وكحة', price: 6.00, qty: 90, rx: false , barcode: '6221000000087', expiryDate: '2027-09-14' },
    { id: 79, name: 'بانادول كولد', scientificName: 'باراسيتامول+سودوإيفيدرين', category: 'برد وكحة', price: 15.00, qty: 70, rx: false , barcode: '6221000000088', expiryDate: '2027-09-19' },

    // ===== أدوية الجلد =====
    { id: 80, name: 'كلوتريمازول كريم', scientificName: 'كلوتريمازول 1%', category: 'جلد', price: 10.00, qty: 50, rx: false , barcode: '6221000000089', expiryDate: '2027-09-24' },
    { id: 81, name: 'فوسيدين كريم', scientificName: 'حمض الفوسيديك 2%', category: 'جلد', price: 25.00, qty: 35, rx: false , barcode: '6221000000090', expiryDate: '2027-09-29' },
    { id: 82, name: 'بيتازون كريم', scientificName: 'بيتاميثازون 0.1%', category: 'جلد', price: 18.00, qty: 40, rx: true , barcode: '6221000000091', expiryDate: '2027-10-04' },
    { id: 83, name: 'إيلوكوم كريم', scientificName: 'موميتازون 0.1%', category: 'جلد', price: 35.00, qty: 25, rx: true , barcode: '6221000000092', expiryDate: '2027-10-09' },
    { id: 84, name: 'بانثينول كريم', scientificName: 'ديكسبانثينول 5%', category: 'جلد', price: 18.00, qty: 45, rx: false , barcode: '6221000000093', expiryDate: '2027-10-14' },

    // ===== قطرة عين وأذن =====
    { id: 85, name: 'توبريكس قطرة عين', scientificName: 'توبراميسين 0.3%', category: 'قطرة', price: 22.00, qty: 30, rx: true , barcode: '6221000000094', expiryDate: '2027-10-19' },
    { id: 86, name: 'ديكسا قطرة عين', scientificName: 'ديكساميثازون 0.1%', category: 'قطرة', price: 12.00, qty: 30, rx: true , barcode: '6221000000095', expiryDate: '2027-10-24' },
    { id: 87, name: 'دموع صناعية', scientificName: 'كارميلوز صوديوم', category: 'قطرة', price: 18.00, qty: 30, rx: false , barcode: '6221000000096', expiryDate: '2027-10-29' },
    { id: 88, name: 'ريسين قطرة أذن', scientificName: 'حمض البوريك+جلسرين', category: 'قطرة', price: 8.00, qty: 35, rx: false , barcode: '6221000000097', expiryDate: '2027-11-02' },

    // ===== أدوية أطفال =====
    { id: 89, name: 'بانادول شراب أطفال', scientificName: 'باراسيتامول 120مجم', category: 'أطفال', price: 10.00, qty: 60, rx: false , barcode: '6221000000098', expiryDate: '2027-11-07' },
    { id: 90, name: 'بروفين شراب أطفال', scientificName: 'ايبوبروفين 100مجم', category: 'أطفال', price: 15.00, qty: 45, rx: false , barcode: '6221000000099', expiryDate: '2027-11-12' },
    { id: 91, name: 'بيدياليت محلول', scientificName: 'محلول جفاف', category: 'أطفال', price: 12.00, qty: 50, rx: false , barcode: '6221000000100', expiryDate: '2027-11-17' },
    { id: 92, name: 'دايفلات نقط', scientificName: 'سيميثيكون', category: 'أطفال', price: 12.00, qty: 35, rx: false , barcode: '6221000000101', expiryDate: '2027-11-22' },

    // ===== مسالك بولية =====
    { id: 93, name: 'تامسولوسين كبسول', scientificName: 'تامسولوسين 0.4 مجم', category: 'مسالك بولية', price: 45.00, qty: 30, rx: true , barcode: '6221000000102', expiryDate: '2027-11-27' },
    { id: 94, name: 'فيناسترايد أقراص', scientificName: 'فيناسترايد 5 مجم', category: 'مسالك بولية', price: 35.00, qty: 30, rx: true , barcode: '6221000000103', expiryDate: '2027-12-02' },
    { id: 95, name: 'فياجرا أقراص 50مجم', scientificName: 'سيلدينافيل 50 مجم', category: 'مسالك بولية', price: 85.00, qty: 20, rx: true , barcode: '6221000000104', expiryDate: '2027-12-07' },
    { id: 96, name: 'سياليس أقراص 5مجم', scientificName: 'تادالافيل 5 مجم', category: 'مسالك بولية', price: 95.00, qty: 18, rx: true , barcode: '6221000000105', expiryDate: '2027-12-12' },

    // ===== ربو وصدر =====
    { id: 97, name: 'فنتولين بخاخ', scientificName: 'سالبيوتامول', category: 'ربو', price: 45.00, qty: 25, rx: true , barcode: '6221000000106', expiryDate: '2027-12-17' },
    { id: 98, name: 'سيريتايد بخاخ 250', scientificName: 'سالميتيرول+فلوتيكازون', category: 'ربو', price: 120.00, qty: 15, rx: true , barcode: '6221000000107', expiryDate: '2027-12-22' },
    { id: 99, name: 'بلميكورت بخاخ', scientificName: 'بوديزونيد', category: 'ربو', price: 85.00, qty: 15, rx: true , barcode: '6221000000108', expiryDate: '2027-12-26' },
    { id: 100, name: 'سبيريفا بخاخ', scientificName: 'تيوتروبيوم', category: 'ربو', price: 180.00, qty: 10, rx: true , barcode: '6221000000109', expiryDate: '2027-12-31' },

    // ===== الغدة الدرقية =====
    { id: 101, name: 'ثيروكسين أقراص 50ميكروجرام', scientificName: 'ليفوثيروكسين', category: 'غدة درقية', price: 15.00, qty: 60, rx: true , barcode: '6221000000110', expiryDate: '2028-01-05' },
    { id: 102, name: 'ثيروكسين أقراص 100ميكروجرام', scientificName: 'ليفوثيروكسين', category: 'غدة درقية', price: 18.00, qty: 45, rx: true , barcode: '6221000000111', expiryDate: '2028-01-10' },
    { id: 103, name: 'ميثيمازول أقراص', scientificName: 'ميثيمازول 5 مجم', category: 'غدة درقية', price: 15.00, qty: 30, rx: true , barcode: '6221000000112', expiryDate: '2028-01-15' },

    // ===== أعصاب =====
    { id: 104, name: 'ليريكا كبسول 75مجم', scientificName: 'بريجابالين 75 مجم', category: 'أعصاب', price: 55.00, qty: 25, rx: true , barcode: '6221000000113', expiryDate: '2028-01-20' },
    { id: 105, name: 'نيورونتن كبسول', scientificName: 'جابابنتين 300 مجم', category: 'أعصاب', price: 45.00, qty: 35, rx: true , barcode: '6221000000114', expiryDate: '2028-01-25' },
    { id: 106, name: 'كاربامازيبين أقراص', scientificName: 'كاربامازيبين 200 مجم', category: 'أعصاب', price: 15.00, qty: 50, rx: true , barcode: '6221000000115', expiryDate: '2028-01-30' },
    { id: 107, name: 'جينكو بيلوبا', scientificName: 'مستخلص الجينكو', category: 'أعصاب', price: 35.00, qty: 30, rx: false , barcode: '6221000000116', expiryDate: '2028-02-04' },
    { id: 108, name: 'دونيبيزيل أقراص', scientificName: 'دونيبيزيل 5 مجم', category: 'أعصاب', price: 55.00, qty: 18, rx: true , barcode: '6221000000117', expiryDate: '2028-02-09' },

    // ===== نفسية =====
    { id: 109, name: 'بروزاك كبسول', scientificName: 'فلوكستين 20 مجم', category: 'نفسية', price: 35.00, qty: 30, rx: true , barcode: '6221000000118', expiryDate: '2028-02-14' },
    { id: 110, name: 'زولفت أقراص 50مجم', scientificName: 'سيرترالين 50 مجم', category: 'نفسية', price: 45.00, qty: 25, rx: true , barcode: '6221000000119', expiryDate: '2028-02-18' },
    { id: 111, name: 'سيبراليكس أقراص', scientificName: 'إسيتالوبرام 10 مجم', category: 'نفسية', price: 48.00, qty: 22, rx: true , barcode: '6221000000120', expiryDate: '2028-02-23' },
    { id: 112, name: 'إيفكسور كبسول', scientificName: 'فينلافاكسين 75 مجم', category: 'نفسية', price: 65.00, qty: 18, rx: true , barcode: '6221000000121', expiryDate: '2028-02-28' },
    { id: 113, name: 'سيروكويل أقراص', scientificName: 'كويتيابين 25 مجم', category: 'نفسية', price: 40.00, qty: 22, rx: true , barcode: '6221000000122', expiryDate: '2028-03-04' },

    // ===== مضادات تخثر =====
    { id: 114, name: 'إكسابيلتا أقراص 10مجم', scientificName: 'ريفاروكسابان 10 مجم', category: 'مضادات تخثر', price: 150.00, qty: 15, rx: true , barcode: '6221000000123', expiryDate: '2028-03-09' },
    { id: 115, name: 'إليكويس أقراص 5مجم', scientificName: 'أبيكسابان 5 مجم', category: 'مضادات تخثر', price: 180.00, qty: 10, rx: true , barcode: '6221000000124', expiryDate: '2028-03-14' },
    { id: 116, name: 'وارفارين أقراص', scientificName: 'وارفارين 5 مجم', category: 'مضادات تخثر', price: 12.00, qty: 50, rx: true , barcode: '6221000000125', expiryDate: '2028-03-19' },

    // ===== مناعية =====
    { id: 117, name: 'ميثوتريكسيت أقراص', scientificName: 'ميثوتريكسيت 2.5 مجم', category: 'مناعية', price: 15.00, qty: 25, rx: true , barcode: '6221000000126', expiryDate: '2028-03-24' },
    { id: 118, name: 'هيدروكسي كلوروكوين', scientificName: 'هيدروكسي كلوروكوين', category: 'مناعية', price: 45.00, qty: 25, rx: true , barcode: '6221000000127', expiryDate: '2028-03-29' },

    // ===== حقن ومحاليل =====
    { id: 119, name: 'محلول ملح 0.9% 500مل', scientificName: 'كلوريد الصوديوم', category: 'محاليل', price: 15.00, qty: 40, rx: true , barcode: '6221000000128', expiryDate: '2028-04-03' },
    { id: 120, name: 'محلول جلوكوز 5%', scientificName: 'جلوكوز 5%', category: 'محاليل', price: 15.00, qty: 35, rx: true , barcode: '6221000000129', expiryDate: '2028-04-08' },
    { id: 121, name: 'كينو كورت حقن', scientificName: 'تريامسينولون', category: 'محاليل', price: 45.00, qty: 15, rx: true , barcode: '6221000000130', expiryDate: '2028-04-12' },
    { id: 122, name: 'بوتوكس حقن', scientificName: 'توكسين البوتولينوم', category: 'محاليل', price: 950.00, qty: 4, rx: true , barcode: '6221000000131', expiryDate: '2028-04-17' },

    // ===== أدوات طبية =====
    { id: 123, name: 'جهاز سكر', scientificName: 'جهاز قياس سكر', category: 'أدوات طبية', price: 200.00, qty: 10, rx: false , barcode: '6221000000132', expiryDate: '2028-04-22' },
    { id: 124, name: 'جهاز ضغط رقمي', scientificName: 'جهاز ضغط إلكتروني', category: 'أدوات طبية', price: 450.00, qty: 6, rx: false , barcode: '6221000000133', expiryDate: '2028-04-27' },
    { id: 125, name: 'سماعة طبية', scientificName: 'سماعة طبية', category: 'أدوات طبية', price: 180.00, qty: 5, rx: false , barcode: '6221000000134', expiryDate: '2028-05-02' },
    { id: 126, name: 'مقياس أكسجين', scientificName: 'مقياس تأكسج', category: 'أدوات طبية', price: 280.00, qty: 8, rx: false , barcode: '6221000000135', expiryDate: '2028-05-07' },
    { id: 127, name: 'كرسي متحرك', scientificName: 'كرسي متحرك', category: 'أدوات طبية', price: 2500.00, qty: 2, rx: false , barcode: '6221000000136', expiryDate: '2028-05-12' },

    // ===== عناية شخصية =====
    { id: 128, name: 'واقي شمس SPF 50', scientificName: 'كريم واقي شمس', category: 'عناية', price: 85.00, qty: 25, rx: false , barcode: '6221000000137', expiryDate: '2028-05-17' },
    { id: 129, name: 'كحول ايثيلي 70%', scientificName: 'كحول مطهر', category: 'عناية', price: 18.00, qty: 40, rx: false , barcode: '6221000000138', expiryDate: '2028-05-22' },
    { id: 130, name: 'كمامة طبية', scientificName: 'كمامة جراحية', category: 'عناية', price: 25.00, qty: 35, rx: false , barcode: '6221000000139', expiryDate: '2028-05-27' },
    { id: 131, name: 'مطهر لليدين', scientificName: 'جل كحولي', category: 'عناية', price: 20.00, qty: 45, rx: false , barcode: '6221000000140', expiryDate: '2028-06-01' },
];

// ===== دوال مساعدة =====
function searchMedicines(query) {
    query = query.toLowerCase().trim();
    if (!query) return medicinesDB;
    return medicinesDB.filter(m => 
        m.name.includes(query) || 
        m.scientificName.includes(query) || 
        m.category.includes(query) ||
        (m.barcode && m.barcode.includes(query))
    );
}

function getMedicinesByCategory(category) {
    if (!category || category === 'الكل') return medicinesDB;
    return medicinesDB.filter(m => m.category === category);
}

function getMedicineById(id) {
    return medicinesDB.find(m => m.id === parseInt(id));
}

function getCategories() {
    return [...new Set(medicinesDB.map(m => m.category))];
}

function getStockStatus(m) {
    if (m.qty <= 0) return 'نفذ';
    if (m.qty <= 10) return 'منخفض';
    if (m.qty <= 50) return 'متوسط';
    return 'متوفر';
}
