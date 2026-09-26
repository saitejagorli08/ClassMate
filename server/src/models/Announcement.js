import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: {
      type: String,
      enum: ['all', 'student', 'faculty', 'admin'],
      default: 'all',
    },
    targetClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    targetDepartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    isPublished: { type: Boolean, default: true },
    isPinned: { type: Boolean, default: false },
    expiresAt: { type: Date },
    attachments: [{ type: String }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
  },
  { timestamps: true }
);

announcementSchema.index({ targetRole: 1, isPublished: 1 });
announcementSchema.index({ createdAt: -1 });

export default mongoose.model('Announcement', announcementSchema);
