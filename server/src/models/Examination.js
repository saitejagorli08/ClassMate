import mongoose from 'mongoose';

const examinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['midterm', 'final', 'quiz', 'assignment', 'practical', 'internal'],
      required: true,
    },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    maxMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    examDate: { type: Date },
    semester: { type: Number },
    academicYear: { type: String },
    instructions: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

examinationSchema.index({ class: 1, subject: 1 });
examinationSchema.index({ subject: 1, type: 1 });

export default mongoose.model('Examination', examinationSchema);
