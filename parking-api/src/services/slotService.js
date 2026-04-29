const db = require('../config/db');

const getAllSlots = async ({ zone, status }) => {
  let query = 'SELECT * FROM parking_slots WHERE 1=1';
  const params = [];
  if (zone)   { query += ' AND zone = ?';   params.push(zone); }
  if (status) { query += ' AND status = ?'; params.push(status); }
  query += ' ORDER BY zone, slot_code';
  const [rows] = await db.execute(query, params);
  return rows;
};

const createSlot = async ({ slot_code, zone, type }) => {
  const [result] = await db.execute(
    'INSERT INTO parking_slots (slot_code, zone, type) VALUES (?,?,?)',
    [slot_code, zone, type]
  );
  return { id: result.insertId, slot_code, zone, type, status: 'available' };
};

const updateSlot = async (id, data) => {
  const [rows] = await db.execute('SELECT id FROM parking_slots WHERE id=?', [id]);
  if (!rows.length) throw { status: 404, message: 'Place non trouvée' };
  await db.execute(
    'UPDATE parking_slots SET slot_code=?, zone=?, type=?, status=? WHERE id=?',
    [data.slot_code, data.zone, data.type, data.status, id]
  );
  return { id, ...data };
};

const deleteSlot = async (id) => {
  const [rows] = await db.execute('SELECT id FROM parking_slots WHERE id=?', [id]);
  if (!rows.length) throw { status: 404, message: 'Place non trouvée' };
  await db.execute('DELETE FROM parking_slots WHERE id=?', [id]);
};

module.exports = { getAllSlots, createSlot, updateSlot, deleteSlot };