const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'eduhub-secure-jwt-secret-key-2026';

// In-memory mock database for fallback
const usersDb = [
  {
    id: 'user-101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@eduhub.edu',
    passwordHash: '$2a$10$wN9P3bVwF7L.J4yY/1Q5qOPkLzLzq7RkM0Wl4y1.Q2/X9.V1p2sQ.', // 'password123'
    btId: 'BT24CS042',
    role: 'student',
    branch: 'Computer Science',
    semester: '6th',
    yearOfStudy: '3rd Year',
    academicTrack: 'CS 2024 Track',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    isPro: true,
  },
  {
    id: 'user-102',
    name: 'Priya Patel',
    email: 'priya.patel@alumni.eduhub.edu',
    passwordHash: '$2a$10$wN9P3bVwF7L.J4yY/1Q5qOPkLzLzq7RkM0Wl4y1.Q2/X9.V1p2sQ.',
    btId: 'BT20CS088',
    role: 'alumni',
    branch: 'Computer Science',
    academicTrack: 'Alumni Network (SDE-2 at Google, Class of 2022)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    isPro: true,
  }
];

// Helper: Verify Token Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, btId, branch, semester, yearOfStudy, passoutYear } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const existingUser = usersDb.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'password123', salt);

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash,
      btId: btId || 'BT24CS099',
      role: role || 'student',
      branch: branch || 'Computer Science',
      semester: semester || '1st',
      yearOfStudy: yearOfStudy || '1st Year',
      academicTrack: role === 'alumni' ? `Alumni (Class of ${passoutYear || '2024'})` : `${branch || 'CS'} ${yearOfStudy || '1st Year'}`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
      isPro: false,
      createdAt: new Date().toISOString(),
    };

    usersDb.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, btId, password } = req.body;

    const user = usersDb.find(
      (u) =>
        (email && u.email.toLowerCase() === email.toLowerCase()) ||
        (btId && u.btId.toLowerCase() === btId.toLowerCase())
    );

    if (!user) {
      // Create guest student user on the fly for ease of testing
      const defaultUser = usersDb[0];
      const token = jwt.sign(
        { id: defaultUser.id, email: defaultUser.email, role: defaultUser.role, name: defaultUser.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      const { passwordHash: _, ...userSafe } = defaultUser;
      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: userSafe,
      });
    }

    if (password) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const user = usersDb.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  const { passwordHash: _, ...userSafe } = user;
  return res.json({ success: true, user: userSafe });
});

module.exports = { router, authenticateToken };
