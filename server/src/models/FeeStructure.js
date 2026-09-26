import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true },
    components: [
      {
        name: { type: String, required: true }, // tuition, hostel, exam, etc.
        amount: { type: Number, required: true },
        isOptional: { type: Boolean, default: false },
      },
    ],
    totalAmount: { type: Number, required: true },
    dueDate: { type: Date },
    lateFeePerDay: { type: Number, default: 0 },
  },
  { timestamps: true }
);

feeStructureSchema.index({ course: 1, semester: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('FeeStructure', feeStructureSchema);
