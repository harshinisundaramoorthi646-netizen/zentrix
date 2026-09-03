import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { initialData } from './data.js';
import { connectDB } from './config/db.js';
import { setupSwagger } from './config/swagger.js';
import { authenticateToken, requireRole, generateToken } from './middleware/auth.js';
import {
  User,
  Lead,
  CommissionRule,
  Client,
  Project,
  Task,
  TimeEntry,
  Invoice,
  AuditLog,
  Notification
} from './models/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root Health & Service Status Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: '⚡ ZENTRIX Express API Backend Service is Running Live!',
    swaggerDocs: `${req.protocol}://${req.get('host')}/api-docs`,
    apiBase: `${req.protocol}://${req.get('host')}/api`
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', mongoConnected: isMongoConnected, timestamp: new Date().toISOString() });
});

// Setup Swagger UI documentation with custom project theme
setupSwagger(app);


// Database connection state
let isMongoConnected = false;

// In-memory data store initialized from seed data
let db = JSON.parse(JSON.stringify(initialData));

// Helper to hash passwords in memory
const hashSeedUsers = async () => {
  for (const u of db.users) {
    if (u.password && !u.password.startsWith('$2a$') && !u.password.startsWith('$2b$')) {
      u.password = await bcrypt.hash(u.password, 10);
    }
  }
};

// Initialize and Seed Database if connected
const initDatabase = async () => {
  await hashSeedUsers();

  isMongoConnected = await connectDB();
  if (!isMongoConnected) return;

  try {
    // Seed Users if empty or missing seed accounts
    for (const su of initialData.users) {
      const cleanEmail = su.email.toLowerCase();
      const existing = await User.findOne({ email: cleanEmail });
      const pass = (su.password && !su.password.startsWith('$2a$') && !su.password.startsWith('$2b$'))
        ? await bcrypt.hash(su.password, 10)
        : su.password;

      if (!existing) {
        await User.create({ ...su, password: pass });
        console.log(`🌱 Seed User created: ${cleanEmail}`);
      } else if (!existing.password.startsWith('$2a$') && !existing.password.startsWith('$2b$')) {
        await User.updateOne({ _id: existing._id }, { password: pass });
      }
    }
    db.users = await User.find().lean();

    // Seed Commission Rules if empty
    const commissionCount = await CommissionRule.countDocuments();
    if (commissionCount === 0) {
      await CommissionRule.create(initialData.commissionRules);
      console.log('🌱 Commission Rules seeded into MongoDB');
    }
    const commDoc = await CommissionRule.findOne().lean();
    if (commDoc) {
      db.commissionRules = { teamA: commDoc.teamA, teamB: commDoc.teamB };
    }

    // Seed Leads if empty
    const leadCount = await Lead.countDocuments();
    if (leadCount === 0) {
      await Lead.insertMany(initialData.leads);
      console.log('🌱 Leads seeded into MongoDB');
    }
    db.leads = await Lead.find().lean();

    // Seed Clients if empty
    const clientCount = await Client.countDocuments();
    if (clientCount === 0) {
      await Client.insertMany(initialData.clients);
      console.log('🌱 Clients seeded into MongoDB');
    }
    db.clients = await Client.find().lean();

    // Seed Projects if empty
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(initialData.projects);
      console.log('🌱 Projects seeded into MongoDB');
    }
    db.projects = await Project.find().lean();

    // Seed Tasks if empty
    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      await Task.insertMany(initialData.tasks);
      console.log('🌱 Tasks seeded into MongoDB');
    }
    db.tasks = await Task.find().lean();

    // Seed Time Entries if empty
    const timeCount = await TimeEntry.countDocuments();
    if (timeCount === 0) {
      await TimeEntry.insertMany(initialData.timeEntries);
      console.log('🌱 Time Entries seeded into MongoDB');
    }
    db.timeEntries = await TimeEntry.find().lean();

    // Seed Invoices if empty
    const invoiceCount = await Invoice.countDocuments();
    if (invoiceCount === 0) {
      await Invoice.insertMany(initialData.invoices);
      console.log('🌱 Invoices seeded into MongoDB');
    }
    db.invoices = await Invoice.find().lean();

    // Seed Audit Logs if empty
    const auditCount = await AuditLog.countDocuments();
    if (auditCount === 0) {
      await AuditLog.insertMany(initialData.auditLogs);
      console.log('🌱 Audit Logs seeded into MongoDB');
    }
    db.auditLogs = await AuditLog.find().lean();

    // Seed Notifications if empty
    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      await Notification.insertMany(initialData.notifications);
      console.log('🌱 Notifications seeded into MongoDB');
    }
    db.notifications = await Notification.find().lean();

  } catch (err) {
    console.error('❌ Database initialization/sync error:', err.message);
  }
};

