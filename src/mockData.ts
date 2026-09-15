import {
  ResourceItem,
  AcademicSubject,
  FreelanceGig,
  Mentor,
  LiveClass,
  ChatMessage,
  UserProfile,
  FriendConnection,
  DirectMessage,
  UserReview,
  ProjectCredits,
  ChatGroup,
  GroupMessage,
  CampusDirectoryUser,
} from './types';

export const initialAcademicSubjects: AcademicSubject[] = [
  // 1st Year
  {
    id: 'subj-math-1',
    code: 'MATH-1',
    name: 'Engineering Mathematics & Discrete Structures',
    year: '1st Year',
    semester: 'Semester 1',
    description: 'Matrices, Eigenvalues, Multivariable Calculus, Discrete Graphs, Propositional Logic and Combinatorics.',
    department: 'CSE / Core',
    color: 'blue',
    units: ['Unit 1: Linear Algebra & Matrix Decompositions', 'Unit 2: Multivariable Differential Calculus', 'Unit 3: Discrete Graph Theory & Logic', 'Unit 4: Numerical Methods'],
  },
  {
    id: 'subj-cfp',
    code: 'CFP',
    name: 'C Programming & Computational Thinking',
    year: '1st Year',
    semester: 'Semester 2',
    description: 'Procedural programming in C, pointers, dynamic memory allocation, file I/O, recursion, and struct layouts.',
    department: 'Computer Science',
    color: 'indigo',
    units: ['Unit 1: Control Flow & Memory Basics', 'Unit 2: Pointers & Dynamic Allocation', 'Unit 3: Structs, Unions & Bit Manipulation', 'Unit 4: File Handling & Preprocessor Directives'],
  },
  {
    id: 'subj-bee',
    code: 'BEE',
    name: 'Basic Electrical & Electronics Engineering',
    year: '1st Year',
    semester: 'Semester 1',
    description: 'DC/AC circuit theorems, semiconductor diodes, transistors, logic gates, and operational amplifiers.',
    department: 'Electrical / ECE',
    color: 'amber',
    units: ['Unit 1: DC Network Theorems', 'Unit 2: AC Circuits & Phasors', 'Unit 3: Diodes & BJT Transistors', 'Unit 4: Digital Logic & Op-Amps'],
  },

  // 2nd Year
  {
    id: 'subj-dsa',
    code: 'DSA',
    name: 'Data Structures & Algorithms',
    year: '2nd Year',
    semester: 'Semester 3',
    description: 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, AVL Trees, Heaps, Graph traversals, Dynamic Programming, and algorithmic analysis.',
    department: 'Computer Science',
    color: 'emerald',
    units: ['Unit 1: Stacks, Queues & Linked Lists', 'Unit 2: Balanced Trees, BST & Heaps', 'Unit 3: Graph Traversal (DFS/BFS) & Shortest Path', 'Unit 4: Dynamic Programming & Greedy Approaches'],
  },
  {
    id: 'subj-can',
    code: 'CAN',
    name: 'Computer Architecture & Networking',
    year: '2nd Year',
    semester: 'Semester 4',
    description: 'MIPS Instruction sets, pipelining, cache memory hierarchy, OSI 7-layer & TCP/IP stack, IP routing, and socket protocols.',
    department: 'Computer Science',
    color: 'purple',
    units: ['Unit 1: Instruction Set Architecture & ALU Design', 'Unit 2: Processor Pipelining & Cache Memory Hierarchy', 'Unit 3: OSI & TCP/IP Transport Layer Protocols', 'Unit 4: Network Layer, IP Subnetting & CIDR Routing'],
  },
  {
    id: 'subj-dbms',
    code: 'DBMS',
    name: 'Database Management Systems',
    year: '2nd Year',
    semester: 'Semester 4',
    description: 'Relational algebra, SQL query optimization, E-R modeling, 1NF to BCNF normalizations, ACID transactions, and indexing.',
    department: 'Computer Science',
    color: 'cyan',
    units: ['Unit 1: Relational Data Model & ER Diagrams', 'Unit 2: Advanced SQL Queries & Joins', 'Unit 3: Schema Normalization (1NF-BCNF)', 'Unit 4: ACID Transactions & Concurrency Control'],
  },
  {
    id: 'subj-oop',
    code: 'OOP',
    name: 'Object-Oriented Programming (Java / C++)',
    year: '2nd Year',
    semester: 'Semester 3',
    description: 'Encapsulation, polymorphism, abstract classes, templates/generics, exception handling, and design patterns in Java & C++.',
    department: 'Computer Science',
    color: 'indigo',
    units: ['Unit 1: Classes, Objects & Constructors', 'Unit 2: Inheritance & Runtime Polymorphism', 'Unit 3: Generics, Collections & Exception Handling', 'Unit 4: Creational & Structural Design Patterns'],
  },

  // 3rd Year
  {
    id: 'subj-ise',
    code: 'ISE',
    name: 'Information Systems Engineering & Software Architecture',
    year: '3rd Year',
    semester: 'Semester 5',
    description: 'Enterprise information architectures, software development life cycle, Agile methodologies, microservice patterns, and system verification.',
    department: 'Computer Science',
    color: 'rose',
    units: ['Unit 1: Enterprise System Architecture & Requirements', 'Unit 2: Agile Engineering & Design Patterns', 'Unit 3: Software Verification, CI/CD & Testing', 'Unit 4: Cloud Microservices & High Availability'],
  },
  {
    id: 'subj-os',
    code: 'OS',
    name: 'Operating Systems & Kernel Fundamentals',
    year: '3rd Year',
    semester: 'Semester 5',
    description: 'Process scheduling, POSIX threads, synchronization primitives (mutex/semaphores), deadlock detection, virtual memory, and page replacement.',
    department: 'Computer Science',
    color: 'blue',
    units: ['Unit 1: Process Management & CPU Scheduling', 'Unit 2: Threads, Mutexes & Classical Synchronization', 'Unit 3: Virtual Memory & Page Replacement Algorithms', 'Unit 4: File Systems & Storage Management'],
  },
  {
    id: 'subj-toc',
    code: 'TOC',
    name: 'Theory of Computation & Automata',
    year: '3rd Year',
    semester: 'Semester 5',
    description: 'DFA, NFA, Regular Expressions, Context-Free Grammars, Pushdown Automata, Turing Machines, and Halting problem undecidability.',
    department: 'Computer Science',
    color: 'amber',
    units: ['Unit 1: Finite Automata & Regular Languages', 'Unit 2: Context-Free Grammars & Pushdown Automata', 'Unit 3: Turing Machines & Computability', 'Unit 4: P vs NP & Undecidability Proofs'],
  },
  {
    id: 'subj-web',
    code: 'WEB',
    name: 'Full-Stack Web Development & Cloud Systems',
    year: '3rd Year',
    semester: 'Semester 6',
    description: 'Modern React, TypeScript, Node.js REST & GraphQL APIs, database ORMs, state management, and cloud container deployments.',
    department: 'Computer Science',
    color: 'emerald',
    units: ['Unit 1: Modern Frontend Architecture (React & Next)', 'Unit 2: Node.js, Express & Serverless Backend APIs', 'Unit 3: Database ORMs & GraphQL Subscriptions', 'Unit 4: Docker Containerization & Cloud Deployment'],
  },

  // 4th Year
  {
    id: 'subj-ai-ml',
    code: 'AI-ML',
    name: 'Artificial Intelligence & Machine Learning',
    year: '4th Year',
    semester: 'Semester 7',
    description: 'Supervised and unsupervised learning, Gradient Descent, Backpropagation, Convolutional Neural Networks, Transformers, and LLM fine-tuning.',
    department: 'Computer Science',
    color: 'purple',
    units: ['Unit 1: Linear Regression, Logistic & SVM Models', 'Unit 2: Deep Neural Networks & Backpropagation', 'Unit 3: Convolutional & Recurrent Architectures', 'Unit 4: Transformers & Large Language Models'],
  },
  {
    id: 'subj-cyber',
    code: 'CYBER',
    name: 'Network Security, Cryptography & Cyber Defense',
    year: '4th Year',
    semester: 'Semester 7',
    description: 'Symmetric & Asymmetric encryption (AES, RSA), Elliptic Curve cryptography, SSL/TLS handshakes, penetration testing, and zero-trust security.',
    department: 'Computer Science',
    color: 'rose',
    units: ['Unit 1: Classical & Modern Cryptography (AES, RSA)', 'Unit 2: Authentication Protocols & PKI Infrastructure', 'Unit 3: Network Attacks & Web Vulnerabilities (OWASP)', 'Unit 4: Zero Trust & Incident Response'],
  },
  {
    id: 'subj-dist',
    code: 'DIST',
    name: 'Distributed Systems & Cloud Computing',
    year: '4th Year',
    semester: 'Semester 8',
    description: 'CAP theorem, Raft & Paxos consensus algorithms, Kafka event streaming, distributed caching, and Kubernetes cluster orchestration.',
    department: 'Computer Science',
    color: 'cyan',
    units: ['Unit 1: Distributed Architectures & RPC Models', 'Unit 2: Consensus Protocols (Raft & Paxos)', 'Unit 3: Event Streaming & Message Queues (Kafka)', 'Unit 4: Cluster Orchestration with Kubernetes'],
  },
];

export const initialUser: UserProfile = {
  id: 'user-101',
  name: 'Alex Rivera',
  email: 'alex.rivera@eduhub.edu',
  btId: 'BT22CS089',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  branch: 'Computer Science & Engineering',
  semester: '6th Semester',
  yearOfStudy: '3rd Year',
  rollNo: '42',
  academicTrack: 'CS 2024 Track (Systems & Full-Stack)',
  bio: 'CS Junior passionate about distributed systems, React performance, and modern algorithmic optimizations. Open for freelance contracts and mentor sessions.',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'PostgreSQL', 'Docker'],
  earnings: 1250,
  completedGigsCount: 4,
  isPro: false,
  githubUrl: 'https://github.com/alexrivera-dev',
  linkedinUrl: 'https://linkedin.com/in/alex-rivera-cs',
  hourlyRate: 35,
};

export const avatarPresets = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=400',
];

