import React from 'react';
import { useAuth } from '../AuthContext';
import '../assets/styles/AdminSidebar.css';

const AdminSidebar = ({ table, setTable }) => {
  const { logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Admin</h2>
      </div>
      <ul className="sidebar-menu">
        <li className={table === 'students' ? 'active' : ''}>
          <button onClick={() => setTable('students')}>Students</button>
        </li>
        <li className={table === 'teachers' ? 'active' : ''}>
          <button onClick={() => setTable('teachers')}>Teachers</button>
        </li>
        <li className={table === 'classes' ? 'active' : ''}>
          <button onClick={() => setTable('classes')}>Classes</button>
        </li>
        <li className={table === 'courses' ? 'active' : ''}>
          <button onClick={() => setTable('courses')}>Courses</button>
        </li>
        <li className={table === 'groups' ? 'active' : ''}>
          <button onClick={() => setTable('groups')}>Groups</button>
        </li>
        <li>
          <button className="logout-button" onClick={logout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
