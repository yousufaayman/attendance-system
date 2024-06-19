import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './AuthContext';
import TeacherDashboard from './pages/TeacherDahboard';

const App = () => {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/unauthorized" element={<h1>Unauthorized Access to Page</h1>} />

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
      <Route element={<ProtectedRoute roles={['teacher']} />}>
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Route>
    </Routes>
  </AuthProvider>
  );
};

export default App;