export const sampleResources: ResourceItem[] = [
  // 2nd Year - DSA
  {
    id: 'res-dsa-pdf-1',
    title: 'Advanced Data Structures & Trees Compendium',
    description: 'In-depth guide covering Segment Trees, Fenwick Trees, Suffix Automata, Red-Black Trees, AVL balance proofs, and clean C++/Python implementations.',
    category: 'Algorithms',
    type: 'pdf',
    subjectCode: 'DSA',
    subjectId: 'subj-dsa',
    year: '2nd Year',
    unitOrModule: 'Unit 2: Balanced Trees, BST & Heaps',
    author: 'Prof. Alan Turing',
    authorRole: 'Head of Theoretical CS',
    pages: 142,
    size: '8.4 MB',
    url: 'https://slosofqdfxelmonorspt.supabase.co/storage/v1/object/public/BHAVESH%20RAVINDRA%20DHAWALE/dsa%20all%20practicals.pdf',
    downloadUrl: 'https://slosofqdfxelmonorspt.supabase.co/storage/v1/object/public/BHAVESH%20RAVINDRA%20DHAWALE/dsa%20all%20practicals.pdf',
    fileUrl: 'https://slosofqdfxelmonorspt.supabase.co/storage/v1/object/public/BHAVESH%20RAVINDRA%20DHAWALE/dsa%20all%20practicals.pdf',
    fileName: 'dsa all practicals.pdf',
    viewCount: 4210,
    views: '4.2k views',
    likesCount: 384,
    isLiked: true,
    rating: 4.9,
    reviewsCount: 28,
    reviews: [
      {
        id: 'rev-1-1',
        targetId: 'res-dsa-pdf-1',
        targetType: 'resource',
        userId: 'u-elena',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        userRole: '4th Year CS',
        rating: 5,
        comment: 'This compendium saved me during my mid-term dynamic programming & segment tree exam. The Python illustrations are pure gold!',
        createdAt: '2 days ago',
        likesCount: 14,
      },
    ],
    contentSnippet: '# Chapter 4: Range Query Optimization\n\nSegment trees provide O(log N) point and range updates with O(log N) range queries. When combined with Lazy Propagation, interval updates operate efficiently with space complexity O(4N).\n\n```python\ndef update_tree(node, start, end, l, r, val):\n    if lazy[node] != 0:\n        tree[node] += (end - start + 1) * lazy[node]\n        if start != end:\n            lazy[2*node] += lazy[node]\n            lazy[2*node+1] += lazy[node]\n        lazy[node] = 0\n```',
    saved: true,
    isOwnerUploaded: true,
  },
  {
    id: 'res-dsa-vid-1',
    title: 'Mastering Graph Algorithms: Dijkstra, Bellman-Ford & Floyd-Warshall',
    description: 'Complete visual walkthrough of graph representations, adjacency lists, shortest paths, and topological sorting with interactive tracing.',
    category: 'Algorithms',
    type: 'video',
    subjectCode: 'DSA',
    subjectId: 'subj-dsa',
    year: '2nd Year',
    unitOrModule: 'Unit 3: Graph Traversal & Shortest Path',
    author: 'Campus Algo Faculty',
    authorRole: 'Senior Algo Lead',
    duration: '52:15',
    viewCount: 5120,
    views: '5.1k views',
    likesCount: 410,
    isLiked: true,
    rating: 5.0,
    reviewsCount: 39,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    url: 'https://www.youtube.com/watch?v=sample-dsa-graph',
    contentSnippet: 'Learn Dijkstra with priority queues, negative weight cycle detection via Bellman-Ford, and all-pairs shortest path in O(V^3).',
    saved: false,
    isOwnerUploaded: true,
  },
  {
    id: 'res-dsa-pdf-2',
    title: 'Dynamic Programming: From Recursion to Memoization & Tabulation',
    description: 'Structured patterns covering 0/1 Knapsack, Longest Common Subsequence, Matrix Chain Multiplication, and Digit DP with formula derivations.',
    category: 'Algorithms',
    type: 'pdf',
    subjectCode: 'DSA',
    subjectId: 'subj-dsa',
    year: '2nd Year',
    unitOrModule: 'Unit 4: Dynamic Programming & Greedy Approaches',
    author: 'Prof. Evelyn Reed',
    authorRole: 'Algorithms Professor',
    pages: 96,
    size: '6.1 MB',
    viewCount: 3400,
    views: '3.4k views',
    likesCount: 298,
    isLiked: false,
    rating: 4.8,
    reviewsCount: 22,
    contentSnippet: '# Dynamic Programming Core Patterns\n\n1. Identify overlapping subproblems.\n2. Formulate state transition equation.\n3. Base conditions and space optimization.',
    saved: true,
  },

  // 2nd Year - CAN (Computer Architecture & Networking)
  {
    id: 'res-can-pdf-1',
    title: 'Computer Architecture & Processor Pipelining Lecture Notes',
    description: 'Detailed analysis of MIPS 5-stage instruction pipeline, data hazards, structural hazards, branch prediction, and cache memory mapping (Direct vs Set-Associative).',
    category: 'System Design',
    type: 'pdf',
    subjectCode: 'CAN',
    subjectId: 'subj-can',
    year: '2nd Year',
    unitOrModule: 'Unit 2: Processor Pipelining & Cache Memory Hierarchy',
    author: 'Prof. Alan Vance',
    authorRole: 'Computer Systems Chair',
    pages: 110,
    size: '7.2 MB',
    viewCount: 2840,
    views: '2.8k views',
    likesCount: 245,
    isLiked: true,
    rating: 4.9,
    reviewsCount: 18,
    contentSnippet: '# Pipelining & Data Forwarding\n\nHazard Resolution: Data forwarding bypasses the register write-back stage directly to the ALU execution stage to prevent pipeline stalls.\n\nSpeedup = (Non-pipelined time) / (Pipelined time + Overhead)',
    saved: true,
    isOwnerUploaded: true,
  },
  {
    id: 'res-can-vid-1',
    title: 'TCP/IP Protocol Suite, IP Subnetting & CIDR Demystified',
    description: 'Complete hands-on packet inspection tutorial covering 3-way TCP handshakes, window scaling, subnet masks, CIDR prefix calculations, and NAT routing.',
    category: 'System Design',
    type: 'video',
    subjectCode: 'CAN',
    subjectId: 'subj-can',
    year: '2nd Year',
    unitOrModule: 'Unit 4: Network Layer, IP Subnetting & CIDR Routing',
    author: 'Network Engineering Board',
    authorRole: 'Cisco Certified Specialist',
    duration: '48:30',
    viewCount: 4670,
    views: '4.6k views',
    likesCount: 390,
    isLiked: false,
    rating: 4.9,
    reviewsCount: 29,
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    url: 'https://www.youtube.com/watch?v=sample-can-tcp',
    contentSnippet: 'Learn how packets navigate the internet, how router routing tables match longest prefixes, and how TCP controls congestion with AIMD.',
    saved: false,
    isOwnerUploaded: true,
  },

  // 3rd Year - ISE (Information Systems Engineering & Software Architecture)
  {
    id: 'res-ise-pdf-1',
    title: 'Information Systems Engineering & Agile Architecture Guide',
    description: 'Official campus guide covering requirements engineering, UML state diagrams, Domain-Driven Design (DDD), CI/CD pipelines, and microservice boundary decomposition.',
    category: 'System Design',
    type: 'pdf',
    subjectCode: 'ISE',
    subjectId: 'subj-ise',
    year: '3rd Year',
    unitOrModule: 'Unit 1: Enterprise System Architecture & Requirements',
    author: 'Dr. Marcus Holloway',
    authorRole: 'ISE Department Lead',
    pages: 125,
    size: '9.0 MB',
    viewCount: 3100,
    views: '3.1k views',
    likesCount: 275,
    isLiked: true,
    rating: 4.8,
    reviewsCount: 21,
    contentSnippet: '# Enterprise Information Systems Blueprint\n\n- User Story Mapping & Acceptance Criteria\n- Domain Driven Design (Bounded Contexts & Aggregate Roots)\n- Event-Driven Architecture with Event Sourcing and CQRS',
    saved: true,
    isOwnerUploaded: true,
  },
  {
    id: 'res-ise-vid-1',
    title: 'Microservices & High Availability Enterprise Systems Architecture',
    description: 'Step-by-step masterclass on event-driven communication, Kafka message partitioning, idempotent API handlers, Saga orchestration, and distributed tracing.',
    category: 'System Design',
    type: 'video',
    subjectCode: 'ISE',
    subjectId: 'subj-ise',
    year: '3rd Year',
    unitOrModule: 'Unit 4: Cloud Microservices & High Availability',
    author: 'Tech Lead Academy',
    authorRole: 'Principal Cloud Architect',
    duration: '45:20',
    viewCount: 6850,
    views: '6.8k views',
    likesCount: 520,
    isLiked: false,
    rating: 4.8,
    reviewsCount: 34,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    url: 'https://www.youtube.com/watch?v=sample-ise-microservices',
    contentSnippet: 'Learn how to partition event streams, implement Saga patterns for distributed transactions, and eliminate single points of failure in cloud-native deployments.',
    saved: true,
    isOwnerUploaded: true,
  },

  // 2nd Year - DBMS
  {
    id: 'res-dbms-pdf-1',
    title: 'Database Systems: Normalization, B+ Trees & ACID Transactions',
    description: 'Comprehensive notes on 1NF to BCNF decompositions, lossless join proofs, B+ tree leaf splitting, WAL logging, and serializability.',
    category: 'System Design',
    type: 'pdf',
    subjectCode: 'DBMS',
    subjectId: 'subj-dbms',
    year: '2nd Year',
    unitOrModule: 'Unit 3: Schema Normalization (1NF-BCNF)',
    author: 'Database Engineering Group',
    authorRole: 'Senior Database Researcher',
    pages: 88,
    size: '5.8 MB',
    viewCount: 2900,
    views: '2.9k views',
    likesCount: 260,
    isLiked: false,
    rating: 4.9,
    reviewsCount: 20,
    contentSnippet: '# Functional Dependencies & 3NF / BCNF\n\nA relation R is in BCNF if for every non-trivial functional dependency X -> Y, X is a superkey of R.',
    saved: false,
    isOwnerUploaded: true,
  },
  {
    id: 'res-dbms-vid-1',
    title: 'SQL Query Optimization, Index Mechanics & EXPLAIN ANALYZE',
    description: 'Deep dive into Postgres query planner, B-Tree index scans, Hash Joins vs Nested Loops, and concurrency control with MVCC.',
    category: 'System Design',
    type: 'video',
    subjectCode: 'DBMS',
    subjectId: 'subj-dbms',
    year: '2nd Year',
    unitOrModule: 'Unit 2: Advanced SQL Queries & Joins',
    author: 'Senior DBA Team',
    authorRole: 'PostgreSQL Architect',
    duration: '38:40',
    viewCount: 3200,
    views: '3.2k views',
    likesCount: 310,
    isLiked: true,
    rating: 4.9,
    reviewsCount: 25,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
    url: 'https://www.youtube.com/watch?v=sample-dbms-sql',
    contentSnippet: 'Learn why sequential scans happen, how to build composite indexes, and how to read EXPLAIN ANALYZE buffers.',
    saved: true,
  },

  // 3rd Year - OS
  {
    id: 'res-os-pdf-1',
    title: 'Operating Systems: Kernel Primitives, Semaphores & Virtual Memory',
    description: 'Complete university guide covering CPU scheduling (CFS), Banker algorithm for deadlock prevention, Page replacement (LRU/Clock), and Linux ext4 file systems.',
    category: 'System Design',
    type: 'pdf',
    subjectCode: 'OS',
    subjectId: 'subj-os',
    year: '3rd Year',
    unitOrModule: 'Unit 2: Threads, Mutexes & Classical Synchronization',
    author: 'Prof. David Patterson',
    authorRole: 'Operating Systems Faculty',
    pages: 130,
    size: '9.4 MB',
    viewCount: 4100,
    views: '4.1k views',
    likesCount: 360,
    isLiked: true,
    rating: 4.9,
    reviewsCount: 30,
    contentSnippet: '# Dining Philosophers & Deadlock Prevention\n\nFour Coffman conditions must hold simultaneously for a deadlock:\n1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait',
    saved: true,
    isOwnerUploaded: true,
  },
  {
    id: 'res-os-vid-1',
    title: 'Virtual Memory, Page Tables & TLB Translation in Linux',
    description: 'Visual step-by-step trace of multi-level page tables (CR3 register), TLB miss handling, page faults, and kernel swap space management.',
    category: 'System Design',
    type: 'video',
    subjectCode: 'OS',
    subjectId: 'subj-os',
    year: '3rd Year',
    unitOrModule: 'Unit 3: Virtual Memory & Page Replacement Algorithms',
    author: 'Kernel Engineering Labs',
    authorRole: 'Linux Kernel Contributor',
    duration: '42:10',
    viewCount: 3900,
    views: '3.9k views',
    likesCount: 340,
    isLiked: false,
    rating: 5.0,
    reviewsCount: 27,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    url: 'https://www.youtube.com/watch?v=sample-os-virtual-memory',
    contentSnippet: 'Trace virtual addresses to physical frames through 4-level paging in x86-64 architecture.',
    saved: false,
  },

  // 1st Year - CFP
  {
    id: 'res-cfp-pdf-1',
    title: 'C Programming Master Handbook: Pointers, Memory & Structs',
    description: 'Foundational guide to procedural problem solving, dynamic malloc/free, pointer arithmetic, bitwise operators, and multi-file project linking in GCC.',
    category: 'Web Dev',
    type: 'pdf',
    subjectCode: 'CFP',
    subjectId: 'subj-cfp',
    year: '1st Year',
    unitOrModule: 'Unit 2: Pointers & Dynamic Allocation',
    author: 'Prof. Dennis Ritchie Legacy',
    authorRole: 'CS Foundational Lead',
    pages: 92,
    size: '4.9 MB',
    viewCount: 5200,
    views: '5.2k views',
    likesCount: 460,
    isLiked: true,
    rating: 4.9,
    reviewsCount: 35,
    contentSnippet: '# Pointer Fundamentals & Memory Layout\n\nA pointer variable stores the hexadecimal memory address of another variable. De-referencing with * retrieves the value stored at that address.',
    saved: true,
  },
  {
    id: 'res-cfp-vid-1',
    title: 'C Programming for Absolute Beginners: From Hello World to Pointers',
    description: 'Interactive tutorial with live coding sessions, memory visualization, and debugging segmentation faults with GDB.',
    category: 'Web Dev',
    type: 'video',
    subjectCode: 'CFP',
    subjectId: 'subj-cfp',
    year: '1st Year',
    unitOrModule: 'Unit 1: Control Flow & Memory Basics',
    author: 'Campus Coding Club',
    authorRole: 'Peer Mentor Leads',
    duration: '1h 05m',
    viewCount: 6100,
    views: '6.1k views',
    likesCount: 580,
    isLiked: false,
    rating: 4.8,
    reviewsCount: 42,
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800',
    url: 'https://www.youtube.com/watch?v=sample-cfp-c-basics',
    contentSnippet: 'Learn syntax, loops, arrays, function stack frames, and how to debug pointer errors.',
    saved: false,
  },

  // 4th Year - AI-ML
  {
    id: 'res-aiml-pdf-1',
    title: 'Transformers & Large Language Models from Scratch',
    description: 'Comprehensive mathematical breakdown of multi-head self-attention, KV caching, positional embeddings, and PyTorch implementations.',
    category: 'AI & ML',
    type: 'pdf',
    subjectCode: 'AI-ML',
    subjectId: 'subj-ai-ml',
    year: '4th Year',
    unitOrModule: 'Unit 4: Transformers & Large Language Models',
    author: 'Dr. Evelyn Reed',
    authorRole: 'AI Research Director',
    pages: 118,
    size: '12.1 MB',
    viewCount: 8900,
    views: '8.9k views',
    likesCount: 810,
    isLiked: false,
    rating: 5.0,
    reviewsCount: 47,
    reviews: [
      {
        id: 'rev-4-1',
        targetId: 'res-aiml-pdf-1',
        targetType: 'resource',
        userId: 'u-arjun',
        userName: 'Arjun Patel',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        userRole: 'ML Researcher',
        rating: 5,
        comment: 'The step-by-step tensor dimensional tracking through MultiHeadAttention alone makes this worth reading.',
        createdAt: 'Yesterday',
        likesCount: 31,
      },
    ],
    contentSnippet: 'Understanding QKV projections:\nAttention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V\n\nWe derive the scaled dot-product attention mechanics step-by-step.',
    saved: true,
  },
  {
    id: 'res-aiml-vid-1',
    title: 'Deep Neural Networks, Backpropagation & PyTorch Tensor Calculus',
    description: 'Mathematical derivation of gradients across dense and convolutional layers with complete training loops in PyTorch.',
    category: 'AI & ML',
    type: 'video',
    subjectCode: 'AI-ML',
    subjectId: 'subj-ai-ml',
    year: '4th Year',
    unitOrModule: 'Unit 2: Deep Neural Networks & Backpropagation',
    author: 'AI Research Labs',
    authorRole: 'Deep Learning Scientist',
    duration: '58:45',
    viewCount: 7200,
    views: '7.2k views',
    likesCount: 650,
    isLiked: true,
    rating: 4.9,
    reviewsCount: 38,
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    url: 'https://www.youtube.com/watch?v=sample-aiml-pytorch',
    contentSnippet: 'Learn how automatic differentiation works, how to prevent exploding gradients with layer norm, and how Adam optimizer scales weights.',
    saved: false,
  },

  // 3rd Year - WEB
  {
    id: 'res-web-pdf-1',
    title: 'Modern React Patterns 2024 & Server Components',
    description: 'Master React Server Components, Suspense waterfalls elimination, custom hook optimization, and fine-grained state management patterns.',
    category: 'Web Dev',
    type: 'pdf',
    subjectCode: 'WEB',
    subjectId: 'subj-web',
    year: '3rd Year',
    unitOrModule: 'Unit 1: Modern Frontend Architecture (React & Next)',
    author: 'Frontend Masters Lead',
    authorRole: 'Senior Staff Engineer',
    pages: 89,
    size: '5.2 MB',
    viewCount: 3190,
    views: '3.2k views',
    likesCount: 290,
    isLiked: true,
    rating: 4.9,
    reviewsCount: 19,
    contentSnippet: '# React 19 Action Handlers & Async Transitions\n\nOptimistic UI updates paired with server action boundaries yield immediate feedback while automatically rolling back upon failure.\n\nKey rules:\n1. Colocate query states with view consumers.\n2. Leverage useTransition to de-prioritize non-urgent background render passes.',
    saved: false,
  },
  {
    id: 'res-web-vid-1',
    title: 'Full-Stack GraphQL & WebSocket Real-time Engine',
    description: 'Constructing resilient live subscriptions, connection pooling, heartbeat pings, and delta synchronizations for collaborative web suites.',
    category: 'Web Dev',
    type: 'video',
    subjectCode: 'WEB',
    subjectId: 'subj-web',
    year: '3rd Year',
    unitOrModule: 'Unit 3: Database ORMs & GraphQL Subscriptions',
    author: 'DevHub Interactive',
    authorRole: 'Tech Educator',
    duration: '1h 12m',
    viewCount: 5400,
    views: '5.4k views',
    likesCount: 430,
    isLiked: true,
    rating: 4.9,
    reviewsCount: 23,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    url: 'https://www.youtube.com/watch?v=sample-web-graphql',
    contentSnippet: 'Real-time state broadcast with optimistic locking and delta reconciliation.',
    saved: false,
  },
];

