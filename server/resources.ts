import express, { Request, Response } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface ServerResource {
  id: string;
  title: string;
  description: string;
  yearOfStudy: number; // 1 to 4
  examYear?: number;
  branch: string;
  semester: string;
  subject: string;
  subjectCode?: string;
  author: string;
  authorRole?: string;
  fileName: string;
  fileSize: string;
  storagePath: string;
  allowDownload: boolean;
  type: string;
  category: string;
  createdAt: string;
}

// Local storage directory fallback if Supabase is offline
const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'data', 'storage', 'resources');
if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
  fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
}

// In-memory token cache for signed URL generation (expires in 1 hour)
interface SignedToken {
  resourceId: string;
  filePath: string;
  fileName: string;
  allowDownload: boolean;
  expiresAt: number;
}
const tokenCache = new Map<string, SignedToken>();

function cleanExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of tokenCache.entries()) {
    if (data.expiresAt < now) {
      tokenCache.delete(token);
    }
  }
}
setInterval(cleanExpiredTokens, 60000);

// Initialize Supabase client safely
function resolveSupabaseConfig(rawUrl?: string, rawKey?: string): { url: string; key: string } | null {
  if (!rawUrl || !rawKey) return null;
  const trimmedUrl = rawUrl.trim();
  const trimmedKey = rawKey.trim();
  if (!trimmedUrl || !trimmedKey || trimmedUrl.includes('xxxx') || trimmedKey.includes('xxxx')) return null;

  let formattedUrl = trimmedUrl;
  if (!/^https?:\/\//i.test(formattedUrl)) {
    if (/^[a-zA-Z0-9_-]+$/.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}.supabase.co`;
    } else {
      formattedUrl = `https://${formattedUrl}`;
    }
  }

  try {
    const parsed = new URL(formattedUrl);
    if (!parsed.protocol.startsWith('http')) return null;
    return { url: parsed.origin, key: trimmedKey };
  } catch {
    return null;
  }
}

