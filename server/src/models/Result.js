import mongoose from 'mongoose';

const GRADE_SCALE = [
  { min: 90, grade: 'A+', gradePoint: 10 },
  { min: 80, grade: 'A', gradePoint: 9 },
  { min: 70, grade: 'B+', gradePoint: 8 },
  { min: 60, grade: 'B', gradePoint: 7 },
  { min: 50, grade: 'C+', gradePoint: 6 },
  { min: 40, grade: 'C', gradePoint: 5 },
  { min: 35, grade: 'D', gradePoint: 4 },
  { min: 0, grade: 'F', gradePoint: 0 },
];

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    examination: { type: mongoose.Schema.Types.ObjectId, ref: 'Examination', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    marksObtained: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true },
    percentage: { type: Number },
    grade: { type: String },
    gradePoint: { type: Number },
    status: { type: String, enum: ['pass', 'fail', 'absent', 'withheld'] },
    remarks: { type: String },
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Auto-compute percentage, grade, pass/fail
resultSchema.pre('save', function (next) {
  if (this.maxMarks > 0) {
    this.percentage = parseFloat(((this.marksObtained / this.maxMarks) * 100).toFixed(2));
    const gradeInfo = GRADE_SCALE.find((g) => this.percentage >= g.min);
    this.grade = gradeInfo?.grade || 'F';
    this.gradePoint = gradeInfo?.gradePoint || 0;
    this.status = this.percentage >= (this.examination?.passingMarks || 35) ? 'pass' : 'fail';
  }
  next();
});

resultSchema.index({ student: 1, examination: 1 }, { unique: true });
resultSchema.index({ student: 1, subject: 1 });
resultSchema.index({ examination: 1 });

export default mongoose.model('Result', resultSchema);
