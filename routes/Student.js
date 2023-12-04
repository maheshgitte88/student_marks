const axios = require('axios');
const express = require('express');
const router = express.Router();
const StudentModel = require('../models/StudentModel');
const SubjectClassModel = require('../models/SubjectClassModel');
const AllStudentModel =require('../models/All_Students');
const BatchModel = require('../models/BatchModel');
// const BatchModel =require('../models/BatchModel');


// const  StudentSubjectData= async (arr) => { 
//   try {
//     // need following fileds extract from arr
//     const class_id = req.params.class_id;  
//     const master_batch_id = req.params.master_batch_id;

//     const response = await axios.get(`https://mitsde-staging-api.edmingle.com/nuSource/api/v1/masterbatch/classstudents?class_id=${class_id}&master_batch_id=${master_batch_id}&page=1&per_page=3000`, {
//       headers: {
//         'orgid': 4,
//         'apikey': '34c376e9a999a96f29b86989d9f4513e',
//       },
//     });

//     const students = response.data.students
//     const classes = response.data.class.class;

//     for (const classData of classes) {
//       await SubjectClassModel.create({
//         subject_id: classData.class_id,
//         subject_name: classData.class_name,
//         program_id: master_batch_id,
//         batch_id: class_id,
//         start_date: classData.class_start,
//         end_date: classData.class_end
//       });
//     }

//     for (const student of students) {
//       await StudentModel.create({
//         user_id: student.user_id,
//         registration_number: student.registration_number,
//         name: student.name,
//         email: student.email,
//         program_id: master_batch_id,
//         batch_id: class_id,
//         user_name: student.user_name,
//         user_username: student.user_username,
//         contact_number: student.contact_number,
//       });
//     }

//     res.status(201).json({ message: 'Data saved successfully.' });
//   } catch (error) {
//     console.error('API Error:', error.message);
//     // res.status(500).json({ error: 'Internal Server Error' });
//   }
  
// }
const StudentSubjectData = async (data) => {
  try {
    for (const item of data) {
      const class_id = item.class_id;
      const master_batch_id = item.master_batch_id;

    const response = await axios.get(`https://mitsde-staging-api.edmingle.com/nuSource/api/v1/masterbatch/classstudents?class_id=${class_id}&master_batch_id=${master_batch_id}&page=1&per_page=3000`, {
      headers: {
        'orgid': 4,
        'apikey': '34c376e9a999a96f29b86989d9f4513e',
      },
    });

      const students = response.data.students;
      const classes = response.data.class.class;

      for (const classData of classes) {
        await SubjectClassModel.create({
          subject_id: classData.class_id,
          subject_name: classData.class_name,
          program_id: master_batch_id,
          batch_id: class_id,
          start_date: classData.class_start,
          end_date: classData.class_end,
        });
      }

      // for (const student of students) {
      //   await StudentModel.create({
      //     user_id: student.user_id,
      //     registration_number: student.registration_number,
      //     name: student.name,
      //     email: student.email,
      //     program_id: master_batch_id,
      //     batch_id: class_id,
      //     user_name: student.user_name,
      //     user_username: student.user_username,
      //     contact_number: student.contact_number,
      //   });
      // }
    }

    console.log('Data saved successfully.');
  } catch (error) {
    console.error('API Error:', error.message);
  }
};


router.post('/student_subject_data', async (req, res) => { 
  try {
    const batchData = await BatchModel.findAll({
      attributes: ['batch_id', 'program_id'],
    });
    const batchArray = batchData.map((batch) => ({
      class_id: batch.batch_id,
      master_batch_id: batch.program_id,
    }));
    StudentSubjectData(batchArray);
  } catch (error) {
    console.error('Error fetching batch data:', error);
    throw error;
  }

})

// const getBatchData = async () => {
//   try {
//     const batchData = await BatchModel.findAll({
//       attributes: ['batch_id', 'program_id'],
//     });

//     const batchArray = batchData.map((batch) => ({
//       batch_id: batch.batch_id,
//       program_id: batch.program_id,
//     }));

//     return batchArray;
//   } catch (error) {
//     console.error('Error fetching batch data:', error);
//     throw error;
//   }
// };
// router.post('/student_subject_data/:class_id/:master_batch_id', async (req, res) => {
//   try {
//     const class_id = req.params.class_id;
//     const master_batch_id = req.params.master_batch_id;

//     const response = await axios.get(`https://mitsde-staging-api.edmingle.com/nuSource/api/v1/masterbatch/classstudents?class_id=${class_id}&master_batch_id=${master_batch_id}&page=1&per_page=3000`, {
//       headers: {
//         'orgid': 4,
//         'apikey': '34c376e9a999a96f29b86989d9f4513e',
//       },
//     });

//     const students = response.data.students
//     const classes = response.data.class.class;

//     for (const classData of classes) {
//       await SubjectClassModel.create({
//         subject_id: classData.class_id,
//         subject_name: classData.class_name,
//         program_id: master_batch_id,
//         batch_id: class_id,
//         start_date: classData.class_start,
//         end_date: classData.class_end
//       });
//     }

//     for (const student of students) {
//       await StudentModel.create({
//         user_id: student.user_id,
//         registration_number: student.registration_number,
//         name: student.name,
//         email: student.email,
//         program_id: master_batch_id,
//         batch_id: class_id,
//         user_name: student.user_name,
//         user_username: student.user_username,
//         contact_number: student.contact_number,
//       });
//     }

//     res.status(201).json({ message: 'Data saved successfully.' });
//   } catch (error) {
//     console.error('API Error:', error.message);
//     // res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



router.post('/save_All_Students', async (req, res) => {
  try {
    const response = await axios.get(`https://mitsde-api.edmingle.com/nuSource/api/v1/organization/students?organization_id=2&search=&is_archived=0&page=1&per_page=50000`, {
      headers: {
        'orgid': 3,
        'apikey': '49137bd489d3e3c7116ead9518ab093e',
      },
    });
      const studentsData = response.data.students; // Assuming your data is in req.body.students
      // console.log(studentsData.length,67)
      const createdStudents = await AllStudentModel.bulkCreate(studentsData);
      res.json({ code: 200, message: 'Success', createdStudents });
  } catch (error) {
      console.error(error);
      res.status(500).json({ code: 500, message: 'Internal Server Error' });
  }
});


module.exports = router;