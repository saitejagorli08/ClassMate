import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    academicYear: { type: String, required: true },
    schedule: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          required: true,
        },
        periods: [
          {
            periodNumber: { type: Number, required: true },
            subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
            faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
            startTime: { type: String, required: true }, // "09:00"
            endTime: { type: String, required: true },   // "10:00"
            room: { type: String },
            type: { type: String, enum: ['lecture', 'lab', 'break', 'free'], default: 'lecture' },
          },
        ],
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

timetableSchema.index({ class: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('Timetable', timetableSchema);
