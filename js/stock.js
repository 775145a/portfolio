// ===== Stock Management Module =====
// Separate stock (qty, price, expiry, batch) from reference medicine data.

var medStock = {};

function saveStock() {
  localStorage.setItem('pharmacy_pos_stock', JSON.stringify(medStock));
}

function loadStock() {
  var saved = localStorage.getItem('pharmacy_pos_stock');
  if (saved) {
    try {
      medStock = JSON.parse(saved);
    } catch (e) {
      medStock = {};
    }
  } else {
    medStock = {};
  }
  migrateOldStock();
  saveStock();
}

function getStock(id) {
  id = String(id);
  if (medStock[id]) {
    return medStock[id];
  }
  return { q: 0, bp: 0, ed: '', bn: '', rp: 10, pp: 0 };
}

function getQty(id) {
  return Number(getStock(id).q) || 0;
}

function setStock(id, data) {
  id = String(id);
  if (!medStock[id]) {
    medStock[id] = { q: 0, bp: 0, ed: '', bn: '', rp: 10, pp: 0 };
  }
  if (data.q !== undefined) medStock[id].q = Number(data.q);
  if (data.bp !== undefined) medStock[id].bp = Number(data.bp);
  if (data.ed !== undefined) medStock[id].ed = String(data.ed);
  if (data.bn !== undefined) medStock[id].bn = String(data.bn);
  if (data.rp !== undefined) medStock[id].rp = Number(data.rp);
  if (data.pp !== undefined) medStock[id].pp = Number(data.pp);
  saveStock();
}

function adjustStock(id, delta) {
  id = String(id);
  var s = getStock(id);
  var newQ = Number(s.q) + Number(delta);
  if (newQ < 0) newQ = 0;
  s.q = newQ;
  medStock[id] = s;
  saveStock();
}

function updateStock(id, qty, price, expiry, batch) {
  id = String(id);
  if (!medStock[id]) {
    medStock[id] = { q: 0, bp: 0, ed: '', bn: '', rp: 10, pp: 0 };
  }
  if (qty !== undefined) medStock[id].q = Number(qty);
  if (price !== undefined) medStock[id].bp = Number(price);
  if (expiry !== undefined) medStock[id].ed = String(expiry);
  if (batch !== undefined) medStock[id].bn = String(batch);
  saveStock();
}

function getFullMedicineInfo(id) {
  id = String(id);
  var ref = medIndexById[id] || {};
  var stock = getStock(id);
  return Object.assign({}, ref, stock);
}

function getStockStatus(id) {
  id = String(id);
  var qty = getQty(id);
  if (qty <= 0) return '\u0646\u0641\u0630';
  if (qty <= 10) return '\u0645\u0646\u062E\u0641\u0636';
  return '\u0645\u062A\u0648\u0641\u0631';
}

function getBuyPrice(id) {
  return Number(getStock(id).bp) || 0;
}

function getExpiryDate(id) {
  return getStock(id).ed || '';
}

function getBatchNumber(id) {
  return getStock(id).bn || '';
}

function migrateOldStock() {
  for (var i = 0; i < medicinesDB.length; i++) {
    var m = medicinesDB[i];
    if (m === undefined || m === null) continue;
    var id = String(m.id);
    if (!id) continue;
    var hasOldStock = (m.qty !== undefined || m.buyPrice !== undefined || m.expiryDate !== undefined || m.reorderPoint !== undefined || m.batchNumber !== undefined);
    if (!hasOldStock) continue;
    if (!medStock[id]) {
      medStock[id] = { q: 0, bp: 0, ed: '', bn: '', rp: 10, pp: 0 };
    }
    if (m.qty !== undefined) { medStock[id].q = Number(m.qty); delete m.qty; }
    if (m.buyPrice !== undefined) { medStock[id].bp = Number(m.buyPrice); delete m.buyPrice; }
    if (m.expiryDate !== undefined) { medStock[id].ed = String(m.expiryDate); delete m.expiryDate; }
    if (m.reorderPoint !== undefined) { medStock[id].rp = Number(m.reorderPoint); delete m.reorderPoint; }
    if (m.batchNumber !== undefined) { medStock[id].bn = String(m.batchNumber); delete m.batchNumber; }
  }
}

function getAllStock() {
  return medStock;
}