const supabaseConfig = resolveSupabaseConfig(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const supabase: SupabaseClient | null = supabaseConfig
  ? createClient(supabaseConfig.url, supabaseConfig.key)
  : null;

// In-memory resource storage (synced on disk if needed)
let resourcesList: ServerResource[] = [];

export function setupResourcesRoutes(app: express.Express) {
  const router = express.Router();

  // GET /api/resources - List all resources with yearOfStudy
  router.get('/', (req: Request, res: Response) => {
    const { year, branch, semester, subject, search } = req.query;
    let filtered = [...resourcesList];

    if (year && year !== 'All') {
      const yearNum = parseInt(String(year), 10);
      if (!isNaN(yearNum)) {
        filtered = filtered.filter((r) => r.yearOfStudy === yearNum);
      }
    }

    if (branch && branch !== 'All') {
      filtered = filtered.filter(
        (r) => r.branch.toLowerCase() === String(branch).toLowerCase() || r.branch.toLowerCase() === 'all'
      );
    }

    if (semester && semester !== 'All') {
      filtered = filtered.filter((r) => r.semester.toLowerCase() === String(semester).toLowerCase());
    }

    if (subject && subject !== 'All') {
      filtered = filtered.filter(
        (r) =>
          r.subject.toLowerCase() === String(subject).toLowerCase() ||
          (r.subjectCode && r.subjectCode.toLowerCase() === String(subject).toLowerCase())
      );
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subject.toLowerCase().includes(q) ||
          r.branch.toLowerCase().includes(q) ||
          r.semester.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  });

  // POST /api/resources/upload - Upload a real PDF file (max 25MB, application/pdf only)
  router.post('/upload', async (req: Request, res: Response) => {
    try {
      const {
        title,
        description,
        yearOfStudy,
        examYear,
        branch,
        semester,
        subject,
        subjectCode,
        allowDownload = true,
        fileName,
        fileBase64,
        mimeType,
        author,
        authorRole,
      } = req.body;

      // 1. Validate required fields
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, error: 'Title is required' });
      }

      const yearNum = parseInt(String(yearOfStudy), 10);
      if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
        return res.status(400).json({ success: false, error: 'yearOfStudy must be an integer between 1 and 4' });
      }

      if (!branch || !branch.trim()) {
        return res.status(400).json({ success: false, error: 'Branch is required' });
      }

      if (!semester || !semester.trim()) {
        return res.status(400).json({ success: false, error: 'Semester is required' });
      }

      if (!subject || !subject.trim()) {
        return res.status(400).json({ success: false, error: 'Subject is required' });
      }

      if (!fileBase64) {
        return res.status(400).json({ success: false, error: 'PDF file payload is required' });
      }

      // 2. Decode and validate PDF data
      const cleanBase64 = fileBase64.replace(/^data:application\/pdf;base64,/, '').replace(/\s+/g, '');
      const fileBuffer = Buffer.from(cleanBase64, 'base64');

      // 3. Size check: Max 25 MB
      const MAX_SIZE = 25 * 1024 * 1024;
      if (fileBuffer.byteLength > MAX_SIZE) {
        return res.status(400).json({
          success: false,
          error: `File size exceeds 25 MB limit (${(fileBuffer.byteLength / (1024 * 1024)).toFixed(1)} MB)`,
        });
      }

      // 4. File format / MIME validation: application/pdf and %PDF magic bytes
      if (mimeType && mimeType !== 'application/pdf') {
        return res.status(400).json({ success: false, error: 'Only application/pdf files are permitted' });
      }

      const magicBytes = fileBuffer.subarray(0, 4).toString('ascii');
      if (magicBytes !== '%PDF') {
        return res.status(400).json({ success: false, error: 'Invalid file format: Not a valid PDF document' });
      }

      // 5. Generate secure storage path
      const resourceId = `res-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      const safeFileName = (fileName || 'document.pdf').replace(/[^a-zA-Z0-9_.-]/g, '_');
      const storagePath = `year-${yearNum}/${branch.toLowerCase()}/${resourceId}-${safeFileName}`;

      // 6. Save to Supabase Storage if configured; else local fallback
      let storageSuccess = false;
      if (supabase) {
        try {
          const { error } = await supabase.storage
            .from('resources')
            .upload(storagePath, fileBuffer, {
              contentType: 'application/pdf',
              upsert: true,
            });

          if (!error) {
            storageSuccess = true;
          } else {
            console.warn('Supabase storage upload note, using local fallback:', error.message);
          }
        } catch (storageErr) {
          console.warn('Supabase storage connection failed, fallback to local storage:', storageErr);
        }
      }

      // Fallback: Store on local filesystem
      const localFilePath = path.join(LOCAL_STORAGE_DIR, `${resourceId}-${safeFileName}`);
      await fs.promises.writeFile(localFilePath, fileBuffer);

      const parsedExamYear = examYear ? parseInt(String(examYear), 10) : undefined;
      const fileSizeDisplay = `${(fileBuffer.byteLength / (1024 * 1024)).toFixed(2)} MB`;

      const newResource: ServerResource = {
        id: resourceId,
        title: title.trim(),
        description: (description || '').trim(),
        yearOfStudy: yearNum,
        examYear: parsedExamYear && !isNaN(parsedExamYear) ? parsedExamYear : undefined,
        branch: branch.trim(),
        semester: semester.trim(),
        subject: subject.trim(),
        subjectCode: subjectCode || subject.slice(0, 4).toUpperCase(),
        author: author || 'Student / Faculty Contributor',
        authorRole: authorRole || 'student',
        fileName: safeFileName,
        fileSize: fileSizeDisplay,
        storagePath,
        allowDownload: Boolean(allowDownload),
        type: 'pdf',
        category: 'Notes',
        createdAt: new Date().toISOString(),
      };

      resourcesList.unshift(newResource);

      return res.status(201).json({
        success: true,
        message: 'Resource uploaded successfully',
        data: newResource,
      });
    } catch (err: any) {
      console.error('Error during resource upload:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal upload error' });
    }
  });

  // GET /api/resources/:id/signed-url - Generate short-lived signed URL for in-page viewing or download
  router.get('/:id/signed-url', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const resource = resourcesList.find((r) => r.id === id);

      if (!resource) {
        return res.status(404).json({ success: false, error: 'Resource not found' });
      }

      const expiresInSeconds = 3600; // 1 hour expiration

      // Try Supabase signed URL if available
      if (supabase && resource.storagePath) {
        try {
          const { data: viewData, error: viewError } = await supabase.storage
            .from('resources')
            .createSignedUrl(resource.storagePath, expiresInSeconds);

          if (!viewError && viewData?.signedUrl) {
            let downloadUrl = viewData.signedUrl;
            if (resource.allowDownload) {
              const { data: downData } = await supabase.storage
                .from('resources')
                .createSignedUrl(resource.storagePath, expiresInSeconds, {
                  download: resource.fileName,
                });
              if (downData?.signedUrl) {
                downloadUrl = downData.signedUrl;
              }
            }

            return res.json({
              success: true,
              viewUrl: viewData.signedUrl,
              downloadUrl: resource.allowDownload ? downloadUrl : null,
              allowDownload: resource.allowDownload,
              expiresIn: expiresInSeconds,
            });
          }
        } catch (supabaseErr) {
          // Fall through to server-signed token URL
        }
      }

      // Generate local signed token
      const token = crypto.randomBytes(24).toString('hex');
      const localFilePath = path.join(LOCAL_STORAGE_DIR, `${resource.id}-${resource.fileName}`);

      tokenCache.set(token, {
        resourceId: resource.id,
        filePath: localFilePath,
        fileName: resource.fileName,
        allowDownload: resource.allowDownload,
        expiresAt: Date.now() + expiresInSeconds * 1000,
      });

      const protocol = req.protocol;
      const host = req.get('host') || 'localhost:3000';
      const baseUrl = `${protocol}://${host}`;

      const viewUrl = `${baseUrl}/api/resources/file/${token}?action=view`;
      const downloadUrl = resource.allowDownload
        ? `${baseUrl}/api/resources/file/${token}?action=download`
        : null;

      return res.json({
        success: true,
        viewUrl,
        downloadUrl,
        allowDownload: resource.allowDownload,
        expiresIn: expiresInSeconds,
      });
    } catch (err: any) {
      console.error('Error creating signed URL:', err);
      return res.status(500).json({ success: false, error: 'Failed to generate signed URL' });
    }
  });

  // GET /api/resources/file/:token - Serve signed file content for viewer iframe or download
  router.get('/file/:token', (req: Request, res: Response) => {
    const { token } = req.params;
    const action = req.query.action === 'download' ? 'download' : 'view';

    const tokenData = tokenCache.get(token);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(403).send('Signed URL has expired or is invalid. Please refresh the page.');
    }

    if (action === 'download' && !tokenData.allowDownload) {
      return res.status(403).send('Downloading this resource is restricted by the publisher.');
    }

    if (!fs.existsSync(tokenData.filePath)) {
      return res.status(404).send('File not found on storage.');
    }

    res.setHeader('Content-Type', 'application/pdf');
    if (action === 'download') {
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(tokenData.fileName)}"`);
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(tokenData.fileName)}"`);
    }

    const stream = fs.createReadStream(tokenData.filePath);
    stream.pipe(res);
  });

  // DELETE /api/resources/:id - Delete resource
  router.delete('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = resourcesList.length;
    resourcesList = resourcesList.filter((r) => r.id !== id);

    if (resourcesList.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }

    res.json({ success: true, message: 'Resource removed' });
  });

  app.use('/api/resources', router);
}
