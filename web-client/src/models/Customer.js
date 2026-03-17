import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  panNumber: { type: String, required: true, unique: true },
  kycStatus: { 
    type: String, 
    enum: ['PENDING', 'VERIFIED', 'REJECTED'], 
    default: 'PENDING' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);