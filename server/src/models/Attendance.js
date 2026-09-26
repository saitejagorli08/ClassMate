import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      required: true,
    },
    remarks: { type: String },
    // Audit trail for corrections
    corrections: [
      {
        correctedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        correctedAt: { type: Date },
        previousStatus: String,
        newStatus: String,
        reason: String,
      },
    ],
  },
  { timestamps: true }
);

// Prevent duplicate attendance for same student/subject/date
attendanceSchema.index(
  { student: 1, subject: 1, date: 1 },
  { unique: true }
);
attendanceSchema.index({ class: 1, date: 1 });
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ faculty: 1, date: 1 });

export default mongoose.model('Attendance', attendanceSchema);