/**
 * @openapi
 * /:
 *   get:
 *     summary: Root health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Returns backend running status and database connection mode.
 */
app.get('/', (req, res) => {
  res.json({
    status: 'Backend is running',
    database: isMongoConnected ? 'Connected to MongoDB' : 'In-Memory Store Mode (Set MONGODB_URI to connect)',
    timestamp: new Date().toISOString()
  });
});

// Helper to log audit event
const logAuditEvent = (user, action, details) => {
  const newLog = {
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    user,
    action,
    details
  };
  db.auditLogs.unshift(newLog);
  if (isMongoConnected) {
    AuditLog.create(newLog).catch(err => console.error('Error saving AuditLog:', err.message));
  }
  return newLog;
};

// Helper to send notification
const addNotification = (title, message, type = 'info') => {
  const notif = {
    id: `notif_${Date.now()}`,
    title,
    message,
    timestamp: 'Just now',
    read: false,
    type
  };
  db.notifications.unshift(notif);
  if (isMongoConnected) {
    Notification.create(notif).catch(err => console.error('Error saving Notification:', err.message));
  }
  return notif;
};

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@zentrix.com
 *               password:
 *                 type: string
 *                 example: Zx9#kP2$vL8n
 *     responses:
 *       200:
 *         description: Authenticated user object and JWT token.
 *       401:
 *         description: Invalid email address or incorrect password.
 */
const handleLogin = async (req, res) => {
  const { email, password } = req.body || {};

  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPassword = (password || '').trim();

  // Validate presence
  if (!cleanEmail) {
    return res.status(401).json({ error: 'Invalid email address.' });
  }

  if (!cleanPassword) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  // Find user in memory or database
  let user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user && isMongoConnected) {
    user = await User.findOne({ email: cleanEmail }).lean();
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid email address.' });
  }

  // Compare Password with bcrypt (with fallback for legacy plaintext)
  let isMatch = false;
  try {
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(cleanPassword, user.password);
    } else {
      isMatch = (user.password === cleanPassword);
      // Migrate plaintext password to bcrypt hash
      if (isMatch) {
        user.password = await bcrypt.hash(cleanPassword, 10);
        if (isMongoConnected) {
          User.updateOne({ id: user.id }, { password: user.password }).catch(() => {});
        }
      }
    }
  } catch (err) {
    isMatch = false;
  }

  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const token = generateToken(user);
  logAuditEvent(user.name, 'USER_LOGIN', `Logged in as ${user.role}`);

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, token });
};

app.post('/login', handleLogin);
app.post('/auth/login', handleLogin);
app.post('/api/auth/login', handleLogin);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile object.
 *       401:
 *         description: Unauthorized token.
 */
