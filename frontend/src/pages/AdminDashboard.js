import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminDataManagment from '../components/AdminDataManagment';
import '../assets/styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [table, setTable] = useState('students');

    return (
      <div className="admin-dashboard">
        <AdminSidebar table={table} setTable={setTable} />
        <div className="dashboard-content">
          <AdminDataManagment table={table} />
        </div>
      </div>
    );
  };

export default AdminDashboard;
