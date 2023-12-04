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
  const [batchData, setBatchData] = useState([]);
  const [subjectId, setsubjectId] = useState('');

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

  const FetchBatchData = async () => {
    try {
      const batchData = await axios.get(`http://localhost:7000/api/marks/getBatchName/${subjectId}`);
      const batch = batchData.data;
      setBatchData(batch)
    } catch (error) {
      setBatchData()
    }

  }
  useEffect(() => {
    if (marksData.length > 0) {
      setsubjectId(marksData[0].subject_id);
    }
  }, [marksData])
  useEffect(() => {
    FetchBatchData()
  }, [subjectId])

  const handleSearchChange = (field, value) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const handleSearchClick = () => {
    fetchData();
  };
  console.log(marksData, 39)
  const { id, name, email, registration_number, user_username, contact_number, date } = data;

  return (
    <div className="container">
      <div className='row mx-1 my-1'>
        <h3 className="mb-2 text-white rounded" style={{ backgroundImage: 'linear-gradient(to right, rgb(0, 149, 255), rgb(0, 238, 255)' }}>Student Assignament Information</h3>
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
          <button className="btn btn-primary mb-3 mt-3" onClick={handleSearchClick}>
            Search
          </button>
          <div className="card bg-info rounded">
            <h4 class="card-header">Basic Info oF student</h4>
            <div className="card-body text-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Name:</strong>
                <div className="end">{name}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Email:</strong>
                <div className="end">{email}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Registration Number:</strong>
                <div className="end">{registration_number}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Username:</strong>
                <div className="end">{user_username}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Contact Number:</strong>
                <div className="end">{contact_number}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Date:</strong>
                <div className="end">{date}</div>
              </div>
              {/* <div className="d-flex justify-content-between align-items-center">
                <strong className="start">Subjects:</strong>
                <div className="end">{marksData.length}</div>
              </div> */}
              {batchData ?
                <div className="d-flex justify-content-between align-items-center">
                <strong className="start">Program:</strong>
                  <div className="end">{batchData.batch_name}</div>
                </div> : ''}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <table className="table table-bordered">
            <thead>
              <tr>
                {/* <th>Subject_Id</th> */}
                <th>Subject-Name</th>
                <th>Assignment No</th>

                {/* <th>GR</th> */}
                <th>Mark</th>
                {/* <th>Total-Marks</th> */}
                {/* <th>Passing</th> */}
                <th>Attempts</th>
                {/* <th>time_in_seconds</th> */}
              </tr>
            </thead>
            <tbody>
              {data.flattenedData ? (
                data.flattenedData.map((item, rowIndex) => (
                  <>
                    <tr key={`subject-${rowIndex}`}>
                      {/* <td>{item.subject_id}</td> */}
                      <td>{item.subject_name}</td>
                      <td>{item.assignments[0].assignment}</td>
                      {/* <td>{item.assignments[0].gr}</td> */}
                      <td>{item.assignments[0].mk !== null ? item.assignments[0].mk : 'N/A'}</td>
                      {/* <td>{item.assignments[0].tm !== null ? item.assignments[0].tm : 'N/A'}</td> */}
                      {/* <td>{item.assignments[0].tpt}</td> */}
                      <td>{item.assignments[0].atmpt}</td>
                      {/* <td>{item.assignments[0].tttm}</td> */}

                    </tr>
                    {item.assignments.slice(1).map((assignment, index) => (
                      <tr key={index}>

                        <td></td>
                        <td>{assignment.assignment}</td>
                        {/* <td>{assignment.gr}</td> */}
                        <td>{assignment.mk !== null ? assignment.mk : 'N/A'}</td>
                        {/* <td>{assignment.tm !== null ? assignment.tm : 'N/A'}</td> */}
                        {/* <td>{assignment.tpt}</td> */}
                        <td>{assignment.atmpt}</td>
                        {/* <td>{assignment.tttm}</td> */}
                      </tr>
                    ))}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No data available</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>

      <h5 className="mt-4 mb-4">Student Marks</h5>

    </div>
  );
};

export default StudentInfo;










