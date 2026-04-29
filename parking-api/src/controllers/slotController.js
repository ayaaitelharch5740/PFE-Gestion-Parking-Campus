const slotService = require('../services/slotService');

// GET /slots (avec filtres optionnels ?zone=A&status=available)
exports.getAllSlots = async (req, res, next) => {
  try {
    const slots = await slotService.getAllSlots(req.query);
    res.json(slots);
  } catch (err) {
    next(err);
  }
};

// POST /slots (admin)
exports.createSlot = async (req, res, next) => {
  try {
    const slot = await slotService.createSlot(req.body);
    res.status(201).json(slot);
  } catch (err) {
    next(err);
  }
};

// PUT /slots/:id (admin)
exports.updateSlot = async (req, res, next) => {
  try {
    const slot = await slotService.updateSlot(
      req.params.id,
      req.body
    );
    res.json(slot);
  } catch (err) {
    next(err);
  }
};

// DELETE /slots/:id (admin)
exports.deleteSlot = async (req, res, next) => {
  try {
    await slotService.deleteSlot(req.params.id);
    res.json({ message: 'Place supprimée' });
  } catch (err) {
    next(err);
  }
};