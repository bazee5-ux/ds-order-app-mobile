const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const CustomerDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, required: true },
  remarks: { type: String, default: '' }
});

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  customerDetails: { type: CustomerDetailsSchema, required: true },
  products: { type: [ProductSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
