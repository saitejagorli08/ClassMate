import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    photo: { type: String },
    qualification: { type: String },
    specialization: { type: String },
    experience: { type: Number, default: 0 }, // years
    joinDate: { type: Date, default: Date.now },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    designation: { type: String, default: 'Assistant Professor' },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'India' },
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave'],
      default: 'active',
    },
  },
  { timestamps: true }
);

facultySchema.index({ department: 1, status: 1 });

export default mongoose.model('Faculty', facultySchema);
