import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  stockId: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  assetType: { 
    type: String, 
    enum: ['EQUITY', 'GOLD_ETF', 'MUTUAL_FUND'], 
    default: 'EQUITY' 
  },
  exchange: { type: String, enum: ['NSE', 'BSE'], required: true },
  currentPrice: { type: Number, required: true },
  dayHigh: { type: Number },
  dayLow: { type: Number },
  lastUpdated: { type: Date, default: Date.now },
  
  aiAnalysis: {
    sentimentScore: { type: Number, default: 0 },
    predictedTrend: { type: String, default: "HOLD" },
    analyzedHeadlines: [{ type: String }]
  }
});

export default mongoose.models.Stock || mongoose.model('Stock', StockSchema);