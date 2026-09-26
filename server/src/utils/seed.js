import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Department from '../models/Department.js';
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import Class from '../models/Class.js';
import Enrollment from '../models/Enrollment.js';
import Attendance from '../models/Attendance.js';
import Examination from '../models/Examination.js';
import Result from '../models/Result.js';
import Assignment from '../models/Assignment.js';
import Announcement from '../models/Announcement.js';
import FeeStructure from '../models/FeeStructure.js';
import Payment from '../models/Payment.js';

console.log('🌱 Starting database seed...');

const seed = async () => {
  await connectDB();

  // Clear existing data (dev only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Faculty.deleteMany({}),
      Department.deleteMany({}),
      Course.deleteMany({}),
      Subject.deleteMany({}),
      Class.deleteMany({}),
      Enrollment.deleteMany({}),
      Attendance.deleteMany({}),
      Examination.deleteMany({}),
      Result.deleteMany({}),
      Assignment.deleteMany({}),
      Announcement.deleteMany({}),
      FeeStructure.deleteMany({}),
      Payment.deleteMany({}),
    ]);
  }

  // ─── 1. Departments ─────────────────────────────────────────────────────
  console.log('📂 Creating departments...');
  const [csDept, eceDept, mechDept] = await Department.create([
    { name: 'Computer Science & Engineering', code: 'CSE', description: 'Department of Computer Science' },
    { name: 'Electronics & Communication', code: 'ECE', description: 'Department of Electronics' },
    { name: 'Mechanical Engineering', code: 'MECH', description: 'Department of Mechanical Engineering' },
  ]);

  // ─── 2. Courses ──────────────────────────────────────────────────────────
  console.log('📖 Creating courses...');
  const [btech, mtech] = await Course.create([
    { name: 'B.Tech Computer Science', code: 'BTCS', department: csDept._id, duration: 4, totalSemesters: 8, fees: 120000 },
    { name: 'M.Tech Computer Science', code: 'MTCS', department: csDept._id, duration: 2, totalSemesters: 4, fees: 80000 },
  ]);

  // ─── 3. Subjects ─────────────────────────────────────────────────────────
  console.log('📝 Creating subjects...');
  const [dsa, dbms, os, cn, ml] = await Subject.create([
    { name: 'Data Structures & Algorithms', code: 'CSE301', course: btech._id, semester: 3, credits: 4, maxMarks: 100 },
    { name: 'Database Management Systems', code: 'CSE302', course: btech._id, semester: 3, credits: 3, maxMarks: 100 },
    { name: 'Operating Systems', code: 'CSE303', course: btech._id, semester: 3, credits: 3, maxMarks: 100 },
    { name: 'Computer Networks', code: 'CSE401', course: btech._id, semester: 4, credits: 4, maxMarks: 100 },
    { name: 'Machine Learning', code: 'CSE501', course: btech._id, semester: 5, credits: 4, maxMarks: 100 },
  ]);

  // ─── 4. Admin User ────────────────────────────────────────────────────────
  console.log('👤 Creating admin user...');
  const adminUser = await User.create({
    name: 'System Administrator',
    email: 'admin@sms.edu',
    password: 'Admin@123!',
    role: 'admin',
    phone: '+91-9999999999',
  });

  // ─── 5. Faculty Users ─────────────────────────────────────────────────────
  console.log('👨‍🏫 Creating faculty...');
  const [facUser1, facUser2] = await User.create([
    { name: 'Dr. Rajesh Kumar', email: 'rajesh@sms.edu', password: 'Faculty@123!', role: 'faculty', phone: '+91-8888888881' },
    { name: 'Prof. Priya Sharma', email: 'priya@sms.edu', password: 'Faculty@123!', role: 'faculty', phone: '+91-8888888882' },
  ]);

  const [faculty1, faculty2] = await Faculty.create([
    {
      user: facUser1._id, employeeId: 'EMP0001', firstName: 'Rajesh', lastName: 'Kumar',
      department: csDept._id, designation: 'Associate Professor', qualification: 'PhD CS',
      specialization: 'Algorithms', experience: 10, joinDate: new Date('2015-07-01'),
    },
    {
      user: facUser2._id, employeeId: 'EMP0002', firstName: 'Priya', lastName: 'Sharma',
      department: csDept._id, designation: 'Assistant Professor', qualification: 'M.Tech CS',
      specialization: 'Machine Learning', experience: 5, joinDate: new Date('2020-07-01'),
    },
  ]);

  await User.findByIdAndUpdate(facUser1._id, { facultyProfile: faculty1._id });
  await User.findByIdAndUpdate(facUser2._id, { facultyProfile: faculty2._id });

  // Update departments with heads
  await Department.findByIdAndUpdate(csDept._id, { head: faculty1._id });

  // ─── 6. Class ────────────────────────────────────────────────────────────
  console.log('🏫 Creating class...');
  const class1 = await Class.create({
    name: 'CS-3A', section: 'A', course: btech._id, department: csDept._id,
    semester: 3, academicYear: '2024-25', classTeacher: faculty1._id,
    subjects: [
      { subject: dsa._id, faculty: faculty1._id },
      { subject: dbms._id, faculty: faculty1._id },
      { subject: os._id, faculty: faculty2._id },
    ],
    maxStudents: 60, room: 'CS-301',
  });

  await Faculty.findByIdAndUpdate(faculty1._id, { assignedClasses: [class1._id], subjects: [dsa._id, dbms._id] });
  await Faculty.findByIdAndUpdate(faculty2._id, { assignedClasses: [class1._id], subjects: [os._id] });

  // ─── 7. Student Users ─────────────────────────────────────────────────────
  console.log('🎓 Creating students...');
  const studentData = [
    { name: 'Arjun Mehta', email: 'arjun@student.sms.edu', studentId: 'STU00001', first: 'Arjun', last: 'Mehta' },
    { name: 'Priya Patel', email: 'priya.p@student.sms.edu', studentId: 'STU00002', first: 'Priya', last: 'Patel' },
    { name: 'Rahul Singh', email: 'rahul@student.sms.edu', studentId: 'STU00003', first: 'Rahul', last: 'Singh' },
    { name: 'Ananya Gupta', email: 'ananya@student.sms.edu', studentId: 'STU00004', first: 'Ananya', last: 'Gupta' },
    { name: 'Vikram Nair', email: 'vikram@student.sms.edu', studentId: 'STU00005', first: 'Vikram', last: 'Nair' },
  ];

  const studentUsers = await User.create(
    studentData.map((s) => ({ name: s.name, email: s.email, password: 'Student@123!', role: 'student' }))
  );

  const students = await Student.create(
    studentData.map((s, i) => ({
      user: studentUsers[i]._id,
      studentId: s.studentId,
      firstName: s.first,
      lastName: s.last,
      department: csDept._id,
      course: btech._id,
      currentSemester: 3,
      admissionYear: 2023,
      graduationYear: 2027,
      status: 'active',
      feeStatus: i % 3 === 0 ? 'pending' : 'paid',
      gender: i % 2 === 0 ? 'Male' : 'Female',
      dateOfBirth: new Date(`200${i + 1}-0${i + 1}-15`),
      address: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
    }))
  );

  for (let i = 0; i < studentUsers.length; i++) {
    await User.findByIdAndUpdate(studentUsers[i]._id, { studentProfile: students[i]._id });
  }

  // ─── 8. Enrollments ──────────────────────────────────────────────────────
  console.log('📋 Creating enrollments...');
  await Enrollment.create(
    students.map((s) => ({ student: s._id, class: class1._id, academicYear: '2024-25' }))
  );

  // ─── 9. Attendance (last 30 days) ────────────────────────────────────────
  console.log('✅ Creating attendance records...');
  const attendanceRecords = [];
  const subjects = [dsa, dbms, os];
  const statuses = ['present', 'present', 'present', 'present', 'absent', 'late'];

  for (let day = 30; day >= 1; day--) {
    const date = new Date();
    date.setDate(date.getDate() - day);
    date.setHours(0, 0, 0, 0);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // skip weekends

    for (const subject of subjects) {
      for (const student of students) {
        attendanceRecords.push({
          student: student._id,
          class: class1._id,
          subject: subject._id,
          faculty: faculty1._id,
          date,
          status: statuses[Math.floor(Math.random() * statuses.length)],
        });
      }
    }
  }
  await Attendance.insertMany(attendanceRecords);

  // ─── 10. Examinations & Results ──────────────────────────────────────────
  console.log('📊 Creating examinations and results...');
  const midterm = await Examination.create({
    name: 'Midterm Exam - Sem 3',
    type: 'midterm',
    class: class1._id,
    subject: dsa._id,
    faculty: faculty1._id,
    maxMarks: 50,
    passingMarks: 18,
    examDate: new Date('2024-10-15'),
    semester: 3,
    academicYear: '2024-25',
    isPublished: true,
  });

  const marksData = [45, 32, 28, 48, 38];
  await Result.create(
    students.map((s, i) => ({
      student: s._id,
      examination: midterm._id,
      subject: dsa._id,
      marksObtained: marksData[i],
      maxMarks: 50,
      percentage: parseFloat(((marksData[i] / 50) * 100).toFixed(2)),
      grade: marksData[i] >= 45 ? 'A+' : marksData[i] >= 40 ? 'A' : marksData[i] >= 35 ? 'B+' : marksData[i] >= 25 ? 'C' : 'F',
      gradePoint: marksData[i] >= 45 ? 10 : marksData[i] >= 40 ? 9 : marksData[i] >= 35 ? 8 : marksData[i] >= 25 ? 5 : 0,
      status: marksData[i] >= 18 ? 'pass' : 'fail',
      enteredBy: facUser1._id,
    }))
  );

  // ─── 11. Assignments ─────────────────────────────────────────────────────
  console.log('📄 Creating assignments...');
  await Assignment.create([
    {
      title: 'DSA Lab - Sorting Algorithms',
      description: 'Implement and analyze bubble, merge, and quick sort algorithms.',
      class: class1._id,
      subject: dsa._id,
      faculty: faculty1._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxMarks: 20,
    },
    {
      title: 'DBMS Project - Library System',
      description: 'Design and implement a library management database.',
      class: class1._id,
      subject: dbms._id,
      faculty: faculty1._id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      maxMarks: 30,
    },
  ]);

  // ─── 12. Announcements ───────────────────────────────────────────────────
  console.log('📢 Creating announcements...');
  await Announcement.create([
    {
      title: '🎓 Mid-semester Examination Schedule Released',
      content: 'The mid-semester examination schedule for Semester 3 has been released. Check the timetable section.',
      author: adminUser._id,
      targetRole: 'all',
      isPinned: true,
      priority: 'high',
    },
    {
      title: '🏖️ Dussehra Holiday Notice',
      content: 'The institution will remain closed from October 12 to 14 on account of Dussehra. Classes resume October 15.',
      author: adminUser._id,
      targetRole: 'all',
      priority: 'medium',
    },
    {
      title: '📝 Faculty: Submit Marks Before October 30',
      content: 'All faculty are requested to enter mid-semester marks by October 30, 2024.',
      author: adminUser._id,
      targetRole: 'faculty',
      priority: 'high',
    },
  ]);

  // ─── 13. Fee Structure & Payments ────────────────────────────────────────
  console.log('💰 Creating fee structures and payments...');
  await FeeStructure.create({
    course: btech._id,
    semester: 3,
    academicYear: '2024-25',
    components: [
      { name: 'Tuition Fee', amount: 60000 },
      { name: 'Lab Fee', amount: 10000 },
      { name: 'Exam Fee', amount: 5000 },
      { name: 'Library Fee', amount: 2000 },
      { name: 'Sports Fee', amount: 1500 },
    ],
    totalAmount: 78500,
    dueDate: new Date('2024-08-31'),
    lateFeePerDay: 100,
  });

  await Payment.create(
    students.slice(0, 3).map((s, i) => ({
      student: s._id,
      amount: 78500,
      paymentDate: new Date(`2024-08-${10 + i}`),
      method: ['online', 'cash', 'upi'][i],
      status: 'success',
      receiptNumber: `RCP-2024-${1001 + i}`,
      semester: 3,
      academicYear: '2024-25',
      description: 'Semester 3 Fee Payment',
      recordedBy: adminUser._id,
    }))
  );

  console.log('\n✅ Database seeded successfully!');
  console.log('\n🔑 Demo Accounts:');
  console.log('  Admin:   admin@sms.edu      / Admin@123!');
  console.log('  Faculty: rajesh@sms.edu     / Faculty@123!');
  console.log('  Faculty: priya@sms.edu      / Faculty@123!');
  console.log('  Student: arjun@student.sms.edu  / Student@123!');
  console.log('  Student: priya.p@student.sms.edu / Student@123!');
  console.log('\n⚠️  Change all passwords before any production use.\n');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