app.get(['/api/auth/me', '/auth/me'], authenticateToken, async (req, res) => {
  let user = db.users.find(u => u.id === req.user.id);
  if (!user && isMongoConnected) {
    user = await User.findOne({ id: req.user.id }).lean();
  }

  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

// Helper to dynamically generate a unique non-colliding Lead ID
const generateLeadId = async () => {
  let maxId = 128;
  if (Array.isArray(db.leads)) {
    for (const l of db.leads) {
      if (l && l.id && typeof l.id === 'string' && l.id.startsWith('ZX-LD-2026-')) {
        const num = parseInt(l.id.replace('ZX-LD-2026-', ''), 10);
        if (!isNaN(num) && num > maxId) maxId = num;
      }
    }
  }
  if (isMongoConnected) {
    try {
      const mongoLeads = await Lead.find({}, { id: 1 }).lean();
      for (const l of mongoLeads) {
        if (l && l.id && typeof l.id === 'string' && l.id.startsWith('ZX-LD-2026-')) {
          const num = parseInt(l.id.replace('ZX-LD-2026-', ''), 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      }
    } catch (e) {
      console.warn('Warning fetching max lead id from mongo:', e.message);
    }
  }
  const nextNum = maxId + 1;
  return `ZX-LD-2026-${String(nextNum).padStart(5, '0')}`;
};

/**
 * @openapi
 * /api/leads:
 *   get:
 *     summary: Get all leads
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of all lead objects.
 */
app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    if (isMongoConnected) {
      db.leads = await Lead.find().sort({ createdAt: -1 }).lean();
    }
    res.json(db.leads);
  } catch (err) {
    res.json(db.leads);
  }
});

/**
 * @openapi
 * /api/leads/{id}:
 *   get:
 *     summary: Get lead by ID
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the lead
 *     responses:
 *       200:
 *         description: Lead details.
 *       404:
 *         description: Lead not found.
 */
app.get('/api/leads/:id', authenticateToken, (req, res) => {
  const lead = db.leads.find(l => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
});

/**
 * @openapi
 * /api/leads:
 *   post:
 *     summary: Create a new lead prospect
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               company:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               location:
 *                 type: string
 *               source:
 *                 type: string
 *               requirement:
 *                 type: string
 *               estimatedBudget:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lead created successfully.
 */
app.post('/api/leads', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, company, location, source, requirement, estimatedBudget, notes, author } = req.body;
    
    const newId = await generateLeadId();
    const creatorName = author || req.user?.name || 'Team A';
    
    const newLead = {
      id: newId,
      name: name || 'New Lead Prospect',
      phone: phone || '',
      email: email || '',
      company: company || 'Independent Company',
      location: location || 'India',
      source: source || 'Direct Outreach',
      requirement: requirement || 'Full-stack Custom SaaS Development',
      estimatedBudget: Number(estimatedBudget) || 100000,
      notes: notes || '',
      status: 'Submitted',
      priority: Number(estimatedBudget) > 200000 ? 'HIGH' : 'MEDIUM',
      assignedTeamA: creatorName,
      assignedTeamB: 'Rahul M',
      createdDate: new Date().toISOString(),
      calls: [],
      journey: [
        {
          timestamp: new Date().toISOString(),
          stage: 'Submitted',
          author: creatorName,
          details: `Lead submitted with estimated budget ₹${Number(estimatedBudget || 100000).toLocaleString('en-IN')}`
        }
      ]
    };

    if (isMongoConnected) {
      const savedLead = await Lead.create(newLead);
      const plainLead = savedLead.toObject();
      db.leads = db.leads.filter(l => l.id !== newId);
      db.leads.unshift(plainLead);
    } else {
      db.leads = db.leads.filter(l => l.id !== newId);
      db.leads.unshift(newLead);
    }
    
    const member = db.users.find(u => u.name === creatorName || u.role === 'TEAM_A');
    if (member) {
      member.earnedCommission = (member.earnedCommission || 0) + (db.commissionRules?.teamA?.amount || 100);
      member.leadsSubmitted = (member.leadsSubmitted || 0) + 1;
      if (isMongoConnected) {
        await User.updateOne({ id: member.id }, { earnedCommission: member.earnedCommission, leadsSubmitted: member.leadsSubmitted }).catch(err => console.error('Error updating member:', err.message));
      }
    }

    logAuditEvent(creatorName, 'SUBMITTED_LEAD', `Created Lead ${newId} (${company})`);
    addNotification('New Lead Created', `Lead ${newId} submitted by ${creatorName}.`, 'info');

    return res.status(201).json(newLead);
  } catch (err) {
    console.error('❌ Error creating Lead in MongoDB:', err);
    return res.status(500).json({ error: 'Failed to save lead to database', details: err.message });
  }
});

