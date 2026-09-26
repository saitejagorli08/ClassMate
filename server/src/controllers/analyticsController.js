import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Attendance from '../models/Attendance.js';
import Result from '../models/Result.js';
import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';

export const getAdminAnalytics = async (req, res) => {
  const [
    totalStudents,
    activeStudents,
    totalFaculty,
    totalAttendance,
    totalPayments,
    recentEnrollments,
  ] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ status: 'active' }),
    Faculty.countDocuments({ status: 'active' }),
    Attendance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Enrollment.aggregate([
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
  ]);

  const attendanceMap = {};
  totalAttendance.forEach((a) => (attendanceMap[a._id] = a.count));

  const totalDays = Object.values(attendanceMap).reduce((a, b) => a + b, 0);
  const presentDays = (attendanceMap.present || 0) + (attendanceMap.late || 0);
  const overallAttendance = totalDays > 0 ? parseFloat(((presentDays / totalDays) * 100).toFixed(1)) : 0;

  res.json({
    success: true,
    data: {
      overview: {
        totalStudents,
        activeStudents,
        totalFaculty,
        overallAttendance,
        totalFeeCollected: totalPayments[0]?.total || 0,
      },
      attendance: attendanceMap,
      enrollmentTrend: recentEnrollments,
    },
  });
};

export const getFacultyAnalytics = async (req, res) => {
  const faculty = await Faculty.findOne({ user: req.user._id });
  if (!faculty) return res.status(404).json({ success: false, message: 'Faculty profile not found.' });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayAttendance, classCount] = await Promise.all([
    Attendance.find({ faculty: faculty._id, date: { $gte: today, $lt: tomorrow } }).countDocuments(),
    Enrollment.aggregate([
      { $group: { _id: '$class', count: { $sum: 1 } } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      todayAttendanceMarked: todayAttendance,
      assignedClasses: faculty.assignedClasses?.length || 0,
    },
  });
};

export const getStudentAnalytics = async (req, res) => {
  const student = await Student.findOne({ user: req.user._id });
  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });

  const [attendanceRecords, results, payments] = await Promise.all([
    Attendance.find({ student: student._id }).populate('subject', 'name code'),
    Result.find({ student: student._id }).populate('subject', 'name code credits').populate('examination', 'name type semester'),
    Payment.find({ student: student._id, status: 'success' }).sort({ createdAt: -1 }).limit(5),
  ]);

  // Attendance by subject
  const subjectAttendance = {};
  for (const r of attendanceRecords) {
    const key = r.subject?._id?.toString() || 'unknown';
    if (!subjectAttendance[key]) subjectAttendance[key] = { subject: r.subject, total: 0, present: 0 };
    subjectAttendance[key].total++;
    if (r.status === 'present' || r.status === 'late') subjectAttendance[key].present++;
  }

  const attendanceSummary = Object.values(subjectAttendance).map((s) => ({
    subject: s.subject?.name,
    percentage: s.total > 0 ? parseFloat(((s.present / s.total) * 100).toFixed(1)) : 0,
  }));

  const overallAttendance = attendanceRecords.length > 0
    ? parseFloat(((attendanceRecords.filter((r) => r.status === 'present' || r.status === 'late').length / attendanceRecords.length) * 100).toFixed(1))
    : 0;

  res.json({
    success: true,
    data: {
      student: { name: `${student.firstName} ${student.lastName}`, studentId: student.studentId },
      overallAttendance,
      attendanceSummary,
      recentResults: results.slice(0, 10),
      recentPayments: payments,
    },
  });
};
