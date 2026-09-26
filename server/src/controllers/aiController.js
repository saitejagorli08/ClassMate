import { buildStudentContext, callAI } from '../services/aiService.js';
import Student from '../models/Student.js';

const STUDENT_SYSTEM_PROMPT = `You are an AI Student Assistant for an educational institution. 
You have access to a student's academic data including attendance, marks, grades, assignments, and fee status.

Rules:
1. Only discuss the provided student's data — never invent data.
2. Be encouraging and constructive.
3. Always label AI recommendations as "suggestions" or "recommendations".
4. Never modify academic records — you can only provide information.
5. Do not expose other students' data.
6. If asked about something outside your data scope, politely decline.
7. Provide personalized study advice based on weak subjects (low grades).
8. Keep responses concise, clear, and formatted with markdown.`;

const FACULTY_SYSTEM_PROMPT = `You are an AI Faculty Assistant for an educational institution.
You help faculty generate quizzes, analyze class performance, and draft student feedback.

Rules:
1. Generate educational content only for the provided subject/topic.
2. Always note that AI-generated content must be reviewed before publishing.
3. Provide clear, structured, educationally sound content.
4. Do not expose student personal information beyond academic performance.`;

export const studentChat = async (req, res) => {
  const { message, studentId } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  // Get student ID from profile if not provided
  let targetStudentId = studentId;
  if (req.user.role === 'student') {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });
    targetStudentId = student._id.toString();
  }

  const context = await buildStudentContext(targetStudentId, req.user);
  const response = await callAI(STUDENT_SYSTEM_PROMPT, message, context);

  res.json({
    success: true,
    data: {
      message: response,
      isAI: true,
      disclaimer: 'AI-generated content. Recommendations are suggestions only.',
    },
  });
};

export const generateQuiz = async (req, res) => {
  const { topic, subject, numQuestions = 5, difficulty = 'medium' } = req.body;

  const prompt = `Generate a ${numQuestions}-question multiple choice quiz on the topic: "${topic}" for subject: "${subject}".
Difficulty: ${difficulty}.
Format each question as:
Q[n]: [Question]
A) [Option A]
B) [Option B]  
C) [Option C]
D) [Option D]
Answer: [Correct letter]
Explanation: [Brief explanation]`;

  const response = await callAI(FACULTY_SYSTEM_PROMPT, prompt, { topic, subject });

  res.json({
    success: true,
    data: {
      quiz: response,
      topic,
      subject,
      disclaimer: 'AI-generated quiz. Please review before publishing to students.',
    },
  });
};

export const summarizeClassPerformance = async (req, res) => {
  const { examinationId } = req.params;

  const Result = (await import('../models/Result.js')).default;
  const results = await Result.find({ examination: examinationId })
    .populate('student', 'firstName lastName')
    .populate('subject', 'name');

  if (!results.length) {
    return res.json({ success: true, data: { summary: 'No results found for this examination.' } });
  }

  const context = {
    examination: examinationId,
    totalStudents: results.length,
    averageMarks: (results.reduce((a, r) => a + r.marksObtained, 0) / results.length).toFixed(1),
    passed: results.filter((r) => r.status === 'pass').length,
    failed: results.filter((r) => r.status === 'fail').length,
    gradeDistribution: results.reduce((acc, r) => {
      acc[r.grade] = (acc[r.grade] || 0) + 1;
      return acc;
    }, {}),
  };

  const prompt = `Analyze this class examination performance data and provide:
1. A performance summary
2. Key observations
3. Topics that may need review
4. Recommended teaching strategies

Data: ${JSON.stringify(context)}`;

  const response = await callAI(FACULTY_SYSTEM_PROMPT, prompt, context);

  res.json({
    success: true,
    data: {
      summary: response,
      metrics: context,
      disclaimer: 'AI-generated analysis. Review before sharing with students.',
    },
  });
};
