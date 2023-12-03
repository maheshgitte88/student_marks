const axios = require('axios');
const express = require('express');
const router = express.Router();
const sequelize = require('../config')
const { Op } = require('sequelize');
const SubjectClassModel = require('../models/SubjectClassModel')
// const Studentmaster=require('../models/Student_Master')
const FlattenedDataModel = require('../models/FlattenedDataModel');
const All_Students = require('../models/All_Students');

// router.post('/saveFlattenedData', async (req, res) => {
//     try {
//         const response = await axios.get(`https://mitsde.edmingle.com/nuSource/api/v1/short/masterbatch`, {
//             headers: {
//               'ORGID': 3,
//               'apiKey': '49137bd489d3e3c7116ead9518ab093e',
//             },
//           });
//           const flattenedData = response.data.class_report; // Assuming your data is in req.body.flattenedData

//         // Use bulkCreate to insert multiple rows at once
//         await FlattenedDataModel.bulkCreate(flattenedData);

//         res.json({ code: 200, message: 'Success' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ code: 500, message: 'Internal Server Error' });
//     }
// });


// Define the fields for user data
const userDataFields = ['name', 'username']; // Add other fields as needed

// Define the fields for user marks data
const userMarksDataFields = ['gr', 'mk', 'tm', 'pt', 'tpt', 'atmpt', 'pssd', 'tttm']; // Add other fields as needed
// const StudentSubjectMarksData = async (data) => {
//     // router.post('/saveFlattenedData', async (req, res) => {
//     try {
//         for (const item of data) {
//             const class_id = item.subject_id;
//             const subject_name = item.subject_name;
//             const response = await axios.get(`https://mitsde-api.edmingle.com/nuSource/api/v1/reports/classprogress?page=1&per_page=3000&class_id=${class_id}`, {
//                 headers: {
//                     'ORGID': 4,
//                     'apiKey': '34c376e9a999a96f29b86989d9f4513e',
//                 },
//             });
//             const classReport = response.data.class_report;
//             const userMarks = classReport.user_marks;
//             const users = classReport.users;
    
//             const flattenedData = [];
    
//             // Iterate over each user
//             for (const user of users) {
//                 const userId = user[0];
    
//                 // Extract user data from user_marks
//                 const userData = userMarks[userId].map(mark => ({
//                     user_id: userId,
//                     name: user[1],            // Add user name
//                     userUsername: user[2],   // Add user username
//                     subject_id:class_id,
//                     subject_name:subject_name,
//                     gr: mark.gr,
//                     mk: mark.mk,
//                     tm: mark.tm,
//                     pt: mark.pt,
//                     tpt: mark.tpt,
//                     atmpt: mark.atmpt,
//                     pssd: mark.pssd,
//                     tttm: mark.tttm,
//                     // Add other fields as needed
//                 }));
    
//                 flattenedData.push(...userData);
//             }
    
//             // Use bulkCreate to insert multiple rows at once
//             await FlattenedDataModel.bulkCreate(flattenedData);
//         }
//         console.log('Subject Marks Data saved successfully.');
//         // res.json({ code: 200, message: 'Success' });
//     } catch (error) {
//         console.error(error);
//         // res.status(500).json({ code: 500, message: 'Internal Server Error' });
//     }
// };

const StudentSubjectMarksData = async (data) => {
    try {
        for (const item of data) {
            const class_id = item.subject_id;
            const subject_name = item.subject_name;
            const response = await axios.get(`https://mitsde-api.edmingle.com/nuSource/api/v1/reports/classprogress?page=1&per_page=3000&class_id=${class_id}`, {
                headers: {
                    'ORGID': 4,
                    'apiKey': '34c376e9a999a96f29b86989d9f4513e',
                },
            });
            const classReport = response.data.class_report;
            const userMarks = classReport.user_marks;
            const users = classReport.users;

            // Iterate over each user
            for (const user of users) {
                const userId = user[0];

                // Extract user data from user_marks
                const userData = userMarks[userId].map(mark => ({
                    user_id: userId,
                    name: user[1],            // Add user name
                    userUsername: user[2],   // Add user username
                    subject_id: class_id,
                    subject_name: subject_name,
                    gr: mark.gr,
                    mk: mark.mk,
                    tm: mark.tm,
                    pt: mark.pt,
                    tpt: mark.tpt,
                    atmpt: mark.atmpt,
                    pssd: mark.pssd,
                    tttm: mark.tttm,
                    // Add other fields as needed
                }));

                // Iterate over userData and insert each record individually
                for (const record of userData) {
                    await FlattenedDataModel.create(record);
                }
            }

            console.log(`Subject Marks Data for class_id ${class_id} saved successfully.`);
        }

        console.log('All Subject Marks Data saved successfully.');
    } catch (error) {
        console.error(error);
    }
};




    

