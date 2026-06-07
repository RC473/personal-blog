// ── Supabase 配置 ──────────────────────────────────
const SUPABASE_URL = 'https://gqwxslartbdvfjgxcmye.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxd3hzbGFydGJkdmZqZ3hjbXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjQyODUsImV4cCI6MjA5NjI0MDI4NX0.6domkvEQg1gdfRWDf0SqhIBwgCBPs3lEH0xxCS4gBU8';

// 后台管理员账号（明文存储，仅供个人使用）
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// ── 通用请求头 ─────────────────────────────────────
function getHeaders(extra = {}) {
  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...extra
  };
}

// ── 文章 API ───────────────────────────────────────
const PostsAPI = {
  async list() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?order=created_at.desc`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getById(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    const rows = await res.json();
    return rows[0] || null;
  },

  async create(post) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async update(id, post) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders({ 'Prefer': '' })
    });
    if (!res.ok) throw new Error(await res.text());
  }
};

// ── 评论 API ───────────────────────────────────────
const CommentsAPI = {
  async listByPost(postId) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?post_id=eq.${postId}&order=created_at.asc`,
      { headers: getHeaders() }
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async listAll() {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?order=created_at.desc`,
      { headers: getHeaders() }
    );
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async create(comment) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(comment)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async delete(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/comments?id=eq.${id}`, {
      method: 'DELETE',
      headers: getHeaders({ 'Prefer': '' })
    });
    if (!res.ok) throw new Error(await res.text());
  }
};

// ── Storage API ────────────────────────────────────
const BUCKET = 'blog-files';
const StorageAPI = {
  async list() {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ prefix: '', limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
    });
    return res.json();
  },

  async delete(name) {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  getPublicUrl(name) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(name)}`;
  }
};
