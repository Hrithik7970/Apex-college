import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DEPARTMENTS, COURSES_BY_DEPT } from '../mockData';

export default function StudentFormDrawer({ isOpen, onClose, onSave, student }) {
  const initialFormState = {
    name: '',
    rollNumber: '',
    email: '',
    department: DEPARTMENTS[0],
    year: 1,
    semester: 1,
    cgpa: 0,
    attendance: 100,
    feeStatus: 'Pending',
    feeAmount: 0,
    courses: []
  };

  const [formData, setFormData] = useState(initialFormState);

  // Sync state if editing a student
  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        courses: student.courses || []
      });
    } else {
      setFormData(initialFormState);
    }
  }, [student, isOpen]);

  // When department changes, update courses list to match
  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setFormData(prev => ({
      ...prev,
      department: dept,
      courses: [] // reset courses when department changes
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'semester' || name === 'attendance'
        ? parseInt(value, 10) || 0
        : name === 'cgpa' || name === 'feeAmount'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleCourseCheckboxChange = (course) => {
    setFormData(prev => {
      const alreadySelected = prev.courses.includes(course);
      const updatedCourses = alreadySelected
        ? prev.courses.filter(c => c !== course)
        : [...prev.courses, course];
      return {
        ...prev,
        courses: updatedCourses
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNumber || !formData.email) {
      alert('Please fill out required fields.');
      return;
    }
    onSave(formData);
  };

  const availableCourses = COURSES_BY_DEPT[formData.department] || [];

  return (
    <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <form className="drawer-content" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        
        {/* Drawer Header */}
        <div className="drawer-header">
          <h3 className="drawer-title">{student ? 'Edit Student Record' : 'Enroll New Student'}</h3>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              required
              className="form-control"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Roll Number & Email */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Roll Number *</label>
              <input
                type="text"
                name="rollNumber"
                required
                disabled={!!student} // Don't allow changing roll number on edit for database integrity
                className="form-control"
                placeholder="e.g. CS2023055"
                value={formData.rollNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                className="form-control"
                placeholder="e.g. john@college.edu"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Department, Year & Semester */}
          <div className="form-group">
            <label className="form-label">Department / Branch</label>
            <select
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleDepartmentChange}
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select
                name="year"
                className="form-control"
                value={formData.year}
                onChange={handleInputChange}
              >
                <option value={1}>1st Year (Freshman)</option>
                <option value={2}>2nd Year (Sophomore)</option>
                <option value={3}>3rd Year (Junior)</option>
                <option value={4}>4th Year (Senior)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Semester</label>
              <input
                type="number"
                name="semester"
                min="1"
                max="8"
                className="form-control"
                value={formData.semester}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* CGPA & Attendance */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cumulative GPA (CGPA)</label>
              <input
                type="number"
                name="cgpa"
                step="0.01"
                min="0"
                max="10"
                className="form-control"
                value={formData.cgpa}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Attendance (%)</label>
              <input
                type="number"
                name="attendance"
                min="0"
                max="100"
                className="form-control"
                value={formData.attendance}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Fees Status & Amount */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fee Status</label>
              <select
                name="feeStatus"
                className="form-control"
                value={formData.feeStatus}
                onChange={handleInputChange}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Outstanding Fees (₹)</label>
              <input
                type="number"
                name="feeAmount"
                min="0"
                disabled={formData.feeStatus === 'Paid'} // Lock if paid
                className="form-control"
                value={formData.feeStatus === 'Paid' ? 0 : formData.feeAmount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Course Checklist */}
          <div className="form-group">
            <label className="form-label">Select Semester Courses</label>
            <div className="courses-checkbox-grid">
              {availableCourses.map(course => (
                <label className="checkbox-label" key={course}>
                  <input
                    type="checkbox"
                    checked={formData.courses.includes(course)}
                    onChange={() => handleCourseCheckboxChange(course)}
                  />
                  {course}
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button type="button" className="btn-primary" style={{ backgroundColor: 'var(--text-secondary)' }} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {student ? 'Update Record' : 'Register Student'}
          </button>
        </div>

      </form>
    </div>
  );
}
