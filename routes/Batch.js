const axios = require('axios');
const express = require('express');
const router = express.Router();
// const sequelize = require('../config')
// const Batchmaster=require('../models/Batch_Master')


// router.post('/saveBatchs', async (req, res) => {
//     try {
//         const response = await axios.get('https://mitsde-api.edmingle.com/nuSource/api/v1/institution/dataexport?type=3&page=1&per_page=10&organization_id=4', {
//             headers: {
//                 'orgid': 3,
//                 'apikey': '49137bd489d3e3c7116ead9518ab093e',
//             },
//         });
//       const batchData = response.data.resource; // Assuming the data is sent in the request body
//       console.log(batchData , 17)
//       for (const batch of batchData) {
//         await Batchmaster.create({
//           batch_id: batch.batch_id,
//           batch_name: batch.batch_name,
//           bundle_id: batch.bundle_id,
//           tutor_id: batch.tutor_id,
//           is_default_batch: batch.is_default_batch,
//           is_archived: batch.is_archived,
//         });
//       }

//       res.status(200).json({ message: 'Batch data has been saved to the database.' });
//     } catch (error) {
//       console.error('API Error:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

  // router.get('/getBatchIds', async (req, res) => {
  //   try {
  //     const batchIds = await Batchmaster.findAll({ attributes: ['batch_id'], raw: true });
  //     const batchIdsArray = batchIds.map((batch) => batch.batch_id);
  
  //     res.status(200).json({ batchIds: batchIdsArray });
  //   } catch (error) {
  //     console.error('API Error:', error.message);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });



module.exports = router;