import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    feeStructure: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeStructure' },
    receiptNumber: { type: String },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    method: {
      type: String,
      enum: ['cash', 'online', 'cheque', 'dd', 'upi'],
      default: 'cash',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded'],
      default: 'success',
    },
    transactionId: { type: String },
    semester: { type: Number },
    academicYear: { type: String },
    description: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

paymentSchema.index({ student: 1, academicYear: 1 });
paymentSchema.index({ receiptNumber: 1 }, { unique: true, sparse: true });

export default mongoose.model('Payment', paymentSchema);
