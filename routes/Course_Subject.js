const axios = require('axios');
const express = require('express');
const router = express.Router();
const ProgramModel = require('../models/ProgramModel'); // Update the path based on your file structure
const BatchModel = require('../models/BatchModel'); // Update the path based on your file structure

// API endpoint to save Bundle data
router.post('/saveBundle', async (req, res) => {
  try {
    const response = await axios.get(`https://mitsde.edmingle.com/nuSource/api/v1/short/masterbatch`, {
        headers: {
          'ORGID': 3,
          'apiKey': '49137bd489d3e3c7116ead9518ab093e',
        },
      });
    // https://mitsde.edmingle.com/nuSource/api/v1/short/masterbatch

    const courses  = response.data.courses;

    for (const course of courses) {
      const { bundle_id, bundle_name } = course;

      // Save data to BundleModel
      const bundle = await ProgramModel.create({
        program_id: bundle_id,
        program_name:bundle_name,
      });

      // Save batch data
      for (const batch of course.batch) {
        await BatchModel.create({
          batch_id: batch.class_id,
          batch_name: batch.class_name,
          start_date: batch.start_date,
          end_date: batch.end_date,
          admitted_students: batch.admitted_students,
          program_id: bundle.dataValues.program_id, // Use the bundle_id from the saved BundleModel
        });
      }
    }

    res.status(201).json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;




