import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Result from '../models/Result.js';
import Assignment from '../models/Assignment.js';
import Payment from '../models/Payment.js';
import Announcement from '../models/Announcement.js';

/**
 * Fetch student context data for AI — only what the requesting user is authorized to see.
 */
export const buildStudentContext = async (studentId, requestingUser) => {
  // Authorization guard
  if (requestingUser.role === 'student') {
    const student = await Student.findOne({ user: requestingUser._id });
    if (!student || student._id.toString() !== studentId) {
      throw new Error('Unauthorized: You can only access your own data.');
    }
  }

  const student = await Student.findById(studentId)
    .populate('department', 'name')
    .populate('course', 'name code');

  if (!student) throw new Error('Student not found.');

  const [attendanceRecords, results, pendingAssignments, payments] = await Promise.all([
    Attendance.find({ student: studentId }).populate('subject', 'name'),
    Result.find({ student: studentId }).populate('subject', 'name credits').populate('examination', 'name type semester maxMarks'),
    Assignment.find({}).sort({ dueDate: 1 }).limit(5),
    Payment.find({ student: studentId, status: 'success' }),
  ]);

  // Compute attendance summary
  const totalClasses = attendanceRecords.length;
  const presentClasses = attendanceRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const attendancePercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 'N/A';

  // Compute results summary
  const subjectResults = {};
  for (const r of results) {
    const name = r.subject?.name || 'Unknown';
    if (!subjectResults[name]) subjectResults[name] = [];
    subjectResults[name].push({ type: r.examination?.type, marks: r.marksObtained, max: r.maxMarks, grade: r.grade, percentage: r.percentage });
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return {
    student: {
      name: `${student.firstName} ${student.lastName}`,
      studentId: student.studentId,
      course: student.course?.name,
      department: student.department?.name,
      semester: student.currentSemester,
      status: student.status,
      feeStatus: student.feeStatus,
    },
    attendance: {
      percentage: attendancePercentage,
      totalClasses,
      presentClasses,
      warning: parseFloat(attendancePercentage) < 75,
    },
    results: subjectResults,
    fees: {
      totalPaid,
      status: student.feeStatus,
    },
    pendingAssignments: pendingAssignments.map((a) => ({
      title: a.title,
      subject: a.subject?.toString(),
      dueDate: a.dueDate?.toDateString(),
    })),
  };
};

/**
 * Call Google Gemini API (or compatible AI) with student context
 */
export const callAI = async (systemPrompt, userMessage, context) => {
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'gemini-1.5-flash';

  if (!apiKey || apiKey === 'your_ai_api_key_here') {
    return generateFallbackResponse(userMessage, context);
  }

  const provider = process.env.AI_PROVIDER || 'gemini';

  if (provider === 'gemini') {
    const { GoogleGenerativeAI } = await import('@google/generative-ai').catch(() => null) || {};
    
    if (!GoogleGenerativeAI) {
      // Try fetch-based approach
      return await callGeminiViaFetch(apiKey, model, systemPrompt, userMessage, context);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const geminiModel = genAI.getGenerativeModel({ model });
    const result = await geminiModel.generateContent([
      { text: systemPrompt + '\n\nStudent Data Context:\n' + JSON.stringify(context, null, 2) },
      { text: 'User Question: ' + userMessage },
    ]);
    return result.response.text();
  }

  return generateFallbackResponse(userMessage, context);
};

const callGeminiViaFetch = async (apiKey, model, systemPrompt, userMessage, context) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body = {
    contents: [
      {
        parts: [
          { text: systemPrompt + '\n\nStudent Data:\n' + JSON.stringify(context, null, 2) + '\n\nUser: ' + userMessage },
        ],
      },
    ],
    generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`AI API error: ${err.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not generate a response.';
};

const generateFallbackResponse = (userMessage, context) => {
  const lower = userMessage.toLowerCase();
  const ctx = context?.student;

  if (lower.includes('attendance')) {
    return `📊 **Attendance Summary** (Based on your records)\n\n- Overall Attendance: **${context?.attendance?.percentage || 'N/A'}%**\n- Classes Present: **${context?.attendance?.presentClasses || 0}** of **${context?.attendance?.totalClasses || 0}**\n${context?.attendance?.warning ? '\n⚠️ **Warning:** Your attendance is below 75%. Please attend classes regularly.' : '\n✅ Your attendance is in good standing.'}\n\n*Note: AI assistant is operating in offline mode. For full personalized insights, configure an AI API key.*`;
  }
  if (lower.includes('mark') || lower.includes('result') || lower.includes('grade')) {
    const resultsText = context?.results
      ? Object.entries(context.results).map(([sub, r]) => `- **${sub}**: ${r[0]?.grade || 'N/A'} (${r[0]?.percentage || 0}%)`).join('\n')
      : 'No results found.';
    return `📝 **Your Academic Results**\n\n${resultsText}\n\n*AI assistant is in offline mode. Configure an AI API key for personalized study plans.*`;
  }
  if (lower.includes('fee') || lower.includes('payment')) {
    return `💰 **Fee Status**: ${context?.fees?.status || 'Unknown'}\n- Total Paid: ₹${context?.fees?.totalPaid || 0}\n\n*Contact the admin office for payment assistance.*`;
  }

  return `👋 Hello! I'm your AI Student Assistant.\n\nYou can ask me about:\n- 📊 Your attendance percentage\n- 📝 Your marks and grades\n- 💰 Your fee status\n- 📚 Study recommendations\n- 🗓️ Upcoming assignments\n\n*Note: AI is currently in offline mode. Configure an AI API key for full functionality.*`;
};
