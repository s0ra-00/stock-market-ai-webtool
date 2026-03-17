import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  stockId: { type: String, required: true },
  orderType: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  executionPrice: { type: Number, required: true },
  isSip: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['PENDING', 'EXECUTED', 'CANCELLED'], 
    default: 'PENDING' 
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);