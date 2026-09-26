import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    enrollmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'dropped', 'completed'],
      default: 'active',
    },
    academicYear: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments
enrollmentSchema.index({ student: 1, class: 1 }, { unique: true });
enrollmentSchema.index({ class: 1, status: 1 });

export default mongoose.model('Enrollment', enrollmentSchema);