/**
 * @openapi
 * /api/leads/{id}/call:
 *   post:
 *     summary: Log a call interaction for a lead
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Call logged and lead status updated.
 */
app.post('/api/leads/:id/call', authenticateToken, requireRole('ADMIN', 'TEAM_B'), (req, res) => {
  const { id } = req.params;
  const { outcome, notes, followUpDate, agent, duration } = req.body;
  const agentName = agent || req.user.name || 'Team B';

  const lead = db.leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  lead.status = 'Calling';
  if (followUpDate) {
    lead.followUpDate = followUpDate;
    lead.status = 'Follow-up';
  }

  const callEntry = {
    date: new Date().toISOString(),
    agent: agentName,
    outcome: outcome || 'Interested',
    notes: notes || 'Call completed',
    duration: duration || '10m'
  };

  lead.calls.unshift(callEntry);
  lead.journey.push({
    timestamp: new Date().toISOString(),
    stage: lead.status,
    author: agentName,
    details: `Outcome: ${outcome}. Notes: ${notes}`
  });

  if (isMongoConnected) {
    Lead.updateOne({ id }, { status: lead.status, followUpDate: lead.followUpDate, calls: lead.calls, journey: lead.journey }).catch(err => console.error('Error updating Lead call:', err.message));
  }

  logAuditEvent(agentName, 'RECORDED_CALL', `Call logged for ${id} (Outcome: ${outcome})`);
  res.json(lead);
});

/**
 * @openapi
 * /api/leads/{id}/qualify:
 *   post:
 *     summary: Qualify a lead for proposal negotiation
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead marked as qualified.
 */
app.post('/api/leads/:id/qualify', authenticateToken, requireRole('ADMIN', 'TEAM_B'), (req, res) => {
  const { id } = req.params;
  const { agent } = req.body;
  const agentName = agent || req.user.name || 'Team B';

  const lead = db.leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  lead.status = 'Qualified';
  lead.journey.push({
    timestamp: new Date().toISOString(),
    stage: 'Qualified',
    author: agentName,
    details: `Lead qualified for proposal negotiation.`
  });

  const member = db.users.find(u => u.name === agentName || u.role === 'TEAM_B');
  if (member) {
    member.earnedCommission = (member.earnedCommission || 0) + (db.commissionRules?.teamB?.amount || 200);
    member.qualifiedLeads = (member.qualifiedLeads || 0) + 1;
    if (isMongoConnected) {
      User.updateOne({ id: member.id }, { earnedCommission: member.earnedCommission, qualifiedLeads: member.qualifiedLeads }).catch(err => console.error('Error updating member qualification:', err.message));
    }
  }

  if (isMongoConnected) {
    Lead.updateOne({ id }, { status: 'Qualified', journey: lead.journey }).catch(err => console.error('Error updating Lead qualify:', err.message));
  }

  logAuditEvent(agentName, 'QUALIFIED_LEAD', `Qualified Lead ${id}`);
  addNotification('Lead Qualified!', `Lead ${id} (${lead.company}) qualified by ${agentName}!`, 'success');

  res.json(lead);
});

/**
 * @openapi
 * /api/leads/{id}/convert:
 *   post:
 *     summary: Convert lead to won deal, create client, project, and invoice
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead converted with created project, client, and invoice details.
 */
