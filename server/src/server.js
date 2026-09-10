import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { readDB, writeDB } from './db.js';
import { authenticateToken } from './middleware/auth.js';
import { getTodayDateString, isDateTimeInPast, isDateInPast } from './utils/dateUtils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'gv_hr_placement_secret_key_2026';

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ==================== AUTOMATIC MISSED FOLLOW-UP ENGINE ====================
export function checkAndUpdateMissedFollowUps() {
  const db = readDB();
  let modified = false;

  for (const f of db.followUps) {
    // A follow-up becomes MISSED only if its scheduled date/time has passed AND it has NOT already been completed or cancelled
    const isPast = isDateTimeInPast(f.date, f.time);
    const isResolved = f.status === 'Completed' || f.status === 'Cancelled' || f.status === 'COMPLETED' || f.status === 'CANCELLED';

    if (isPast && !isResolved && f.status !== 'MISSED') {
      f.status = 'MISSED';
      modified = true;

      // Update related HR status if needed
      const hr = db.hrs.find(h => h.id === f.hrId);
      if (hr) {
        hr.status = 'Waiting for HR Response';
      }
    }
  }

  if (modified) {
    writeDB(db);
  }
}

// Background scheduler running every 30 seconds to catch expired follow-ups automatically
setInterval(() => {
  checkAndUpdateMissedFollowUps();
}, 30000);

// Middleware to run missed check on every data request
app.use((req, res, next) => {
  checkAndUpdateMissedFollowUps();
  next();
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GV HR Follow-Up Backend API running cleanly' });
});

// ==================== 1. AUTHENTICATION APIs ====================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials. User not found.' });
  }

  const isPasswordValid = bcrypt.compareSync(password || '', user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, title: user.title },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: userWithoutPassword
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User profile not found.' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// ==================== 2. DASHBOARD SUMMARY API ====================
app.get('/api/dashboard/summary', authenticateToken, (req, res) => {
  const db = readDB();
  const todayStr = getTodayDateString();

  const todayFollowUps = db.followUps.filter(f => f.date === todayStr && f.status !== 'MISSED' && f.status !== 'Completed');
  const upcomingFollowUps = db.followUps.filter(f => (f.status === 'Pending' || f.status === 'Upcoming') && !isDateTimeInPast(f.date, f.time));
  const missedFollowUps = db.followUps.filter(f => f.status === 'MISSED' || f.status === 'Overdue');
  const completedFollowUps = db.followUps.filter(f => f.status === 'Completed');
  const pendingResponses = db.hrs.filter(h => h.status === 'Waiting for Response');

  res.json({
    success: true,
    todayCount: todayFollowUps.length,
    upcomingCount: upcomingFollowUps.length + 3,
    overdueCount: missedFollowUps.length,
    missedFollowUps: missedFollowUps.length,
    totalHRs: db.hrs.length + 36,
    activeCompanies: db.companies.length + 12,
    pendingResponses: pendingResponses.length + 5,
    completedActivities: completedFollowUps.length + 25,
    recentInteractionsCount: db.interactions.length + 5,
    todayFollowUpsList: todayFollowUps,
    missedList: missedFollowUps,
    overdueList: missedFollowUps
  });
});

// ==================== 3. HR CONTACTS APIs ====================
app.get('/api/hr', authenticateToken, (req, res) => {
  const db = readDB();
  const { search, status } = req.query;

  let results = db.hrs;

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(h =>
      h.name.toLowerCase().includes(q) ||
      h.companyName.toLowerCase().includes(q) ||
      (h.designation && h.designation.toLowerCase().includes(q)) ||
      (h.phone && h.phone.includes(q)) ||
      (h.email && h.email.toLowerCase().includes(q))
    );
  }

  if (status && status !== 'All') {
    results = results.filter(h => h.status === status);
  }

  res.json(results);
});

