import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../AuthContext';
import '../assets/styles/AdminDataManagment.css';
import { v4 as uuidv4 } from 'uuid';

const AdminDataManagement = ({ table }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('name');
  const [newEntry, setNewEntry] = useState({});
  const [editEntry, setEditEntry] = useState(null);
  const [foreignKeyData, setForeignKeyData] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [editSelectedInstructors, setEditSelectedInstructors] = useState([]);

  const { authAxios } = useAuth();

  const foreignKeyFields = useMemo(() => ({
    students: ['group_id'],
    classes: ['course_id', 'room_id', 'teacher_id'],
    attendanceRecords: ['student_id', 'class_id'],
    courses: ['teacher_id'],
  }), []);

  const fetchData = useCallback(async () => {
    try {
      const response = await authAxios.get(`/api/data/${table}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [table, authAxios]);

  const fetchForeignKeyData = useCallback(async () => {
    const foreignKeys = foreignKeyFields[table];
    if (!foreignKeys) return;

    const promises = foreignKeys.map(async (key) => {
      const response = await authAxios.get(`/api/data/${key.replace('_id', 's')}`);
      return { [key]: response.data };
    });

    const results = await Promise.all(promises);
    const foreignKeyData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    setForeignKeyData(foreignKeyData);

    console.log('ForeignKeyData:', foreignKeyData); // Add this line to debug
  }, [table, foreignKeyFields, authAxios]);

  useEffect(() => {
    if (table) {
      fetchData();
      fetchForeignKeyData();
    }
  }, [table, fetchData, fetchForeignKeyData]);

  const handleSearch = () => {
    const filteredData = data.filter(item => {
      if (item[filter] != null) {
        return item[filter].toString().toLowerCase().includes(search.toLowerCase());
      }
      return false;
    });
    setData(filteredData);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleNewEntryChange = (e) => {
    setNewEntry({
      ...newEntry,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditEntryChange = (e) => {
    setEditEntry({
      ...editEntry,
      [e.target.name]: e.target.value,
    });
  };

  const handleInstructorChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedInstructors([...selectedInstructors, value]);
    } else {
      setSelectedInstructors(selectedInstructors.filter(id => id !== value));
    }
    console.log('SelectedInstructors:', selectedInstructors); // Add this line to debug
  };

  const handleEditInstructorChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEditSelectedInstructors([...editSelectedInstructors, value]);
    } else {
      setEditSelectedInstructors(editSelectedInstructors.filter(id => id !== value));
    }
  };

  const handleAddNewEntry = async () => {
    const entryWithID = {
      ...newEntry,
      id: uuidv4(),
      teachers: selectedInstructors
    };

    console.log('EntryWithID:', entryWithID); // Add this line to debug

    try {
      const response = await authAxios.post(`/api/data/${table}`, entryWithID);
      setData([...data, response.data]);
      setNewEntry({});
      setSelectedInstructors([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding new entry:', error);
    }
  };

  const handleUpdateEntry = async () => {
    try {
      const entryWithInstructors = {
        ...editEntry,
        teachers: editSelectedInstructors
      };

      console.log('EntryWithInstructors:', entryWithInstructors); // Add this line to debug

      const response = await authAxios.put(`/api/data/${table}/${editEntry.id}`, entryWithInstructors);
      setData(data.map(item => (item.id === editEntry.id ? response.data : item)));
      setEditEntry(null);
      setEditSelectedInstructors([]);
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await authAxios.delete(`/api/data/${table}/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== '') {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  return (
    <div className="data-management">
      <div className="search-bar">
        <input
          type="text"
          placeholder={`Search ${table} by ${filter}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={handleFilterChange}>
          {Object.keys(data[0] || {}).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      <button className="add-entry-button" onClick={() => setIsModalOpen(true)}>
        Add New Entry
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Entry</h2>
        {Object.keys(data[0] || {}).map((key) => {
          if (key === 'createdAt' || key === 'updatedAt' || key === 'id') return null;
          if (foreignKeyFields[table] && foreignKeyFields[table].includes(key)) {
            return (
              <select
                key={key}
                name={key}
                value={newEntry[key] || ''}
                onChange={handleNewEntryChange}
              >
                <option value="">Select {key.replace('_id', '')}</option>
                {foreignKeyData[key] && foreignKeyData[key].map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            );
          } else if (table === 'courses' && key === 'teacher_id') {
            return (
              <div key={key}>
                <label>Instructors:</label>
                <select multiple={true} value={selectedInstructors} onChange={handleInstructorChange}>
                  {foreignKeyData.teachers && foreignKeyData.teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          } else {
            return (
              <input
              key={key}
              name={key}
              placeholder={key}
              value={newEntry[key] || ''}
              onChange={handleNewEntryChange}
            />
          );
        }
      })}
      <button className="modal-add-button" onClick={handleAddNewEntry}>Add</button>
      <button className="modal-cancel-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
    </Modal>
    <table className="data-table">
      <thead>
        <tr>
          {Object.keys(data[0] || {}).map((key) => (
            <th key={key} onClick={() => handleSort(key)}>
              {key}
              {sortConfig.key === key && (
                <span className={`sort-indicator ${sortConfig.direction === 'ascending' ? 'asc' : 'desc'}`}></span>
              )}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((item, index) => (
          <tr key={index}>
            {Object.keys(item).map((key, idx) => (
              <td key={idx}>
                {key === 'Teachers' && Array.isArray(item[key])
                  ? item[key].map(teacher => teacher.name).join(', ')
                  : item[key]}
              </td>
            ))}
            <td>
              <button onClick={() => {
                setEditEntry(item);
                setEditSelectedInstructors(item.Teachers ? item.Teachers.map(teacher => teacher.id) : []);
              }}>Edit</button>
              <button onClick={() => handleDeleteEntry(item.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Modal
      isOpen={editEntry !== null}
      onRequestClose={() => setEditEntry(null)}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Edit Entry</h2>
      {editEntry && Object.keys(editEntry).map((key) => {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'id') return null;
        if (foreignKeyFields[table] && foreignKeyFields[table].includes(key)) {
          return (
            <select
              key={key}
              name={key}
              value={editEntry[key] || ''}
              onChange={handleEditEntryChange}
            >
              <option value="">Select {key.replace('_id', '')}</option>
              {foreignKeyData[key] && foreignKeyData[key].map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          );
        } else if (table === 'courses' && key === 'teacher_id') {
          return (
            <div key={key}>
              <label>Instructors:</label>
              <select multiple={true} value={editSelectedInstructors} onChange={handleEditInstructorChange}>
                {foreignKeyData.teachers && foreignKeyData.teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          );
        } else {
          return (
            <input
              key={key}
              name={key}
              placeholder={key}
              value={editEntry[key] || ''}
              onChange={handleEditEntryChange}
            />
          );
        }
      })}
      <button className="modal-add-button" onClick={handleUpdateEntry}>Update</button>
      <button className="modal-cancel-button" onClick={() => setEditEntry(null)}>Cancel</button>
    </Modal>
  </div>
);
};

export default AdminDataManagement;
