import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    dueDate: { type: Date, required: true },
    maxMarks: { type: Number, default: 100 },
    attachments: [{ type: String }], // file URLs
    isPublished: { type: Boolean, default: true },
    allowLateSubmission: { type: Boolean, default: false },
  },
  { timestamps: true }
);

assignmentSchema.index({ class: 1, subject: 1 });
assignmentSchema.index({ faculty: 1 });
assignmentSchema.index({ dueDate: 1 });

export default mongoose.model('Assignment', assignmentSchema);
