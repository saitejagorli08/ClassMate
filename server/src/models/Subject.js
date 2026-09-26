import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, unique: true, uppercase: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    semester: { type: Number, required: true },
    credits: { type: Number, default: 3 },
    type: { type: String, enum: ['theory', 'practical', 'elective'], default: 'theory' },
    maxMarks: { type: Number, default: 100 },
    passMarks: { type: Number, default: 35 },
    isActive: { type: Boolean, default: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  },
  { timestamps: true }
);

subjectSchema.index({ course: 1, semester: 1 });

export default mongoose.model('Subject', subjectSchema);
