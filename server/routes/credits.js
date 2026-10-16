const express = require('express');
const router = express.Router();

let projectCreditsDb = {
  hod: {
    name: '',
    designation: 'Head of Department',
    department: 'Computer Science & Engineering',
    email: 'info@jdcoem.ac.in',
    cabin: '',
    qualifications: '',
    avatar: '',
    message: '',
  },
  facultyGuides: [],
  studentContributors: [],
  updatedAt: new Date().toISOString(),
};

// GET /api/credits
router.get('/', (req, res) => {
  return res.json({ success: true, data: projectCreditsDb });
});

// PUT /api/credits (Update HOD, Faculty, or Contributors)
router.put('/', (req, res) => {
  const { hod, facultyGuides, studentContributors } = req.body;

  if (hod) projectCreditsDb.hod = { ...projectCreditsDb.hod, ...hod };
  if (facultyGuides) projectCreditsDb.facultyGuides = facultyGuides;
  if (studentContributors) projectCreditsDb.studentContributors = studentContributors;

  projectCreditsDb.updatedAt = new Date().toISOString();

  return res.json({
    success: true,
    message: 'Project credits updated successfully',
    data: projectCreditsDb,
  });
});

module.exports = router;
