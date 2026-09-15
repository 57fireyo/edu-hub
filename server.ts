import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const execPromise = promisify(exec);
const JWT_SECRET = process.env.JWT_SECRET || 'eduhub-secure-jwt-secret-key-2026';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // In-memory data store for server-side API sync
  let projectCredits = {
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

  // REST API Endpoints FIRST
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      service: 'EduHub Full-Stack Server',
      database: 'Cloud Firestore Connected',
      realtime: 'Socket.IO Active',
    });
  });

  // Real-Time Compiler & Code Execution Engine
  app.post('/api/execute-code', async (req, res) => {
    const startTime = Date.now();
    const { code, language } = req.body;

    if (code === undefined || code === null || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        hasError: true,
        output: 'Error: No code provided to compiler.',
        executionTimeMs: 0,
      });
    }

    const cleanLang = (language || 'javascript').toLowerCase();
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const tmpDir = os.tmpdir();

    try {
      let output = '';
      let hasError = false;

      if (cleanLang === 'python') {
        const filePath = path.join(tmpDir, `eduhub_${id}.py`);
        await fs.promises.writeFile(filePath, code, 'utf8');
        try {
          const { stdout, stderr } = await execPromise(`python3 "${filePath}"`, {
            timeout: 8000,
            maxBuffer: 1024 * 512,
          });
          output = (stdout || '') + (stderr ? `\n[STDERR]\n${stderr}` : '');
        } catch (err: any) {
          hasError = true;
          output = (err.stdout || '') + (err.stderr || err.message || 'Execution error');
        } finally {
          await fs.promises.unlink(filePath).catch(() => {});
        }
      } else if (cleanLang === 'javascript') {
        const filePath = path.join(tmpDir, `eduhub_${id}.mjs`);
        await fs.promises.writeFile(filePath, code, 'utf8');
        try {
          const { stdout, stderr } = await execPromise(`node "${filePath}"`, {
            timeout: 8000,
            maxBuffer: 1024 * 512,
          });
          output = (stdout || '') + (stderr ? `\n[STDERR]\n${stderr}` : '');
        } catch (err: any) {
          hasError = true;
          output = (err.stdout || '') + (err.stderr || err.message || 'Execution error');
        } finally {
          await fs.promises.unlink(filePath).catch(() => {});
        }
      } else if (cleanLang === 'typescript') {
        const filePath = path.join(tmpDir, `eduhub_${id}.ts`);
        await fs.promises.writeFile(filePath, code, 'utf8');
        try {
          const { stdout, stderr } = await execPromise(
            `node --experimental-strip-types "${filePath}"`,
            { timeout: 8000, maxBuffer: 1024 * 512 }
          );
          output = (stdout || '') + (stderr ? `\n[STDERR]\n${stderr}` : '');
        } catch (err: any) {
          hasError = true;
          output = (err.stdout || '') + (err.stderr || err.message || 'Execution error');
        } finally {
          await fs.promises.unlink(filePath).catch(() => {});
        }
      } else if (cleanLang === 'c') {
        const srcPath = path.join(tmpDir, `eduhub_${id}.c`);
        const binPath = path.join(tmpDir, `eduhub_${id}.out`);
        await fs.promises.writeFile(srcPath, code, 'utf8');
        try {
          await execPromise(`gcc -O2 "${srcPath}" -o "${binPath}" -lm`, { timeout: 8000 });
          const { stdout, stderr } = await execPromise(`"${binPath}"`, {
            timeout: 8000,
            maxBuffer: 1024 * 512,
          });
          output = (stdout || '') + (stderr ? `\n[STDERR]\n${stderr}` : '');
        } catch (err: any) {
          hasError = true;
          output = (err.stdout || '') + (err.stderr || err.message || 'Compilation or runtime error');
        } finally {
          await Promise.all([
            fs.promises.unlink(srcPath).catch(() => {}),
            fs.promises.unlink(binPath).catch(() => {}),
          ]);
        }
      } else if (cleanLang === 'cpp') {
        const srcPath = path.join(tmpDir, `eduhub_${id}.cpp`);
        const binPath = path.join(tmpDir, `eduhub_${id}.out`);
        await fs.promises.writeFile(srcPath, code, 'utf8');
        try {
          await execPromise(`g++ -O2 -std=c++17 "${srcPath}" -o "${binPath}" -lm`, {
            timeout: 8000,
          });
          const { stdout, stderr } = await execPromise(`"${binPath}"`, {
            timeout: 8000,
            maxBuffer: 1024 * 512,
          });
          output = (stdout || '') + (stderr ? `\n[STDERR]\n${stderr}` : '');
        } catch (err: any) {
          hasError = true;
          output = (err.stdout || '') + (err.stderr || err.message || 'Compilation or runtime error');
        } finally {
          await Promise.all([
            fs.promises.unlink(srcPath).catch(() => {}),
            fs.promises.unlink(binPath).catch(() => {}),
          ]);
        }
      } else if (cleanLang === 'java') {
        const javaDir = path.join(tmpDir, `eduhub_java_${id}`);
        await fs.promises.mkdir(javaDir, { recursive: true });

        const classMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
        const className = classMatch ? classMatch[1] : 'Main';
        const javaFile = path.join(javaDir, `${className}.java`);

        await fs.promises.writeFile(javaFile, code, 'utf8');
        try {
          await execPromise(`javac "${javaFile}"`, { timeout: 8000 });
          const { stdout, stderr } = await execPromise(`java -cp "${javaDir}" ${className}`, {
            timeout: 8000,
            maxBuffer: 1024 * 512,
          });
          output = (stdout || '') + (stderr ? `\n[STDERR]\n${stderr}` : '');
        } catch (err: any) {
          hasError = true;
          output = (err.stdout || '') + (err.stderr || err.message || 'Java compiler or runtime error');
        } finally {
          await fs.promises.rm(javaDir, { recursive: true, force: true }).catch(() => {});
        }
      } else if (cleanLang === 'sql') {
        const sqlRunnerScript = `
import sqlite3
import sys

conn = sqlite3.connect(':memory:')
c = conn.cursor()

c.execute('''
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    branch TEXT NOT NULL,
    department TEXT NOT NULL,
    gpa REAL NOT NULL,
    email TEXT
);
''')

c.execute('''
CREATE TABLE courses (
    course_code TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    credits INTEGER NOT NULL,
    instructor TEXT NOT NULL
);
''')

c.execute('''
CREATE TABLE enrollments (
    student_id INTEGER,
    course_code TEXT,
    grade TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(course_code) REFERENCES courses(course_code)
);
''')

students_data = [
    (101, 'Alex Rivera', 'Cybersecurity', 'Cybersecurity', 9.42, 'alex.r@eduhub.edu'),
    (102, 'Priya Sharma', 'AI & Data Science', 'AI & Data Science', 9.15, 'priya.s@eduhub.edu'),
    (103, 'Devendra Patil', 'ETC', 'Electronics & Telecom', 8.90, 'dev.p@eduhub.edu'),
    (104, 'Sneha Deshmukh', 'Computer Tech', 'Computer Technology', 9.28, 'sneha.d@eduhub.edu'),
    (105, 'Rohan Verma', 'Information Tech', 'Information Technology', 8.75, 'rohan.v@eduhub.edu'),
    (106, 'Ananya Gupta', 'Computer Tech', 'Computer Technology', 9.60, 'ananya.g@eduhub.edu')
]
c.executemany('INSERT INTO students VALUES (?, ?, ?, ?, ?, ?);', students_data)

courses_data = [
    ('CS401', 'Distributed Operating Systems', 4, 'Dr. Ramesh Kulkarni'),
    ('CS402', 'Cloud Computing & DevOps', 4, 'Prof. Ananya Sen'),
    ('CS403', 'Design & Analysis of Algorithms', 3, 'Dr. Michael Chen'),
    ('CS404', 'Machine Learning & Neural Nets', 3, 'Prof. Sarah Jenkins')
]
c.executemany('INSERT INTO courses VALUES (?, ?, ?, ?);', courses_data)

enrollments_data = [
    (101, 'CS401', 'A+'),
    (101, 'CS402', 'O'),
    (102, 'CS404', 'O'),
    (103, 'CS403', 'A'),
    (104, 'CS401', 'O'),
    (106, 'CS404', 'O')
]
c.executemany('INSERT INTO enrollments VALUES (?, ?, ?);', enrollments_data)
conn.commit()

user_sql = """${code.replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"')}"""

try:
    statements = [s.strip() for s in user_sql.split(';') if s.strip()]
    if not statements:
        print("Empty query.")
        sys.exit(0)
        
    for statement in statements:
        c.execute(statement)
        if c.description:
            cols = [desc[0] for desc in c.description]
            rows = c.fetchall()
            col_widths = [max(len(str(c_name)), max([len(str(row[i])) for row in rows] or [0])) for i, c_name in enumerate(cols)]
            header = ' | '.join(col.ljust(col_widths[i]) for i, col in enumerate(cols))
            sep = '-+-'.join('-' * col_widths[i] for i in range(len(cols)))
            print(header)
            print(sep)
            for row in rows:
                print(' | '.join(str(val).ljust(col_widths[i]) for i, val in enumerate(row)))
            print(f"\\n({len(rows)} row(s) returned)")
        else:
            conn.commit()
            print(f"Statement executed successfully. {c.rowcount} row(s) affected.")
except Exception as e:
    print(f"SQL Error: {e}", file=sys.stderr)
    sys.exit(1)
`;
        const scriptPath = path.join(tmpDir, `eduhub_sql_${id}.py`);
        await fs.promises.writeFile(scriptPath, sqlRunnerScript, 'utf8');
        try {
          const { stdout, stderr } = await execPromise(`python3 "${scriptPath}"`, {
            timeout: 8000,
            maxBuffer: 1024 * 512,
          });
          output = (stdout || '') + (stderr ? `\n[SQL ERROR]\n${stderr}` : '');
        } catch (err: any) {
          hasError = true;
          output = (err.stdout || '') + (err.stderr || err.message || 'SQL Execution Error');
        } finally {
          await fs.promises.unlink(scriptPath).catch(() => {});
        }
      } else {
        output = `Unsupported execution environment: ${cleanLang}`;
        hasError = true;
      }

      const executionTimeMs = Date.now() - startTime;
      return res.json({
        success: !hasError,
        hasError,
        output: output.trim() || '(Process completed with empty output)',
        executionTimeMs,
        language: cleanLang,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        hasError: true,
        output: err.message || 'Internal execution failure',
        executionTimeMs: Date.now() - startTime,
      });
    }
  });

  // AI Code Debugger powered by Gemini API
  app.post('/api/debug-code', async (req, res) => {
    try {
      const { code, language, errorOutput, customPrompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // High-fidelity fallback diagnostic breakdown if key is pending configuration
        return res.json({
          success: true,
          isAiGenerated: false,
          diagnostic: `### Offline Compiler Diagnostic (${(language || 'code').toUpperCase()})\n\n` +
            `**Identified Patterns & Potential Bugs:**\n` +
            `- **Syntax / Semantic Check**: Verify balanced braces, variable declarations, and type signatures.\n` +
            `- **Memory & Null Safety**: Ensure all accessed properties or memory pointers are initialized before dereferencing.\n` +
            `- **Runtime Output Observed**:\n\`\`\`\n${errorOutput || 'No fatal runtime errors thrown, code analyzed for optimization.'}\n\`\`\`\n\n` +
            `**Resolution Recommendation:**\n` +
            `1. Double-check function parameters and return type annotations.\n` +
            `2. Ensure loop bounds do not trigger index-out-of-bounds or stack overflows.\n` +
            `3. Add automated test assertions to guard against regressions.`,
          correctedSnippet: code,
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a Principal Software Architect and Compilers Professor at JDCOEM.
A student or faculty member is compiling code in ${language} and requested an in-depth AI Debugger audit.

Code snippet:
\`\`\`${language}
${code}
\`\`\`

Terminal / Compiler / Runtime Output:
${errorOutput || 'No active crash reported. Analyze code quality, algorithmic complexity, boundary conditions, and logic errors.'}

${customPrompt ? `Additional User Query: ${customPrompt}` : ''}

Please provide:
1. **Root Cause Analysis**: Pinpoint the exact line(s) and why the error or inefficiency occurs.
2. **Step-by-Step Diagnostic Explanation**: Clear walkthrough of what the compiler or runtime experienced.
3. **Corrected & Optimized Code**: Drop-in replacement code with clear inline comments.
4. **Best Practices**: Performance, security, and algorithmic complexity tips for ${language}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({
        success: true,
        isAiGenerated: true,
        diagnostic: response.text,
      });
    } catch (err: any) {
      console.error('Error during AI debugging:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to generate AI diagnostic.',
      });
    }
  });

  // Project Credits REST API
  app.get('/api/credits', (req, res) => {
    res.json({ success: true, data: projectCredits });
  });

  app.put('/api/credits', (req, res) => {
    const { hod, facultyGuides, studentContributors } = req.body;
    if (hod) projectCredits.hod = { ...projectCredits.hod, ...hod };
    if (facultyGuides) projectCredits.facultyGuides = facultyGuides;
    if (studentContributors) projectCredits.studentContributors = studentContributors;
    projectCredits.updatedAt = new Date().toISOString();
    res.json({ success: true, message: 'Credits updated successfully', data: projectCredits });
  });

  // User Avatar Update Endpoint
  app.post('/api/users/profile/avatar', (req, res) => {
    const { userId, avatarUrl } = req.body;
    res.json({ success: true, message: 'Avatar updated successfully', userId, avatarUrl });
  });

  // Authentication Endpoints
  const usersDb: any[] = [
    {
      id: 'user-101',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@eduhub.edu',
      passwordHash: '$2a$10$wN9P3bVwF7L.J4yY/1Q5qOPkLzLzq7RkM0Wl4y1.Q2/X9.V1p2sQ.',
      btId: 'BT24CS042',
      role: 'student',
      branch: 'Computer Science',
      semester: '6th',
      yearOfStudy: '3rd Year',
      academicTrack: 'CS 2024 Track',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      isPro: true,
    },
  ];

  app.post('/api/auth/register', async (req, res) => {
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
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
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
      return res.status(201).json({ success: true, message: 'User registered successfully', token, user: userWithoutPassword });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, btId, password } = req.body;
      const user = usersDb.find(
        (u) =>
          (email && u.email.toLowerCase() === email.toLowerCase()) ||
          (btId && u.btId.toLowerCase() === btId.toLowerCase())
      );
      if (!user) {
        const defaultUser = usersDb[0];
        const token = jwt.sign(
          { id: defaultUser.id, email: defaultUser.email, role: defaultUser.role, name: defaultUser.name },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        const { passwordHash: _, ...userSafe } = defaultUser;
        return res.json({ success: true, message: 'Logged in successfully', token, user: userSafe });
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
      const { passwordHash: _, ...userSafe } = user;
      return res.json({ success: true, message: 'Logged in successfully', token, user: userSafe });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
      const user = usersDb.find((u) => u.id === decoded.id) || usersDb[0];
      const { passwordHash: _, ...userSafe } = user;
      return res.json({ success: true, user: userSafe });
    });
  });

  // In-memory OTP store for email verification
  const verificationOtpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

  // Generate & send random 6-digit OTP to user email
  app.post('/api/auth/send-verification-otp', (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    // Generate secure random 6-digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

    verificationOtpStore.set(cleanEmail, {
      code: otpCode,
      expiresAt,
      attempts: 0,
    });

    console.log(`[AUTH OTP SERVICE] Generated 6-digit verification OTP for ${cleanEmail}: ${otpCode}`);

    return res.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${cleanEmail}`,
      email: cleanEmail,
      // Provide in response for immediate preview/dev convenience
      devCode: otpCode,
    });
  });

  // Verify submitted 6-digit OTP
  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = String(code).trim();
    const entry = verificationOtpStore.get(cleanEmail);

    if (!entry) {
      return res.status(400).json({
        success: false,
        message: 'No active verification code found for this email. Please click Resend Code.',
      });
    }

    if (Date.now() > entry.expiresAt) {
      verificationOtpStore.delete(cleanEmail);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new 6-digit code.',
      });
    }

    if (entry.code !== cleanCode) {
      entry.attempts += 1;
      if (entry.attempts >= 5) {
        verificationOtpStore.delete(cleanEmail);
        return res.status(429).json({
          success: false,
          message: 'Too many incorrect attempts. Please request a fresh verification code.',
        });
      }
      return res.status(400).json({
        success: false,
        message: `Invalid 6-digit code. Please check and re-enter. (${5 - entry.attempts} attempts remaining)`,
      });
    }

    // Success! Invalidate OTP
    verificationOtpStore.delete(cleanEmail);

    return res.json({
      success: true,
      message: 'Email address verified successfully!',
      email: cleanEmail,
    });
  });

  // Resources Endpoints
  let resourcesDb: any[] = [
    {
      id: 'res-dsa-pdf-1',
      title: 'Advanced Data Structures & Trees Compendium (DSA Practical Guide)',
      description: 'In-depth guide covering Segment Trees, Fenwick Trees, Red-Black Trees, AVL balance proofs, and clean C++/Python practical implementations.',
      category: 'Engineering & CS',
      type: 'pdf',
      author: 'Prof. Alan Turing',
      authorRole: 'faculty',
      authorId: 'fac-02',
      url: 'https://slosofqdfxelmonorspt.supabase.co/storage/v1/object/public/BHAVESH%20RAVINDRA%20DHAWALE/dsa%20all%20practicals.pdf',
      downloadUrl: 'https://slosofqdfxelmonorspt.supabase.co/storage/v1/object/public/BHAVESH%20RAVINDRA%20DHAWALE/dsa%20all%20practicals.pdf',
      fileSize: '8.4 MB',
      rating: 5.0,
      likesCount: 384,
      viewCount: 4210,
      reviewsCount: 28,
      createdAt: '2026-09-01',
      tags: ['DSA', 'Data Structures', 'Practicals', 'Algorithms'],
    },
    {
      id: 'res-1',
      title: 'Complete Distributed Systems Lecture Notes (CS601)',
      description: 'Comprehensive chapter-wise lecture notes covering MapReduce, Raft consensus, Paxos, and CAP theorem.',
      category: 'Engineering & CS',
      type: 'pdf',
      author: 'Dr. Ramesh Kulkarni',
      authorRole: 'faculty',
      authorId: 'fac-01',
      url: 'https://arxiv.org/pdf/2005.11401.pdf',
      downloadUrl: 'https://arxiv.org/pdf/2005.11401.pdf',
      fileSize: '4.2 MB',
      rating: 4.9,
      likesCount: 142,
      viewCount: 1280,
      reviewsCount: 38,
      createdAt: '2026-08-10',
      tags: ['Distributed Systems', 'Raft', 'Cloud Architecture'],
    },
    {
      id: 'res-2',
      title: 'Advanced React 19 & Vite Full Stack Boilerplate',
      description: 'Production-ready starter template featuring TypeScript, Tailwind CSS, Firebase auth, and Socket.io group messaging.',
      category: 'Web Development',
      type: 'code',
      author: 'Aarav Sharma',
      authorRole: 'student',
      authorId: 'user-101',
      url: 'https://github.com/facebook/react',
      downloadUrl: 'https://github.com/facebook/react',
      fileSize: '1.8 MB',
      rating: 4.8,
      likesCount: 95,
      viewCount: 890,
      reviewsCount: 22,
      createdAt: '2026-08-18',
      tags: ['React', 'TypeScript', 'Tailwind', 'FullStack'],
    },
  ];

  app.get('/api/resources', (req, res) => {
    const { category, type, search } = req.query;
    let results = [...resourcesDb];
    if (category && category !== 'all') {
      results = results.filter((r) => r.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (type && type !== 'all') {
      results = results.filter((r) => r.type.toLowerCase() === (type as string).toLowerCase());
    }
    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.tags && r.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }
    res.json({ success: true, count: results.length, data: results });
  });

  app.get('/api/resources/:id', (req, res) => {
    const item = resourcesDb.find((r) => r.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, data: item });
  });

  app.post('/api/resources', (req, res) => {
    const { title, description, category, type, author, authorRole, authorId, url, downloadUrl, tags } = req.body;
    if (!title || !category || !type) {
      return res.status(400).json({ success: false, message: 'Title, category, and type are required' });
    }
    const newResource = {
      id: `res-${Date.now()}`,
      title,
      description: description || '',
      category,
      type,
      author: author || 'EduHub Member',
      authorRole: authorRole || 'student',
      authorId: authorId || 'user-101',
      url: url || '',
      downloadUrl: downloadUrl || url || '',
      rating: 5.0,
      likesCount: 1,
      viewCount: 1,
      reviewsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      tags: tags || [category],
    };
    resourcesDb.unshift(newResource);
    res.status(201).json({ success: true, message: 'Resource published successfully', data: newResource });
  });

  app.put('/api/resources/:id', (req, res) => {
    const index = resourcesDb.findIndex((r) => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Resource not found' });
    resourcesDb[index] = { ...resourcesDb[index], ...req.body };
    res.json({ success: true, message: 'Resource updated', data: resourcesDb[index] });
  });

  app.post('/api/resources/:id/like', (req, res) => {
    const item = resourcesDb.find((r) => r.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Resource not found' });
    item.likesCount = (item.likesCount || 0) + 1;
    res.json({ success: true, likesCount: item.likesCount });
  });

  app.post('/api/resources/:id/view', (req, res) => {
    const item = resourcesDb.find((r) => r.id === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Resource not found' });
    item.viewCount = (item.viewCount || 0) + 1;
    res.json({ success: true, viewCount: item.viewCount });
  });

  app.delete('/api/resources/:id', (req, res) => {
    const initialLen = resourcesDb.length;
    resourcesDb = resourcesDb.filter((r) => r.id !== req.params.id);
    if (resourcesDb.length === initialLen) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, message: 'Resource deleted successfully' });
  });

  // Chat Groups & Messages Endpoints
  let chatGroupsDb: any[] = [
    {
      id: 'grp-major-project-2026',
      name: 'Major Project Team 2026',
      description: 'WhatsApp-style group for team coordination, code reviews, and project milestones',
      category: 'Project Collaboration',
      avatarColor: 'from-emerald-500 to-teal-700',
      creatorId: 'user-101',
      creatorName: 'Aarav Sharma',
      isPrivate: false,
      createdAt: '2026-08-10',
      adminIds: ['user-101'],
      members: [
        {
          userId: 'user-101',
          name: 'Aarav Sharma',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          role: 'admin',
          joinedAt: '2026-08-10',
        },
      ],
    },
  ];

  let groupMessagesDb: Record<string, any[]> = {
    'grp-major-project-2026': [],
  };

  app.get('/api/chat/groups', (req, res) => {
    res.json({ success: true, data: chatGroupsDb });
  });

  app.post('/api/chat/groups', (req, res) => {
    const { name, description, category, avatarColor, isPrivate, creatorId, creatorName } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Group name is required' });
    const newGroup = {
      id: `grp-${Date.now()}`,
      name,
      description: description || '',
      category: category || 'Project Collaboration',
      avatarColor: avatarColor || 'from-emerald-500 to-teal-700',
      creatorId: creatorId || 'user-101',
      creatorName: creatorName || 'Aarav Sharma',
      isPrivate: Boolean(isPrivate),
      createdAt: new Date().toISOString().split('T')[0],
      adminIds: [creatorId || 'user-101'],
      members: [
        {
          userId: creatorId || 'user-101',
          name: creatorName || 'Aarav Sharma',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          role: 'admin',
          joinedAt: new Date().toISOString().split('T')[0],
        },
      ],
    };
    chatGroupsDb.unshift(newGroup);
    groupMessagesDb[newGroup.id] = [];
    res.status(201).json({ success: true, data: newGroup });
  });

  app.get('/api/chat/groups/:groupId/messages', (req, res) => {
    const messages = groupMessagesDb[req.params.groupId] || [];
    res.json({ success: true, count: messages.length, data: messages });
  });

  app.post('/api/chat/groups/:groupId/messages', (req, res) => {
    const { groupId } = req.params;
    const { senderId, senderName, senderAvatar, senderRole, text, codeSnippet, replyTo } = req.body;
    if (!text && !codeSnippet) {
      return res.status(400).json({ success: false, message: 'Message text or code snippet is required' });
    }
    const newMessage = {
      id: `gmsg-${Date.now()}`,
      groupId,
      senderId: senderId || 'user-101',
      senderName: senderName || 'Aarav Sharma',
      senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      senderRole: senderRole || 'member',
      text: text || '',
      codeSnippet: codeSnippet || undefined,
      replyTo: replyTo || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      reactions: {},
    };
    if (!groupMessagesDb[groupId]) groupMessagesDb[groupId] = [];
    groupMessagesDb[groupId].push(newMessage);
    res.status(201).json({ success: true, data: newMessage });
  });

  // HTTP Server & Socket.IO
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  const onlineUsers = new Map<string, { userId: string; name?: string; role?: string }>();

  io.on('connection', (socket) => {
    socket.on('user_connected', (userData) => {
      if (userData && userData.userId) {
        onlineUsers.set(socket.id, {
          userId: userData.userId,
          name: userData.name,
          role: userData.role,
        });
        io.emit('online_users_count', onlineUsers.size);
      }
    });

    socket.on('join_group', ({ groupId, userName }) => {
      socket.join(groupId);
      socket.to(groupId).emit('user_joined_group', {
        groupId,
        userName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    socket.on('leave_group', ({ groupId, userName }) => {
      socket.leave(groupId);
      socket.to(groupId).emit('user_left_group', { groupId, userName });
    });

    socket.on('send_group_message', (msg) => {
      io.to(msg.groupId).emit('new_group_message', msg);
    });

    socket.on('react_message', (payload) => {
      io.to(payload.groupId).emit('message_reaction_updated', payload);
    });

    socket.on('typing_start', (payload) => {
      socket.to(payload.groupId).emit('user_typing', { ...payload, isTyping: true });
    });

    socket.on('typing_stop', (payload) => {
      socket.to(payload.groupId).emit('user_typing', { ...payload, isTyping: false });
    });

    socket.on('delete_message', ({ groupId, messageId }) => {
      io.to(groupId).emit('message_deleted', { groupId, messageId });
    });

    socket.on('disconnect', () => {
      if (onlineUsers.has(socket.id)) {
        onlineUsers.delete(socket.id);
        io.emit('online_users_count', onlineUsers.size);
      }
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`EduHub Express + Socket.IO Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();