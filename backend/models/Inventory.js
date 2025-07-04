const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, default: "available" }, // or "used" / "sold"
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Inventory', InventorySchema);
