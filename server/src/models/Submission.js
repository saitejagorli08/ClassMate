import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    submittedAt: { type: Date, default: Date.now },
    content: { type: String },
    attachments: [{ type: String }],
    isLate: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'returned', 'resubmit'],
      default: 'submitted',
    },
    marksObtained: { type: Number },
    feedback: { type: String },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gradedAt: { type: Date },
  },
  { timestamps: true }
);

// One submission per student per assignment
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model('Submission', submissionSchema);
