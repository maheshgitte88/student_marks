const axios = require('axios');
const express = require('express');
const router = express.Router();
const sequelize = require('../config')
// const Studentmaster=require('../models/Student_Master')
const FlattenedDataModel = require('../models/FlattenedDataModel');

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

router.post('/saveFlattenedData', async (req, res) => {
    try {
        const response = await axios.get(`https://mitsde-api.edmingle.com/nuSource/api/v1/reports/classprogress?page=1&per_page=3000&class_id=19`, {
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
                  userId: userId,
                  name: users.find(user => user[0] === userId)[1],            // Add user name
                  userUsername: users.find(user => user[0] === userId)[2],   // Add user username
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
  
              flattenedData.push(...userData);
          }
  
          // Use bulkCreate to insert multiple rows at once
          await FlattenedDataModel.bulkCreate(flattenedData);
  
          res.json({ code: 200, message: 'Success' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ code: 500, message: 'Internal Server Error' });
      }
  });
  
module.exports = router;