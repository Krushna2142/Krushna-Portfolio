require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const constants = require('./config/constants');
const supabase = require('./config/supabase');

// ─── Initialize App ───────────────────────────────────────────
const app = express();

app.set('trust proxy', true); 

// ─── Verify Supabase Connection ───────────────────────────────
(async () => {
  try {
    const { data, error } = await supabase.from('admins').select('id').limit(1);
    if (error) {
      console.error('❌ Supabase Connection Error:', error.message);
      process.exit(1);
    }
    console.log('✅ Supabase Connected Successfully');
  } catch (error) {
    console.error('❌ Supabase Connection Error:', error.message);
    process.exit(1);
  }
})();

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: [
    constants.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: constants.RATE_LIMIT_WINDOW_MS,
  max: constants.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});
app.use('/api/', limiter);



// ─── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ──────────────────────────────────────────────────
if (constants.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Krushna Portfolio API is live',
    version: '1.0.0',
    environment: constants.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', async (req, res) => {
  try {
    // Check Supabase connection
    const { error } = await supabase.from('admins').select('id').limit(1);
    
    res.json({
      success: true,
      status: error ? 'degraded' : 'healthy',
      database: error ? 'disconnected' : 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: err.message,
    });
  }
});

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/skills', require('./routes/skill.routes'));
app.use('/api/certifications', require('./routes/cert.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/config', require('./routes/config.routes'));

// ─── 404 Handler ──────────────────────────────────────────────
app.use('*path', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(constants.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = constants.PORT;
app.listen(PORT, () => {
  console.log('\n────────────────────────────────────────');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${constants.NODE_ENV}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log('🗄️  Database: Supabase PostgreSQL');
  console.log('────────────────────────────────────────\n');
});

module.exports = app;