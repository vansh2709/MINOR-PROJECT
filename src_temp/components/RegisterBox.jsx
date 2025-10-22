import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // (Recommended for real React apps)

function RegisterPage() {
  // 1. State to manage the selected role
  const [selectedRole, setSelectedRole] = useState('');
  
  // 2. State to manage form inputs (Recommended, though basic form is shown here)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    teacherId: '',
    branch: '',
    year: '',
    studentId: '',
  });

  // 3. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration Form Submitted!');
    console.log('Role:', selectedRole);
    console.log('Data:', formData);
    // You'd typically send this data to an API here
  };

  // 4. Handle role change (Updates state)
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    
    // Optional: Reset role-specific fields when the role changes
    setFormData(prevData => ({
      ...prevData,
      teacherId: '',
      branch: '',
      year: '',
      studentId: '',
    }));
  };

  // 5. useEffect hook replaces the DOMContentLoaded listener and roleSelect.addEventListener('change', ...)
  // This runs whenever selectedRole changes
  useEffect(() => {
    // Note: In React, we use the `required` attribute directly on the JSX element,
    // which is controlled by the state logic, not by manipulating the DOM via JS.
    // The conditional rendering below handles the display.
    
    // The `required` attribute for the role-specific fields must be set directly
    // based on the `selectedRole` state in the JSX below.
    
  }, [selectedRole]);

  // Function to handle changes in text inputs/selects
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <header>
        <nav className="navigation-bar">
          <h1>Scheduler</h1>
          <div>
            <a href="#">About</a>
            <a href="#">Contact Admin</a>
          </div>
        </nav>
      </header>
      <div className="content">
        <div className="register-page" id="login-page"> {/* Assuming the ID should be register-page */}
          <h1>Register Account</h1>
          <form id="registrationForm" onSubmit={handleSubmit}>
            
            {/* Role Select */}
            <label htmlFor="roleSelect">Select Role:</label>
            <select 
              className="select-box" 
              id="roleSelect" 
              name="role" 
              required
              value={selectedRole} // Controlled component value
              onChange={handleRoleChange} // Event handler
            >
              <option value="">-- Please select your role --</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
            <br />
            
            {/* Common Fields */}
            <label htmlFor="name">Name:</label>
            <input 
              className="input-box" 
              type="text" 
              id="name" 
              name="name" 
              required 
              placeholder="Enter Your Name Here"
              value={formData.name}
              onChange={handleInputChange}
            />
            
            <label htmlFor="email">Email:</label>
            <input 
              className="input-box" 
              type="email" 
              id="email" 
              name="email" 
              required 
              placeholder="username1234@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />

            <label htmlFor="password">Password:</label>
            <input 
              className="input-box" 
              type="password" 
              id="password" 
              name="password" 
              required 
              placeholder="*****************"
              value={formData.password}
              onChange={handleInputChange}
            />
            <br />
            
            {/* Teacher Fields (Conditional Rendering) */}
            {selectedRole === 'Teacher' && (
              <fieldset className="field-sections" id="teacherFields">
                <label htmlFor="teacherId">Teacher ID:</label>
                <input 
                  className="input-box" 
                  type="text" 
                  id="teacherId" 
                  name="teacherId" 
                  required={selectedRole === 'Teacher'} // Required if teacher
                  value={formData.teacherId}
                  onChange={handleInputChange}
                />
                <br /><br />
              </fieldset>
            )}

            {/* Student Fields (Conditional Rendering) */}
            {selectedRole === 'Student' && (
              <fieldset className="field-sections" id="studentFields">
                <label htmlFor="year">Branch and Year:</label>
                <select 
                  className="select-box" 
                  id="branch" 
                  name="branch" 
                  required={selectedRole === 'Student'} // Required if student
                  value={formData.branch}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Branch --</option>
                  <option value="1">B.Tech: Civil Engineering</option>
                  <option value="2">B.Tech: Computer Science and Engineering</option>
                  <option value="3">B.Tech: Mechanical</option>
                  <option value="4">B.Tech: Robotics and Automation</option>
                  <option value="5">B.Tech: Artificial Intelligence and Machine Learning</option>
                  <option value="6">B.CA: Bachelor of Computer Applications</option>
                </select>
                <select 
                  className="select-box" 
                  id="year" 
                  name="year" 
                  required={selectedRole === 'Student'} // Required if student
                  value={formData.year}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Year --</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                <br />
                <label htmlFor="studentId">Student ID:</label>
                <input 
                  className="input-box" 
                  type="text" 
                  id="studentId" 
                  name="studentId" 
                  required={selectedRole === 'Student'} // Required if student
                  value={formData.studentId}
                  onChange={handleInputChange}
                />
                <br /><br />
              </fieldset>
            )}
            
            <p>Already have an account? <Link to="/login">Login Instead?</Link></p><br />
            
            <button className="button" type="submit">Register</button>
          </form>
        </div>
      </div>
      <footer className="footer">
        <a href="#">T's & C's</a>
        <a href="#">Calendar</a>
        <a href="#">Exit</a>
      </footer>
    </>
  );
}

export default RegisterPage;