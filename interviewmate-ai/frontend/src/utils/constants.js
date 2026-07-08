// ============================================
// INTERVIEWMATE AI - CONSTANTS
// ============================================

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000/ws';

// App Configuration
export const APP_NAME = 'InterviewMate AI';
export const APP_VERSION = '1.0.0';
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Interview Configuration
export const MIN_QUESTIONS = 5;
export const MAX_QUESTIONS = 20;
export const DEFAULT_QUESTIONS = 10;
export const MIN_TIME_PER_QUESTION = 60; // seconds
export const MAX_TIME_PER_QUESTION = 300; // seconds
export const DEFAULT_TIME_PER_QUESTION = 120;

// Emotion Labels
export const EMOTIONS = {
  HAPPY: 'happy',
  SAD: 'sad',
  ANGRY: 'angry',
  FEAR: 'fear',
  SURPRISE: 'surprise',
  DISGUST: 'disgust',
  NEUTRAL: 'neutral'
};

export const EMOTION_LABELS = {
  [EMOTIONS.HAPPY]: 'Happy / Confident',
  [EMOTIONS.SAD]: 'Sad / Low Energy',
  [EMOTIONS.ANGRY]: 'Angry / Frustrated',
  [EMOTIONS.FEAR]: 'Fear / Nervous',
  [EMOTIONS.SURPRISE]: 'Surprised',
  [EMOTIONS.DISGUST]: 'Disgusted',
  [EMOTIONS.NEUTRAL]: 'Neutral'
};

// Score Weights (configurable)
export const DEFAULT_SCORE_WEIGHTS = {
  facial: 0.25,
  speech: 0.20,
  clarity: 0.15,
  answer: 0.25,
  eyeContact: 0.15
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'hard', label: 'Hard', color: '#ef4444' },
  { value: 'mixed', label: 'Mixed', color: '#8b5cf6' }
];

// Question Types
export const QUESTION_TYPES = {
  TECHNICAL: 'technical',
  BEHAVIORAL: 'behavioral',
  HR: 'hr',
  SITUATIONAL: 'situational'
};

// Job Categories
export const JOB_CATEGORIES = [
  { id: 1, name: 'Software Development', icon: '💻', description: 'Coding, algorithms, system design' },
  { id: 2, name: 'Data Science', icon: '📊', description: 'ML, statistics, data analysis' },
  { id: 3, name: 'Cloud & DevOps', icon: '☁️', description: 'AWS, Docker, CI/CD, Kubernetes' },
  { id: 4, name: 'Cybersecurity', icon: '🔒', description: 'Network security, ethical hacking' },
  { id: 5, name: 'Database Administration', icon: '🗄️', description: 'SQL, NoSQL, data modeling' },
  { id: 6, name: 'UI/UX Design', icon: '🎨', description: 'Design principles, Figma, prototyping' },
  { id: 7, name: 'Digital Marketing', icon: '📱', description: 'SEO, SEM, social media marketing' },
  { id: 8, name: 'Project Management', icon: '📋', description: 'Agile, Scrum, stakeholder management' },
  { id: 9, name: 'Business Analysis', icon: '📈', description: 'Requirements, process modeling' },
  { id: 10, name: 'Quality Assurance', icon: '✅', description: 'Testing, automation, Selenium' },
  { id: 11, name: 'Technical Support', icon: '🛠️', description: 'Troubleshooting, customer service' },
  { id: 12, name: 'HR & Recruitment', icon: '👥', description: 'Talent acquisition, employee relations' },
  { id: 13, name: 'Finance & Accounting', icon: '💰', description: 'Financial analysis, auditing' },
  { id: 14, name: 'Sales & Business Dev', icon: '🤝', description: 'B2B sales, negotiation, CRM' },
  { id: 15, name: 'Operations & Supply Chain', icon: '🚚', description: 'Logistics, inventory management' },
  { id: 16, name: 'Content Writing', icon: '✍️', description: 'Copywriting, SEO content, editing' }
];

// Target Companies
export const TARGET_COMPANIES = [
  { id: 1, name: 'TCS', logo: 'tcs.png', type: 'Service', focus: 'IT Services, Consulting' },
  { id: 2, name: 'Infosys', logo: 'infosys.png', type: 'Service', focus: 'Digital Services, Consulting' },
  { id: 3, name: 'Wipro', logo: 'wipro.png', type: 'Service', focus: 'IT Services, Business Solutions' },
  { id: 4, name: 'Accenture', logo: 'accenture.png', type: 'Service', focus: 'Strategy, Consulting, Technology' },
  { id: 5, name: 'Cognizant', logo: 'cognizant.png', type: 'Service', focus: 'IT Services, Digital Transformation' },
  { id: 6, name: 'HCL', logo: 'hcl.png', type: 'Service', focus: 'IT Infrastructure, Engineering' },
  { id: 7, name: 'Capgemini', logo: 'capgemini.png', type: 'Service', focus: 'Consulting, Technology Services' },
  { id: 8, name: 'Tech Mahindra', logo: 'techmahindra.png', type: 'Service', focus: 'Telecom, IT Services' },
  { id: 9, name: 'IBM', logo: 'ibm.png', type: 'Product+Service', focus: 'Cloud, AI, Consulting' },
  { id: 10, name: 'Amazon', logo: 'amazon.png', type: 'Product', focus: 'E-commerce, AWS, AI' },
  { id: 11, name: 'Google', logo: 'google.png', type: 'Product', focus: 'Search, Cloud, AI/ML' },
  { id: 12, name: 'Microsoft', logo: 'microsoft.png', type: 'Product', focus: 'Cloud, Productivity, AI' }
];

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'im_access_token',
  REFRESH_TOKEN: 'im_refresh_token',
  USER_DATA: 'im_user_data',
  THEME: 'im_theme',
  INTERVIEW_SETTINGS: 'im_interview_settings',
  PROGRESS_DATA: 'im_progress_data'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  INTERVIEW_SETUP: '/interview/setup',
  INTERVIEW_ROOM: '/interview/room',
  FEEDBACK: '/feedback/:sessionId',
  REPORT: '/report/:sessionId',
  PROGRESS: '/progress',
  CATEGORIES: '/categories',
  COMPANY_PREP: '/company-prep',
  PROFILE: '/profile',
  RESUME_UPLOAD: '/resume-upload',
  ABOUT: '/about'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please log in again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload PDF or DOCX.',
  CAMERA_DENIED: 'Camera access denied. Please enable permissions.',
  MICROPHONE_DENIED: 'Microphone access denied. Please enable permissions.'
};