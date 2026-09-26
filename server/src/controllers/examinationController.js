import Result from '../models/Result.js';
import Examination from '../models/Examination.js';
import Student from '../models/Student.js';

export const createExamination = async (req, res) => {
  const exam = await Examination.create({ ...req.body, faculty: req.user.facultyProfile });
  res.status(201).json({ success: true, message: 'Examination created.', data: exam });
};

export const getExaminations = async (req, res) => {
  const { classId, subjectId, type } = req.query;
  const filter = {};
  if (classId) filter.class = classId;
  if (subjectId) filter.subject = subjectId;
  if (type) filter.type = type;
  const exams = await Examination.find(filter)
    .populate('class', 'name')
    .populate('subject', 'name code')
    .sort({ examDate: -1 });
  res.json({ success: true, data: exams });
};

export const enterResults = async (req, res) => {
  const { examinationId, results } = req.body;
  const exam = await Examination.findById(examinationId);
  if (!exam) return res.status(404).json({ success: false, message: 'Examination not found.' });

  const saved = [];
  const errors = [];

  for (const r of results) {
    try {
      const result = await Result.findOneAndUpdate(
        { student: r.studentId, examination: examinationId },
        {
          student: r.studentId,
          examination: examinationId,
          subject: exam.subject,
          marksObtained: r.marksObtained,
          maxMarks: exam.maxMarks,
          remarks: r.remarks,
          status: r.status || (r.marksObtained >= exam.passingMarks ? 'pass' : 'fail'),
          enteredBy: req.user._id,
        },
        { upsert: true, new: true, runValidators: true }
      );
      saved.push(result);
    } catch (e) {
      errors.push({ studentId: r.studentId, error: e.message });
    }
  }

  res.json({ success: true, message: `Results entered for ${saved.length} students.`, data: saved, errors });
};

export const getStudentResults = async (req, res) => {
  const { studentId } = req.params;

  if (req.user.role === 'student') {
    const student = await Student.findOne({ user: req.user._id });
    if (!student || student._id.toString() !== studentId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
  }

  const results = await Result.find({ student: studentId })
    .populate('subject', 'name code credits')
    .populate({ path: 'examination', select: 'name type semester academicYear maxMarks' })
    .sort({ createdAt: -1 });

  // Aggregate by semester
  const semesterMap = {};
  for (const r of results) {
    const sem = r.examination?.semester || 'N/A';
    if (!semesterMap[sem]) semesterMap[sem] = { semester: sem, results: [], totalCredits: 0, totalPoints: 0 };
    semesterMap[sem].results.push(r);
    if (r.gradePoint && r.subject?.credits) {
      semesterMap[sem].totalCredits += r.subject.credits;
      semesterMap[sem].totalPoints += r.gradePoint * r.subject.credits;
    }
  }

  const semesters = Object.values(semesterMap).map((s) => ({
    ...s,
    sgpa: s.totalCredits > 0 ? parseFloat((s.totalPoints / s.totalCredits).toFixed(2)) : 0,
  }));

  res.json({ success: true, data: { results, semesters } });
};

export const getClassResults = async (req, res) => {
  const { examinationId } = req.params;
  const results = await Result.find({ examination: examinationId })
    .populate('student', 'studentId firstName lastName')
    .sort({ marksObtained: -1 });

  const summary = {
    total: results.length,
    passed: results.filter((r) => r.status === 'pass').length,
    failed: results.filter((r) => r.status === 'fail').length,
    highest: results[0]?.marksObtained || 0,
    average: results.length ? (results.reduce((a, r) => a + r.marksObtained, 0) / results.length).toFixed(1) : 0,
  };

  res.json({ success: true, data: { results, summary } });
};
