import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

let studentCounter = 1000;
let facultyCounter = 100;

export const generateStudentId = async () => {
  const last = await Student.findOne().sort({ studentId: -1 }).select('studentId');
  if (last?.studentId) {
    const num = parseInt(last.studentId.replace('STU', '')) + 1;
    return `STU${String(num).padStart(5, '0')}`;
  }
  return `STU${String(studentCounter++).padStart(5, '0')}`;
};

export const generateEmployeeId = async () => {
  const last = await Faculty.findOne().sort({ employeeId: -1 }).select('employeeId');
  if (last?.employeeId) {
    const num = parseInt(last.employeeId.replace('EMP', '')) + 1;
    return `EMP${String(num).padStart(4, '0')}`;
  }
  return `EMP${String(facultyCounter++).padStart(4, '0')}`;
};
