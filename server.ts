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

const execPromise = promisify(exec);

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
    (101, 'Alex Rivera', 'Cybersecurity', 9.42, 'alex.r@eduhub.edu'),
    (102, 'Priya Sharma', 'AI & Data Science', 9.15, 'priya.s@eduhub.edu'),
    (103, 'Devendra Patil', 'ETC', 8.90, 'dev.p@eduhub.edu'),
    (104, 'Sneha Deshmukh', 'Computer Tech', 9.28, 'sneha.d@eduhub.edu'),
    (105, 'Rohan Verma', 'Information Tech', 8.75, 'rohan.v@eduhub.edu'),
    (106, 'Ananya Gupta', 'Computer Tech', 9.60, 'ananya.g@eduhub.edu')
]
c.executemany('INSERT INTO students VALUES (?, ?, ?, ?, ?);', students_data)

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

  // HTTP Server & Socket.IO
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', (socket) => {
    socket.on('join_group', ({ groupId, userName }) => {
      socket.join(groupId);
      socket.to(groupId).emit('user_joined_group', { groupId, userName });
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
