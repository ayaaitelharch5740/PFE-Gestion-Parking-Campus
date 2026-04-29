const db = require('../config/db');
const { sendReservationConfirmation } = require('./emailService');

// Vérification de conflit de créneau (règle métier critique)
const hasConflict = async (slotId, startTime, endTime, excludeId = null) => {
  let query = `
    SELECT id FROM parking_reservations
    WHERE slot_id = ?
      AND status NOT IN ('cancelled','completed')
      AND start_time < ?
      AND end_time   > ?
  `;
  const params = [slotId, endTime, startTime];
  if (excludeId) { query += ' AND id != ?'; params.push(excludeId); }
  const [rows] = await db.execute(query, params);
  return rows.length > 0;
};

const createReservation = async (userId, { vehicle_id, slot_id, start_time, end_time }) => {
  // 1. Le véhicule appartient bien à l'utilisateur
  const [veh] = await db.execute(
    'SELECT id, plate_number FROM vehicles WHERE id=? AND user_id=?', 
    [vehicle_id, userId]
  );
  if (!veh.length) throw { status: 403, message: 'Véhicule non autorisé' };

  // 2. La place existe et n'est pas en maintenance
  const [slot] = await db.execute(
    "SELECT * FROM parking_slots WHERE id=? AND status != 'maintenance'", 
    [slot_id]
  );
  if (!slot.length) throw { status: 400, message: 'Place indisponible ou en maintenance' };

  // 3. Pas de conflit de créneau
  if (await hasConflict(slot_id, start_time, end_time))
    throw { status: 409, message: 'Créneau déjà réservé pour cette place' };

  // 🔹 Récupérer les infos user (email + nom)
  const [userRows] = await db.execute(
    "SELECT email, name FROM users WHERE id=?", 
    [userId]
  );
  const user = userRows[0];

  // 🔹 Création de la réservation
  const [result] = await db.execute(
    `INSERT INTO parking_reservations
     (user_id, vehicle_id, slot_id, start_time, end_time, status)
     VALUES (?,?,?,?,?,'confirmed')`,
    [userId, vehicle_id, slot_id, start_time, end_time]
  );

  // 🔹 Envoi email (non bloquant)
  try {
    await sendReservationConfirmation({
      to:          user.email,
      userName:    user.name,
      slotCode:    slot[0].slot_code,
      zone:        slot[0].zone,
      plateNumber: veh[0].plate_number,
      startTime:   start_time,
      endTime:     end_time,
    });
  } catch (err) {
    console.error("Erreur envoi email :", err);
  }

  return {
    id: result.insertId,
    userId,
    vehicle_id,
    slot_id,
    start_time,
    end_time,
    status: 'confirmed'
  };
};
const getMyReservations = async (userId) => {
  const [rows] = await db.execute(`
    SELECT r.*, s.slot_code, s.zone, v.plate_number
    FROM parking_reservations r
    JOIN parking_slots s  ON r.slot_id    = s.id
    JOIN vehicles      v  ON r.vehicle_id = v.id
    WHERE r.user_id = ?
    ORDER BY r.start_time DESC
  `, [userId]);
  return rows;
};

const cancelReservation = async (userId, reservationId) => {
  const [rows] = await db.execute(
    "SELECT * FROM parking_reservations WHERE id=? AND user_id=? AND status='confirmed'",
    [reservationId, userId]
  );
  if (!rows.length) throw { status: 404, message: 'Réservation non trouvée ou déjà annulée' };
  await db.execute(
    "UPDATE parking_reservations SET status='cancelled' WHERE id=?", [reservationId]
  );
};

// Pour l'admin : toutes les réservations avec filtres
const getAllReservations = async ({ plate, userId, date }) => {
  let query = `
    SELECT r.*, s.slot_code, s.zone, v.plate_number, u.name AS user_name
    FROM parking_reservations r
    JOIN parking_slots s ON r.slot_id    = s.id
    JOIN vehicles      v ON r.vehicle_id = v.id
    JOIN users         u ON r.user_id    = u.id
    WHERE 1=1
  `;
  const params = [];
  if (plate)  { query += ' AND v.plate_number LIKE ?'; params.push(`%${plate}%`); }
  if (userId) { query += ' AND r.user_id = ?';         params.push(userId); }
  if (date)   { query += ' AND DATE(r.start_time) = ?'; params.push(date); }
  query += ' ORDER BY r.start_time DESC';
  const [rows] = await db.execute(query, params);
  return rows;
};

// Dashboard stats
const getStats = async () => {
  const [[{ total }]]     = await db.execute('SELECT COUNT(*) AS total FROM parking_slots');
  const [[{ occupied }]]  = await db.execute("SELECT COUNT(*) AS occupied FROM parking_slots WHERE status='occupied'");
  const [[{ today }]]     = await db.execute("SELECT COUNT(*) AS today FROM parking_reservations WHERE DATE(start_time)=CURDATE()");
  return { total, occupied, available: total - occupied, today };
};

module.exports = { createReservation, getMyReservations, cancelReservation, getAllReservations, getStats };