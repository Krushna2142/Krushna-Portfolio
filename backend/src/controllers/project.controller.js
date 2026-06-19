const dbService = require('../services/db.service');

const mapProjectToDb = (data) => ({
  title: data.title,
  description: data.description,
  long_description: data.longDescription || null,
  tech_stack: data.techStack || [],
  category: data.category || 'Web',
  thumbnail: data.thumbnail || null,
  images: data.images || [],
  live_url: data.liveUrl || null,
  github_url: data.githubUrl || null,
  featured: data.featured !== undefined ? data.featured : false,
  visible: data.visible !== undefined ? data.visible : true,
  order_index: data.order !== undefined ? data.order : 0,
});

const mapDbToProject = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  longDescription: row.long_description,
  techStack: row.tech_stack || [],
  category: row.category,
  thumbnail: row.thumbnail,
  images: row.images || [],
  liveUrl: row.live_url,
  githubUrl: row.github_url,
  featured: row.featured,
  visible: row.visible,
  order: row.order_index,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

exports.getAll = async (req, res) => {
  try {
    const projects = await dbService.findAll('projects', { 
      filter: { visible: true },
      sort: 'order_index',
      order: 'asc'
    });
    res.json({ success: true, data: projects.map(mapDbToProject) });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.adminGetAll = async (req, res) => {
  try {
    const projects = await dbService.findAll('projects', { 
      sort: 'order_index',
      order: 'asc'
    });
    res.json({ success: true, data: projects.map(mapDbToProject) });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};

exports.create = async (req, res) => {
  try {
    const project = await dbService.create('projects', mapProjectToDb(req.body));
    res.status(201).json({ success: true, data: mapDbToProject(project) });
  } catch (err) { 
    console.error('Project create error:', err);
    res.status(400).json({ success: false, message: err.message }); 
  }
};

exports.update = async (req, res) => {
  try {
    const project = await dbService.update('projects', req.params.id, mapProjectToDb(req.body));
    res.json({ success: true, data: mapDbToProject(project) });
  } catch (err) { 
    res.status(400).json({ success: false, message: err.message }); 
  }
};

exports.remove = async (req, res) => {
  try {
    await dbService.delete('projects', req.params.id);
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) { 
    res.status(500).json({ success: false, message: err.message }); 
  }
};