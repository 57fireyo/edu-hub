const express = require('express');
const router = express.Router();

let projectCreditsDb = {
  hod: {
    name: 'Dr. Ramesh Kulkarni',
    designation: 'Head of Department',
    department: 'Computer Science & Engineering',
    email: 'hod.cse@eduhub.edu',
    cabin: 'Room 304, Academic Block A',
    qualifications: 'Ph.D. in Distributed Systems & AI, IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    message: 'Empowering students to build scalable software, foster cross-cohort mentorship, and innovate academic technology for our campus community.',
  },
  facultyGuides: [
    {
      id: 'fac-guide-1',
      name: 'Prof. Ananya Sen',
      designation: 'Associate Professor',
      department: 'Computer Science & Engineering',
      email: 'ananya.sen@eduhub.edu',
      roleInProject: 'Technical Advisor & Architecture Mentor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 'fac-guide-2',
      name: 'Dr. Vikramaditya Rao',
      designation: 'Assistant Professor',
      department: 'Information Technology',
      email: 'v.rao@eduhub.edu',
      roleInProject: 'Database & Cloud Security Supervisor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
  ],
  studentContributors: [
    {
      id: 'student-contrib-1',
      name: 'Aarav Sharma',
      rollNo: 'BT24CS042',
      branch: 'Computer Science',
      year: '3rd Year',
      role: 'Lead Full-Stack Developer & Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      contributions: 'Engineered Node.js + Express backend, Firestore synchronization, and real-time Socket.IO WhatsApp group chats.',
      techStack: ['Node.js', 'Express', 'Socket.IO', 'Firebase', 'React 19', 'TypeScript'],
      githubUrl: 'https://github.com/aaravsharma',
      linkedinUrl: 'https://linkedin.com/in/aaravsharma',
    },
    {
      id: 'student-contrib-2',
      name: 'Rohan Gupta',
      rollNo: 'BT24CS078',
      branch: 'Computer Science',
      year: '3rd Year',
      role: 'UI/UX & Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      contributions: 'Designed responsive mobile-first UI with Tailwind CSS, Lucide icons, dark mode, and interactive code playgrounds.',
      techStack: ['React', 'Tailwind CSS', 'Motion', 'Canvas Confetti'],
      githubUrl: 'https://github.com/rohangupta',
    },
    {
      id: 'student-contrib-3',
      name: 'Sneha Roy',
      rollNo: 'BT24CS103',
      branch: 'Information Technology',
      year: '3rd Year',
      role: 'Database & API Integration Specialist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      contributions: 'Modeled Firestore schema rules, JWT authorization pipeline, and client-side real-time data observers.',
      techStack: ['Firestore', 'JWT', 'REST APIs', 'Postman'],
      linkedinUrl: 'https://linkedin.com/in/sneharoy',
    },
  ],
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
