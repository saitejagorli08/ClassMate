import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    rollNumber: { type: String, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    bloodGroup: { type: String },
    photo: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
    },
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String },
    guardianRelation: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    currentSemester: { type: Number, default: 1 },
    admissionDate: { type: Date, default: Date.now },
    admissionYear: { type: Number },
    graduationYear: { type: Number },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'suspended', 'dropped'],
      default: 'active',
    },
    feeStatus: {
      type: String,
      enum: ['paid', 'partial', 'pending', 'overdue'],
      default: 'pending',
    },
    academicHistory: [
      {
        semester: Number,
        gpa: Number,
        sgpa: Number,
        remarks: String,
      },
    ],
  },
  { timestamps: true }
);

studentSchema.index({ department: 1, status: 1 });
studentSchema.index({ course: 1, currentSemester: 1 });

export default mongoose.model('Student', studentSchema);
