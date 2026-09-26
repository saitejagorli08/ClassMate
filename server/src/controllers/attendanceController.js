import Attendance from '../models/Attendance.js';
import Enrollment from '../models/Enrollment.js';
import Student from '../models/Student.js';
import AuditLog from '../models/AuditLog.js';

export const markAttendance = async (req, res) => {
  const { classId, subjectId, date, records = [] } = req.body;
  const faculty = req.user.facultyProfile;
  const attendanceDate = new Date(date || Date.now());
  attendanceDate.setHours(0, 0, 0, 0);

  const results = { created: 0, errors: [] };

  for (const record of records) {
    try {
      const sId = record.studentId || record.student;
      if (!sId) continue;

      await Attendance.findOneAndUpdate(
        { student: sId, subject: subjectId, date: attendanceDate },
        {
          student: sId,
          class: classId,
          subject: subjectId,
          faculty: faculty?._id,
          date: attendanceDate,
          status: record.status || 'present',
          remarks: record.remarks,
        },
        { upsert: true, new: true, runValidators: true }
      );
      results.created++;
    } catch (e) {
      results.errors.push({ studentId: record.studentId || record.student, error: e.message });
    }
  }

  res.status(201).json({ success: true, message: `Attendance marked for ${results.created} students.`, ...results });
};

export const getAttendanceByClass = async (req, res) => {
  const { classId, subjectId, date, startDate, endDate } = req.query;
  const filter = { class: classId };
  if (subjectId) filter.subject = subjectId;
  if (date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    filter.date = d;
  } else if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const records = await Attendance.find(filter)
    .populate('student', 'studentId firstName lastName')
    .populate('subject', 'name code')
    .sort({ date: -1 });

  res.json({ success: true, data: records });
};

export const getStudentAttendance = async (req, res) => {
  const { studentId } = req.params;
  const { subjectId, startDate, endDate } = req.query;

  // Authorization: students can only see their own
  if (req.user.role === 'student') {
    const student = await Student.findOne({ user: req.user._id });
    if (!student || student._id.toString() !== studentId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
  }

  const filter = { student: studentId };
  if (subjectId) filter.subject = subjectId;
  if (startDate && endDate) filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

  const records = await Attendance.find(filter).populate('subject', 'name code');
  
  // Calculate percentages per subject
  const subjectMap = {};
  for (const r of records) {
    const key = r.subject?._id?.toString();
    if (!subjectMap[key]) subjectMap[key] = { subject: r.subject, total: 0, present: 0, absent: 0, late: 0, excused: 0 };
    subjectMap[key].total++;
    subjectMap[key][r.status]++;
  }

  const summary = Object.values(subjectMap).map((s) => ({
    ...s,
    percentage: s.total > 0 ? parseFloat(((s.present + s.late) / s.total * 100).toFixed(1)) : 0,
  }));

  res.json({ success: true, data: { records, summary } });
};

export const correctAttendance = async (req, res) => {
  const { attendanceId, newStatus, reason } = req.body;
  const record = await Attendance.findById(attendanceId);
  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found.' });

  const previousStatus = record.status;
  record.status = newStatus;
  record.corrections.push({
    correctedBy: req.user._id,
    correctedAt: new Date(),
    previousStatus,
    newStatus,
    reason,
  });
  await record.save();

  await AuditLog.create({
    user: req.user._id,
    action: 'UPDATE',
    resource: 'Attendance',
    resourceId: record._id,
    changes: { before: { status: previousStatus }, after: { status: newStatus } },
    reason,
    ipAddress: req.ip,
  });

  res.json({ success: true, message: 'Attendance corrected.', data: record });
};