//             const uniqueUserIds = new Set();

//             // Collect unique user IDs
//             users.forEach(user => uniqueUserIds.add(user[0]));

//             const flattenedData = [];

//             // Iterate over unique user IDs
//             for (const userId of uniqueUserIds) {
//                 const userData = userMarks[userId].map(mark => ({
//                     user_id: userId,
//                     name: users.find(user => user[0] === userId)[1],            // Add user name
//                     userUsername: users.find(user => user[0] === userId)[2],   // Add user username
//                     subject_id:class_id,
//                     subject_name:subject_name,
//                     gr: mark.gr,
//                     mk: mark.mk,
//                     tm: mark.tm,
//                     pt: mark.pt,
//                     tpt: mark.tpt,
//                     atmpt: mark.atmpt,
//                     pssd: mark.pssd,
//                     tttm: mark.tttm,
//                     // Add other fields as needed
//                 }));

//                 flattenedData.push(...userData);
//             }

//             // Use bulkCreate to insert multiple rows at once
//             await FlattenedDataModel.bulkCreate(flattenedData);
//         }
//         console.log('Subject Marks Data saved successfully.');
//         // res.json({ code: 200, message: 'Success' });
//     } catch (error) {
//         console.error(error);
//         // res.status(500).json({ code: 500, message: 'Internal Server Error' });
//     }
// };

router.post('/student_subject_marks_data', async (req, res) => {
    try {
        // const sub_Data = await SubjectClassModel.findAll({
        //     attributes: ['subject_id', 'subject_name'],
        // });
        // const subjectArray = sub_Data.map((subject) => ({
        //     subject_id: subject.subject_id,
        //     subject_name: subject.subject_name,
        // }));
        const subjectArray = [
            {
                "subject_id": 19,
                "subject_name": "Indian Economy and Policy"
            }]
        StudentSubjectMarksData(subjectArray)
        res.json(subjectArray);
        //   StudentSubjectData(subjectArray);
    } catch (error) {
        console.error('Error fetching batch data:', error);
        throw error;
    }

})

