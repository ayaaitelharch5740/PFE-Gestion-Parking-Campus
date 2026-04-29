const vehicleService = require('../services/vehicleService');

// GET /vehicles (mes véhicules)
exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getMyVehicles(req.user.id);
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
};

// POST /vehicles
exports.addVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.addVehicle(req.user.id, req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
};


exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(
      req.user.id,
      req.params.id,
      req.body
    );
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
};

// DELETE /vehicles/:id
exports.deleteVehicle = async (req, res, next) => {
  try {
    await vehicleService.deleteVehicle(req.user.id, req.params.id);
    res.json({ message: 'Véhicule supprimé' });
  } catch (err) {
    next(err);
  }
};