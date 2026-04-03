require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin.model');
const Skill = require('../models/Skill.model');
const Certification = require('../models/Certification.model');
const Project = require('../models/Project.model');
const SiteConfig = require('../models/SiteConfig.model');

const SKILLS = [
  // Frontend
  { name: 'React.js', category: 'Frontend', proficiency: 90 },
  { name: 'Next.js', category: 'Frontend', proficiency: 85 },
  { name: 'TypeScript', category: 'Frontend', proficiency: 80 },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 92 },
  { name: 'HTML', category: 'Frontend', proficiency: 95 },
  { name: 'CSS / SASS', category: 'Frontend', proficiency: 90 },
  { name: 'Redux.js', category: 'Frontend', proficiency: 78 },
  { name: 'Framer Motion', category: 'Frontend', proficiency: 75 },
  { name: 'Flutter', category: 'Mobile', proficiency: 80 },
  { name: 'React Native', category: 'Mobile', proficiency: 75 },
  // Backend
  { name: 'Node.js', category: 'Backend', proficiency: 88 },
  { name: 'Express.js', category: 'Backend', proficiency: 88 },
  { name: 'Spring Boot', category: 'Backend', proficiency: 80 },
  { name: 'FastAPI', category: 'Backend', proficiency: 78 },
  { name: 'Django', category: 'Backend', proficiency: 75 },
  { name: 'Flask', category: 'Backend', proficiency: 78 },
  // Languages
  { name: 'JavaScript', category: 'Languages', proficiency: 92 },
  { name: 'Java', category: 'Languages', proficiency: 85 },
  { name: 'Python', category: 'Languages', proficiency: 85 },
  { name: 'C++', category: 'Languages', proficiency: 75 },
  // Database
  { name: 'MongoDB', category: 'Database', proficiency: 85 },
  { name: 'PostgreSQL', category: 'Database', proficiency: 78 },
  { name: 'Firebase', category: 'Database', proficiency: 80 },
  { name: 'SQL', category: 'Database', proficiency: 80 },
  // DevOps
  { name: 'Docker', category: 'DevOps', proficiency: 78 },
  { name: 'Git / GitHub', category: 'DevOps', proficiency: 90 },
  { name: 'AWS', category: 'DevOps', proficiency: 72 },
  { name: 'GCP', category: 'DevOps', proficiency: 70 },
  // AI/ML
  { name: 'OpenAI API', category: 'AI/ML', proficiency: 85 },
  { name: 'LLM / Agentic AI', category: 'AI/ML', proficiency: 82 },
  { name: 'Machine Learning', category: 'AI/ML', proficiency: 78 },
  { name: 'NLP', category: 'AI/ML', proficiency: 75 },
  { name: 'Spring AI', category: 'AI/ML', proficiency: 72 },
  // Tools
  { name: 'Figma', category: 'Tools', proficiency: 80 },
  { name: 'Postman', category: 'Tools', proficiency: 88 },
  { name: 'Jira', category: 'Tools', proficiency: 78 },
  { name: 'Linux', category: 'Tools', proficiency: 80 },
];

const CERTIFICATIONS = [
  {
    title: 'Artificial Intelligence Fundamentals',
    issuer: 'IBM / Coursera',
    credentialUrl: '',
    visible: true,
  },
  {
    title: 'Google AI Essentials',
    issuer: 'Google',
    credentialUrl: '',
    visible: true,
  },
  {
    title: 'Deloitte Australia - Data Analytics Job Simulation',
    issuer: 'Deloitte / Forage',
    credentialUrl: '',
    visible: true,
  },
];

const PROJECTS = [
  {
    title: 'JobCrawler.ai',
    description: 'Agentic AI system for job hunting — resume parsing, job crawling, semantic matching, skill gap detection, and adaptive mock interviews.',
    techStack: ['Python', 'FastAPI', 'OpenAI API', 'MongoDB', 'React.js', 'Docker', 'GCP'],
    category: 'AI',
    featured: true,
    liveUrl: '',
    githubUrl: '',
  },
  {
    title: 'AI Powered Intelligent Workflow Automation Platform',
    description: 'Enterprise-grade workflow automation platform powered by AI agents capable of reasoning, planning, and executing multi-step business tasks.',
    techStack: ['Next.js', 'Node.js', 'OpenAI API', 'MongoDB', 'Docker', 'AWS'],
    category: 'AI',
    featured: true,
    liveUrl: '',
    githubUrl: '',
  },
  {
    title: 'AI-Powered Customer Query Ticketing Assistant',
    description: 'Intelligent ticketing system with NLP-based query classification, automated routing, and AI-assisted response generation.',
    techStack: ['Java', 'Spring Boot', 'FastAPI', 'MongoDB', 'React.js'],
    category: 'AI',
    featured: true,
    liveUrl: '',
    githubUrl: '',
  },
  {
    title: 'Library Management System',
    description: 'Full-featured library management system with book tracking, member management, and fine calculation.',
    techStack: ['Java', 'React Native', 'MongoDB', 'AWS'],
    category: 'Backend',
    featured: false,
    liveUrl: '',
    githubUrl: '',
  },
];

const SITE_CONFIG = [
  { key: 'hero_visible', value: true, description: 'Toggle Hero section' },
  { key: 'about_visible', value: true, description: 'Toggle About section' },
  { key: 'skills_visible', value: true, description: 'Toggle Skills section' },
  { key: 'projects_visible', value: true, description: 'Toggle Projects section' },
  { key: 'certifications_visible', value: true, description: 'Toggle Certifications section' },
  { key: 'contact_visible', value: true, description: 'Toggle Contact section' },
  { key: 'site_name', value: 'Krushna Pokharkar', description: 'Portfolio owner name' },
  { key: 'site_tagline', value: 'Full-Stack Developer | Agentic AI Engineer', description: 'Hero tagline' },
  { key: 'maintenance_mode', value: false, description: 'Put site in maintenance mode' },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected — seeding database...');

  // Admin
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    console.log('✅ Admin created');
  }

  // Skills
  await Skill.deleteMany({});
  await Skill.insertMany(SKILLS.map((s, i) => ({ ...s, order: i })));
  console.log(`✅ ${SKILLS.length} skills seeded`);

  // Certifications
  await Certification.deleteMany({});
  await Certification.insertMany(CERTIFICATIONS.map((c, i) => ({ ...c, order: i })));
  console.log(`✅ ${CERTIFICATIONS.length} certifications seeded`);

  // Projects
  await Project.deleteMany({});
  await Project.insertMany(PROJECTS.map((p, i) => ({ ...p, order: i })));
  console.log(`✅ ${PROJECTS.length} projects seeded`);

  // Site Config
  for (const config of SITE_CONFIG) {
    await SiteConfig.findOneAndUpdate(
      { key: config.key },
      config,
      { upsert: true, new: true }
    );
  }
  console.log('✅ Site config seeded');

  console.log('\n🎉 Database seeded successfully');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});