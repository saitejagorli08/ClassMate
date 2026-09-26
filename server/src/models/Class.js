import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String, trim: true, default: 'A' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true }, // e.g. "2024-25"
    classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    subjects: [
      {
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
      },
    ],
    maxStudents: { type: Number, default: 60 },
    room: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

classSchema.index({ course: 1, semester: 1, academicYear: 1 });

export default mongoose.model('Class', classSchema);
