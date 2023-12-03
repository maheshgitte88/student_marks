import axios from 'axios';
import React, { useEffect, useState } from 'react';

const StudentInfo = () => {
  const [searchValues, setSearchValues] = useState({
    email: '',
    registration_number: '',
    user_username: '',
    user_id: null,
  });
  const [data, setData] = useState([]);
  const [marksData, setMarksData] = useState([]);

  const fetchData = async () => {
    try {
      const resData = await axios.get('http://localhost:7000/api/marks/student-marks', {
        params: searchValues,
      });
      setData(resData.data);
      setMarksData(resData.data.flattenedData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchValues]);

  const handleSearchChange = (field, value) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const handleSearchClick = () => {
    fetchData();
  };

  const { id, name, email, registration_number, user_username, contact_number, date } = data;

  return (
    <div className="container">
      <div className='row mx-3 my-1'>
        <h3 className="mb-4" style={{ backgroundImage: 'linear-gradient(to right, #ff9a9e, #fad0c4)' }}>Student Assignament Information</h3>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <div className='d-flex m-2 justify-content-between'>
            <input
              type="text"
              id="email"
              placeholder='Email'
              className="form-control"
              value={searchValues.email}
              onChange={(e) => handleSearchChange('email', e.target.value)}
            />
          </div>
          <div className='d-flex m-2'>
            <input
              type="text"
              id="registration_number"
              placeholder='registration_number'
              className="form-control"
              value={searchValues.registration_number}
              onChange={(e) => handleSearchChange('registration_number', e.target.value)}
            />
          </div>
          <div className='d-flex m-2'>
            <input
              type="text"
              id="username"
              placeholder='username'
              className="form-control"
              value={searchValues.user_username}
              onChange={(e) => handleSearchChange('user_username', e.target.value)}
            />
          </div>
          <div className='d-flex m-2'>
            <input
              type="text"
              id="userId"
              placeholder='user_id'
              className="form-control"
              value={searchValues.user_id}
              onChange={(e) => handleSearchChange('user_id', e.target.value)}
            />
          </div>
          <button className="btn btn-primary mt-3" onClick={handleSearchClick}>
            Search
          </button>
        </div>

        <div className="col-md-6">
          <ul className="list-group">
            <li className="list-group-item"><strong>ID: </strong>{id}</li>
            <li className="list-group-item"><strong>Name:</strong> {name}</li>
            <li className="list-group-item"><strong>Email:</strong> {email}</li>
            <li className="list-group-item"><strong>Registration Number:</strong> {registration_number}</li>
            <li className="list-group-item"><strong>Username:</strong> {user_username}</li>
            <li className="list-group-item"><strong>Contact Number:</strong> {contact_number}</li>
            <li className="list-group-item"><strong>Date:</strong> {date}</li>
            <li className="list-group-item"><strong>Subjects:</strong> {marksData.length / 3}</li>
          </ul>
        </div>
      </div>

      <h5 className="mt-4 mb-4">Student Marks</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Subject_Id</th>
            <th>Subject-Name</th>
            <th>GR</th>
            <th>Mark</th>
            <th>Total-Marks</th>
            <th>Passing</th>
            <th>attempts</th>
            <th>time_in_seeconds</th>
            <th>R-Date</th>
          </tr>
        </thead>
        <tbody>
          {marksData.map((item, index) => (
            <tr key={item.id} className={index % 3 === 2 ? 'blue-row' : ''}>
              <td>{item.subject_id}</td>
              <td>{item.subject_name}</td>
              <td>{item.gr}</td>
              <td>{item.mk !== null ? item.mk : 'N/A'}</td>
              <td>{item.tm !== null ? item.tm : 'N/A'}</td>
              <td>{item.tpt}</td>
              <td>{item.atmpt}</td>
              <td>{item.tttm}</td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default StudentInfo;










