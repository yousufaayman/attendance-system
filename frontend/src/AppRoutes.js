import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDahboard';
import StudentDashboard from './pages/StudentDashboard';

const App = () => {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={['teacher']} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={['student']} />}>
        <Route path="/student" element={<StudentDashboard />} />
      </Route>
    </Routes>
  </AuthProvider>
  );
};

export default App;
