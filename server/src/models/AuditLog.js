import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // CREATE, UPDATE, DELETE, LOGIN, etc.
    resource: { type: String, required: true }, // model name
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    changes: { type: mongoose.Schema.Types.Mixed }, // { before, after }
    ipAddress: { type: String },
    userAgent: { type: String },
    reason: { type: String },
    status: { type: String, enum: ['success', 'failure'], default: 'success' },
  },
  { timestamps: true }
);

auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });
auditLogSchema.index({ action: 1, createdAt: -1 });

export default mongoose.model('AuditLog', auditLogSchema);