app.post('/api/leads/:id/convert', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const { dealValue, notes, agent } = req.body;
  const agentName = agent || req.user.name || 'Admin';

  const lead = db.leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  const finalValue = Number(dealValue) || lead.estimatedBudget || 150000;
  lead.status = 'Converted';
  lead.convertedDealValue = finalValue;
  lead.convertedDate = new Date().toISOString();

  lead.journey.push({
    timestamp: new Date().toISOString(),
    stage: 'Converted',
    author: agentName,
    details: `Deal converted successfully! Final value: ₹${finalValue.toLocaleString('en-IN')}. ${notes || ''}`
  });

  if (isMongoConnected) {
    Lead.updateOne({ id }, { status: 'Converted', convertedDealValue: finalValue, convertedDate: lead.convertedDate, journey: lead.journey }).catch(err => console.error('Error updating Lead convert:', err.message));
  }

  const existingClient = db.clients.find(c => c.companyName.toLowerCase() === lead.company.toLowerCase());
  if (!existingClient) {
    const newClient = {
      id: `cli_${Date.now()}`,
      companyName: lead.company,
      contactPerson: lead.name,
      email: lead.email,
      phone: lead.phone,
      location: lead.location,
      activeProjects: 1,
      completedProjects: 0,
      totalRevenue: finalValue,
      outstandingInvoices: finalValue,
      status: "Active",
      joinedDate: new Date().toISOString().split('T')[0]
    };
    db.clients.unshift(newClient);
    if (isMongoConnected) {
      Client.create(newClient).catch(err => console.error('Error creating Client:', err.message));
    }
  }

  const newProject = {
    id: `prj_${Date.now()}`,
    name: `${lead.company} Platform`,
    client: lead.company,
    description: lead.requirement,
    budget: finalValue,
    startDate: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    status: "Active",
    progress: 10,
    assignedTeam: "ADMIN",
    members: [agentName],
    priority: "HIGH"
  };
  db.projects.unshift(newProject);
  if (isMongoConnected) {
    Project.create(newProject).catch(err => console.error('Error creating Project:', err.message));
  }

  const newInvoice = {
    id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    clientName: lead.company,
    projectName: newProject.name,
    amount: finalValue,
    tax: Math.round(finalValue * 0.18),
    totalAmount: Math.round(finalValue * 1.18),
    status: "Pending",
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  };
  db.invoices.unshift(newInvoice);
  if (isMongoConnected) {
    Invoice.create(newInvoice).catch(err => console.error('Error creating Invoice:', err.message));
  }

  logAuditEvent(agentName, 'CONVERTED_DEAL', `Converted Lead ${id} (${lead.company}) for ₹${finalValue.toLocaleString('en-IN')}`);
  addNotification('🎉 Deal Converted!', `${agentName} converted ${lead.company} for ₹${finalValue.toLocaleString('en-IN')}.`, 'success');

  const commissionAmt = Math.round(finalValue * 0.05);
  res.json({ lead, project: newProject, invoice: newInvoice, commission: commissionAmt });
});

/**
 * @openapi
 * /api/leads/{id}/requirements:
 *   post:
 *     summary: Save client technical requirements scoping (Team B)
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 */
app.post('/api/leads/:id/requirements', authenticateToken, requireRole('ADMIN', 'TEAM_B'), (req, res) => {
  const { id } = req.params;
  const lead = db.leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  const agentName = req.body.agent || req.user.name || 'Team B';
  lead.clientRequirements = {
    clientName: req.body.clientName || lead.name,
    companyName: req.body.companyName || lead.company,
    category: req.body.category || 'Website Development',
    detailedRequirement: req.body.detailedRequirement || '',
    budget: Number(req.body.budget) || lead.estimatedBudget || 0,
    expectedDeliveryDate: req.body.expectedDeliveryDate || '',
    additionalNotes: req.body.additionalNotes || '',
    savedAt: new Date().toISOString(),
    savedBy: agentName
  };

  lead.journey.push({
    timestamp: new Date().toISOString(),
    stage: 'Requirements Locked',
    author: agentName,
    details: `Client requirements scope locked under category: ${lead.clientRequirements.category}`
  });

  if (isMongoConnected) {
    Lead.updateOne({ id }, { clientRequirements: lead.clientRequirements, journey: lead.journey }).catch(err => console.error('Error saving requirements:', err.message));
  }

  logAuditEvent(agentName, 'SCOPED_REQUIREMENTS', `Saved client requirements for Lead ${id}`);
  res.json(lead);
});

