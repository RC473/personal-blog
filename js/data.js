// 文章数据层 —— 从 Supabase 读取（依赖 supabase.js）
// 保留原有函数名以兼容 main.js

let blogPosts = [];

async function loadBlogPosts() {
  try {
    blogPosts = await PostsAPI.list();
  } catch (e) {
    console.error('加载文章失败：', e);
    blogPosts = [];
  }
  return blogPosts;
}

function getAllCategories() {
  const categories = new Set();
  blogPosts.forEach(post => categories.add(post.category));
  return Array.from(categories).filter(Boolean);
}

function getAllTags() {
  const tags = new Set();
  blogPosts.forEach(post => (post.tags || []).forEach(tag => tags.add(tag)));
  return Array.from(tags);
}

function getPostsByCategory(category) {
  return blogPosts.filter(post => post.category === category);
}

function getPostsByTag(tag) {
  return blogPosts.filter(post => (post.tags || []).includes(tag));
}

function searchPosts(query) {
  const lowerQuery = query.toLowerCase();
  return blogPosts.filter(post =>
    post.title?.toLowerCase().includes(lowerQuery) ||
    post.excerpt?.toLowerCase().includes(lowerQuery) ||
    post.content?.toLowerCase().includes(lowerQuery) ||
    (post.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

function getPostById(id) {
  return blogPosts.find(post => post.id === parseInt(id));
}

function getRelatedPosts(postId, limit = 3) {
  const post = getPostById(postId);
  if (!post) return [];
  return blogPosts
    .filter(p => p.id !== parseInt(postId))
    .filter(p => (p.tags || []).some(tag => (post.tags || []).includes(tag)))
    .slice(0, limit);
}