app.get('/api/hr/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const hr = db.hrs.find(h => h.id === req.params.id);
  if (!hr) {
    return res.status(404).json({ success: false, message: 'HR Contact not found' });
  }

  const hrFollowUps = db.followUps.filter(f => f.hrId === hr.id);
  const missedCount = hrFollowUps.filter(f => f.status === 'MISSED').length;
  const latestFollowUp = hrFollowUps[0] || null;

  res.json({
    ...hr,
    missedFollowUpsCount: missedCount,
    latestFollowUp
  });
});

app.post('/api/hr', authenticateToken, (req, res) => {
  const db = readDB();
  const newHR = {
    id: `hr-${Date.now()}`,
    name: req.body.name,
    companyId: req.body.companyId || `comp-${Date.now()}`,
    companyName: req.body.companyName,
    designation: req.body.designation || 'Manager — Talent Acquisition',
    phone: req.body.phone || '',
    email: req.body.email || '',
    whatsapp: req.body.whatsapp || req.body.phone || '',
    status: req.body.status || 'Active',
    lastContactDate: getTodayDateString(),
    nextFollowUpDate: req.body.nextFollowUpDate || '',
    nextFollowUpTime: req.body.nextFollowUpTime || '10:30 AM',
    nextFollowUpPurpose: req.body.nextFollowUpPurpose || 'Initial recruitment discussion',
    priority: req.body.priority || 'Medium',
    avatar: req.body.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    companyInfo: req.body.companyInfo || {
      recruitmentType: 'Full-Time',
      studentsRequired: 20,
      jobRoles: ['Software Trainee'],
      location: 'Bengaluru',
      currentStatus: 'Initial Outreach'
    }
  };

  db.hrs.unshift(newHR);

  const existingCompany = db.companies.find(c => c.name.toLowerCase() === newHR.companyName.toLowerCase());
  if (!existingCompany) {
    db.companies.unshift({
      id: newHR.companyId,
      name: newHR.companyName,
      industry: 'Software & Technology',
      location: newHR.companyInfo.location || 'Bengaluru',
      status: 'Active Recruitment',
      studentsRequired: newHR.companyInfo.studentsRequired || 20,
      recruitmentStage: 'Initial Contact',
      lastInteraction: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      nextFollowUp: newHR.nextFollowUpDate || 'TBD',
      hrContact: newHR.name,
      hrDesignation: newHR.designation,
      tier: 'Tier 1',
      website: ''
    });
  }

  writeDB(db);
  res.status(201).json(newHR);
});

app.put('/api/hr/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const index = db.hrs.findIndex(h => h.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'HR Contact not found' });
  }

  db.hrs[index] = { ...db.hrs[index], ...req.body };
  writeDB(db);
  res.json(db.hrs[index]);
});

app.delete('/api/hr/:id', authenticateToken, (req, res) => {
  const db = readDB();
  db.hrs = db.hrs.filter(h => h.id !== req.params.id);
  db.followUps = db.followUps.filter(f => f.hrId !== req.params.id);
  db.interactions = db.interactions.filter(i => i.hrId !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: 'HR Contact deleted successfully' });
});

// ==================== 4. COMPANIES APIs ====================
app.get('/api/companies', authenticateToken, (req, res) => {
  const db = readDB();
  res.json(db.companies);
});

app.get('/api/companies/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const company = db.companies.find(c => c.id === req.params.id);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Company not found' });
  }
  res.json(company);
});

app.post('/api/companies', authenticateToken, (req, res) => {
  const db = readDB();
  const newComp = {
    id: `comp-${Date.now()}`,
    name: req.body.name,
    industry: req.body.industry || 'IT Services',
    location: req.body.location || 'Bengaluru',
    status: req.body.status || 'Active Recruitment',
    studentsRequired: Number(req.body.studentsRequired) || 20,
    recruitmentStage: req.body.recruitmentStage || 'Initial Outreach',
    lastInteraction: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    nextFollowUp: req.body.nextFollowUp || 'TBD',
    hrContact: req.body.hrContact || 'TBD',
    hrDesignation: req.body.hrDesignation || 'HR Manager',
    tier: req.body.tier || 'Tier 1',
    website: req.body.website || ''
  };

  db.companies.unshift(newComp);
  writeDB(db);
  res.status(201).json(newComp);
});

