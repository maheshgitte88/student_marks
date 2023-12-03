const axios = require('axios');
const express = require('express');
const router = express.Router();
const sequelize = require('../config')
const { Op } = require('sequelize');
const SubjectClassModel = require('../models/SubjectClassModel')
// const Studentmaster=require('../models/Student_Master')
const FlattenedDataModel = require('../models/FlattenedDataModel');
const All_Students = require('../models/All_Students');
const BatchModel = require('../models/BatchModel');



router.get('/getBatchName/:subjectId', async (req, res) => {
    try {
      const subjectId = req.params.subjectId;
  
      // Find the subject information
      const subject = await SubjectClassModel.findOne({
        where: { subject_id: subjectId },
      });
  
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      // Find the batch information based on the batch_id from the subject
      const batch = await BatchModel.findOne({
        where: { batch_id: subject.batch_id },
      });
  
      if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
      }
  
      res.json({ batch_name: batch.batch_name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

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
//                     subject_id: class_id,
//                     subject_name: subject_name,
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
//         return 'Subject Marks Data saved successfully.';
//         // res.json({ code: 200, message: 'Success' });
//     } catch (error) {
//         console.error(error);
//         // res.status(500).json({ code: 500, message: 'Internal Server Error' });
//     }
// };

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

            const uniqueUserIds = new Set();

            // Collect unique user IDs
            users.forEach(user => uniqueUserIds.add(user[0]));

            const flattenedData = [];

            // Iterate over unique user IDs
            for (const userId of uniqueUserIds) {
                const userData = userMarks[userId].map(mark => ({
                    user_id: userId,
                    name: users.find(user => user[0] === userId)[1],
                    userUsername: users.find(user => user[0] === userId)[2],
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
                }));

                flattenedData.push(...userData);
            }

            await FlattenedDataModel.bulkCreate(flattenedData);

            console.log('Subject Marks Data saved successfully.');

            // Add a delay of 1.3 minutes (70 seconds)
            await delay(70000);
        }

        return 'Subject Marks Data saved successfully.';
    } catch (error) {
        console.error(error);
    }
};




router.post('/student_subject_marks_data', async (req, res) => {
    try {
        const sub_Data = await SubjectClassModel.findAll({
            attributes: ['subject_id', 'subject_name'],
        });
        const subjectArray = sub_Data.map((subject) => ({
            subject_id: subject.subject_id,
            subject_name: subject.subject_name,
        }));
//         const subjectArray =
//             [
//                 // {
//                 //     "subject_id": 19,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 20,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 21,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 22,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 23,
//                 //     "subject_name": "Legal and Business Environment (Micro and Macro)"
//                 // },
//                 // {
//                 //     "subject_id": 45,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 237,
//                 //     "subject_name": "Legal and Business Environment (Micro and Macro)"
//                 // },
//                 // {
//                 //     "subject_id": 238,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 239,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 240,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 241,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 242,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 255,
//                 //     "subject_name": "Legal and Business Environment"
//                 // },
//                 // {
//                 //     "subject_id": 256,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 257,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 258,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 259,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 260,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 478,
//                 //     "subject_name": "Legal and Business Environment"
//                 // },
//                 // {
//                 //     "subject_id": 479,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 480,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 481,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 482,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 483,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 518,
//                 //     "subject_name": "Legal and Business Environment"
//                 // },
//                 // {
//                 //     "subject_id": 519,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 520,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 521,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 522,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 523,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 533,
//                 //     "subject_name": "Legal and Business Environment"
//                 // },
//                 // {
//                 //     "subject_id": 534,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 535,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 536,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 537,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 538,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 837,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 838,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 839,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 840,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 841,
//                 //     "subject_name": "Legal Aspects of Business"
//                 // },
//                 // {
//                 //     "subject_id": 842,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 843,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 844,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 845,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 859,
//                 //     "subject_name": "Legal Aspects of Business"
//                 // },
//                 // {
//                 //     "subject_id": 860,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 861,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 862,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 863,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 864,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 24,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 27,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 28,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 29,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 30,
//                 //     "subject_name": "Legal and Business Environment (Micro and Macro)"
//                 // },
//                 // {
//                 //     "subject_id": 31,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 32,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 243,
//                 //     "subject_name": "Legal and Business Environment (Micro and Macro) "
//                 // },
//                 // {
//                 //     "subject_id": 244,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 245,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 246,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 247,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 248,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 484,
//                 //     "subject_name": "Legal and Business Environment"
//                 // },
//                 // {
//                 //     "subject_id": 485,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 486,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 487,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 488,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 489,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 518,
//                 //     "subject_name": "Legal and Business Environment"
//                 // },
//                 // {
//                 //     "subject_id": 519,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 520,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 521,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 522,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 523,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 539,
//                 //     "subject_name": "Legal and Business Environment"
//                 // },
//                 // {
//                 //     "subject_id": 540,
//                 //     "subject_name": "Business Communication"
//                 // },
//                 // {
//                 //     "subject_id": 541,
//                 //     "subject_name": "Principles of Management"
//                 // },
//                 // {
//                 //     "subject_id": 542,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 543,
//                 //     "subject_name": "Indian Economy and Policy"
//                 // },
//                 // {
//                 //     "subject_id": 544,
//                 //     "subject_name": "Marketing Management"
//                 // },
//                 // {
//                 //     "subject_id": 33,
//                 //     "subject_name": "Legal Aspects of Business "
//                 // },
//                 // {
//                 //     "subject_id": 34,
//                 //     "subject_name": "Foundations of Business Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 35,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 36,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 38,
//                 //     "subject_name": "Foundations of Business Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 39,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 40,
//                 //     "subject_name": "Project Management"
//                 // },
//                 // {
//                 //     "subject_id": 41,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 42,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 876,
//                 //     "subject_name": "Legal Aspects of Business"
//                 // },
//                 // {
//                 //     "subject_id": 249,
//                 //     "subject_name": "Legal and Business Environment (Micro and Macro)"
//                 // },
//                 // {
//                 //     "subject_id": 250,
//                 //     "subject_name": "Project Management"
//                 // },
//                 // {
//                 //     "subject_id": 251,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 252,
//                 //     "subject_name": "Foundations of Business Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 253,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 254,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 490,
//                 //     "subject_name": "Legal and Business Environment (Micro and Macro)"
//                 // },
//                 // {
//                 //     "subject_id": 491,
//                 //     "subject_name": "Project Management"
//                 // },
//                 // {
//                 //     "subject_id": 492,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 493,
//                 //     "subject_name": "Foundations of Business Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 494,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 495,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 524,
//                 //     "subject_name": "Legal and Business Environment (Micro and Macro)"
//                 // },
//                 // {
//                 //     "subject_id": 525,
//                 //     "subject_name": "Project Management"
//                 // },
//                 // {
//                 //     "subject_id": 526,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 527,
//                 //     "subject_name": "Foundations of Business Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 528,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 529,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 545,
//                 //     "subject_name": "Legal and Business Environment (Micro and Macro)"
//                 // },
//                 // {
//                 //     "subject_id": 546,
//                 //     "subject_name": "Project Management"
//                 // },
//                 // {
//                 //     "subject_id": 547,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 548,
//                 //     "subject_name": "Foundations of Business Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 549,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 550,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 43,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 44,
//                 //     "subject_name": "Digital Marketing"
//                 // },
//                 // {
//                 //     "subject_id": 56,
//                 //     "subject_name": "Fintech"
//                 // },
//                 // {
//                 //     "subject_id": 58,
//                 //     "subject_name": "Project Management (PMc)"
//                 // },
//                 // {
//                 //     "subject_id": 60,
//                 //     "subject_name": "Business Ethics and Corporate Social Responsibility (BECSR)"
//                 // },
//                 // {
//                 //     "subject_id": 61,
//                 //     "subject_name": "Supply Chain Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 62,
//                 //     "subject_name": "Financial Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 63,
//                 //     "subject_name": "Production, Planning and Control (PPCw)"
//                 // },
//                 // {
//                 //     "subject_id": 169,
//                 //     "subject_name": " Financial Management (Fm)"
//                 // },
//                 // {
//                 //     "subject_id": 65,
//                 //     "subject_name": "Lean Management Systems (LMSw)"
//                 // },
//                 // {
//                 //     "subject_id": 66,
//                 //     "subject_name": "Operations Management (OMw)"
//                 // },
//                 // {
//                 //     "subject_id": 67,
//                 //     "subject_name": "Strategic Management (SMc)"
//                 // },
//                 // {
//                 //     "subject_id": 68,
//                 //     "subject_name": "Human Resource Management (HRMc)"
//                 // },
//                 // {
//                 //     "subject_id": 69,
//                 //     "subject_name": "Entrepreneurship and Venture Capital Management"
//                 // },
//                 // {
//                 //     "subject_id": 70,
//                 //     "subject_name": " Research methodology and management decision (RMMDc)"
//                 // },
//                 // {
//                 //     "subject_id": 71,
//                 //     "subject_name": "Marketing of Financial Services (MFSe)"
//                 // },
//                 // {
//                 //     "subject_id": 72,
//                 //     "subject_name": "Marketing Analytics (MkgA)"
//                 // },
//                 // {
//                 //     "subject_id": 73,
//                 //     "subject_name": "HR Analytics (HRA)"
//                 // },
//                 // {
//                 //     "subject_id": 74,
//                 //     "subject_name": "Management Information System (MISc)"
//                 // },
//                 // {
//                 //     "subject_id": 75,
//                 //     "subject_name": "Security Analysis and Portfolio Management (SAPMw)"
//                 // },
//                 // {
//                 //     "subject_id": 76,
//                 //     "subject_name": "Business Analytics (BAc)"
//                 // },
//                 // {
//                 //     "subject_id": 77,
//                 //     "subject_name": "Compensation Management and HR Audit (CMAw)"
//                 // },
//                 // {
//                 //     "subject_id": 78,
//                 //     "subject_name": "Corporate Finance (CFw)"
//                 // },
//                 // {
//                 //     "subject_id": 79,
//                 //     "subject_name": "International Business (IBc)"
//                 // },
//                 // {
//                 //     "subject_id": 80,
//                 //     "subject_name": "International Finance (IFw)"
//                 // },
//                 // {
//                 //     "subject_id": 81,
//                 //     "subject_name": "Mergers and Acquisitions"
//                 // },
//                 // {
//                 //     "subject_id": 82,
//                 //     "subject_name": "Learning and Development (LDw)"
//                 // },
//                 // {
//                 //     "subject_id": 83,
//                 //     "subject_name": "Project Formulation and Real Estate Project Development"
//                 // },
//                 // {
//                 //     "subject_id": 84,
//                 //     "subject_name": "Project Execution, Control and Closure"
//                 // },
//                 // {
//                 //     "subject_id": 85,
//                 //     "subject_name": "Digital Marketing (DMw)"
//                 // },
//                 // {
//                 //     "subject_id": 86,
//                 //     "subject_name": "Project Planning (PP)"
//                 // },
//                 // {
//                 //     "subject_id": 87,
//                 //     "subject_name": "Strategic HRM (SHRMw)"
//                 // },
//                 // {
//                 //     "subject_id": 88,
//                 //     "subject_name": "Project Analysis and Integration Management (PAIM)"
//                 // },
//                 // {
//                 //     "subject_id": 89,
//                 //     "subject_name": "Strategic Cost Management (SCM)"
//                 // },
//                 // {
//                 //     "subject_id": 90,
//                 //     "subject_name": "Financial Markets and Services (FMSw)"
//                 // },
//                 // {
//                 //     "subject_id": 91,
//                 //     "subject_name": "Packaging and Distribution Management (PDMw)"
//                 // },
//                 // {
//                 //     "subject_id": 92,
//                 //     "subject_name": "Materials Management (MtMw)"
//                 // },
//                 // {
//                 //     "subject_id": 93,
//                 //     "subject_name": "Inventory Management (IvMw)"
//                 // },
//                 // {
//                 //     "subject_id": 94,
//                 //     "subject_name": "Cost Engineering and Contracts Management"
//                 // },
//                 // {
//                 //     "subject_id": 95,
//                 //     "subject_name": "Product and Brand Management (PBMw)"
//                 // },
//                 // {
//                 //     "subject_id": 96,
//                 //     "subject_name": "Social Media Marketing (SMM)"
//                 // },
//                 // {
//                 //     "subject_id": 97,
//                 //     "subject_name": "Object Oriented Analysis & Designing (OOA)"
//                 // },
//                 // {
//                 //     "subject_id": 98,
//                 //     "subject_name": "Legal and Business Environment (Micro and Macro) (LBEc)"
//                 // },
//                 // {
//                 //     "subject_id": 99,
//                 //     "subject_name": "Database Management Systems (DMSm)"
//                 // },
//                 // {
//                 //     "subject_id": 100,
//                 //     "subject_name": "Warehouse Management (WMw)"
//                 // },
//                 // {
//                 //     "subject_id": 101,
//                 //     "subject_name": "Industrial Relations and Labour Laws (IRLLw)"
//                 // },
//                 // {
//                 //     "subject_id": 102,
//                 //     "subject_name": "Performance Management and Competency Mapping (PMCMw)"
//                 // },
//                 // {
//                 //     "subject_id": 104,
//                 //     "subject_name": "Sales Management (SMw)"
//                 // },
//                 // {
//                 //     "subject_id": 105,
//                 //     "subject_name": "IT Security"
//                 // },
//                 // {
//                 //     "subject_id": 106,
//                 //     "subject_name": "World Class Manufacturing (WCMw)"
//                 // },
//                 // {
//                 //     "subject_id": 107,
//                 //     "subject_name": "Services Marketing (SMm)"
//                 // },
//                 // {
//                 //     "subject_id": 108,
//                 //     "subject_name": "Construction Technology & Site Management"
//                 // },
//                 // {
//                 //     "subject_id": 109,
//                 //     "subject_name": "Human Resource Information System (HRISw)"
//                 // },
//                 // {
//                 //     "subject_id": 110,
//                 //     "subject_name": "Emerging Trends in SCM and logistics"
//                 // },
//                 // {
//                 //     "subject_id": 111,
//                 //     "subject_name": "Integrated Marketing Communication (IMCw)"
//                 // },
//                 // {
//                 //     "subject_id": 170,
//                 //     "subject_name": "Retail Marketing (RMw)"
//                 // },
//                 // {
//                 //     "subject_id": 113,
//                 //     "subject_name": " Accounting for Managers (AcM)"
//                 // },
//                 // {
//                 //     "subject_id": 114,
//                 //     "subject_name": "Technology Management & Sustainability (TMSw)"
//                 // },
//                 // {
//                 //     "subject_id": 115,
//                 //     "subject_name": "Taxation Direct and Indirect (TDIw)"
//                 // },
//                 // {
//                 //     "subject_id": 116,
//                 //     "subject_name": "Predictive Modelling (PM)"
//                 // },
//                 // {
//                 //     "subject_id": 117,
//                 //     "subject_name": "Organisational behaviour (OBe)"
//                 // },
//                 // {
//                 //     "subject_id": 118,
//                 //     "subject_name": "Networking Concepts (NCm)"
//                 // },
//                 // {
//                 //     "subject_id": 119,
//                 //     "subject_name": "Marketing Management (MMc)"
//                 // },
//                 // {
//                 //     "subject_id": 120,
//                 //     "subject_name": "Indian Economy and Policy (IEPc)"
//                 // },
//                 // {
//                 //     "subject_id": 121,
//                 //     "subject_name": "Business Communication (BCc)"
//                 // },
//                 // {
//                 //     "subject_id": 122,
//                 //     "subject_name": "Information Technology and E - Commerce (ITECe)"
//                 // },
//                 // {
//                 //     "subject_id": 123,
//                 //     "subject_name": "Operating Systems (Osm)"
//                 // },
//                 // {
//                 //     "subject_id": 124,
//                 //     "subject_name": "Fintech"
//                 // },
//                 // {
//                 //     "subject_id": 125,
//                 //     "subject_name": "Coping Workshops"
//                 // },
//                 // {
//                 //     "subject_id": 127,
//                 //     "subject_name": "Scheduling a Counselling Session"
//                 // },
//                 // {
//                 //     "subject_id": 128,
//                 //     "subject_name": "Study Plans"
//                 // },
//                 // {
//                 //     "subject_id": 130,
//                 //     "subject_name": "MIT Harbour Archive"
//                 // },
//                 // {
//                 //     "subject_id": 167,
//                 //     "subject_name": "Induction Forms"
//                 // },
//                 // {
//                 //     "subject_id": 872,
//                 //     "subject_name": "Mentoring Program"
//                 // },
//                 // {
//                 //     "subject_id": 131,
//                 //     "subject_name": "Coping Workshops"
//                 // },
//                 // {
//                 //     "subject_id": 132,
//                 //     "subject_name": "Industry mentoring program"
//                 // },
//                 // {
//                 //     "subject_id": 133,
//                 //     "subject_name": "Scheduling a Counselling Session"
//                 // },
//                 // {
//                 //     "subject_id": 134,
//                 //     "subject_name": "Study Plans"
//                 // },
//                 // {
//                 //     "subject_id": 135,
//                 //     "subject_name": "MIT Harbour Archive"
//                 // },
//                 // {
//                 //     "subject_id": 168,
//                 //     "subject_name": "Induction Forms"
//                 // },
//                 // {
//                 //     "subject_id": 142,
//                 //     "subject_name": "Principles of Management (PoMc)"
//                 // },
//                 // {
//                 //     "subject_id": 143,
//                 //     "subject_name": " Project Execution, Tools &Techniques and Benefit Realisation (ETTBe)"
//                 // },
//                 // {
//                 //     "subject_id": 144,
//                 //     "subject_name": "Data Mining for Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 145,
//                 //     "subject_name": "Financial Accounting & Analysis (FAAc)"
//                 // },
//                 // {
//                 //     "subject_id": 146,
//                 //     "subject_name": "Compensation and Benefits Management (CBMe)"
//                 // },
//                 // {
//                 //     "subject_id": 147,
//                 //     "subject_name": "Microsoft Project and Jira"
//                 // },
//                 // {
//                 //     "subject_id": 148,
//                 //     "subject_name": "Inventory Management (IvMe)"
//                 // },
//                 // {
//                 //     "subject_id": 149,
//                 //     "subject_name": "Strategic HRM (SHR)"
//                 // },
//                 // {
//                 //     "subject_id": 150,
//                 //     "subject_name": "Foundations of Business Management"
//                 // },
//                 // {
//                 //     "subject_id": 151,
//                 //     "subject_name": "Supply Chain Management (SCMe)"
//                 // },
//                 // {
//                 //     "subject_id": 152,
//                 //     "subject_name": "Logistics & Supply Chain Management (LSCMw)"
//                 // },
//                 // {
//                 //     "subject_id": 153,
//                 //     "subject_name": "International Marketing (IMe)"
//                 // },
//                 // {
//                 //     "subject_id": 154,
//                 //     "subject_name": "Legal Aspects of Business"
//                 // },
//                 // {
//                 //     "subject_id": 155,
//                 //     "subject_name": "Project Planning and Project Foundation (PPPFe)"
//                 // },
//                 // {
//                 //     "subject_id": 156,
//                 //     "subject_name": "Digital Marketing Strategies"
//                 // },
//                 // {
//                 //     "subject_id": 157,
//                 //     "subject_name": " Energy Audit And Management (EAMm)"
//                 // },
//                 // {
//                 //     "subject_id": 158,
//                 //     "subject_name": "Energy Efficiency In Electrical and  Thermal Utilities (EEETUm)"
//                 // },
//                 // {
//                 //     "subject_id": 159,
//                 //     "subject_name": "Entrepreneurship (ENT)"
//                 // },
//                 // {
//                 //     "subject_id": 160,
//                 //     "subject_name": "Managerial Finance (MFn)"
//                 // },
//                 // {
//                 //     "subject_id": 161,
//                 //     "subject_name": "Managing e-Business (MeB)"
//                 // },
//                 // {
//                 //     "subject_id": 162,
//                 //     "subject_name": "Retail Management (RMm)"
//                 // },
//                 // {
//                 //     "subject_id": 163,
//                 //     "subject_name": "Light and Illumination"
//                 // },
//                 // {
//                 //     "subject_id": 164,
//                 //     "subject_name": "CAPM"
//                 // },
//                 // {
//                 //     "subject_id": 532,
//                 //     "subject_name": "CAPM"
//                 // },
//                 // {
//                 //     "subject_id": 165,
//                 //     "subject_name": "PMP"
//                 // },
//                 // {
//                 //     "subject_id": 321,
//                 //     "subject_name": "PMP"
//                 // },
//                 // {
//                 //     "subject_id": 166,
//                 //     "subject_name": "Demo for Live session"
//                 // },
//                 // {
//                 //     "subject_id": 881,
//                 //     "subject_name": "testtitle"
//                 // },
//                 // {
//                 //     "subject_id": 173,
//                 //     "subject_name": "Lean Six Sigma"
//                 // },
//                 // {
//                 //     "subject_id": 320,
//                 //     "subject_name": "Lean Six Sigma"
//                 // },
//                 // {
//                 //     "subject_id": 174,
//                 //     "subject_name": "Test Course"
//                 // },
//                 // {
//                 //     "subject_id": 197,
//                 //     "subject_name": "Faculty "
//                 // },
//                 // {
//                 //     "subject_id": 625,
//                 //     "subject_name": "Products-Inclusion"
//                 // },
//                 // {
//                 //     "subject_id": 626,
//                 //     "subject_name": "Products-MITskills"
//                 // },
//                 // {
//                 //     "subject_id": 226,
//                 //     "subject_name": "Management - Information - System"
//                 // },
//                 // {
//                 //     "subject_id": 227,
//                 //     "subject_name": "Legal - Aspects - of - Business"
//                 // },
//                 // {
//                 //     "subject_id": 228,
//                 //     "subject_name": "Strategic - Management"
//                 // },
//                 // {
//                 //     "subject_id": 229,
//                 //     "subject_name": "Foundations - of - Business - Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 230,
//                 //     "subject_name": "Business - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 231,
//                 //     "subject_name": "Management - Information - System"
//                 // },
//                 // {
//                 //     "subject_id": 232,
//                 //     "subject_name": "Legal - Aspects - of - Business"
//                 // },
//                 // {
//                 //     "subject_id": 233,
//                 //     "subject_name": "Strategic - Management"
//                 // },
//                 // {
//                 //     "subject_id": 234,
//                 //     "subject_name": "Foundations - of - Business - Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 235,
//                 //     "subject_name": "Digital - Marketing"
//                 // },
//                 // {
//                 //     "subject_id": 261,
//                 //     "subject_name": "Management - Information - System"
//                 // },
//                 // {
//                 //     "subject_id": 262,
//                 //     "subject_name": "Legal - Aspects - of - Business"
//                 // },
//                 // {
//                 //     "subject_id": 263,
//                 //     "subject_name": "Strategic - Management"
//                 // },
//                 // {
//                 //     "subject_id": 264,
//                 //     "subject_name": "Foundations - of - Business - Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 265,
//                 //     "subject_name": "Business - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 468,
//                 //     "subject_name": "Management - Information - System"
//                 // },
//                 // {
//                 //     "subject_id": 469,
//                 //     "subject_name": "Legal - Aspects - of - Business"
//                 // },
//                 // {
//                 //     "subject_id": 470,
//                 //     "subject_name": "Strategic - Management"
//                 // },
//                 // {
//                 //     "subject_id": 471,
//                 //     "subject_name": "Foundations - of - Business - Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 472,
//                 //     "subject_name": "Business - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 473,
//                 //     "subject_name": "Management - Information - System"
//                 // },
//                 // {
//                 //     "subject_id": 474,
//                 //     "subject_name": "Legal - Aspects - of - Business"
//                 // },
//                 // {
//                 //     "subject_id": 475,
//                 //     "subject_name": "Strategic - Management"
//                 // },
//                 // {
//                 //     "subject_id": 476,
//                 //     "subject_name": "Foundations - of - Business - Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 477,
//                 //     "subject_name": "Digital - Marketing"
//                 // },
//                 // {
//                 //     "subject_id": 508,
//                 //     "subject_name": "Management - Information - System"
//                 // },
//                 // {
//                 //     "subject_id": 509,
//                 //     "subject_name": "Legal - Aspects - of - Business"
//                 // },
//                 // {
//                 //     "subject_id": 510,
//                 //     "subject_name": "Strategic - Management"
//                 // },
//                 // {
//                 //     "subject_id": 511,
//                 //     "subject_name": "Foundations - of - Business - Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 512,
//                 //     "subject_name": "Business - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 513,
//                 //     "subject_name": "Management - Information - System"
//                 // },
//                 // {
//                 //     "subject_id": 514,
//                 //     "subject_name": "Legal - Aspects - of - Business"
//                 // },
//                 // {
//                 //     "subject_id": 515,
//                 //     "subject_name": "Strategic - Management"
//                 // },
//                 // {
//                 //     "subject_id": 516,
//                 //     "subject_name": "Foundations - of - Business - Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 517,
//                 //     "subject_name": "Digital - Marketing"
//                 // },
//                 // {
//                 //     "subject_id": 551,
//                 //     "subject_name": "Management - Information - System"
//                 // },
//                 // {
//                 //     "subject_id": 552,
//                 //     "subject_name": "Legal - Aspects - of - Business"
//                 // },
//                 // {
//                 //     "subject_id": 553,
//                 //     "subject_name": "Strategic - Management"
//                 // },
//                 // {
//                 //     "subject_id": 554,
//                 //     "subject_name": "Foundations - of - Business - Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 555,
//                 //     "subject_name": "Business - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 556,
//                 //     "subject_name": "Management - Information - System"
//                 // },
//                 // {
//                 //     "subject_id": 557,
//                 //     "subject_name": "Legal - Aspects - of - Business"
//                 // },
//                 // {
//                 //     "subject_id": 558,
//                 //     "subject_name": "Strategic - Management"
//                 // },
//                 // {
//                 //     "subject_id": 559,
//                 //     "subject_name": "Foundations - of - Business - Management (HR, Marketing, Finance & Operations)"
//                 // },
//                 // {
//                 //     "subject_id": 560,
//                 //     "subject_name": "Digital - Marketing-FS0W01"
//                 // },
//                 // {
//                 //     "subject_id": 282,
//                 //     "subject_name": "Data - Mining - for - Business - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 283,
//                 //     "subject_name": "Financial - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 284,
//                 //     "subject_name": "Marketing - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 285,
//                 //     "subject_name": "Predictive - Modeling"
//                 // },
//                 // {
//                 //     "subject_id": 286,
//                 //     "subject_name": "Supply - Chain - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 310,
//                 //     "subject_name": "Data - Mining - for - Business - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 311,
//                 //     "subject_name": "Financial - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 312,
//                 //     "subject_name": "Marketing - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 313,
//                 //     "subject_name": "Predictive - Modeling"
//                 // },
//                 // {
//                 //     "subject_id": 314,
//                 //     "subject_name": "Supply - Chain - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 561,
//                 //     "subject_name": "Data - Mining - for - Business - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 562,
//                 //     "subject_name": "Financial - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 563,
//                 //     "subject_name": "Marketing - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 564,
//                 //     "subject_name": "Predictive - Modeling"
//                 // },
//                 // {
//                 //     "subject_id": 565,
//                 //     "subject_name": "Supply - Chain - Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 287,
//                 //     "subject_name": "Social - Media - Analytics - & - Future - Trends"
//                 // },
//                 // {
//                 //     "subject_id": 288,
//                 //     "subject_name": "SEO - & - SEM"
//                 // },
//                 // {
//                 //     "subject_id": 289,
//                 //     "subject_name": "Integrated - Marketing - Communication"
//                 // },
//                 // {
//                 //     "subject_id": 290,
//                 //     "subject_name": "Product - and - Brand - Management"
//                 // },
//                 // {
//                 //     "subject_id": 291,
//                 //     "subject_name": "Social - Media - Marketing"
//                 // },
//                 // {
//                 //     "subject_id": 315,
//                 //     "subject_name": "Social - Media - Analytics - & - Future - Trends"
//                 // },
//                 // {
//                 //     "subject_id": 316,
//                 //     "subject_name": "SEO - & - SEM"
//                 // },
//                 // {
//                 //     "subject_id": 317,
//                 //     "subject_name": "Integrated - Marketing - Communication"
//                 // },
//                 // {
//                 //     "subject_id": 318,
//                 //     "subject_name": "Product - and - Brand - Management"
//                 // },
//                 // {
//                 //     "subject_id": 319,
//                 //     "subject_name": "Social - Media - Marketing"
//                 // },
//                 // {
//                 //     "subject_id": 566,
//                 //     "subject_name": "Social - Media - Analytics - & - Future - Trends"
//                 // },
//                 // {
//                 //     "subject_id": 567,
//                 //     "subject_name": "SEO - & - SEM"
//                 // },
//                 // {
//                 //     "subject_id": 568,
//                 //     "subject_name": "Integrated - Marketing - Communication"
//                 // },
//                 // {
//                 //     "subject_id": 569,
//                 //     "subject_name": "Product - and - Brand - Management"
//                 // },
//                 // {
//                 //     "subject_id": 570,
//                 //     "subject_name": "Social - Media - Marketing"
//                 // },
//                 // {
//                 //     "subject_id": 298,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 299,
//                 //     "subject_name": "Financial Management"
//                 // },






//                 // {
//                 //     "subject_id": 300,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 301,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 302,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 303,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 304,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 305,
//                 //     "subject_name": "Financial Management"
//                 // },
//                 // {
//                 //     "subject_id": 306,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 307,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 308,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 309,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 571,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 572,
//                 //     "subject_name": "Financial Management"
//                 // },
//                 // {
//                 //     "subject_id": 573,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 574,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 575,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 576,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 329,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 330,
//                 //     "subject_name": "Financial Management"
//                 // },
//                 // {
//                 //     "subject_id": 331,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 332,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 333,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 334,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 335,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 336,
//                 //     "subject_name": "Financial Management"
//                 // },
//                 // {
//                 //     "subject_id": 337,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 338,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 339,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 340,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 577,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 578,
//                 //     "subject_name": "Financial Management"
//                 // },
//                 // {
//                 //     "subject_id": 579,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 580,
//                 //     "subject_name": "Strategic Management"
//                 // },
//                 // {
//                 //     "subject_id": 581,
//                 //     "subject_name": "Management Information System "
//                 // },
//                 // {
//                 //     "subject_id": 582,
//                 //     "subject_name": " Business Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 347,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 348,
//                 //     "subject_name": "Production, Planning and Control"
//                 // },
//                 // {
//                 //     "subject_id": 349,
//                 //     "subject_name": "Operations Management"
//                 // },
//                 // {
//                 //     "subject_id": 350,
//                 //     "subject_name": "Lean Management Systems"
//                 // },
//                 // {
//                 //     "subject_id": 351,
//                 //     "subject_name": "Supply Chain Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 352,
//                 //     "subject_name": "Operations Research"
//                 // },
//                 // {
//                 //     "subject_id": 389,
//                 //     "subject_name": "Production, Planning and Control"
//                 // },
//                 // {
//                 //     "subject_id": 390,
//                 //     "subject_name": "Operations Management"
//                 // },
//                 // {
//                 //     "subject_id": 391,
//                 //     "subject_name": "Lean Management Systems"
//                 // },
//                 // {
//                 //     "subject_id": 392,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 393,
//                 //     "subject_name": "Operations Research"
//                 // },
//                 // {
//                 //     "subject_id": 394,
//                 //     "subject_name": "Supply Chain Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 430,
//                 //     "subject_name": "Production, Planning and Control"
//                 // },
//                 // {
//                 //     "subject_id": 431,
//                 //     "subject_name": "Operations Management"
//                 // },
//                 // {
//                 //     "subject_id": 432,
//                 //     "subject_name": "Lean Management Systems"
//                 // },
//                 // {
//                 //     "subject_id": 433,
//                 //     "subject_name": "Operations Research"
//                 // },
//                 // {
//                 //     "subject_id": 434,
//                 //     "subject_name": "Supply Chain Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 865,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 589,
//                 //     "subject_name": "Production, Planning and Control"
//                 // },
//                 // {
//                 //     "subject_id": 590,
//                 //     "subject_name": "Operations Management"
//                 // },
//                 // {
//                 //     "subject_id": 591,
//                 //     "subject_name": "Lean Management Systems"
//                 // },
//                 // {
//                 //     "subject_id": 592,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 593,
//                 //     "subject_name": "Operations Research"
//                 // },
//                 // {
//                 //     "subject_id": 594,
//                 //     "subject_name": "Supply Chain Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 353,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 354,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 355,
//                 //     "subject_name": "Learning and Development"
//                 // },
//                 // {
//                 //     "subject_id": 356,
//                 //     "subject_name": "Compensation Management and HR Audit"
//                 // },
//                 // {
//                 //     "subject_id": 357,
//                 //     "subject_name": "Strategic Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 358,
//                 //     "subject_name": "HR Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 395,
//                 //     "subject_name": "Learning and Development"
//                 // },
//                 // {
//                 //     "subject_id": 396,
//                 //     "subject_name": "Strategic Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 397,
//                 //     "subject_name": "HR Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 398,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 399,
//                 //     "subject_name": "Compensation Management and HR Audit"
//                 // },
//                 // {
//                 //     "subject_id": 400,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 435,
//                 //     "subject_name": "Learning and Development"
//                 // },
//                 // {
//                 //     "subject_id": 436,
//                 //     "subject_name": "Strategic Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 437,
//                 //     "subject_name": "HR Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 438,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 439,
//                 //     "subject_name": "Compensation Management and HR Audit"
//                 // },
//                 // {
//                 //     "subject_id": 858,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 595,
//                 //     "subject_name": "Learning and Development"
//                 // },
//                 // {
//                 //     "subject_id": 596,
//                 //     "subject_name": "Strategic Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 597,
//                 //     "subject_name": "HR Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 598,
//                 //     "subject_name": "Human Resource Management"
//                 // },
//                 // {
//                 //     "subject_id": 599,
//                 //     "subject_name": "Compensation Management and HR Audit"
//                 // },
//                 // {
//                 //     "subject_id": 600,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },



// // data not present 371 to 376 at edmengale

//                 // {
//                 //     "subject_id": 371,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 372,
//                 //     "subject_name": "Strategic Cost Management"
//                 // },
//                 // {
//                 //     "subject_id": 373,
//                 //     "subject_name": "Security Analysis and Portfolio Management"
//                 // },
//                 // {
//                 //     "subject_id": 374,
//                 //     "subject_name": "Corporate Finance"
//                 // },
//                 // {
//                 //     "subject_id": 375,
//                 //     "subject_name": "Financial Markets & Services"
//                 // },
//                 // {
//                 //     "subject_id": 376,
//                 //     "subject_name": "Financial Analytics"
//                 // },




//                 // {
//                 //     "subject_id": 413,
//                 //     "subject_name": "Security Analysis and Portfolio Management"
//                 // },
//                 // {
//                 //     "subject_id": 414,
//                 //     "subject_name": "Strategic Cost Management"
//                 // },
//                 // {
//                 //     "subject_id": 415,
//                 //     "subject_name": "Financial Markets & Services"
//                 // },
//                 // {
//                 //     "subject_id": 416,
//                 //     "subject_name": "Financial Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 417,
//                 //     "subject_name": "Corporate Finance"
//                 // },
//                 // {
//                 //     "subject_id": 868,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 451,
//                 //     "subject_name": "Security Analysis and Portfolio Management"
//                 // },
//                 // {
//                 //     "subject_id": 452,
//                 //     "subject_name": "Strategic Cost Management"
//                 // },
//                 // {
//                 //     "subject_id": 453,
//                 //     "subject_name": "Financial Markets & Services"
//                 // },
//                 // {
//                 //     "subject_id": 454,
//                 //     "subject_name": "Financial Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 455,
//                 //     "subject_name": "Corporate Finance"
//                 // },
//                 // {
//                 //     "subject_id": 867,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 613,
//                 //     "subject_name": "Security Analysis and Portfolio Management"
//                 // },
//                 // {
//                 //     "subject_id": 614,
//                 //     "subject_name": "Strategic Cost Management"
//                 // },
//                 // {
//                 //     "subject_id": 615,
//                 //     "subject_name": "Financial Markets & Services"
//                 // },
//                 // {
//                 //     "subject_id": 616,
//                 //     "subject_name": "Financial Analytics"
//                 // },
//                 // {
//                 //     "subject_id": 617,
//                 //     "subject_name": "Corporate Finance"
//                 // },
//                 // {
//                 //     "subject_id": 610,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 377,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 378,
//                 //     "subject_name": "Construction Site Management"
//                 // },
//                 // {
//                 //     "subject_id": 379,
//                 //     "subject_name": "Cost Engineering and Contracts Management"
//                 // },
//                 // {
//                 //     "subject_id": 380,
//                 //     "subject_name": "Project Formulation and Real Estate Project Development"
//                 // },
//                 // {
//                 //     "subject_id": 381,
//                 //     "subject_name": "Construction Technology for Real Estate and Infrastructure Development"
//                 // },
//                 // {
//                 //     "subject_id": 382,
//                 //     "subject_name": "Oracle Primavera"
//                 // },
//                 // {
//                 //     "subject_id": 419,
//                 //     "subject_name": "Project Formulation and Real Estate Project Development"
//                 // },
//                 // {
//                 //     "subject_id": 420,
//                 //     "subject_name": "Cost Engineering and Contracts Management"
//                 // },
//                 // {
//                 //     "subject_id": 421,
//                 //     "subject_name": "Construction Technology for Real Estate and Infrastructure Development"
//                 // },
//                 // {
//                 //     "subject_id": 422,
//                 //     "subject_name": "Construction Site Management"
//                 // },
//                 // {
//                 //     "subject_id": 423,
//                 //     "subject_name": "Oracle Primavera"
//                 // },
//                 // {
//                 //     "subject_id": 869,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 457,
//                 //     "subject_name": "Project Formulation and Real Estate Project Development"
//                 // },
//                 // {
//                 //     "subject_id": 458,
//                 //     "subject_name": "Cost Engineering and Contracts Management"
//                 // },
//                 // {
//                 //     "subject_id": 459,
//                 //     "subject_name": "Construction Technology for Real Estate and Infrastructure Development"
//                 // },
//                 // {
//                 //     "subject_id": 460,
//                 //     "subject_name": "Construction Site Management"
//                 // },
//                 // {
//                 //     "subject_id": 461,
//                 //     "subject_name": "Oracle Primavera"
//                 // },
//                 // {
//                 //     "subject_id": 870,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 618,
//                 //     "subject_name": "Project Formulation and Real Estate Project Development"
//                 // },
//                 // {
//                 //     "subject_id": 619,
//                 //     "subject_name": "Cost Engineering and Contracts Management"
//                 // },
//                 // {
//                 //     "subject_id": 620,
//                 //     "subject_name": "Construction Technology for Real Estate and Infrastructure Development"
//                 // },
//                 // {
//                 //     "subject_id": 621,
//                 //     "subject_name": "Construction Site Management"
//                 // },
//                 // {
//                 //     "subject_id": 622,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 623,
//                 //     "subject_name": "Oracle Primavera"
//                 // },
//                 // {
//                 //     "subject_id": 383,
//                 //     "subject_name": "Project Planning"
//                 // },
//                 // {
//                 //     "subject_id": 384,
//                 //     "subject_name": "Project Execution, Control and Closure"
//                 // },
//                 // {
//                 //     "subject_id": 385,
//                 //     "subject_name": "Project Analysis and Integration Management"
//                 // },
//                 // {
//                 //     "subject_id": 386,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 387,
//                 //     "subject_name": "Essentials of Agile Project Management"
//                 // },
//                 // {
//                 //     "subject_id": 388,
//                 //     "subject_name": "Microsoft Project and Jira"
//                 // },
//                 // {
//                 //     "subject_id": 424,
//                 //     "subject_name": "Project Planning"
//                 // },
//                 // {
//                 //     "subject_id": 425,
//                 //     "subject_name": "Project Execution, Control and Closure"
//                 // },
//                 // {
//                 //     "subject_id": 426,
//                 //     "subject_name": "Project Analysis and Integration Management"
//                 // },
//                 // {
//                 //     "subject_id": 428,
//                 //     "subject_name": "Essentials of Agile Project Management"
//                 // },
//                 // {
//                 //     "subject_id": 429,
//                 //     "subject_name": "Microsoft Project and Jira"
//                 // },
//                 // {
//                 //     "subject_id": 866,
//                 //     "subject_name": "Research Methodology and Management Decision"
//                 // },
//                 // {
//                 //     "subject_id": 583,
//                 //     "subject_name": "Project Planning"
//                 // },
//                 // {
//                 //     "subject_id": 584,
//                 //     "subject_name": "Project Execution, Control and Closure"
//                 // },
//                 // {
//                 //     "subject_id": 585,
//                 //     "subject_name": "Project Analysis and Integration Management"
//                 // },
// //                 {
// //                     "subject_id": 586,
// //                     "subject_name": "Research Methodology and Management Decision"
// //                 },
// //                 {
// //                     "subject_id": 587,
// //                     "subject_name": "Essentials of Agile Project Management"
// //                 },
// //                 {
// //                     "subject_id": 588,
// //                     "subject_name": "Microsoft Project and Jira"
// //                 },
// //                 {
// //                     "subject_id": 401,
// //                     "subject_name": "Product and Brand Management"
// //                 },
// //                 {
// //                     "subject_id": 402,
// //                     "subject_name": "Marketing Analytics"
// //                 },
// //                 {
// //                     "subject_id": 403,
// //                     "subject_name": "Integrated Marketing Communication"
// //                 },
// //                 {
// //                     "subject_id": 404,
// //                     "subject_name": "Research Methodology and Management Decision"
// //                 },
// //                 {
// //                     "subject_id": 405,
// //                     "subject_name": "Digital Marketing Strategies"
// //                 },
// //                 {
// //                     "subject_id": 406,
// //                     "subject_name": "Marketing Management"
// //                 },
// //                 {
// //                     "subject_id": 440,
// //                     "subject_name": "Product and Brand Management"
// //                 },
// //                 {
// //                     "subject_id": 441,
// //                     "subject_name": "Marketing Analytics"
// //                 },
// //                 {
// //                     "subject_id": 442,
// //                     "subject_name": "Integrated Marketing Communication"
// //                 },
// //                 {
// //                     "subject_id": 444,
// //                     "subject_name": "Digital Marketing Strategies"
// //                 },
// //                 {
// //                     "subject_id": 445,
// //                     "subject_name": "Marketing Management"
// //                 },
// //                 {
// //                     "subject_id": 856,
// //                     "subject_name": "Research Methodology and Management Decision"
// //                 },
// //                 {
// //                     "subject_id": 601,
// //                     "subject_name": "Product and Brand Management"
// //                 },
// //                 {
// //                     "subject_id": 602,
// //                     "subject_name": "Marketing Analytics"
// //                 },
// //                 {
// //                     "subject_id": 603,
// //                     "subject_name": "Integrated Marketing Communication"
// //                 },
// //                 {
// //                     "subject_id": 604,
// //                     "subject_name": "Research Methodology and Management Decision"
// //                 },
// //                 {
// //                     "subject_id": 605,
// //                     "subject_name": "Digital Marketing Strategies"
// //                 },
// //                 {
// //                     "subject_id": 606,
// //                     "subject_name": "Marketing Management"
// //                 },
// //                 {
// //                     "subject_id": 407,
// //                     "subject_name": "Inventory Management"
// //                 },
// //                 {
// //                     "subject_id": 408,
// //                     "subject_name": "Production, Planning and Control"
// //                 },
// //                 {
// //                     "subject_id": 409,
// //                     "subject_name": "Packaging and Distribution Management"
// //                 },
// //                 {
// //                     "subject_id": 410,
// //                     "subject_name": "Research Methodology and Management Decision"
// //                 },
// //                 {
// //                     "subject_id": 411,
// //                     "subject_name": "Warehouse Management"
// //                 },
// //                 {
// //                     "subject_id": 412,
// //                     "subject_name": "Supply Chain Analytics"
// //                 },
// //                 {
// //                     "subject_id": 446,
// //                     "subject_name": "Inventory Management"
// //                 },
// //                 {
// //                     "subject_id": 447,
// //                     "subject_name": "Production, Planning and Control"
// //                 },
// //                 {
// //                     "subject_id": 448,
// //                     "subject_name": "Packaging and Distribution Management"
// //                 },
// //                 {
// //                     "subject_id": 449,
// //                     "subject_name": "Warehouse Management"
// //                 },
// //                 {
// //                     "subject_id": 450,
// //                     "subject_name": "Supply Chain Analytics"
// //                 },
// //                 {
// //                     "subject_id": 857,
// //                     "subject_name": "Research Methodology and Management Decision"
// //                 },
// //                 {
// //                     "subject_id": 607,
// //                     "subject_name": "Inventory Management"
// //                 },
// //                 {
// //                     "subject_id": 608,
// //                     "subject_name": "Production, Planning and Control"
// //                 },
// //                 {
// //                     "subject_id": 609,
// //                     "subject_name": "Packaging and Distribution Management"
// //                 },
// //                 {
// //                     "subject_id": 610,
// //                     "subject_name": "Research Methodology and Management Decision"
// //                 },
// //                 {
// //                     "subject_id": 611,
// //                     "subject_name": "Warehouse Management"
// //                 },
// //                 {
// //                     "subject_id": 612,
// //                     "subject_name": "Supply Chain Analytics"
// //                 },
// //                 {
// //                     "subject_id": 502,
// //                     "subject_name": "Indian Economy and Policy"
// //                 },
// //                 {
// //                     "subject_id": 503,
// //                     "subject_name": "Business Communication"
// //                 },
// //                 {
// //                     "subject_id": 504,
// //                     "subject_name": "Accounting for Managers"
// //                 },
// //                 {
// //                     "subject_id": 505,
// //                     "subject_name": "Marketing Management"
// //                 },
// //                 {
// //                     "subject_id": 506,
// //                     "subject_name": "Legal and Business Environment"
// //                 },
// //                 {
// //                     "subject_id": 507,
// //                     "subject_name": "Principles of Management"
// //                 },
// //                 // {
// //                 //     "subject_id": 880,
// //                 //     "subject_name": "testtitle"
// //                 // },
// //                 {
// //                     "subject_id": 530,
// //                     "subject_name": "AI in Digital Marketing"
// //                 },
// //                 {
// //                     "subject_id": 531,
// //                     "subject_name": "AI in Digital Marketing"
// //                 },
// //                 // {
// //                 //     "subject_id": 627,
// //                 //     "subject_name": "Call Recordings "
// //                 // },
// //                 {
// //                     "subject_id": 628,
// //                     "subject_name": "Basic Of IT Training"
// //                 },
// //                 {
// //                     "subject_id": 639,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 640,
// //                     "subject_name": "Learning and Development"
// //                 },
// //                 {
// //                     "subject_id": 641,
// //                     "subject_name": "Compensation Management and HR Audit"
// //                 },
// //                 {
// //                     "subject_id": 642,
// //                     "subject_name": "Performance Management and Competency Mapping"
// //                 },
// //                 {
// //                     "subject_id": 643,
// //                     "subject_name": "Strategic Human Resource Management"
// //                 },
// //                 {
// //                     "subject_id": 689,
// //                     "subject_name": "Performance Management and Competency Mapping"
// //                 },
// //                 {
// //                     "subject_id": 690,
// //                     "subject_name": "Learning and Development"
// //                 },
// //                 {
// //                     "subject_id": 691,
// //                     "subject_name": "Strategic Human Resource Management"
// //                 },
// //                 {
// //                     "subject_id": 692,
// //                     "subject_name": "Compensation Management and HR Audit"
// //                 },
// //                 {
// //                     "subject_id": 693,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 644,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 645,
// //                     "subject_name": "Database Management Systems"
// //                 },
// //                 {
// //                     "subject_id": 646,
// //                     "subject_name": "Object Oriented Analysis & Designing (OOA)"
// //                 },
// //                 {
// //                     "subject_id": 647,
// //                     "subject_name": "IT Security"
// //                 },
// //                 {
// //                     "subject_id": 648,
// //                     "subject_name": "Digital  Marketing"
// //                 },
// //                 {
// //                     "subject_id": 694,
// //                     "subject_name": "Object Oriented Analysis & Designing (OOA)"
// //                 },
// //                 {
// //                     "subject_id": 695,
// //                     "subject_name": "IT Security"
// //                 },
// //                 {
// //                     "subject_id": 696,
// //                     "subject_name": "Database Management Systems"
// //                 },
// //                 {
// //                     "subject_id": 697,
// //                     "subject_name": "Digital  Marketing"
// //                 },
// //                 {
// //                     "subject_id": 698,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 649,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 650,
// //                     "subject_name": "Digital  Marketing"
// //                 },
// //                 {
// //                     "subject_id": 651,
// //                     "subject_name": "Integrated Marketing Communication"
// //                 },
// //                 {
// //                     "subject_id": 652,
// //                     "subject_name": "Product and Brand Management"
// //                 },
// //                 {
// //                     "subject_id": 653,
// //                     "subject_name": "Packaging and Distribution Management"
// //                 },
// //                 {
// //                     "subject_id": 699,
// //                     "subject_name": "Digital  Marketing"
// //                 },
// //                 {
// //                     "subject_id": 700,
// //                     "subject_name": "Product and Brand Management"
// //                 },
// //                 {
// //                     "subject_id": 701,
// //                     "subject_name": "Integrated Marketing Communication"
// //                 },
// //                 {
// //                     "subject_id": 702,
// //                     "subject_name": "Packaging and Distribution Management"
// //                 },
// //                 {
// //                     "subject_id": 703,
// //                     "subject_name": "Project Management"
// //                 },

// // // data not present 654 to 658 at edmengale


// //                 {
// //                     "subject_id": 654,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 655,
// //                     "subject_name": "Strategic Cost Management"
// //                 },
// //                 {
// //                     "subject_id": 656,
// //                     "subject_name": "International Finance"
// //                 },
// //                 {
// //                     "subject_id": 657,
// //                     "subject_name": "Corporate Finance"
// //                 },
// //                 {
// //                     "subject_id": 658,
// //                     "subject_name": "Security Analysis and Portfolio Management"
// //                 },





// //                 {
// //                     "subject_id": 704,
// //                     "subject_name": "International Finance"
// //                 },
// //                 {
// //                     "subject_id": 705,
// //                     "subject_name": "Security Analysis and Portfolio Management"
// //                 },
// //                 {
// //                     "subject_id": 706,
// //                     "subject_name": "Strategic Cost Management"
// //                 },
// //                 {
// //                     "subject_id": 707,
// //                     "subject_name": "Corporate Finance"
// //                 },
// //                 {
// //                     "subject_id": 708,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 659,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 660,
// //                     "subject_name": "Production, Planning and Control"
// //                 },
// //                 {
// //                     "subject_id": 661,
// //                     "subject_name": "Warehouse Management"
// //                 },
// //                 {
// //                     "subject_id": 662,
// //                     "subject_name": "Packaging and Distribution Management"
// //                 },
// //                 {
// //                     "subject_id": 663,
// //                     "subject_name": "Emerging Trends in SCM and logistics"
// //                 },
// //                 {
// //                     "subject_id": 709,
// //                     "subject_name": "Emerging Trends in SCM and logistics"
// //                 },
// //                 {
// //                     "subject_id": 710,
// //                     "subject_name": "Production, Planning and Control"
// //                 },
// //                 {
// //                     "subject_id": 711,
// //                     "subject_name": "Packaging and Distribution Management"
// //                 },
// //                 {
// //                     "subject_id": 712,
// //                     "subject_name": "Warehouse Management"
// //                 },
// //                 {
// //                     "subject_id": 713,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 664,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 665,
// //                     "subject_name": "Production, Planning and Control"
// //                 },
// //                 {
// //                     "subject_id": 666,
// //                     "subject_name": "Inventory Management"
// //                 },
// //                 {
// //                     "subject_id": 667,
// //                     "subject_name": "Materials Management"
// //                 },
// //                 {
// //                     "subject_id": 668,
// //                     "subject_name": "Warehouse Management"
// //                 },
// //                 {
// //                     "subject_id": 714,
// //                     "subject_name": "Materials Management"
// //                 },
// //                 {
// //                     "subject_id": 715,
// //                     "subject_name": "Inventory Management"
// //                 },
// //                 {
// //                     "subject_id": 716,
// //                     "subject_name": "Production, Planning and Control"
// //                 },
// //                 {
// //                     "subject_id": 717,
// //                     "subject_name": "Warehouse Management"
// //                 },
// //                 {
// //                     "subject_id": 718,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 669,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 670,
// //                     "subject_name": "Strategic Cost Management"
// //                 },
// //                 {
// //                     "subject_id": 671,
// //                     "subject_name": "Security Analysis and Portfolio Management"
// //                 },
// //                 {
// //                     "subject_id": 672,
// //                     "subject_name": "Corporate Finance"
// //                 },
// //                 {
// //                     "subject_id": 673,
// //                     "subject_name": "Financial Markets & Services"
// //                 },
// //                 {
// //                     "subject_id": 719,
// //                     "subject_name": "Security Analysis and Portfolio Management"
// //                 },
// //                 {
// //                     "subject_id": 720,
// //                     "subject_name": "Strategic Cost Management"
// //                 },
// //                 {
// //                     "subject_id": 721,
// //                     "subject_name": "Financial Markets & Services"
// //                 },
// //                 {
// //                     "subject_id": 722,
// //                     "subject_name": "Corporate Finance"
// //                 },
// //                 {
// //                     "subject_id": 723,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 674,
// //                     "subject_name": "Project Planning"
// //                 },
// //                 {
// //                     "subject_id": 675,
// //                     "subject_name": "Project Execution, Control and Closure"
// //                 },
// //                 {
// //                     "subject_id": 676,
// //                     "subject_name": "Project Analysis and Integration Management"
// //                 },
// //                 {
// //                     "subject_id": 677,
// //                     "subject_name": "Microsoft Project and Jira"
// //                 },
// //                 {
// //                     "subject_id": 678,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 850,
// //                     "subject_name": "Project Planning"
// //                 },
// //                 {
// //                     "subject_id": 851,
// //                     "subject_name": "Project Execution, Control and Closure"
// //                 },
// //                 {
// //                     "subject_id": 852,
// //                     "subject_name": "Project Analysis and Integration Management"
// //                 },
// //                 {
// //                     "subject_id": 853,
// //                     "subject_name": "Microsoft Project and Jira"
// //                 },
// //                 {
// //                     "subject_id": 854,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 684,
// //                     "subject_name": "Production, Planning and Control"
// //                 },
// //                 {
// //                     "subject_id": 685,
// //                     "subject_name": "Operations Management"
// //                 },
// //                 {
// //                     "subject_id": 686,
// //                     "subject_name": "Lean Management Systems"
// //                 },
// //                 {
// //                     "subject_id": 687,
// //                     "subject_name": "Operations Research"
// //                 },
// //                 {
// //                     "subject_id": 688,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 724,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 725,
// //                     "subject_name": "Construction Technology & Site Management"
// //                 },
// //                 {
// //                     "subject_id": 726,
// //                     "subject_name": "Cost Engineering and Contracts Management"
// //                 },
// //                 {
// //                     "subject_id": 727,
// //                     "subject_name": "Project Formulation and Real Estate Project Development"
// //                 },
// //                 {
// //                     "subject_id": 728,
// //                     "subject_name": "Oracle Primavera"
// //                 },
// //                 {
// //                     "subject_id": 729,
// //                     "subject_name": "Business Ethics and Corporate Social Responsibility"
// //                 },
// //                 {
// //                     "subject_id": 730,
// //                     "subject_name": "Production, Planning and Control"
// //                 },
// //                 {
// //                     "subject_id": 731,
// //                     "subject_name": "Operations Management"
// //                 },
// //                 {
// //                     "subject_id": 732,
// //                     "subject_name": "Lean Management Systems"
// //                 },
// //                 {
// //                     "subject_id": 733,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 734,
// //                     "subject_name": "Business Ethics and Corporate Social Responsibility"
// //                 },
// //                 {
// //                     "subject_id": 735,
// //                     "subject_name": "Strategic Cost Management"
// //                 },
// //                 {
// //                     "subject_id": 736,
// //                     "subject_name": "Financial Markets & Services"
// //                 },
// //                 {
// //                     "subject_id": 737,
// //                     "subject_name": "Corporate Finance"
// //                 },
// //                 {
// //                     "subject_id": 738,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 739,
// //                     "subject_name": "Business Ethics and Corporate Social Responsibility"
// //                 },
// //                 {
// //                     "subject_id": 740,
// //                     "subject_name": "Strategic Human Resource Management"
// //                 },
// //                 {
// //                     "subject_id": 741,
// //                     "subject_name": "Learning and Development"
// //                 },
// //                 {
// //                     "subject_id": 742,
// //                     "subject_name": "Compensation Management and HR Audit"
// //                 },
// //                 {
// //                     "subject_id": 743,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 744,
// //                     "subject_name": "Business Ethics and Corporate Social Responsibility"
// //                 },
// //                 {
// //                     "subject_id": 745,
// //                     "subject_name": "Database Management Systems"
// //                 },
// //                 {
// //                     "subject_id": 746,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 747,
// //                     "subject_name": "Object Oriented Analysis & Designing (OOA)"
// //                 },
// //                 {
// //                     "subject_id": 748,
// //                     "subject_name": "Operating Systems"
// //                 },
// //                 {
// //                     "subject_id": 749,
// //                     "subject_name": "Business Ethics and Corporate Social Responsibility"
// //                 },
// //                 {
// //                     "subject_id": 750,
// //                     "subject_name": "Integrated Marketing Communication"
// //                 },
// //                 {
// //                     "subject_id": 751,
// //                     "subject_name": "Product and Brand Management"
// //                 },
// //                 {
// //                     "subject_id": 752,
// //                     "subject_name": "Services Marketing"
// //                 },
// //                 {
// //                     "subject_id": 753,
// //                     "subject_name": "Digital Marketing Strategies"
// //                 },
// //                 {
// //                     "subject_id": 766,
// //                     "subject_name": "HR Analytics"
// //                 },
// //                 {
// //                     "subject_id": 768,
// //                     "subject_name": "Marketing Analytics"
// //                 },
// //                 {
// //                     "subject_id": 769,
// //                     "subject_name": "Financial Analytics"
// //                 },
// //                 {
// //                     "subject_id": 770,
// //                     "subject_name": "Social Media Marketing"
// //                 },
// //                 {
// //                     "subject_id": 771,
// //                     "subject_name": "Predictive Modelling"
// //                 },
// //                 {
// //                     "subject_id": 772,
// //                     "subject_name": "Supply Chain Analytics"
// //                 },
// //                 {
// //                     "subject_id": 773,
// //                     "subject_name": "Corporate Finance"
// //                 },
// //                 {
// //                     "subject_id": 774,
// //                     "subject_name": "Security Analysis and Portfolio Management"
// //                 },
// //                 {
// //                     "subject_id": 775,
// //                     "subject_name": "Strategic Cost Management"
// //                 },
// //                 {
// //                     "subject_id": 776,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 777,
// //                     "subject_name": "Financial Markets & Services"
// //                 },

// // // data not present 778 to 782 at edmengale


// //                 {
// //                     "subject_id": 778,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 779,
// //                     "subject_name": " Energy Audit And Management (EAMm)"
// //                 },
// //                 {
// //                     "subject_id": 780,
// //                     "subject_name": "Energy Efficiency In Electrical and Thermal Utilities (EEETUm)"
// //                 },
// //                 {
// //                     "subject_id": 781,
// //                     "subject_name": "Light and Illumination"
// //                 },
// //                 {
// //                     "subject_id": 782,
// //                     "subject_name": "Operations Management"
// //                 },






// //                 {
// //                     "subject_id": 783,
// //                     "subject_name": "Light and Illumination"
// //                 },
// //                 {
// //                     "subject_id": 784,
// //                     "subject_name": " Energy Audit And Management (EAMm)"
// //                 },
// //                 {
// //                     "subject_id": 785,
// //                     "subject_name": "Operations Management"
// //                 },
// //                 {
// //                     "subject_id": 786,
// //                     "subject_name": "Energy Efficiency In Electrical and Thermal Utilities (EEETUm)"
// //                 },
// //                 {
// //                     "subject_id": 787,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 788,
// //                     "subject_name": "Project Management"
// //                 },
// //                 {
// //                     "subject_id": 789,
// //                     "subject_name": "Business Ethics and Corporate Social Responsibility"
// //                 },
// //                 {
// //                     "subject_id": 790,
// //                     "subject_name": "Fire and Marine Insurance (FMIm)"
// //                 },
// //                 {
// //                     "subject_id": 791,
// //                     "subject_name": "Life Insurance I and II (LIm)"
// //                 },
// //                 {
// //                     "subject_id": 792,
// //                     "subject_name": "Principles and Practice of General Insurance (PPGIm)"
// //                 },
// //                 {
// //                     "subject_id": 793,
// //                     "subject_name": "Business Ethics and Corporate Social Responsibility"
// //                 },
//                 // {
//                 //     "subject_id": 794,
//                 //     "subject_name": "Inventory Management"
//                 // },
//                 // {
//                 //     "subject_id": 795,
//                 //     "subject_name": "Materials Management"
//                 // },
//                 // {
//                 //     "subject_id": 796,
//                 //     "subject_name": "Production, Planning and Control"
//                 // },
//                 // {
//                 //     "subject_id": 797,
//                 //     "subject_name": "Project Management"
//                 // },
//                 // {
//                 //     "subject_id": 798,
//                 //     "subject_name": "Achieving Supply Chain Integration"
//                 // },
//                 // {
//                 //     "subject_id": 799,
//                 //     "subject_name": "Business Ethics and Corporate Social Responsibility"
//                 // },
//                 // {
//                 //     "subject_id": 800,
//                 //     "subject_name": "Packaging and Distribution Management"
//                 // },
//                 // {
//                 //     "subject_id": 801,
//                 //     "subject_name": "Production, Planning and Control"
//                 // },
//                 // {
//                 //     "subject_id": 802,
//                 //     "subject_name": "Project Management"
//                 // },
//                 // {
//                 //     "subject_id": 803,
//                 //     "subject_name": "Marketing of Financial Services"
//                 // },
//                 // {
//                 //     "subject_id": 804,
//                 //     "subject_name": "Entrepreneurship and Venture Capital Management"
//                 // },
//                 // {
//                 //     "subject_id": 805,
//                 //     "subject_name": "World Class Manufacturing"
//                 // },
//                 // {
//                 //     "subject_id": 806,
//                 //     "subject_name": "Achieving Supply Chain Integration"
//                 // },
//                 // {
//                 //     "subject_id": 807,
//                 //     "subject_name": "Operations Research"
//                 // },
//                 // {
//                 //     "subject_id": 808,
//                 //     "subject_name": "Entrepreneurship and Venture Capital Management"
//                 // },
//                 // {
//                 //     "subject_id": 809,
//                 //     "subject_name": "Security Analysis and Portfolio Management"
//                 // },
//                 // {
//                 //     "subject_id": 810,
//                 //     "subject_name": "International Finance"
//                 // },
//                 // {
//                 //     "subject_id": 811,
//                 //     "subject_name": "Mergers and Acquisitions"
//                 // },
//                 // {
//                 //     "subject_id": 812,
//                 //     "subject_name": "Entrepreneurship and Venture Capital Management"
//                 // },
//                 // {
//                 //     "subject_id": 813,
//                 //     "subject_name": "Human Resource Information System"
//                 // },
//                 // {
//                 //     "subject_id": 814,
//                 //     "subject_name": "Industrial Relations and Labour Laws"
//                 // },
//                 // {
//                 //     "subject_id": 815,
//                 //     "subject_name": "Performance Management and Competency Mapping"
//                 // },
//                 // {
//                 //     "subject_id": 816,
//                 //     "subject_name": "Entrepreneurship and Venture Capital Management"
//                 // },
//                 // {
//                 //     "subject_id": 817,
//                 //     "subject_name": "Networking Concepts"
//                 // },
//                 // {
//                 //     "subject_id": 818,
//                 //     "subject_name": "Advanced Networking"
//                 // },
//                 // {
//                 //     "subject_id": 819,
//                 //     "subject_name": "IT Security"
//                 // },
//                 // {
//                 //     "subject_id": 820,
//                 //     "subject_name": "Entrepreneurship and Venture Capital Management"
//                 // },
//                 // {
//                 //     "subject_id": 821,
//                 //     "subject_name": "Sales Management"
//                 // },
//                 // {
//                 //     "subject_id": 822,
//                 //     "subject_name": "Retail Management"
//                 // },
//                 // {
//                 //     "subject_id": 823,
//                 //     "subject_name": "Packaging and Distribution Management"
//                 // },
//                 // {
//                 //     "subject_id": 824,
//                 //     "subject_name": "Entrepreneurship and Venture Capital Management"
//                 // },
//                 // {
//                 //     "subject_id": 825,
//                 //     "subject_name": "Achieving Supply Chain Integration"
//                 // },
//                 // {
//                 //     "subject_id": 826,
//                 //     "subject_name": "Warehouse Management"
//                 // },
//                 // {
//                 //     "subject_id": 827,
//                 //     "subject_name": "World Class Manufacturing"
//                 // },
//                 // {
//                 //     "subject_id": 828,
//                 //     "subject_name": "Emerging Trends in SCM and logistics"
//                 // },
//                 // {
//                 //     "subject_id": 829,
//                 //     "subject_name": "Entrepreneurship and Venture Capital Management"
//                 // },
//                 // {
//                 //     "subject_id": 830,
//                 //     "subject_name": "Warehouse Management (WMw)"
//                 // },
//                 // {
//                 //     "subject_id": 831,
//                 //     "subject_name": "World Class Manufacturing"
//                 // },
//                 // {
//                 //     "subject_id": 832,
//                 //     "subject_name": "Total Quality Management"
//                 // },
//                 // {
//                 //     "subject_id": 833,
//                 //     "subject_name": " Accounting for Managers (AcM)"
//                 // },
//                 // {
//                 //     "subject_id": 834,
//                 //     "subject_name": "Project Management (PMc)"
//                 // },


// // // data not present 873 to 878 at edmengale


//                 // {
//                 //     "subject_id": 873,
//                 //     "subject_name": "Live Recording"
//                 // },
//                 // {
//                 //     "subject_id": 874,
//                 //     "subject_name": "Live Recording"
//                 // },
//                 // {
//                 //     "subject_id": 877,
//                 //     "subject_name": "Leadership and Organizational Behavior"
//                 // },
//                 // {
//                 //     "subject_id": 878,
//                 //     "subject_name": "Managerial Economics (MEco)"
//                 // },
//                 // {
//                 //     "subject_id": 879,
//                 //     "subject_name": "Risk Management"
//                 // },
//                 // {
//                 //     "subject_id": 882,
//                 //     "subject_name": "Accounting for Managers"
//                 // },
//                 // {
//                 //     "subject_id": 883,
//                 //     "subject_name": "Project Management"
//                 // }
//             ]
        console.log(subjectArray.length)
        // StudentSubjectMarksData(subjectArray)
        res.json(subjectArray);

    } catch (error) {
        console.error('Error fetching batch data:', error);
        throw error;
    }

})

// router.get('/student-marks', async (req, res) => {
//     try {
//       const { registration_number, email, user_username, user_id } = req.query;

//       const userData = await All_Students.findOne({
//         where: {
//           [Op.or]: [
//             { registration_number },
//             { email },
//             { user_username },
//             { user_id },
//           ],
//         },
//         include: [{ model: FlattenedDataModel }],
//       });

//       if (!userData) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       res.json(userData);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });





router.get('/student-marks', async (req, res) => {
    try {
        const { registration_number, email, user_username, user_id } = req.query;

        // Ensure at least one field is provided
        if (!registration_number && !email && !user_username && !user_id) {
            return res.status(400).json({ message: 'Please provide at least one search parameter' });
        }

        // Find user data
        const userData = await All_Students.findOne({
            where: {
                [Op.or]: [
                    registration_number && { registration_number },
                    email && { email },
                    user_username && { user_username },
                    user_id && { user_id },
                ].filter(Boolean), // Filter out undefined values
            },
        });

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userFlattenedData = await FlattenedDataModel.findAll({
            where: {
                user_id: userData.user_id,  // Assuming the field name in FlattenedDataModel is user_id
            },
        });

        // Combine user data with flattened data
        const result = {
            ...userData.toJSON(),
            flattenedData: userFlattenedData.map(item => item.toJSON()),
        };

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// router.get('/student-marks', async (req, res) => {
//     try {
//         const { registration_number, email, user_username, user_id } = req.query;

//         // Find user data
//         const userData = await All_Students.findOne({
//             where: {
//                 [Op.or]: [
//                     { registration_number },
//                     { email },
//                     { user_username },
//                     { user_id },
//                 ],
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


module.exports = router;