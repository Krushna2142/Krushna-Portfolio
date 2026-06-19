require('dotenv').config();
const bcrypt = require('bcryptjs');
const dbService = require('./db.service');
const supabase = require('../config/supabase');

const SKILLS = [
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
  { name: 'Node.js', category: 'Backend', proficiency: 88 },
  { name: 'Express.js', category: 'Backend', proficiency: 88 },
  { name: 'Spring Boot', category: 'Backend', proficiency: 80 },
  { name: 'FastAPI', category: 'Backend', proficiency: 78 },
  { name: 'Django', category: 'Backend', proficiency: 75 },
  { name: 'Flask', category: 'Backend', proficiency: 78 },
  { name: 'JavaScript', category: 'Languages', proficiency: 92 },
  { name: 'Java', category: 'Languages', proficiency: 85 },
  { name: 'Python', category: 'Languages', proficiency: 85 },
  { name: 'C++', category: 'Languages', proficiency: 75 },
  { name: 'MongoDB', category: 'Database', proficiency: 85 },
  { name: 'PostgreSQL', category: 'Database', proficiency: 78 },
  { name: 'Firebase', category: 'Database', proficiency: 80 },
  { name: 'SQL', category: 'Database', proficiency: 80 },
  { name: 'Docker', category: 'DevOps', proficiency: 78 },
  { name: 'Git / GitHub', category: 'DevOps', proficiency: 90 },
  { name: 'AWS', category: 'DevOps', proficiency: 72 },
  { name: 'GCP', category: 'DevOps', proficiency: 70 },
  { name: 'OpenAI API', category: 'AI/ML', proficiency: 85 },
  { name: 'LLM / Agentic AI', category: 'AI/ML', proficiency: 82 },
  { name: 'Machine Learning', category: 'AI/ML', proficiency: 78 },
  { name: 'NLP', category: 'AI/ML', proficiency: 75 },
  { name: 'Spring AI', category: 'AI/ML', proficiency: 72 },
  { name: 'Figma', category: 'Tools', proficiency: 80 },
  { name: 'Postman', category: 'Tools', proficiency: 88 },
  { name: 'Jira', category: 'Tools', proficiency: 78 },
  { name: 'Linux', category: 'Tools', proficiency: 80 },
];

const CERTIFICATIONS = [
  {
    title: 'Artificial Intelligence Fundamentals',
    issuer: 'IBM / Coursera',
    credential_url: '',
    visible: true,
  },
  {
    title: 'Google AI Essentials',
    issuer: 'Google',
    credential_url: '',
    visible: true,
  },
  {
    title: 'Deloitte Australia - Data Analytics Job Simulation',
    issuer: 'Deloitte / Forage',
    credential_url: '',
    visible: true,
  },
];

const PROJECTS = [
  {
    title: 'JobCrawler.ai',
    description: 'Agentic AI system for job hunting — resume parsing, job crawling, semantic matching, skill gap detection, and adaptive mock interviews.',
    tech_stack: ['Python', 'FastAPI', 'OpenAI API', 'MongoDB', 'React.js', 'Docker', 'GCP'],
    category: 'AI',
    featured: true,
    live_url: '',
    github_url: '',
  },
  {
    title: 'AI Powered Intelligent Workflow Automation Platform',
    description: 'Enterprise-grade workflow automation platform powered by AI agents capable of reasoning, planning, and executing multi-step business tasks.',
    tech_stack: ['Next.js', 'Node.js', 'OpenAI API', 'MongoDB', 'Docker', 'AWS'],
    category: 'AI',
    featured: true,
    live_url: '',
    github_url: '',
  },
  {
    title: 'AI-Powered Customer Query Ticketing Assistant',
    description: 'Intelligent ticketing system with NLP-based query classification, automated routing, and AI-assisted response generation.',
    tech_stack: ['Java', 'Spring Boot', 'FastAPI', 'MongoDB', 'React.js'],
    category: 'AI',
    featured: true,
    live_url: '',
    github_url: '',
  },
  {
    title: 'Library Management System',
    description: 'Full-featured library management system with book tracking, member management, and fine calculation.',
    tech_stack: ['Java', 'React Native', 'MongoDB', 'AWS'],
    category: 'Backend',
    featured: false,
    live_url: '',
    github_url: '',
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
  console.log('🌱 Starting seed process...\n');

  // Admin
  const existingAdmins = await dbService.findAll('admins', { filter: { email: process.env.ADMIN_EMAIL } });
  if (existingAdmins.length === 0) {
    const password_hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await dbService.create('admins', {
      email: process.env.ADMIN_EMAIL,
      password_hash,
    });
    console.log('✅ Admin created');
  }

  // Skills
  await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const skillsWithOrder = SKILLS.map((s, i) => ({ ...s, order_index: i }));
  await supabase.from('skills').insert(skillsWithOrder);
  console.log(`✅ ${SKILLS.length} skills seeded`);

  // Certifications
  await supabase.from('certifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const certsWithOrder = CERTIFICATIONS.map((c, i) => ({ ...c, order_index: i }));
  await supabase.from('certifications').insert(certsWithOrder);
  console.log(`✅ ${CERTIFICATIONS.length} certifications seeded`);

  // Projects
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const projectsWithOrder = PROJECTS.map((p, i) => ({ ...p, order_index: i }));
  await supabase.from('projects').insert(projectsWithOrder);
  console.log(`✅ ${PROJECTS.length} projects seeded`);

  // Site Config
  for (const config of SITE_CONFIG) {
    const { data: existing } = await supabase
      .from('site_configs')
      .select()
      .eq('key', config.key)
      .single();
    
    if (existing) {
      await dbService.update('site_configs', existing.id, config);
    } else {
      await dbService.create('site_configs', config);
    }
  }
  console.log('✅ Site config seeded');

  console.log('\n🎉 Database seeded successfully');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});