export const sampleLiveClasses: LiveClass[] = [
  {
    id: 'class-1',
    title: 'Microservices with gRPC, Protocol Buffers & Docker',
    instructor: 'David Miller',
    instructorRole: 'Principal SRE @ Netflix',
    date: 'Today',
    time: '6:00 PM EST',
    duration: '90 mins',
    attendeesCount: 184,
    viewCount: 3450,
    likesCount: 295,
    isLiked: true,
    rating: 4.9,
    reviewsCount: 31,
    reviews: [
      {
        id: 'c-rev-1',
        targetId: 'class-1',
        targetType: 'live-class',
        userId: 'u-elena',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        userRole: '4th Year CS',
        rating: 5,
        comment: 'David explains binary serialization and protobuf schema validation better than any official doc!',
        createdAt: 'Yesterday',
        likesCount: 19,
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    isLiveNow: true,
    category: 'Backend',
    summary: 'Build a production-grade microservice from scratch with protocol buffers, streaming endpoints, health probes, and Docker containerization.',
  },
  {
    id: 'class-2',
    title: 'Cracking FAANG Dynamic Programming in 60 Mins',
    instructor: 'Sarah Jenkins',
    instructorRole: 'Senior SWE @ Google',
    date: 'Tomorrow',
    time: '4:30 PM EST',
    duration: '60 mins',
    attendeesCount: 312,
    viewCount: 7800,
    likesCount: 680,
    isLiked: false,
    rating: 5.0,
    reviewsCount: 54,
    reviews: [
      {
        id: 'c-rev-2',
        targetId: 'class-2',
        targetType: 'live-class',
        userId: 'u-arjun',
        userName: 'Arjun Patel',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        userRole: 'CS Student',
        rating: 5,
        comment: 'Her breakdown of the 0/1 knapsack state compression is unbeatable.',
        createdAt: '3 days ago',
        likesCount: 25,
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    isLiveNow: false,
    category: 'Algorithms',
    summary: 'Deconstruct complex 2D DP and Bitmask DP problems into intuitive recurrence relations with zero boilerplate.',
  },
  {
    id: 'class-3',
    title: 'How to Land $1k+ Freelance Contracts as a Student',
    instructor: 'Alex Rivera & Guests',
    instructorRole: 'Top Rated EduHub Student',
    date: 'Aug 24, 2026',
    time: '7:00 PM EST',
    duration: '45 mins',
    attendeesCount: 220,
    viewCount: 4600,
    likesCount: 410,
    isLiked: true,
    rating: 4.8,
    reviewsCount: 22,
    reviews: [],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    isLiveNow: false,
    category: 'Career',
    summary: 'Proven strategies for proposal writing, client scoping, setting milestones, and maintaining a 5.0 client feedback rating.',
  },
];

export const sampleFriends: FriendConnection[] = [
  {
    id: 'friend-1',
    userId: 'u-elena',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    role: 'student',
    branch: 'Computer Science (AI Track)',
    academicTrack: 'CS 2024 Track',
    status: 'friend',
    isOnline: true,
    lastSeen: 'Active now',
    bio: 'Working on LLM fine-tuning and Rust backend microservices.',
    skills: ['Python', 'PyTorch', 'Rust', 'Algorithms'],
    unreadDMsCount: 1,
  },
  {
    id: 'friend-2',
    userId: 'u-devon',
    name: 'Devon Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'alumni',
    branch: 'Software Engineering (Class of 2023)',
    academicTrack: 'Alumni @ Amazon AWS',
    status: 'friend',
    isOnline: false,
    lastSeen: '2 hours ago',
    bio: 'Cloud Architect & AWS mentor. Happy to review system design resumes.',
    skills: ['AWS', 'Kubernetes', 'Go', 'System Design'],
    unreadDMsCount: 0,
  },
  {
    id: 'friend-3',
    userId: 'u-maya',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    role: 'student',
    branch: 'Design & Interaction',
    academicTrack: 'Design 2025',
    status: 'friend',
    isOnline: true,
    lastSeen: 'Active now',
    bio: 'Product Designer converting complex developer tools into delightful user experiences.',
    skills: ['Figma', 'React', 'Tailwind', 'Motion'],
    unreadDMsCount: 0,
  },
  {
    id: 'friend-4',
    userId: 'u-arjun',
    name: 'Arjun Patel',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    role: 'student',
    branch: 'Data Science & Analytics',
    academicTrack: 'DS 2024 Track',
    status: 'pending_incoming',
    isOnline: false,
    lastSeen: '1 day ago',
    bio: 'Looking for a study buddy for Advanced Data Structures midterms.',
    skills: ['Python', 'SQL', 'C++', 'Data Structures'],
  },
  {
    id: 'friend-5',
    userId: 'u-lucas',
    name: 'Lucas Dupont',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'student',
    branch: 'Cybersecurity',
    academicTrack: 'CS Security 2024',
    status: 'pending_outgoing',
    isOnline: true,
    lastSeen: 'Active now',
    bio: 'Ethical hacker and CTF competitor.',
    skills: ['Network Security', 'Linux', 'Cryptography'],
  },
];

export const initialCampusDirectoryUsers: CampusDirectoryUser[] = [
  {
    id: 'u-elena',
    name: 'Elena Rostova',
    role: 'student',
    branch: 'Computer Science (AI Track)',
    academicTrack: 'CS 2024 Track',
    year: '4th Year',
    btId: 'BT21CS034',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bio: 'Senior student working on LLM fine-tuning and Rust backend microservices. Open to hackathon collabs!',
    skills: ['Python', 'PyTorch', 'Rust', 'Algorithms', 'FastAPI'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'elena.rostova@jdcoem.ac.in',
    mutualFriendsCount: 8,
  },
  {
    id: 'u-bhavesh',
    name: 'Bhavesh Joshi',
    role: 'student',
    branch: 'Computer Science & Engineering',
    academicTrack: 'Full Stack & Cloud Architecture',
    year: '3rd Year',
    btId: 'BT22CS088',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    bio: 'Passionate full-stack developer exploring scalable distributed systems, Docker, and Supabase / Firebase integrations.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Tailwind'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'bhavesh.joshi@jdcoem.ac.in',
    mutualFriendsCount: 14,
  },
  {
    id: 'u-priya',
    name: 'Priya Sharma',
    role: 'student',
    branch: 'AI & Data Science',
    academicTrack: 'Deep Learning & NLP',
    year: '3rd Year',
    btId: 'BT22AI019',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    bio: 'Working on transformer quantization research and multimodal agents. Always up for study sessions.',
    skills: ['PyTorch', 'Transformers', 'Python', 'Computer Vision', 'LangChain'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'priya.sharma@jdcoem.ac.in',
    mutualFriendsCount: 12,
  },
  {
    id: 'u-david',
    name: 'David Kalu',
    role: 'student',
    branch: 'Information Technology',
    academicTrack: 'Full Stack & DevOps',
    year: '3rd Year',
    btId: 'BT22IT045',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bio: 'Open-source enthusiast, building developer tools with Next.js, CI/CD pipelines, and microservices.',
    skills: ['React', 'Next.js', 'DevOps', 'Kubernetes', 'Go'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'david.kalu@jdcoem.ac.in',
    mutualFriendsCount: 7,
  },
  {
    id: 'u-sneha',
    name: 'Sneha Kulkarni',
    role: 'student',
    branch: 'Data Science & Analytics',
    academicTrack: 'Predictive Modeling & Big Data',
    year: '2nd Year',
    btId: 'BT23DS022',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    bio: 'Data enthusiast diving deep into statistics, Pandas, Spark, and exploratory data visualization.',
    skills: ['Python', 'SQL', 'Tableau', 'Scikit-Learn', 'Apache Spark'],
    isOnline: false,
    lastSeen: '15 mins ago',
    email: 'sneha.kulkarni@jdcoem.ac.in',
    mutualFriendsCount: 5,
  },
  {
    id: 'u-marcus',
    name: 'Marcus Vance',
    role: 'student',
    branch: 'Cybersecurity',
    academicTrack: 'Network Defense & Cryptography',
    year: '4th Year',
    btId: 'BT21CY012',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    bio: 'CTF team captain, pentesting explorer, and reverse engineer. Looking for freelance security audits.',
    skills: ['Penetration Testing', 'Linux', 'Wireshark', 'Rust', 'Cryptography'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'marcus.vance@jdcoem.ac.in',
    mutualFriendsCount: 9,
  },
  {
    id: 'u-rohan',
    name: 'Rohan Deshmukh',
    role: 'student',
    branch: 'Internet of Things & Embedded',
    academicTrack: 'Robotics & Hardware Systems',
    year: '3rd Year',
    btId: 'BT22IOT008',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    bio: 'Designing custom PCBs, ESP32 microcontrollers, and MQTT telemetry feeds for smart campus automation.',
    skills: ['C++', 'Embedded C', 'ESP32', 'Raspberry Pi', 'MQTT', 'Circuit Design'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'rohan.deshmukh@jdcoem.ac.in',
    mutualFriendsCount: 6,
  },
  {
    id: 'u-arjun',
    name: 'Arjun Patel',
    role: 'student',
    branch: 'Computer Science & Engineering',
    academicTrack: 'Competitive Programming & Algorithms',
    year: '2nd Year',
    btId: 'BT23CS091',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    bio: 'LeetCode 1900+ rated. Seeking study partners for Codeforces contests and semester examinations.',
    skills: ['C++', 'Algorithms', 'Data Structures', 'Graph Theory', 'DP'],
    isOnline: false,
    lastSeen: '1 hour ago',
    email: 'arjun.patel@jdcoem.ac.in',
    mutualFriendsCount: 11,
  },
  {
    id: 'u-devon',
    name: 'Devon Vance',
    role: 'alumni',
    branch: 'Software Engineering (Class of 2023)',
    academicTrack: 'Senior Cloud Engineer @ AWS',
    year: 'Alumni',
    btId: 'ALUM23-DEV',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    bio: 'AWS Cloud Solutions Architect. Happy to mentor JDCOEM students on system design and mock interviews.',
    skills: ['AWS', 'Kubernetes', 'Go', 'Terraform', 'System Design'],
    isOnline: false,
    lastSeen: '2 hours ago',
    email: 'devon.vance@alumni.jdcoem.ac.in',
    mutualFriendsCount: 19,
  },
  {
    id: 'u-chen',
    name: 'Dr. Michael Chen',
    role: 'alumni',
    branch: 'Computer Science Faculty & Research',
    academicTrack: 'Algorithmic Theory & Distributed Systems',
    year: 'Faculty Mentor',
    btId: 'FAC-CS-01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    bio: 'Senior Faculty Guide and former principal researcher. Mentoring students on algorithmic systems and final year capstones.',
    skills: ['System Design', 'Algorithms', 'Research Writing', 'Distributed Consensus'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'm.chen@jdcoem.ac.in',
    mutualFriendsCount: 25,
  },
  {
    id: 'u-maya',
    name: 'Maya Lin',
    role: 'student',
    branch: 'Design & Interaction',
    academicTrack: 'UI/UX & Product Design',
    year: '3rd Year',
    btId: 'BT22DSG003',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bio: 'Product Designer transforming complex software workflows into clean, accessible user experiences.',
    skills: ['Figma', 'UI/UX', 'Design Systems', 'React', 'Tailwind CSS'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'maya.lin@jdcoem.ac.in',
    mutualFriendsCount: 16,
  },
  {
    id: 'u-aisha',
    name: 'Aisha Siddiqui',
    role: 'student',
    branch: 'Information Technology',
    academicTrack: 'Cloud Native & Security',
    year: '4th Year',
    btId: 'BT21IT052',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    bio: 'Cloud enthusiast, Linux administrator, and Docker containerization buff. Organizing campus DevOps workshops.',
    skills: ['Linux', 'Docker', 'Kubernetes', 'Bash Scripting', 'CI/CD'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'aisha.siddiqui@jdcoem.ac.in',
    mutualFriendsCount: 8,
  },
  {
    id: 'u-tanmay',
    name: 'Tanmay Verma',
    role: 'student',
    branch: 'Computer Science & Engineering',
    academicTrack: 'Mobile Application Engineering',
    year: '3rd Year',
    btId: 'BT22CS110',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    bio: 'Flutter and React Native developer. Published 3 campus utility apps on Google Play Store.',
    skills: ['Flutter', 'Dart', 'React Native', 'Firebase', 'State Management'],
    isOnline: false,
    lastSeen: 'Yesterday',
    email: 'tanmay.verma@jdcoem.ac.in',
    mutualFriendsCount: 10,
  },
  {
    id: 'u-ananya',
    name: 'Ananya Roy',
    role: 'student',
    branch: 'AI & Data Science',
    academicTrack: 'Bioinformatics & Machine Learning',
    year: '2nd Year',
    btId: 'BT23AI007',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    bio: 'Applying graph neural networks to biological data and genomics. Passionate about Python and Kaggle comps.',
    skills: ['Python', 'Graph Neural Networks', 'Pandas', 'Biopython', 'PyTorch'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'ananya.roy@jdcoem.ac.in',
    mutualFriendsCount: 4,
  },
  {
    id: 'u-kunal',
    name: 'Kunal Singhania',
    role: 'student',
    branch: 'Mechanical & Mechatronics',
    academicTrack: 'Automation & CAD Simulation',
    year: '3rd Year',
    btId: 'BT22ME031',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    bio: 'SolidWorks designer and robotics team member. Bridging hardware mechanisms with ROS (Robot Operating System).',
    skills: ['SolidWorks', 'ROS', 'Python', 'Arduino', 'Finite Element Analysis'],
    isOnline: false,
    lastSeen: '3 hours ago',
    email: 'kunal.singhania@jdcoem.ac.in',
    mutualFriendsCount: 3,
  },
  {
    id: 'u-neha',
    name: 'Neha Patil',
    role: 'student',
    branch: 'Computer Science & Engineering',
    academicTrack: 'Database & Backend Engineering',
    year: '3rd Year',
    btId: 'BT22CS062',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=200',
    bio: 'Relational database performance tuning, indexing strategies, and high-concurrency microservices.',
    skills: ['PostgreSQL', 'Redis', 'Node.js', 'Prisma', 'System Design'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'neha.patil@jdcoem.ac.in',
    mutualFriendsCount: 13,
  },
  {
    id: 'u-vikram',
    name: 'Vikram Malhotra',
    role: 'alumni',
    branch: 'Computer Science (Class of 2022)',
    academicTrack: 'Staff Engineer @ Razorpay',
    year: 'Alumni',
    btId: 'ALUM22-VIK',
    avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=200',
    bio: 'Fintech engineering lead building ultra-reliable payment checkout infrastructures. Always excited to review JDCOEM resumes.',
    skills: ['Fintech', 'Java', 'Spring Boot', 'Kafka', 'Distributed Systems'],
    isOnline: false,
    lastSeen: '1 day ago',
    email: 'vikram.malhotra@alumni.jdcoem.ac.in',
    mutualFriendsCount: 22,
  },
  {
    id: 'u-lucas',
    name: 'Lucas Dupont',
    role: 'student',
    branch: 'Cybersecurity',
    academicTrack: 'CS Security 2024',
    year: '4th Year',
    btId: 'BT21CY039',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    bio: 'Ethical hacker and CTF competitor. Researching zero-day vulnerabilities in web applications.',
    skills: ['Network Security', 'Linux', 'Cryptography', 'Burp Suite'],
    isOnline: true,
    lastSeen: 'Active now',
    email: 'lucas.dupont@jdcoem.ac.in',
    mutualFriendsCount: 6,
  },
];

export const sampleDirectMessages: Record<string, DirectMessage[]> = {
  'u-elena': [
    {
      id: 'dm-1-1',
      conversationPartnerId: 'u-elena',
      senderId: 'u-elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: "Hey Alex! Are you joining Dr. Miller's gRPC live stream tonight?",
      timestamp: '5:45 PM',
      isCurrentUser: false,
    },
    {
      id: 'dm-1-2',
      conversationPartnerId: 'u-elena',
      senderId: 'user-101',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      text: "Yes, definitely! I've been experimenting with protocol buffer streaming in Go all afternoon.",
      timestamp: '5:48 PM',
      isCurrentUser: true,
    },
    {
      id: 'dm-1-3',
      conversationPartnerId: 'u-elena',
      senderId: 'u-elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: "Awesome! Let me know if you want to collaborate on the hands-on Docker deployment exercise after the stream.",
      timestamp: '5:50 PM',
      isCurrentUser: false,
    },
  ],
  'u-devon': [
    {
      id: 'dm-2-1',
      conversationPartnerId: 'u-devon',
      senderId: 'user-101',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      text: 'Hi Devon! Thanks for accepting my connection. Loved your talk on AWS ECS deployment pipelines.',
      timestamp: 'Yesterday',
      isCurrentUser: true,
    },
    {
      id: 'dm-2-2',
      conversationPartnerId: 'u-devon',
      senderId: 'u-devon',
      senderName: 'Devon Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      text: "Glad it was helpful Alex! Feel free to book a 1-on-1 session anytime if you'd like resume or architecture feedback.",
      timestamp: 'Yesterday',
      isCurrentUser: false,
    },
  ],
  'u-maya': [
    {
      id: 'dm-3-1',
      conversationPartnerId: 'u-maya',
      senderId: 'u-maya',
      senderName: 'Maya Lin',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      text: 'Hey Alex, do you need Figma assets for that freelance ecommerce dashboard gig you took up?',
      timestamp: '2 days ago',
      isCurrentUser: false,
    },
  ],
};

export const sampleGigs: FreelanceGig[] = [
  {
    id: 'gig-1',
    title: 'Build a Custom E-commerce Dashboard',
    clientName: 'Apex Retail Tech',
    clientCompany: 'Apex Global Inc.',
    clientAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    description: 'Looking for a talented student developer to build a responsive admin dashboard for a local retail chain. Needs inventory tracking, order status filters, low-stock warnings, and basic sales CSV reporting.',
    skills: ['React', 'Node.js', 'Tailwind CSS', 'REST API'],
    budgetType: 'fixed',
    budgetMin: 450,
    budgetMax: 600,
    estimatedDuration: '2 weeks',
    postedAt: '2 hours ago',
    proposalsCount: 6,
    category: 'Web Dev',
    featured: true,
  },
  {
    id: 'gig-2',
    title: 'Redesign Landing Page Mobile Experience',
    clientName: 'Sarah Lin',
    clientCompany: 'Kite Startup Studio',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    description: 'Figma to React conversion. Improve conversion rates, touch targets, and mobile responsiveness for our seed-stage SaaS product website.',
    skills: ['UI/UX', 'Figma', 'React', 'Mobile First'],
    budgetType: 'fixed',
    budgetMin: 150,
    budgetMax: 200,
    estimatedDuration: '4 days',
    postedAt: '3 hours ago',
    proposalsCount: 4,
    category: 'UI/UX',
    featured: false,
  },
  {
    id: 'gig-3',
    title: 'Data Scraping Script for Academic Research',
    clientName: 'Dr. Marcus Vance',
    clientCompany: 'University Research Lab',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    description: 'Need a clean Python script using BeautifulSoup / Playwright to collect public environmental sensor datasets with rate limiting and automated CSV export.',
    skills: ['Python', 'BeautifulSoup', 'Pandas', 'Data Mining'],
    budgetType: 'hourly',
    budgetMin: 25,
    budgetMax: 35,
    estimatedDuration: '1 week (15 hrs)',
    postedAt: '5 hours ago',
    proposalsCount: 8,
    category: 'Python',
    featured: false,
  },
];

export const sampleMentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Sarah Jenkins',
    role: 'Senior Staff Engineer',
    company: 'Google (Cloud Architecture)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    bio: 'Ex-EduHub Alumna (Class of 2018). Passionate about helping students break into top tier product companies, distributed systems, and real-world system architecture.',
    expertise: ['System Design', 'Go', 'Distributed Databases', 'FAANG Interview Prep'],
    rating: 4.9,
    reviewsCount: 48,
    hourlyRate: '$45/hr',
    availableDays: ['Mon', 'Wed', 'Sat'],
    availableHours: '5:00 PM - 8:00 PM EST',
  },
  {
    id: 'mentor-2',
    name: 'Dr. Chen Wei',
    role: 'Department Head & AI Advisor',
    company: 'EduHub University Faculty',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'Specializing in machine learning paradigms, graduate school fellowship applications, and thesis proposal structuring.',
    expertise: ['Machine Learning', 'Research Papers', 'Python', 'Academic Advising'],
    rating: 5.0,
    reviewsCount: 72,
    hourlyRate: 'Free for Students',
    availableDays: ['Tue', 'Thu', 'Fri'],
    availableHours: '2:00 PM - 4:30 PM EST',
  },
];

export const initialStudyGroupMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'sarah-j-student',
    senderName: 'Sarah J.',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    senderRole: 'student',
    text: "I'm looking at line 10 in our analysis script. Should we use median instead of mean to handle those heavy outlier spikes we saw in the sensor telemetry yesterday?",
    timestamp: '10:42 AM',
    channelId: 'study-group-cs2024',
  },
  {
    id: 'msg-2',
    senderId: 'system',
    senderName: 'System',
    senderRole: 'system',
    text: 'Dr. Chen (Mentor) entered the collaborative room and is viewing line 10.',
    timestamp: '10:43 AM',
    channelId: 'study-group-cs2024',
  },
  {
    id: 'msg-3',
    senderId: 'user-101',
    senderName: 'You',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    senderRole: 'student',
    text: "Good point! I'll test it out now in the editor and run the console output. Give me a second.",
    timestamp: '10:45 AM',
    isCurrentUser: true,
    channelId: 'study-group-cs2024',
  },
  {
    id: 'msg-4',
    senderId: 'dr-chen-mentor',
    senderName: 'Dr. Chen (Mentor)',
    senderRole: 'mentor',
    text: "If you switch to median, make sure to import the statistics module at the top or compute the 50th percentile. Let's see how the test suite handles it!",
    timestamp: '10:46 AM',
    channelId: 'study-group-cs2024',
  },
];

export const defaultCodeSnippets = {
  python: `import statistics

def calculate_metrics(data_points):
    """
    Analyzes student engagement data and handles anomaly outliers.
    """
    if not data_points:
        return {"error": "No data provided"}
    
    scores = [dp['score'] for dp in data_points if 'score' in dp]
    
    if not scores:
        return {"error": "Invalid scores"}
        
    avg_score = sum(scores) / len(scores)
    median_score = statistics.median(scores)
    
    # Calculate performance index
    performance_rating = "Excellent" if median_score >= 85 else "Good" if median_score >= 70 else "Needs Review"
    
    return {
        "sample_count": len(scores),
        "mean_engagement": round(avg_score, 2),
        "median_engagement": round(median_score, 2),
        "performance": performance_rating
    }

# Test execution with realistic student engagement telemetry
dataset = [
    {"student_id": "ST-01", "score": 92.5},
    {"student_id": "ST-02", "score": 88.0},
    {"student_id": "ST-03", "score": 79.5},
    {"student_id": "ST-04", "score": 95.0},
    {"student_id": "ST-05", "score": 84.0},
    {"student_id": "ST-06", "score": 32.0} # Outlier handled by median
]

results = calculate_metrics(dataset)
print("=" * 45)
print(" EduHub Collaborative Analytics Output")
print("=" * 45)
for key, value in results.items():
    print(f" • {key.replace('_', ' ').title()}: {value}")
print("=" * 45)
print("✓ Telemetry processed successfully!")
`,
  javascript: `// EduHub Algorithm Playground: Dijkstra Shortest Path
function shortestPath(graph, startNode, endNode) {
  const distances = {};
  const visited = new Set();
  const previous = {};
  
  for (let node in graph) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  while (true) {
    let closestNode = null;
    let shortestDistance = Infinity;

    for (let node in distances) {
      if (!visited.has(node) && distances[node] < shortestDistance) {
        closestNode = node;
        shortestDistance = distances[node];
      }
    }

    if (closestNode === null || closestNode === endNode) break;

    visited.add(closestNode);

    for (let neighbor in graph[closestNode]) {
      let newDist = distances[closestNode] + graph[closestNode][neighbor];
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = closestNode;
      }
    }
  }

  // Reconstruct path
  const path = [];
  let curr = endNode;
  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { totalDistance: distances[endNode], path };
}

const campusMap = {
  'Library': { 'CS_Dept': 4, 'Hostel_A': 2 },
  'CS_Dept': { 'Library': 4, 'Auditorium': 3, 'Cafeteria': 5 },
  'Hostel_A': { 'Library': 2, 'Cafeteria': 6 },
  'Cafeteria': { 'CS_Dept': 5, 'Hostel_A': 6, 'Auditorium': 1 },
  'Auditorium': { 'CS_Dept': 3, 'Cafeteria': 1 }
};

const route = shortestPath(campusMap, 'Hostel_A', 'Auditorium');
console.log("Optimal Campus Route:", route.path.join(" ➔ "));
console.log("Estimated Transit Cost:", route.totalDistance, "minutes");
`,
  typescript: `interface TaskItem {
  id: string;
  title: string;
  rewardUSD: number;
  priority: 'low' | 'medium' | 'high';
}

class GigMatcher {
  private studentSkills: Set<string>;

  constructor(skills: string[]) {
    this.studentSkills = new Set(skills.map(s => s.toLowerCase()));
  }

  public calculateMatchScore(requiredSkills: string[]): number {
    if (!requiredSkills.length) return 0;
    const matches = requiredSkills.filter(s => this.studentSkills.has(s.toLowerCase())).length;
    return Math.round((matches / requiredSkills.length) * 100);
  }
}

const matcher = new GigMatcher(['React', 'TypeScript', 'Node.js', 'Python']);
const matchScore = matcher.calculateMatchScore(['React', 'TypeScript', 'Tailwind CSS']);

console.log("EduHub AI Gig Match Result: " + matchScore + "% Profile Compatibility");
`,
  c: `// EduHub High-Performance C Benchmark: Binary Search & QuickSort
#include <stdio.h>
#include <stdlib.h>

void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}

int main() {
    int studentRolls[] = { 1042, 1018, 1089, 1005, 1077, 1031, 1064, 1099 };
    int n = sizeof(studentRolls) / sizeof(studentRolls[0]);

    printf("=========================================\\n");
    printf(" EduHub C Compiler: Sorting & Search Run\\n");
    printf("=========================================\\n");
    printf("Input roll numbers: ");
    for (int i = 0; i < n; i++) printf("%d ", studentRolls[i]);
    printf("\\n");

    quickSort(studentRolls, 0, n - 1);

    printf("Sorted roll numbers: ");
    for (int i = 0; i < n; i++) printf("%d ", studentRolls[i]);
    printf("\\n");

    int target = 1077;
    int idx = binarySearch(studentRolls, 0, n - 1, target);
    if (idx != -1) {
        printf("Found Roll No %d at sorted index: %d (O(log N))\\n", target, idx);
    }
    printf("✓ C Program compiled & executed successfully!\\n");
    return 0;
}
`,
  cpp: `// EduHub C++ STL Graph Explorer: Dijkstra Shortest Path
#include <iostream>
#include <vector>
#include <queue>
#include <string>
#include <map>

using namespace std;

struct Edge {
    int to;
    int weight;
};

int main() {
    cout << "=========================================" << endl;
    cout << " EduHub C++ Compiler: Graph Engine" << endl;
    cout << "=========================================" << endl;

    map<string, int> nodes = {
        {"Main Gate", 0},
        {"Library", 1},
        {"CS Department", 2},
        {"Auditorium", 3},
        {"Innovation Hub", 4}
    };

    vector<string> nodeNames = {
        "Main Gate", "Library", "CS Department", "Auditorium", "Innovation Hub"
    };

    int n = 5;
    vector<vector<Edge>> adj(n);
    adj[0].push_back({1, 4}); // Main Gate -> Library
    adj[0].push_back({2, 6}); // Main Gate -> CS Dept
    adj[1].push_back({3, 3}); // Library -> Auditorium
    adj[2].push_back({4, 2}); // CS Dept -> Innovation Hub
    adj[3].push_back({4, 5}); // Auditorium -> Innovation Hub

    // Dijkstra from Main Gate (0)
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(n, 1e9);
    dist[0] = 0;
    pq.push({0, 0});

    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            if (dist[u] + edge.weight < dist[edge.to]) {
                dist[edge.to] = dist[u] + edge.weight;
                pq.push({dist[edge.to], edge.to});
            }
        }
    }

    for (int i = 0; i < n; i++) {
        cout << " • Distance to " << nodeNames[i] << ": " << dist[i] << " mins walk" << endl;
    }
    cout << "=========================================" << endl;
    cout << "✓ C++17 algorithm executed successfully!" << endl;
    return 0;
}
`,
  java: `// EduHub Java Academic Grade & CGPA Calculator
import java.util.ArrayList;
import java.util.List;

class CourseScore {
    String courseName;
    int credits;
    double gradePoint;

    CourseScore(String name, int cred, double gp) {
        this.courseName = name;
        this.credits = cred;
        this.gradePoint = gp;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=========================================");
        System.out.println(" EduHub Java VM: Semester CGPA Engine");
        System.out.println("=========================================");

        List<CourseScore> courses = new ArrayList<>();
        courses.add(new CourseScore("Distributed Operating Systems", 4, 9.5));
        courses.add(new CourseScore("Cloud Computing & DevOps", 4, 9.0));
        courses.add(new CourseScore("Design & Analysis of Algorithms", 3, 10.0));
        courses.add(new CourseScore("Machine Learning & Neural Nets", 3, 9.2));

        double totalGradePoints = 0;
        int totalCredits = 0;

        for (CourseScore c : courses) {
            totalGradePoints += (c.gradePoint * c.credits);
            totalCredits += c.credits;
            System.out.println(String.format(" • %-32s [%d Credits] => GP: %.1f", c.courseName, c.credits, c.gradePoint));
        }

        double cgpa = totalGradePoints / totalCredits;
        System.out.println("-----------------------------------------");
        System.out.println(String.format("Total Credits: %d | Computed SGPA: %.2f", totalCredits, cgpa));
        System.out.println("Standing: First Class with Distinction (Honors)");
        System.out.println("=========================================");
        System.out.println("✓ Java bytecode executed successfully!");
    }
}
`,
  sql: `-- EduHub Academic Database Query Playground
-- Available Tables: students, courses, enrollments

SELECT 
    s.id,
    s.name AS student_name,
    s.branch,
    s.gpa,
    c.title AS current_course
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_code = c.course_code
WHERE s.gpa >= 9.0
ORDER BY s.gpa DESC;
`,
};

export const sampleWebsites = [
  {
    id: 'web-1',
    title: 'MIT OpenCourseWare Electrical & CS',
    url: 'https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/',
    category: 'Academics',
    description: 'Direct syllabus, lecture slides, and problem sets from MIT undergraduate courses.',
    isPinned: true,
    addedAt: '2 days ago',
  },
  {
    id: 'web-2',
    title: 'LeetCode Global Weekly Contests',
    url: 'https://leetcode.com/contest/',
    category: 'Competitions',
    description: 'Weekly campus algorithmic ranking and real-time coding challenges.',
    isPinned: true,
    addedAt: '3 days ago',
  },
  {
    id: 'web-3',
    title: 'MDN Web Docs Interactive Playground',
    url: 'https://developer.mozilla.org',
    category: 'Documentation',
    description: 'Comprehensive specifications and live test benches for modern web standards.',
    isPinned: false,
    addedAt: '5 days ago',
  },
  {
    id: 'web-4',
    title: 'Hugging Face AI Model Repository',
    url: 'https://huggingface.co/models',
    category: 'AI & ML',
    description: 'Open-weight foundation models, tokenizer configs, and pipeline checkpoints.',
    isPinned: true,
    addedAt: '1 week ago',
  },
];

export const sampleAnnouncements = [
  {
    id: 'ann-1',
    text: '📢 Welcome to EduHub! Check the Resources tab for faculty-approved exam notes and new student freelance contracts.',
    title: 'Semester Study Material & Exam Prep Active',
    content: 'Check the Resources tab for faculty-approved exam notes, video masterclasses, and verified student freelance contracts.',
    type: 'info' as const,
    active: true,
    linkText: 'Explore Resources',
    linkTab: 'resources',
    createdAt: 'Today',
  },
];

export const initialProjectCredits: ProjectCredits = {
  institutionName: 'Department of Computer Science & Engineering',
  departmentName: 'School of Computing, Artificial Intelligence & Systems Architecture',
  projectTitle: 'EduHub — Unified Academic, Student Freelance & Collaborative Learning Ecosystem',
  academicYear: 'Academic Session 2025 – 2026',
  hod: {
    name: 'Dr. Rajeshwar Rao',
    title: 'Professor & Head of Department',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
    message: 'EduHub stands as a testament to student innovation, bridging textbook computer science with modern engineering execution and peer mentorship.',
    email: 'hod.cse@eduhub.edu',
  },
  facultyGuides: [
    {
      id: 'guide-1',
      name: 'Dr. Michael Chen',
      designation: 'Associate Professor & Major Project Coordinator',
      department: 'Computer Science & Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      email: 'michael.chen@eduhub.edu',
    },
    {
      id: 'guide-2',
      name: 'Prof. Sarah Jenkins',
      designation: 'Assistant Professor & Industry-Academia Liaison',
      department: 'Information Technology',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      email: 'sarah.jenkins@eduhub.edu',
    },
  ],
  contributors: [
    {
      id: 'contrib-1',
      name: 'Alex Rivera',
      rollNo: 'BT22CS089',
      role: 'Lead Architect & Full-Stack Engineer',
      contribution: 'Core React/TypeScript system architecture, Code Workspace engine, real-time messaging, and Owner Control Center.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      github: 'https://github.com/alexrivera-dev',
      linkedin: 'https://linkedin.com/in/alex-rivera-cs',
      email: 'alex.rivera@eduhub.edu',
    },
    {
      id: 'contrib-2',
      name: 'Elena Rostova',
      rollNo: 'BT21CS014',
      role: 'Backend & Cloud Systems Lead',
      contribution: 'Distributed data synchronization, state persistence, campus moderation filters, and security protocols.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      github: 'https://github.com/elena-rostova',
      linkedin: 'https://linkedin.com/in/elena-rostova',
      email: 'elena.rostova@eduhub.edu',
    },
    {
      id: 'contrib-3',
      name: 'David Kalu',
      rollNo: 'BT22IT045',
      role: 'UI/UX Designer & Frontend Engineer',
      contribution: 'Design system, Tailwind theme styling, responsive layouts, review system, and interactive group interfaces.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      github: 'https://github.com/david-kalu',
      linkedin: 'https://linkedin.com/in/david-kalu',
      email: 'david.kalu@eduhub.edu',
    },
    {
      id: 'contrib-4',
      name: 'Priya Sharma',
      rollNo: 'BT22AI031',
      role: 'AI & Data Integration Specialist',
      contribution: 'Smart gig matching algorithm, search ranking filters, study resource categorization, and documentation.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      github: 'https://github.com/priya-sharma-ai',
      linkedin: 'https://linkedin.com/in/priyasharma',
      email: 'priya.sharma@eduhub.edu',
    },
  ],
  acknowledgements: 'Special thanks to our department faculty members, lab assistants, and peer beta testers from the CS 2024–2026 batches for continuous feedback and testing support.',
  lastUpdated: 'August 2026',
};

export const sampleChatGroups: ChatGroup[] = [
  {
    id: 'group-hackathon-2026',
    name: '🚀 Web3 & AI Hackathon Squad',
    description: 'Collaborative team group for the upcoming Inter-College Smart India & Solution Challenge hackathons. Brainstorming, PRs, and demo slides.',
    category: 'Project',
    avatarColor: 'from-violet-600 to-indigo-600',
    creatorId: 'user-101',
    creatorName: 'Alex Rivera',
    adminIds: ['user-101'],
    members: [
      {
        userId: 'user-101',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'admin',
        joinedAt: 'Joined 3 days ago',
      },
      {
        userId: 'user-david',
        name: 'David Kalu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: 'Joined 2 days ago',
      },
      {
        userId: 'user-elena',
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: 'Joined 2 days ago',
      },
      {
        userId: 'user-priya',
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: 'Joined 1 day ago',
      },
    ],
    createdAt: '3 days ago',
    unreadCount: 0,
    lastMessage: {
      text: 'Pushed the smart contract and React frontend integration!',
      senderName: 'Alex Rivera',
      timestamp: '10:45 AM',
    },
  },
  {
    id: 'group-cs-algo-grind',
    name: '🧠 LeetCode & DSA Daily Grind',
    description: 'Daily problem solving, algorithmic breakdowns, time complexity discussions, and contest mock tests.',
    category: 'Study',
    avatarColor: 'from-emerald-600 to-teal-600',
    creatorId: 'user-david',
    creatorName: 'David Kalu',
    adminIds: ['user-david'],
    members: [
      {
        userId: 'user-david',
        name: 'David Kalu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        role: 'admin',
        joinedAt: 'Joined 1 week ago',
      },
      {
        userId: 'user-101',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: 'Joined 5 days ago',
      },
      {
        userId: 'user-priya',
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: 'Joined 4 days ago',
      },
    ],
    createdAt: '1 week ago',
    unreadCount: 1,
    lastMessage: {
      text: 'Today’s problem: Graph coloring with backtracking and Bitmasks.',
      senderName: 'David Kalu',
      timestamp: 'Yesterday',
    },
  },
  {
    id: 'group-freelance-collab',
    name: '💼 Campus Freelance Hub',
    description: 'Find co-developers for client gigs, discuss contract pricing, UI design handoffs, and share job leads.',
    category: 'Freelance',
    avatarColor: 'from-amber-500 to-orange-600',
    creatorId: 'user-elena',
    creatorName: 'Elena Rostova',
    adminIds: ['user-elena'],
    members: [
      {
        userId: 'user-elena',
        name: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        role: 'admin',
        joinedAt: 'Joined 2 weeks ago',
      },
      {
        userId: 'user-101',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: 'Joined 1 week ago',
      },
      {
        userId: 'user-david',
        name: 'David Kalu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        role: 'member',
        joinedAt: 'Joined 3 days ago',
      },
    ],
    createdAt: '2 weeks ago',
    unreadCount: 0,
    lastMessage: {
      text: 'Anyone available for a Next.js + Stripe integration gig tonight?',
      senderName: 'Elena Rostova',
      timestamp: '2 days ago',
    },
  },
];

export const sampleGroupMessages: Record<string, GroupMessage[]> = {
  'group-hackathon-2026': [
    {
      id: 'gmsg-1',
      groupId: 'group-hackathon-2026',
      senderId: 'user-david',
      senderName: 'David Kalu',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      senderRole: 'student',
      text: 'Hey squad! I finished setting up the Figma design tokens and component library for our hackathon project.',
      timestamp: 'Yesterday at 9:15 PM',
      reactions: { '🔥': ['user-101', 'user-elena'], '👏': ['user-priya'] },
    },
    {
      id: 'gmsg-2',
      groupId: 'group-hackathon-2026',
      senderId: 'user-elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      senderRole: 'alumni',
      text: 'Great work David! I deployed the WebSocket relay service and Redis queue to the cloud cluster. Here is the connection snippet:',
      timestamp: 'Yesterday at 10:20 PM',
      codeSnippet: `import { io } from "socket.io-client";\n\nexport const socket = io("wss://relay.eduhub.internal", {\n  transports: ["websocket"],\n  auth: { token: "DEV_JWT_SECRET" },\n});`,
      reactions: { '⚡': ['user-101'] },
    },
    {
      id: 'gmsg-3',
      groupId: 'group-hackathon-2026',
      senderId: 'user-101',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      senderRole: 'student',
      text: 'Pushed the smart contract and React frontend integration! Let’s do a quick sync before demo day.',
      timestamp: '10:45 AM',
      reactions: { '🚀': ['user-david', 'user-priya', 'user-elena'] },
    },
  ],
  'group-cs-algo-grind': [
    {
      id: 'gmsg-4',
      groupId: 'group-cs-algo-grind',
      senderId: 'user-david',
      senderName: 'David Kalu',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      senderRole: 'student',
      text: 'Today’s problem: Graph coloring with backtracking and Bitmasks. Try to hit O(N * 2^N) instead of O(N!).',
      timestamp: 'Yesterday at 4:30 PM',
      codeSnippet: `def can_color_graph(adj, colors_count):\n    n = len(adj)\n    def solve(node, color_mask):\n        if node == n: return True\n        for c in range(colors_count):\n            if not has_conflict(node, c, adj, color_mask):\n                color_mask[node] = c\n                if solve(node + 1, color_mask): return True\n                color_mask[node] = -1\n        return False\n    return solve(0, [-1] * n)`,
    },
  ],
  'group-freelance-collab': [
    {
      id: 'gmsg-5',
      groupId: 'group-freelance-collab',
      senderId: 'user-elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      senderRole: 'alumni',
      text: 'Anyone available for a Next.js + Stripe integration gig tonight? Budget is $450 fixed.',
      timestamp: '2 days ago',
      reactions: { '🙋‍♂️': ['user-101'] },
    },
  ],
};

export const initialAcademicBranches: Array<{ code: string; name: string; description?: string }> = [
  { code: 'CY', name: 'Cyber Security (CSE-CY)', description: 'Network defense, cryptography, penetration testing, security governance' },
  { code: 'DS', name: 'Data Science (CSE-DS)', description: 'Big data analytics, statistics, predictive modeling, data pipelines' },
  { code: 'AI', name: 'Artificial Intelligence (CSE-AI)', description: 'Deep learning, computer vision, NLP, neural architectures' },
  { code: 'CSE', name: 'Computer Science & Engineering', description: 'Core computing, algorithms, distributed systems, compilers' },
  { code: 'IT', name: 'Information Technology', description: 'Web technologies, cloud systems, enterprise architecture' },
  { code: 'ETC', name: 'Electronics & Telecomm Engineering', description: 'Signal processing, IoT, VLSI, wireless networks' },
  { code: 'EE', name: 'Electrical Engineering', description: 'Power systems, microcontrollers, renewable energy, control loops' },
  { code: 'CIVIL', name: 'Civil Engineering', description: 'Structural mechanics, geotechnical, surveying, urban design' },
  { code: 'ME', name: 'Mechanical Engineering', description: 'Thermodynamics, CAD/CAM, fluid mechanics, robotics automation' },
];

export const initialCollegeStats = {
  collegeName: 'JD College of Engineering & Management (JDCOEM)',
  shortName: 'JDCOEM',
  tagline: 'An Autonomous Engineering Institute Affiliated to DBATU & RTMNU',
  naacGrade: 'A',
  autonomousStatus: 'NAAC "A" Grade Autonomous Institute',
  industryPartners: '90+',
  placementRate: '~77%',
  alumniCount: '8,000+',
  totalStudents: 3200,
  activeProjects: 142,
  liveStreams: 8,
  highestPackage: '₹63 LPA',
  averagePackage: '₹6.5 LPA',
  recruiters: [
    { name: 'Amazon', packageOffered: '₹44 - 63 LPA', sector: 'Product / Tech' },
    { name: 'TCS Digital', packageOffered: '₹7.5 - 11 LPA', sector: 'IT Services' },
    { name: 'Infosys (Power Programmer)', packageOffered: '₹9.5 LPA', sector: 'Software' },
    { name: 'Capgemini', packageOffered: '₹6.8 - 8.5 LPA', sector: 'Consulting / IT' },
    { name: 'Cognizant', packageOffered: '₹6.5 LPA', sector: 'IT Services' },
    { name: 'Persistent Systems', packageOffered: '₹8.4 LPA', sector: 'Software R&D' },
    { name: 'Tech Mahindra', packageOffered: '₹5.5 - 7.0 LPA', sector: 'Telecom / IT' },
    { name: 'Wipro Turbo', packageOffered: '₹6.5 LPA', sector: 'Enterprise' },
    { name: 'L&T Infotech', packageOffered: '₹6.0 LPA', sector: 'Technology' },
    { name: 'Hexaware', packageOffered: '₹6.0 LPA', sector: 'Cloud' },
    { name: 'Zensar Technologies', packageOffered: '₹5.5 LPA', sector: 'Software' },
    { name: 'HCL Technologies', packageOffered: '₹5.2 LPA', sector: 'Infrastructure' },
  ],
  infrastructure: [
    {
      title: 'Robotics & AI Center of Excellence',
      description: 'Equipped with industrial robotic arms, high-density GPU computing clusters, and computer vision testbeds.',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'High-Performance Cloud & Networking Lab',
      description: 'CISCO certified networking rigs, localized server virtualization nodes, and cyber defense simulation sandboxes.',
      imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Advanced CAD/CAM & Rapid Prototyping Workshop',
      description: 'Precision CNC machining centers, SLA 3D printers, and dynamic fluid simulation workstations.',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Central Digital Library & IEEE Research Center',
      description: 'Over 45,000 volumes, high-speed Wi-Fi, online subscriptions to IEEE, Springer, and ScienceDirect journals.',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600',
    },
  ],
  coursesAndFees: [
    // UG
    {
      id: 'course-ug-cy',
      level: 'UG' as const,
      courseName: 'B.Tech in Computer Science & Engineering (Cyber Security)',
      branch: 'CY',
      duration: '4 Years (8 Semesters)',
      annualFee: '₹1,05,000 / year',
      intake: 120,
      eligibility: '10+2 with PCM >= 45% + MHT-CET or JEE Main Valid Score',
    },
    {
      id: 'course-ug-ds',
      level: 'UG' as const,
      courseName: 'B.Tech in Computer Science & Engineering (Data Science)',
      branch: 'DS',
      duration: '4 Years (8 Semesters)',
      annualFee: '₹1,05,000 / year',
      intake: 120,
      eligibility: '10+2 with PCM >= 45% + MHT-CET or JEE Main Valid Score',
    },
    {
      id: 'course-ug-ai',
      level: 'UG' as const,
      courseName: 'B.Tech in Computer Science & Engineering (Artificial Intelligence)',
      branch: 'AI',
      duration: '4 Years (8 Semesters)',
      annualFee: '₹1,05,000 / year',
      intake: 120,
      eligibility: '10+2 with PCM >= 45% + MHT-CET or JEE Main Valid Score',
    },
    {
      id: 'course-ug-it',
      level: 'UG' as const,
      courseName: 'B.Tech in Information Technology',
      branch: 'IT',
      duration: '4 Years (8 Semesters)',
      annualFee: '₹1,05,000 / year',
      intake: 60,
      eligibility: '10+2 with PCM >= 45% + MHT-CET or JEE Main Valid Score',
    },
    {
      id: 'course-ug-etc',
      level: 'UG' as const,
      courseName: 'B.Tech in Electronics & Telecommunication Engineering',
      branch: 'ETC',
      duration: '4 Years (8 Semesters)',
      annualFee: '₹98,000 / year',
      intake: 60,
      eligibility: '10+2 with PCM >= 45% + MHT-CET or JEE Main Valid Score',
    },
    {
      id: 'course-ug-ee',
      level: 'UG' as const,
      courseName: 'B.Tech in Electrical Engineering',
      branch: 'EE',
      duration: '4 Years (8 Semesters)',
      annualFee: '₹95,000 / year',
      intake: 60,
      eligibility: '10+2 with PCM >= 45% + MHT-CET or JEE Main Valid Score',
    },
    {
      id: 'course-ug-civil',
      level: 'UG' as const,
      courseName: 'B.Tech in Civil Engineering',
      branch: 'CIVIL',
      duration: '4 Years (8 Semesters)',
      annualFee: '₹92,000 / year',
      intake: 60,
      eligibility: '10+2 with PCM >= 45% + MHT-CET or JEE Main Valid Score',
    },
    {
      id: 'course-ug-me',
      level: 'UG' as const,
      courseName: 'B.Tech in Mechanical Engineering',
      branch: 'ME',
      duration: '4 Years (8 Semesters)',
      annualFee: '₹92,000 / year',
      intake: 60,
      eligibility: '10+2 with PCM >= 45% + MHT-CET or JEE Main Valid Score',
    },
    // PG
    {
      id: 'course-pg-cse',
      level: 'PG' as const,
      courseName: 'M.Tech in Computer Science & Engineering',
      branch: 'CSE',
      duration: '2 Years (4 Semesters)',
      annualFee: '₹85,000 / year',
      intake: 24,
      eligibility: 'B.Tech / B.E. in relevant discipline with valid GATE score',
    },
    {
      id: 'course-pg-mba',
      level: 'PG' as const,
      courseName: 'Master of Business Administration (MBA)',
      branch: 'Management',
      duration: '2 Years (4 Semesters)',
      annualFee: '₹78,000 / year',
      intake: 120,
      eligibility: 'Graduation in any stream >= 50% + MAH-MBA-CET / CAT / CMAT',
    },
    {
      id: 'course-pg-mca',
      level: 'PG' as const,
      courseName: 'Master of Computer Applications (MCA)',
      branch: 'Comp Apps',
      duration: '2 Years (4 Semesters)',
      annualFee: '₹75,000 / year',
      intake: 60,
      eligibility: 'BCA / B.Sc / Graduation with Mathematics + MAH-MCA-CET',
    },
    // Diploma
    {
      id: 'course-dip-ce',
      level: 'Diploma' as const,
      courseName: 'Diploma in Computer Engineering',
      branch: 'CE',
      duration: '3 Years (6 Semesters)',
      annualFee: '₹48,000 / year',
      intake: 60,
      eligibility: '10th (SSC) pass with minimum 35% aggregate marks',
    },
    {
      id: 'course-dip-ee',
      level: 'Diploma' as const,
      courseName: 'Diploma in Electrical Engineering',
      branch: 'EE',
      duration: '3 Years (6 Semesters)',
      annualFee: '₹45,000 / year',
      intake: 60,
      eligibility: '10th (SSC) pass with minimum 35% aggregate marks',
    },
    {
      id: 'course-dip-me',
      level: 'Diploma' as const,
      courseName: 'Diploma in Mechanical Engineering',
      branch: 'ME',
      duration: '3 Years (6 Semesters)',
      annualFee: '₹45,000 / year',
      intake: 60,
      eligibility: '10th (SSC) pass with minimum 35% aggregate marks',
    },
    {
      id: 'course-dip-civil',
      level: 'Diploma' as const,
      courseName: 'Diploma in Civil Engineering',
      branch: 'CIVIL',
      duration: '3 Years (6 Semesters)',
      annualFee: '₹45,000 / year',
      intake: 60,
      eligibility: '10th (SSC) pass with minimum 35% aggregate marks',
    },
  ],
};