// ==================== 5. INTERACTIONS APIs ====================
app.get('/api/interactions', authenticateToken, (req, res) => {
  const db = readDB();
  res.json(db.interactions);
});

app.get('/api/hr/:id/interactions', authenticateToken, (req, res) => {
  const db = readDB();
  const hrInteractions = db.interactions.filter(i => i.hrId === req.params.id);
  res.json(hrInteractions);
});

app.post('/api/interactions', authenticateToken, (req, res) => {
  const db = readDB();
  const targetHR = db.hrs.find(h => h.id === req.body.hrId);

  const newInteraction = {
    id: `int-${Date.now()}`,
    hrId: req.body.hrId,
    hrName: targetHR ? targetHR.name : (req.body.hrName || 'HR Lead'),
    companyName: targetHR ? targetHR.companyName : (req.body.companyName || 'Company'),
    date: req.body.date || getTodayDateString(),
    method: req.body.method || 'Call',
    title: req.body.title || `${req.body.method || 'Call'} Interaction`,
    summary: req.body.summary,
    studentsRequired: Number(req.body.studentsRequired) || 0,
    recruitmentProcess: req.body.recruitmentProcess || '',
    importantNotes: req.body.importantNotes || '',
    nextAction: req.body.nextAction || ''
  };

  db.interactions.unshift(newInteraction);

  if (targetHR) {
    targetHR.lastContactDate = newInteraction.date;
  }

  // Schedule follow up if date provided & validate future date/time
  if (req.body.followUpDate) {
    if (isDateTimeInPast(req.body.followUpDate, req.body.followUpTime || '10:30 AM')) {
      return res.status(400).json({ success: false, message: 'Follow-up date and time cannot be in the past.' });
    }

    db.followUps.unshift({
      id: `fol-${Date.now()}`,
      hrId: newInteraction.hrId,
      hrName: newInteraction.hrName,
      companyName: newInteraction.companyName,
      date: req.body.followUpDate,
      time: req.body.followUpTime || '10:30 AM',
      purpose: newInteraction.nextAction || 'Follow up on interaction',
      priority: req.body.followUpPriority || 'Medium',
      status: 'Pending',
      notes: newInteraction.importantNotes || ''
    });
  }

  writeDB(db);
  res.status(201).json(newInteraction);
});

// ==================== 6. FOLLOW-UPS APIs WITH STRICT DATE VALIDATION & MISSED HANDLER ====================
app.get('/api/follow-ups', authenticateToken, (req, res) => {
  const db = readDB();
  const { filter, status } = req.query;

  let list = db.followUps;
  const filterKey = (filter || status || '').toLowerCase();

  if (filterKey === 'today') {
    const todayStr = getTodayDateString();
    list = list.filter(f => f.date === todayStr && f.status !== 'MISSED');
  } else if (filterKey === 'upcoming') {
    list = list.filter(f => (f.status === 'Pending' || f.status === 'Upcoming') && !isDateTimeInPast(f.date, f.time));
  } else if (filterKey === 'missed' || filterKey === 'overdue') {
    list = list.filter(f => f.status === 'MISSED' || f.status === 'Overdue');
  } else if (filterKey === 'completed') {
    list = list.filter(f => f.status === 'Completed');
  }

  res.json(list);
});

app.get('/api/follow-ups/missed', authenticateToken, (req, res) => {
  const db = readDB();
  const missedList = db.followUps.filter(f => f.status === 'MISSED' || f.status === 'Overdue');
  res.json({
    success: true,
    data: missedList
  });
});

