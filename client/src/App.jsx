import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentManagement } from './pages/admin/StudentManagement';
import { FacultyManagement } from './pages/admin/FacultyManagement';
import { CourseManagement } from './pages/admin/CourseManagement';
import { AttendanceAdmin } from './pages/admin/AttendanceAdmin';
import { ExamAdmin } from './pages/admin/ExamAdmin';
import { FeeManagement } from './pages/admin/FeeManagement';
import { AnnouncementsPage } from './pages/shared/AnnouncementsPage';
import { AiInsightsAdmin } from './pages/admin/AiInsightsAdmin';

// Faculty pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { MarkAttendance } from './pages/faculty/MarkAttendance';
import { AssignmentManager } from './pages/faculty/AssignmentManager';
import { AiFacultyTools } from './pages/faculty/AiFacultyTools';

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyAttendance } from './pages/student/MyAttendance';
import { MyResults } from './pages/student/MyResults';
import { MyAssignments } from './pages/student/MyAssignments';
import { MyFees } from './pages/student/MyFees';
import { AiStudyAssistant } from './pages/student/AiStudyAssistant';

// Shared
import { ProfilePage } from './pages/shared/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <DashboardLayout title="Admin Portal" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminDashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="faculty" element={<FacultyManagement />} />
          <Route path="users" element={<StudentManagement />} />
          <Route path="departments" element={<CourseManagement />} />
          <Route path="courses" element={<CourseManagement />} />
          <Route path="classes" element={<CourseManagement />} />
          <Route path="attendance" element={<AttendanceAdmin />} />
          <Route path="examinations" element={<ExamAdmin />} />
          <Route path="fees" element={<FeeManagement />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="ai-insights" element={<AiInsightsAdmin />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Faculty Routes */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['faculty', 'admin', 'superadmin']}>
              <DashboardLayout title="Faculty Portal" />
            </ProtectedRoute>
          }
        >
          <Route index element={<FacultyDashboard />} />
          <Route path="attendance" element={<MarkAttendance />} />
          <Route path="examinations" element={<ExamAdmin />} />
          <Route path="assignments" element={<AssignmentManager />} />
          <Route path="ai-tools" element={<AiFacultyTools />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout title="Student Portal" />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="results" element={<MyResults />} />
          <Route path="assignments" element={<MyAssignments />} />
          <Route path="timetable" element={<MyAttendance />} />
          <Route path="fees" element={<MyFees />} />
          <Route path="ai-assistant" element={<AiStudyAssistant />} />
          <Route path="ai-tutor" element={<AiStudyAssistant />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