router.get('/student-marks', async (req, res) => {
    try {
        const { registration_number, email, user_username, user_id } = req.query;

        const userData = await FlattenedDataModel.findAll({
            where: {
                [Op.or]: [
                    { registration_number },
                    { email },
                    { user_username },
                    { user_id },
                ],
            },
            include: [{ model: FlattenedDataModel }],
        });

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;


// const axios = require('axios');
// const express = require('express');
// const router = express.Router();
// const sequelize = require('../config')
// const { Op } = require('sequelize');
// const SubjectClassModel = require('../models/SubjectClassModel')
// // const Studentmaster=require('../models/Student_Master')
// const FlattenedDataModel = require('../models/FlattenedDataModel');
// const All_Students = require('../models/All_Students');

// // router.post('/saveFlattenedData', async (req, res) => {
// //     try {
// //         const response = await axios.get(`https://mitsde.edmingle.com/nuSource/api/v1/short/masterbatch`, {
// //             headers: {
// //               'ORGID': 3,
// //               'apiKey': '49137bd489d3e3c7116ead9518ab093e',
// //             },
// //           });
// //           const flattenedData = response.data.class_report; // Assuming your data is in req.body.flattenedData

// //         // Use bulkCreate to insert multiple rows at once
// //         await FlattenedDataModel.bulkCreate(flattenedData);

// //         res.json({ code: 200, message: 'Success' });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ code: 500, message: 'Internal Server Error' });
// //     }
// // });


// // Define the fields for user data
// const userDataFields = ['name', 'username']; // Add other fields as needed

// // Define the fields for user marks data
// const userMarksDataFields = ['gr', 'mk', 'tm', 'pt', 'tpt', 'atmpt', 'pssd', 'tttm']; // Add other fields as needed
// const StudentSubjectMarksData = async (data) => {
//     // router.post('/saveFlattenedData', async (req, res) => {
//     try {
//         for (const item of data) {
//             const class_id = item.subject_id;
//             const subject_name = item.subject_name;
//             const response = await axios.get(`https://mitsde-api.edmingle.com/nuSource/api/v1/reports/classprogress?page=1&per_page=3000&class_id=${class_id}`, {
//                 headers: {
//                     'ORGID': 4,
//                     'apiKey': '34c376e9a999a96f29b86989d9f4513e',
//                 },
//             });
//             const classReport = response.data.class_report;
//             const userMarks = classReport.user_marks;
//             const users = classReport.users;

//             const uniqueUserIds = new Set();

//             // Collect unique user IDs
//             users.forEach(user => uniqueUserIds.add(user[0]));

//             const flattenedData = [];

//             // Iterate over unique user IDs
//             for (const userId of uniqueUserIds) {
//                 const userData = userMarks[userId].map(mark => ({
//                     user_id: userId,
//                     name: users.find(user => user[0] === userId)[1],            // Add user name
//                     userUsername: users.find(user => user[0] === userId)[2],   // Add user username
//                     subject_id:class_id,
//                     subject_name:subject_name,
//                     gr: mark.gr,
//                     mk: mark.mk,
//                     tm: mark.tm,
//                     pt: mark.pt,
//                     tpt: mark.tpt,
//                     atmpt: mark.atmpt,
//                     pssd: mark.pssd,
//                     tttm: mark.tttm,
//                     // Add other fields as needed
//                 }));

//                 flattenedData.push(...userData);
//             }

//             // Use bulkCreate to insert multiple rows at once
//             await FlattenedDataModel.bulkCreate(flattenedData);
//         }
//         console.log('Subject Marks Data saved successfully.');
//         // res.json({ code: 200, message: 'Success' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ code: 500, message: 'Internal Server Error' });
//     }
// };

// router.post('/student_subject_marks_data', async (req, res) => {
//     try {
//         // const sub_Data = await SubjectClassModel.findAll({
//         //     attributes: ['subject_id', 'subject_name'],
//         // });
//         // const subjectArray = sub_Data.map((subject) => ({
//         //     subject_id: subject.subject_id,
//         //     subject_name: subject.subject_name,
//         // }));
//         const subjectArray = [
//             {
//                 "subject_id": 19,
//                 "subject_name": "Indian Economy and Policy"
//             }]
//         StudentSubjectMarksData(subjectArray)
//         res.json(subjectArray);
//         //   StudentSubjectData(subjectArray);
//     } catch (error) {
//         console.error('Error fetching batch data:', error);
//         throw error;
//     }

// })

// // router.get('/student-marks', async (req, res) => {
// //     try {
// //       const { registration_number, email, user_username, user_id } = req.query;
  
// //       const userData = await All_Students.findOne({
// //         where: {
// //           [Op.or]: [
// //             { registration_number },
// //             { email },
// //             { user_username },
// //             { user_id },
// //           ],
// //         },
// //         include: [{ model: FlattenedDataModel }],
// //       });
  
// //       if (!userData) {
// //         return res.status(404).json({ message: 'User not found' });
// //       }
  
// //       res.json(userData);
// //     } catch (error) {
// //       console.error(error);
// //       res.status(500).json({ message: 'Internal Server Error' });
// //     }
// //   });





// router.get('/student-marks', async (req, res) => {
//     try {
//         const { registration_number, email, user_username, user_id } = req.query;

//         // Ensure at least one field is provided
//         if (!registration_number && !email && !user_username && !user_id) {
//             return res.status(400).json({ message: 'Please provide at least one search parameter' });
//         }

//         // Find user data
//         const userData = await All_Students.findOne({
//             where: {
//                 [Op.or]: [
//                     registration_number && { registration_number },
//                     email && { email },
//                     user_username && { user_username },
//                     user_id && { user_id },
//                 ].filter(Boolean), // Filter out undefined values
//             },
//         });

//         if (!userData) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const userFlattenedData = await FlattenedDataModel.findAll({
//             where: {
//                 user_id: userData.user_id,  // Assuming the field name in FlattenedDataModel is user_id
//             },
//         });

//         // Combine user data with flattened data
//         const result = {
//             ...userData.toJSON(),
//             flattenedData: userFlattenedData.map(item => item.toJSON()),
//         };

//         res.json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


// // router.get('/student-marks', async (req, res) => {
// //     try {
// //         const { registration_number, email, user_username, user_id } = req.query;

// //         // Find user data
// //         const userData = await All_Students.findOne({
// //             where: {
// //                 [Op.or]: [
// //                     { registration_number },
// //                     { email },
// //                     { user_username },
// //                     { user_id },
// //                 ],
// //             },
// //         });

// //         if (!userData) {
// //             return res.status(404).json({ message: 'User not found' });
// //         }

// //         const userFlattenedData = await FlattenedDataModel.findAll({
// //             where: {
// //                 user_id: userData.user_id,  // Assuming the field name in FlattenedDataModel is user_id
// //             },
// //         });

// //         // Combine user data with flattened data
// //         const result = {
// //             ...userData.toJSON(),
// //             flattenedData: userFlattenedData.map(item => item.toJSON()),
// //         };

// //         res.json(result);
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: 'Internal Server Error' });
// //     }
// // });


// module.exports = router;