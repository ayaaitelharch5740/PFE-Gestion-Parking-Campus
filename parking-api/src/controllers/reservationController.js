const svc = require('../services/reservationService');

exports.create     = async (req, res, next) => {
  try {
    const r = await svc.createReservation(req.user.id, req.body);
    res.status(201).json(r);
  } catch (err) { next(err); }
};

exports.myList     = async (req, res, next) => {
  try { res.json(await svc.getMyReservations(req.user.id)); }
  catch (err) { next(err); }
};

exports.cancel     = async (req, res, next) => {
  try {
    await svc.cancelReservation(req.user.id, req.params.id);
    res.json({ message: 'Réservation annulée' });
  } catch (err) { next(err); }
};

exports.adminList  = async (req, res, next) => {
  try { res.json(await svc.getAllReservations(req.query)); }
  catch (err) { next(err); }
};

exports.stats      = async (req, res, next) => {
  try { res.json(await svc.getStats()); }
  catch (err) { next(err); }
};