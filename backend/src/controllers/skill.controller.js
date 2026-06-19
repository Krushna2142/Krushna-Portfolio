const dbService = require('../services/db.service');
const supabase = require('../config/supabase');

const mapSkillToDb = (data) => ({
  name: data.name,
  category: data.category,
  proficiency: data.proficiency || 80,
  icon: data.icon || null,
  color: data.color || '#00e5ff',
  level: data.level || 'Advanced',
  years_experience: data.yearsExperience || 1,
  description: data.description || null,
  link_url: data.linkUrl || null,
  featured: data.featured !== undefined ? data.featured : false,
  visible: data.visible !== undefined ? data.visible : true,
  order_index: data.order !== undefined ? data.order : 0,
  marquee_row: data.marqueeRow || 1,
});

const mapDbToSkill = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  proficiency: row.proficiency,
  icon: row.icon,
  color: row.color || '#00e5ff',
  level: row.level || 'Advanced',
  yearsExperience: row.years_experience || 1,
  description: row.description,
  linkUrl: row.link_url,
  featured: row.featured || false,
  visible: row.visible,
  order: row.order_index,
  marqueeRow: row.marquee_row || 1,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

// Category mapping
const mapCategoryToDb = (data) => ({
  name: data.name,
  icon: data.icon || '⚡',
  color: data.color || '#00e5ff',
  description: data.description || null,
  visible: data.visible !== undefined ? data.visible : true,
  order_index: data.order !== undefined ? data.order : 0,
});

const mapDbToCategory = (row) => ({
  id: row.id,
  name: row.name,
  icon: row.icon,
  color: row.color,
  description: row.description,
  visible: row.visible,
  order: row.order_index,
});

exports.getAll = async (req, res) => {
  try {
    const skills = await dbService.findAll('skills', { 
      filter: { visible: true },
      sort: 'category',
      order: 'asc'
    });
    res.json({ success: true, data: skills.map(mapDbToSkill) });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.adminGetAll = async (req, res) => {
  try {
    const skills = await dbService.findAll('skills', { 
      sort: 'category',
      order: 'asc'
    });
    res.json({ success: true, data: skills.map(mapDbToSkill) });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.create = async (req, res) => {
  try {
    const skill = await dbService.create('skills', mapSkillToDb(req.body));
    res.status(201).json({ success: true, data: mapDbToSkill(skill) });
  } catch (err) { 
    console.error('Skill create error:', err);
    res.status(400).json({ success: false, message: err.message }); 
  }
};

exports.update = async (req, res) => {
  try {
    const skill = await dbService.update('skills', req.params.id, mapSkillToDb(req.body));
    res.json({ success: true, data: mapDbToSkill(skill) });
  } catch (err) { 
    res.status(400).json({ success: false, message: err.message }); 
  }
};

exports.remove = async (req, res) => {
  try {
    await dbService.delete('skills', req.params.id);
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

// === CATEGORY ENDPOINTS ===
exports.getCategories = async (req, res) => {
  try {
    const categories = await dbService.findAll('skill_categories', { 
      filter: { visible: true },
      sort: 'order_index',
      order: 'asc'
    });
    res.json({ success: true, data: categories.map(mapDbToCategory) });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.adminGetCategories = async (req, res) => {
  try {
    const categories = await dbService.findAll('skill_categories', { 
      sort: 'order_index',
      order: 'asc'
    });
    res.json({ success: true, data: categories.map(mapDbToCategory) });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await dbService.create('skill_categories', mapCategoryToDb(req.body));
    res.status(201).json({ success: true, data: mapDbToCategory(category) });
  } catch (err) { 
    res.status(400).json({ success: false, message: err.message }); 
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await dbService.update('skill_categories', req.params.id, mapCategoryToDb(req.body));
    res.json({ success: true, data: mapDbToCategory(category) });
  } catch (err) { 
    res.status(400).json({ success: false, message: err.message }); 
  }
};

exports.removeCategory = async (req, res) => {
  try {
    await dbService.delete('skill_categories', req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};