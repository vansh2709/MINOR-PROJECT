import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; // (Recommended for real React apps)

function RegisterPage() {
  // 1. State to manage the selected role
  const [selectedRole, setSelectedRole] = useState('');
  const [isEmailValid, setEmailValid] = useState(null);
  const [isIDValid, setIDValid] = useState(null);

  // 2. State to manage form inputs (Recommended, though basic form is shown here)
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    student_id: '',
    teacher_id: '',
    branch: '',
    year: '',
  });

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/register",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })

    const responseJSON = await response.json();
    alert(responseJSON.message);

    if(responseJSON.success === true){
      window.localStorage.setItem("user_creds", JSON.stringify(formData));
      setFormData({
        role: "",
        name: "",
        email: "",
        password: "",
        student_id: "",
        teacher_id: "",
        branch: "",
        year: ""
      });
    }else{
      setFormData(prevData => ({
        ...prevData,
        email: "",
        password: "",
        student_id: ""
      }));
    }
  };

  // 4. Handle role change (Updates state)
  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);

    // Optional: Reset role-specific fields when the role changes
    setFormData(prevData => ({
      ...prevData,
      role: role,
      teacher_id: '',
      branch: '',
      year: '',
      student_id: '',
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
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    // validate email and techer/student id
    if (name === "email" || name === "student_id" || name === "teacher_id") {
      const response = await fetch("http://localhost:8000/validate-creds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ [name]: value })
      })

      const responseJSON = await response.json();
      responseJSON.success = !responseJSON.success;

      if (name === "email") {
        setEmailValid(responseJSON.success ? true : false);
      } else {
        setIDValid(responseJSON.success ? true : false);
      }
    }
  };

  return (
      <div>
        <div className="register-page" id="login-page"> {/* Assuming the ID should be register-page */}
          <h1 className="headings">Register Account</h1>
          <form id="registrationForm" onSubmit={handleSubmit}>

            {/* Role Select */}
            <label className="label" htmlFor="roleSelect">Select Role:</label><br />
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
            <label className="label" htmlFor="name">Name:</label><br />
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

            <label className="label" htmlFor="email">Email:</label><br />
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="username1234@email.com"
              value={formData.email}
              onChange={handleInputChange}

              className={`input-box ${formData.email.trim() === ""
                ? "border-gray-400"
                : isEmailValid === true
                  ? "!border-green-500"
                  : isEmailValid === false
                    ? "!border-red-500"
                    : "border-gray-400"
                }`}
            />

            {
              formData.email.trim() === ""
                ? "" : isEmailValid === true ? (
                  <p className="text-green-500 mt-1">Email available</p>
                ) : isEmailValid === false ? (
                  <p className="text-red-500 mt-1">Email already registered</p>
                ) : null
            }

            <label className="label" htmlFor="password">Password:</label><br />
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
                <label className="label" htmlFor="teacherId">Teacher ID:</label>
                <input
                  type="text"
                  id="teacherId"
                  name="teacher_id"
                  required={selectedRole === 'Teacher'} // Required if teacher
                  value={formData.teacher_id}
                  onChange={handleInputChange}

                  className={`input-box ${formData.teacher_id.trim() === ""
                    ? "border-gray-400"
                    : isIDValid === true
                      ? "!border-green-500"
                      : isIDValid === false
                        ? "!border-red-500"
                        : "border-gray-400"
                  }`}
                />

                {
                  formData.teacher_id.trim() === ""
                    ? "" : isIDValid === true ? (
                      <p className="text-green-500 mt-1">Teacher ID available</p>
                    ) : isIDValid === false ? (
                      <p className="text-red-500 mt-1">ID already registered</p>
                    ) : null
                }

                <br /><br />
              </fieldset>
            )}

            {/* Student Fields (Conditional Rendering) */}
            {selectedRole === 'Student' && (
              <fieldset className="field-sections" id="studentFields">
                <label className="label" htmlFor="year">Branch and Year:</label>
                <select
                  className="select-box"
                  id="branch"
                  name="branch"
                  required={selectedRole === 'Student'} // Required if student
                  value={formData.branch}
                  onChange={handleInputChange}
                >
                  <option value="NULL">-- Select Branch --</option>
                  <option value="CE">B.Tech: Civil Engineering</option>
                  <option value="CSE">B.Tech: Computer Science and Engineering</option>
                  <option value="ME">B.Tech: Mechanical</option>
                  <option value="RA">B.Tech: Robotics and Automation</option>
                  <option value="AI">B.Tech: Artificial Intelligence and Machine Learning</option>
                  <option value="BCA">B.CA: Bachelor of Computer Applications</option>
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

                <label className="label" htmlFor="studentId">Student ID:</label>
                <input
                  type="text"
                  id="studentId"
                  name="student_id"
                  required={selectedRole === 'Student'} // Required if student
                  value={formData.student_id}
                  onChange={handleInputChange}

                  className={`input-box ${formData.student_id.trim() === ""
                    ? "border-gray-400"
                    : isIDValid === true
                      ? "!border-green-500"
                      : isIDValid === false
                        ? "!border-red-500"
                        : "border-gray-400"
                    }`}

                />
                {
                  formData.student_id.trim() === ""
                    ? "" : isIDValid === true ? (
                      <p className="text-green-500 mt-1">Student ID available</p>
                    ) : isIDValid === false ? (
                      <p className="text-red-500 mt-1">ID already registered</p>
                    ) : null
                }
                <br /><br />
              </fieldset>
            )}

            <p>Already have an account? <Link to="/login">Login Instead?</Link></p><br />

            <button className="button" type="submit" disabled={isEmailValid && isIDValid ? false : true} >Register</button>
          </form>
        </div>
      </div>
  );
}

export default RegisterPage;
