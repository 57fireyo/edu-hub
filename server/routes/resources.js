const express = require('express');
const router = express.Router();

let resourcesDb = [
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
  {
    id: 'res-3',
    title: 'Deep Learning & Neural Networks Video Masterclass',
    description: 'Full semester video walkthrough covering backpropagation, Transformers, Attention mechanisms, and PyTorch.',
    category: 'Artificial Intelligence',
    type: 'video',
    author: 'Prof. Ananya Sen',
    authorRole: 'faculty',
    authorId: 'fac-02',
    url: 'https://www.youtube.com/watch?v=aircAruvnKk',
    rating: 5.0,
    likesCount: 280,
    viewCount: 3400,
    reviewsCount: 64,
    createdAt: '2026-08-15',
    tags: ['AI/ML', 'PyTorch', 'Transformers', 'Deep Learning'],
  }
];

// GET /api/resources (with category & search query filters)
router.get('/', (req, res) => {
  const { category, type, search } = req.query;
  let results = [...resourcesDb];

  if (category && category !== 'all') {
    results = results.filter((r) => r.category.toLowerCase() === category.toLowerCase());
  }

  if (type && type !== 'all') {
    results = results.filter((r) => r.type.toLowerCase() === type.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  return res.json({ success: true, count: results.length, data: results });
});

// GET /api/resources/:id
router.get('/:id', (req, res) => {
  const item = resourcesDb.find((r) => r.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  return res.json({ success: true, data: item });
});

// POST /api/resources
router.post('/', (req, res) => {
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
  return res.status(201).json({ success: true, message: 'Resource published successfully', data: newResource });
});

// PUT /api/resources/:id
router.put('/:id', (req, res) => {
  const index = resourcesDb.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  resourcesDb[index] = { ...resourcesDb[index], ...req.body };
  return res.json({ success: true, message: 'Resource updated', data: resourcesDb[index] });
});

// POST /api/resources/:id/like
router.post('/:id/like', (req, res) => {
  const item = resourcesDb.find((r) => r.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  item.likesCount = (item.likesCount || 0) + 1;
  return res.json({ success: true, likesCount: item.likesCount });
});

// POST /api/resources/:id/view
router.post('/:id/view', (req, res) => {
  const item = resourcesDb.find((r) => r.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  item.viewCount = (item.viewCount || 0) + 1;
  return res.json({ success: true, viewCount: item.viewCount });
});

// DELETE /api/resources/:id
router.delete('/:id', (req, res) => {
  const initialLen = resourcesDb.length;
  resourcesDb = resourcesDb.filter((r) => r.id !== req.params.id);
  if (resourcesDb.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  return res.json({ success: true, message: 'Resource deleted successfully' });
});

module.exports = router;