/**
 * @openapi
 * /api/leads/{id}/payments:
 *   post:
 *     summary: Record advance deposit payment (Team B)
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 */
app.post('/api/leads/:id/payments', authenticateToken, requireRole('ADMIN', 'TEAM_B'), (req, res) => {
  const { id } = req.params;
  const lead = db.leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  const agentName = req.body.agent || req.user.name || 'Team B';
  lead.paymentDetails = {
    amount: Number(req.body.amount) || 0,
    paymentMethod: req.body.paymentMethod || 'UPI',
    transactionId: req.body.transactionId || `TXN-${Date.now()}`,
    paymentDate: req.body.paymentDate || new Date().toISOString().split('T')[0],
    notes: req.body.notes || 'Advance deposit payment received',
    recordedAt: new Date().toISOString(),
    recordedBy: agentName
  };

  lead.journey.push({
    timestamp: new Date().toISOString(),
    stage: 'Payment Recorded',
    author: agentName,
    details: `Deposit payment of ₹${lead.paymentDetails.amount.toLocaleString('en-IN')} recorded via ${lead.paymentDetails.paymentMethod}`
  });

  if (isMongoConnected) {
    Lead.updateOne({ id }, { paymentDetails: lead.paymentDetails, journey: lead.journey }).catch(err => console.error('Error saving payment:', err.message));
  }

  logAuditEvent(agentName, 'RECORDED_PAYMENT', `Recorded payment of ₹${lead.paymentDetails.amount} for Lead ${id}`);
  res.json(lead);
});

/**
 * @openapi
 * /api/leads/{id}/status:
 *   put:
 *     summary: Update lead status (Selected, Rejected, Waiting)
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 */
app.put('/api/leads/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status, agent } = req.body;
  const lead = db.leads.find(l => l.id === id);
  if (!lead) return res.status(404).json({ error: "Lead not found" });

  const agentName = agent || req.user.name || 'System';
  lead.status = status || lead.status;
  lead.journey.push({
    timestamp: new Date().toISOString(),
    stage: lead.status,
    author: agentName,
    details: `Lead status updated to ${lead.status}`
  });

  if (isMongoConnected) {
    Lead.updateOne({ id }, { status: lead.status, journey: lead.journey }).catch(err => console.error('Error updating status:', err.message));
  }

  res.json(lead);
});

/**
 * @openapi
 * /api/projects/{id}/progress:
 *   put:
 *     summary: Update project progress slider % and status (Team C / Execution)
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 */
app.put('/api/projects/:id/progress', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { progress, status, agent } = req.body;
  const project = db.projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });

  if (typeof progress === 'number') project.progress = progress;
  if (status) project.status = status;

  if (isMongoConnected) {
    Project.updateOne({ id }, { progress: project.progress, status: project.status }).catch(err => console.error('Error updating project progress:', err.message));
  }

  logAuditEvent(agent || req.user.name || 'Team C', 'UPDATED_PROJECT_PROGRESS', `Updated progress for project ${id} to ${project.progress}%`);
  res.json(project);
});

