const supabase = require('../config/supabase');

const dbService = {
  create: async (table, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  findAll: async (table, { filter = {}, sort = 'created_at', order = 'desc', limit = null } = {}) => {
    let query = supabase.from(table).select('*');
    
    Object.entries(filter).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        query = query.in(key, value);
      } else if (typeof value === 'object' && value.$gte) {
        query = query.gte(key, value.$gte);
      } else {
        query = query.eq(key, value);
      }
    });
    
    query = query.order(sort, { ascending: order === 'asc' });
    if (limit) query = query.limit(limit);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  findById: async (table, id) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  update: async (table, id, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  delete: async (table, id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  count: async (table, filter = {}) => {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    
    Object.entries(filter).forEach(([key, value]) => {
      if (typeof value === 'object' && value.$gte) {
        query = query.gte(key, value.$gte);
      } else {
        query = query.eq(key, value);
      }
    });
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  // FIXED: Proper analytics aggregation for Supabase
  getAnalyticsDashboard: async () => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Total visits
    const { count: totalVisits } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true });

    // Today visits
    const { count: todayVisits } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart);

    // Device breakdown
    const { data: deviceData } = await supabase
      .from('analytics')
      .select('device')
      .eq('device', 'desktop');
    const { data: mobileData } = await supabase
      .from('analytics')
      .select('device')
      .eq('device', 'mobile');
    const { data: tabletData } = await supabase
      .from('analytics')
      .select('device')
      .eq('device', 'tablet');

    const deviceBreakdown = {
      desktop: deviceData?.length || 0,
      mobile: mobileData?.length || 0,
      tablet: tabletData?.length || 0,
    };

    // Top pages - fetch all and aggregate in memory
    const { data: allAnalytics } = await supabase
      .from('analytics')
      .select('page')
      .order('created_at', { ascending: false })
      .limit(1000);

    const pageCounts = {};
    (allAnalytics || []).forEach(a => {
      pageCounts[a.page] = (pageCounts[a.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Visits by day (last 30 days)
    const { data: last30Data } = await supabase
      .from('analytics')
      .select('created_at')
      .gte('created_at', last30);

    const dayCounts = {};
    (last30Data || []).forEach(a => {
      const day = new Date(a.created_at).toISOString().split('T')[0];
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const visitsByDay = Object.entries(dayCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalVisits: totalVisits || 0,
      todayVisits: todayVisits || 0,
      deviceBreakdown,
      topPages,
      visitsByDay,
    };
  },

  // FIXED: Get all configs as key-value object
  getAllConfigs: async () => {
    const { data, error } = await supabase.from('site_configs').select('*');
    if (error) throw error;
    const result = {};
    (data || []).forEach(c => { result[c.key] = c.value; });
    return result;
  },

  updateConfig: async (key, value) => {
    const { data: existing } = await supabase
      .from('site_configs')
      .select()
      .eq('key', key)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('site_configs')
        .update({ value })
        .eq('key', key)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('site_configs')
        .insert({ key, value })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },
};

module.exports = dbService;