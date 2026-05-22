import Charge from '../models/Charge.js';

// @desc    Get all charges
// @route   GET /api/charges
// @access  Private
const getCharges = async (req, res) => {
  const charges = await Charge.find({ user: req.user._id }).sort({ date: -1 });
  res.json(charges);
};

// @desc    Create a charge
// @route   POST /api/charges
// @access  Private
const createCharge = async (req, res) => {
  const { description, amount, date, category } = req.body;

  if (!description || amount === undefined) {
    res.status(400);
    throw new Error('Veuillez fournir une description et un montant');
  }

  const charge = new Charge({
    user: req.user._id,
    description,
    amount,
    date: date || new Date(),
    category: category || 'Autre',
  });

  const createdCharge = await charge.save();
  res.status(201).json(createdCharge);
};

// @desc    Delete a charge
// @route   DELETE /api/charges/:id
// @access  Private
const deleteCharge = async (req, res) => {
  const charge = await Charge.findById(req.params.id);

  if (charge) {
    if (charge.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Non autorisé à supprimer cette charge');
    }
    await Charge.deleteOne({ _id: charge._id });
    res.json({ message: 'Charge supprimée avec succès' });
  } else {
    res.status(404);
    throw new Error('Charge non trouvée');
  }
};

export { getCharges, createCharge, deleteCharge };