/**
 * @openapi
 * /api/projects/{id}/notes:
 *   post:
 *     summary: Add technical execution note to project (Team C)
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 */
app.post('/api/projects/:id/notes', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { text, author } = req.body;
  const project = db.projects.find(p => p.id === id);
  if (!project) return res.status(404).json({ error: "Project not found" });

  project.notesList = project.notesList || [];
  const newNote = {
    id: `note_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    author: author || req.user.name || 'Developer',
    text: (text || '').trim()
  };
  project.notesList.push(newNote);

  if (isMongoConnected) {
    Project.updateOne({ id }, { notesList: project.notesList }).catch(err => console.error('Error adding project note:', err.message));
  }

  res.status(201).json(newNote);
});

// ----------------------------------------------------
// TEAMS, COMMISSIONS, FINANCIALS, TASKS, TIME TRACKING
// ----------------------------------------------------

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users/team members
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user objects.
 */
app.get('/api/users', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const safeUsers = db.users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               team:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully.
 */
app.post('/api/users', authenticateToken, async (req, res) => {
  const rawPass = req.body.password || 'Password123';
  const hashedPassword = await bcrypt.hash(rawPass, 10);

  const newUser = {
    id: req.body.id || `usr_${Date.now()}`,
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name,
    role: req.body.role || 'TEAM_A',
    team: req.body.team || 'TEAM_A',
    avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: req.body.status || 'active',
    performanceScore: Number(req.body.performanceScore) || 85,
    leadsSubmitted: 0,
    conversions: 0,
    callsCompleted: 0,
    qualifiedLeads: 0,
    earnedCommission: 0
  };
  db.users.push(newUser);
  if (isMongoConnected) {
    User.create(newUser).catch(err => console.error('Error creating User:', err.message));
  }
  logAuditEvent(req.user.name || 'Admin', 'CREATED_USER', `Created user ${newUser.name} (${newUser.role})`);

  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated user profile.
 */
app.put('/api/users/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  const { id } = req.params;
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  const updateData = { ...req.body };
  if (updateData.password && !updateData.password.startsWith('$2a$') && !updateData.password.startsWith('$2b$')) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  db.users[index] = { ...db.users[index], ...updateData };
  if (isMongoConnected) {
    User.updateOne({ id }, db.users[index]).catch(err => console.error('Error updating User:', err.message));
  }
  logAuditEvent(req.user.name || 'Admin', 'UPDATED_USER', `Updated user ${db.users[index].name}`);
  
  const { password: _, ...safeUser } = db.users[index];
  res.json(safeUser);
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 */
app.delete('/api/users/:id', authenticateToken, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const index = db.users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: "User not found" });

  const deletedUser = db.users.splice(index, 1)[0];
  if (isMongoConnected) {
    User.deleteOne({ id }).catch(err => console.error('Error deleting User:', err.message));
  }
  logAuditEvent(req.user.name || 'Admin', 'DELETED_USER', `Deleted user ${deletedUser.name}`);

  const { password: _, ...safeUser } = deletedUser;
  res.json({ message: "User deleted successfully", user: safeUser });
});

/**
 * @openapi
 * /api/leads/{id}:
 *   put:
 *     summary: Update lead information
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated lead details.
 */
app.put('/api/leads/:id', authenticateToken, requireRole('ADMIN', 'TEAM_A'), async (req, res) => {
  try {
    const { id } = req.params;
    const index = db.leads.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ error: "Lead not found" });

    db.leads[index] = { ...db.leads[index], ...req.body };
    if (isMongoConnected) {
      await Lead.updateOne({ id }, db.leads[index]);
    }
    logAuditEvent(req.user?.name || 'Admin', 'UPDATED_LEAD', `Updated lead ${id}`);
    res.json(db.leads[index]);
  } catch (err) {
    console.error('Error updating Lead:', err.message);
    res.status(500).json({ error: 'Failed to update lead', details: err.message });
  }
});

/**
 * @openapi
 * /api/leads/{id}:
 *   delete:
 *     summary: Delete a lead
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead deleted successfully.
 */
app.delete('/api/leads/:id', authenticateToken, requireRole('ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const index = db.leads.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ error: "Lead not found" });

    const deletedLead = db.leads.splice(index, 1)[0];
    if (isMongoConnected) {
      await Lead.deleteOne({ id });
    }
    logAuditEvent(req.user?.name || 'Admin', 'DELETED_LEAD', `Deleted lead ${id}`);
    res.json({ message: "Lead deleted successfully", lead: deletedLead });
  } catch (err) {
    console.error('Error deleting Lead:', err.message);
    res.status(500).json({ error: 'Failed to delete lead', details: err.message });
  }
});

/**
 * @openapi
 * /api/commission-rules:
 *   get:
 *     summary: Get team commission rules and rates
 *     tags:
 *       - Commission Rules
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current commission rules structure.
 */
app.get('/api/commission-rules', authenticateToken, requireRole('ADMIN'), (req, res) => res.json(db.commissionRules));

/**
 * @openapi
 * /api/commission-rules:
 *   put:
 *     summary: Update team commission rules
 *     tags:
 *       - Commission Rules
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated commission rules.
 */
app.put('/api/commission-rules', authenticateToken, requireRole('ADMIN'), (req, res) => {
  db.commissionRules = { ...db.commissionRules, ...req.body };
  if (isMongoConnected) {
    CommissionRule.updateOne({}, db.commissionRules, { upsert: true }).catch(err => console.error('Error updating CommissionRule:', err.message));
  }
  logAuditEvent(req.user.name || 'Admin', 'UPDATED_COMMISSION_RULES', 'Updated team commission parameters');
  res.json(db.commissionRules);
});

/**
 * @openapi
 * /api/clients:
 *   get:
 *     summary: Get all clients
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of client records.
 */
app.get('/api/clients', authenticateToken, (req, res) => res.json(db.clients));

/**
 * @openapi
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of project objects.
 */
app.get('/api/projects', authenticateToken, (req, res) => res.json(db.projects));

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of task items.
 */
app.get('/api/tasks', authenticateToken, (req, res) => res.json(db.tasks));

/**
 * @openapi
 * /api/tasks/{id}/status:
 *   put:
 *     summary: Update task execution status
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated task object.
 */
app.put('/api/tasks/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = db.tasks.find(t => t.id === id);
  if (task) {
    task.status = status;
    if (isMongoConnected) {
      Task.updateOne({ id }, { status }).catch(err => console.error('Error updating Task:', err.message));
    }
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

/**
 * @openapi
 * /api/time-entries:
 *   get:
 *     summary: Get logged time entries
 *     tags:
 *       - Time Entries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of logged time entries.
 */
app.get('/api/time-entries', authenticateToken, (req, res) => res.json(db.timeEntries));

/**
 * @openapi
 * /api/time-entries:
 *   post:
 *     summary: Log a new time entry
 *     tags:
 *       - Time Entries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Time entry created successfully.
 */
app.post('/api/time-entries', authenticateToken, (req, res) => {
  const entry = { id: `time_${Date.now()}`, member: req.user.name, ...req.body };
  db.timeEntries.unshift(entry);
  if (isMongoConnected) {
    TimeEntry.create(entry).catch(err => console.error('Error saving TimeEntry:', err.message));
  }
  res.status(201).json(entry);
});

/**
 * @openapi
 * /api/invoices:
 *   get:
 *     summary: Get all billing invoices
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invoices.
 */
app.get('/api/invoices', authenticateToken, (req, res) => res.json(db.invoices));

/**
 * @openapi
 * /api/audit-logs:
 *   get:
 *     summary: Get system audit logs
 *     tags:
 *       - Audit Logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System audit trail logs.
 */
app.get('/api/audit-logs', authenticateToken, requireRole('ADMIN'), (req, res) => res.json(db.auditLogs));

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User notifications list.
 */
app.get('/api/notifications', authenticateToken, (req, res) => res.json(db.notifications));

/**
 * @openapi
 * /api/ai/predict:
 *   get:
 *     summary: Get AI insights and lead conversion predictions
 *     tags:
 *       - AI Insights
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Predictive metrics, high-priority lead IDs, and recommendations.
 */
app.get('/api/ai/predict', authenticateToken, (req, res) => {
  res.json({
    highPriorityLeads: db.leads.filter(l => l.estimatedBudget >= 200000 || l.priority === 'URGENT').map(l => l.id),
    recommendedTeam: "Team B - Rahul M",
    conversionProbability: 84.6,
    performanceInsight: "Closing rate increases when follow-ups occur within 24 hours."
  });
});

// Start Server and Initialize Database
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`⚡ ZENTRIX Express API Backend running on port ${PORT}`);
  await initDatabase();
});