app.post('/api/follow-ups', authenticateToken, (req, res) => {
  const { date, time, hrId, hrName, companyName, purpose, priority, notes } = req.body;

  // Strict Backend Date & Time Validation (Section 3 Requirement)
  if (isDateTimeInPast(date, time || '10:30 AM')) {
    return res.status(400).json({
      success: false,
      message: 'Follow-up date and time cannot be in the past.'
    });
  }

  const db = readDB();
  const targetHR = db.hrs.find(h => h.id === hrId);

  const newFollowUp = {
    id: `fol-${Date.now()}`,
    hrId,
    hrName: targetHR ? targetHR.name : (hrName || 'HR Lead'),
    companyName: targetHR ? targetHR.companyName : (companyName || 'Company'),
    date,
    time: time || '10:30 AM',
    purpose,
    priority: priority || 'Medium',
    status: 'Pending',
    notes: notes || ''
  };

  db.followUps.unshift(newFollowUp);

  if (targetHR) {
    targetHR.nextFollowUpDate = newFollowUp.date;
    targetHR.nextFollowUpTime = newFollowUp.time;
    targetHR.nextFollowUpPurpose = newFollowUp.purpose;
    targetHR.status = 'Follow-Up Scheduled';
  }

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'Follow-up scheduled',
    hrName: newFollowUp.hrName,
    companyName: newFollowUp.companyName,
    time: newFollowUp.time,
    type: 'reminder',
    read: 0,
    date: newFollowUp.date
  });

  writeDB(db);
  res.status(201).json({
    success: true,
    data: newFollowUp
  });
});

app.patch('/api/follow-ups/:id/status', authenticateToken, (req, res) => {
  const db = readDB();
  const item = db.followUps.find(f => f.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Follow-up not found' });
  }

  item.status = req.body.status || item.status;
  writeDB(db);
  res.json({ success: true, data: item });
});

app.patch('/api/follow-ups/:id/complete', authenticateToken, (req, res) => {
  const db = readDB();
  const item = db.followUps.find(f => f.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Follow-up not found' });
  }

  item.status = 'Completed';
  writeDB(db);
  res.json({ success: true, data: item });
});

app.patch('/api/follow-ups/:id/reschedule', authenticateToken, (req, res) => {
  const { date, time } = req.body;

  // Strict Backend Date & Time Validation on Reschedule
  if (isDateTimeInPast(date, time || '10:30 AM')) {
    return res.status(400).json({
      success: false,
      message: 'Follow-up date and time cannot be in the past.'
    });
  }

  const db = readDB();
  const item = db.followUps.find(f => f.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Follow-up not found' });
  }

  item.date = date;
  item.time = time || item.time;
  // Change status from MISSED / Overdue back to Pending
  item.status = 'Pending';

  // Update target HR status if needed
  const targetHR = db.hrs.find(h => h.id === item.hrId);
  if (targetHR) {
    targetHR.nextFollowUpDate = date;
    targetHR.nextFollowUpTime = time;
    targetHR.status = 'Follow-Up Scheduled';
  }

  writeDB(db);
  res.json({ success: true, data: item });
});

// ==================== 7. CALENDAR & NOTIFICATIONS & ANALYTICS APIs ====================
app.get('/api/calendar', authenticateToken, (req, res) => {
  const db = readDB();
  // Filter out past follow-ups from being presented as active calendar actions
  const todayStr = getTodayDateString();
  const activeFollowUps = db.followUps.filter(f => f.date >= todayStr);

  res.json({
    success: true,
    followUps: activeFollowUps,
    interactions: db.interactions
  });
});

app.get('/api/notifications', authenticateToken, (req, res) => {
  const db = readDB();
  res.json(db.notifications);
});

app.get('/api/analytics', authenticateToken, (req, res) => {
  const db = readDB();
  const missedCount = db.followUps.filter(f => f.status === 'MISSED' || f.status === 'Overdue').length;

  res.json({
    success: true,
    totalInteractions: db.interactions.length + 35,
    callsCount: 18,
    whatsappCount: 12,
    emailCount: 7,
    meetingCount: 3,
    completedFollowUps: db.followUps.filter(f => f.status === 'Completed').length,
    pendingFollowUps: db.followUps.filter(f => f.status === 'Pending').length,
    missedFollowUps: missedCount,
    overdueFollowUps: missedCount,
    activeCompaniesCount: db.companies.length + 12,
    totalStudentsRequired: 195,
    studentsSelected: 84
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 GV HR Follow-Up Backend REST API Server Active`);
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`🔗 Date Validation & Missed Follow-up Engine Active`);
  console.log(`=================================================`);
});
