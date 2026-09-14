# EduHub Node.js + Express Backend Server

Full-featured backend server for EduHub supporting:
- **JWT Authentication** (`/api/auth`)
- **Academic Resources & Notes** (`/api/resources`)
- **Project Credits & Academic Acknowledgements** (`/api/credits`)
- **Group Chat Archives** (`/api/chat`)
- **Real-time Socket.IO WhatsApp-style Chat Room System**

## Quick Start (Local Setup)

1. Open your terminal in this directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install express socket.io cors dotenv jsonwebtoken bcryptjs
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. Test health endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```
