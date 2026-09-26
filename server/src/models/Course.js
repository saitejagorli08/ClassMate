import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, unique: true, uppercase: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    duration: { type: Number, required: true }, // in years
    totalSemesters: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    fees: { type: Number, default: 0 }, // annual fees
  },
  { timestamps: true }
);

courseSchema.index({ department: 1 });

export default mongoose.model('Course', courseSchema);
