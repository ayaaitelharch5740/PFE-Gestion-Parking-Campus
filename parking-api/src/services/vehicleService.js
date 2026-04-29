const db = require('../config/db');

const getMyVehicles = async (userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM vehicles WHERE user_id = ? ORDER BY created_at DESC', [userId]
  );
  return rows;
};

const addVehicle = async (userId, { plate_number, type, brand }) => {
  const [exists] = await db.execute(
    'SELECT id FROM vehicles WHERE plate_number = ?', [plate_number]
  );
  if (exists.length) throw { status: 409, message: 'Plaque déjà enregistrée' };

  const [result] = await db.execute(
    'INSERT INTO vehicles (user_id, plate_number, type, brand) VALUES (?,?,?,?)',
    [userId, plate_number, type, brand]
  );
  return { id: result.insertId, user_id: userId, plate_number, type, brand };
};

const updateVehicle = async (userId, vehicleId, data) => {
  const [rows] = await db.execute(
    'SELECT * FROM vehicles WHERE id = ? AND user_id = ?', [vehicleId, userId]
  );
  if (!rows.length) throw { status: 404, message: 'Véhicule non trouvé' };

  await db.execute(
    'UPDATE vehicles SET plate_number=?, type=?, brand=? WHERE id=?',
    [data.plate_number, data.type, data.brand, vehicleId]
  );
  return { id: vehicleId, ...data };
};

const deleteVehicle = async (userId, vehicleId) => {
  const [rows] = await db.execute(
    'SELECT id FROM vehicles WHERE id = ? AND user_id = ?', [vehicleId, userId]
  );
  if (!rows.length) throw { status: 404, message: 'Véhicule non trouvé' };
  await db.execute('DELETE FROM vehicles WHERE id = ?', [vehicleId]);
};

module.exports = { getMyVehicles, addVehicle, updateVehicle, deleteVehicle };