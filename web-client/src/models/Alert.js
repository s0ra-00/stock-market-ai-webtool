import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  stockId: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  condition: { 
    type: String, 
    enum: ['GREATER_THAN', 'LESS_THAN'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  
  aiTrigger: {
    triggerOnSentimentDrop: { type: Boolean, default: false }
  },
  lastTriggeredAt: { type: Date }
}, { timestamps: true });

export default mongoose.models.Alert || mongoose.model('Alert', AlertSchema);