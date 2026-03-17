import mongoose from 'mongoose';

const FinancialAccountSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  bankName: { type: String, required: true },
  bankAccountNo: { type: String, required: true },
  ifscCode: { type: String, required: true },
  dematAccountNo: { type: String, required: true },
  sebiRegNumber: { type: String },
  tradingBalance: { type: Number, default: 0.00 }
}, { timestamps: true });

export default mongoose.models.FinancialAccount || mongoose.model('FinancialAccount', FinancialAccountSchema);