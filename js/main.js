// 主页面逻辑（文章数据从 Supabase 读取）

document.addEventListener('DOMContentLoaded', async function () {
  // 显示加载中
  document.getElementById('posts-list').innerHTML = '<p style="text-align:center;color:#a0aec0;padding:40px">加载中...</p>';

  await loadBlogPosts();

  // 检查 URL 参数（从文章页跳回时带 tag）
  const urlParams = new URLSearchParams(window.location.search);
  const tagFilter = urlParams.get('tag');
  if (tagFilter) {
    renderPosts(getPostsByTag(decodeURIComponent(tagFilter)));
  } else {
    renderPosts(blogPosts);
  }

  renderCategories();
  renderTagsCloud();
  attachEventListeners();
});

function renderPosts(posts) {
  const postsList = document.getElementById('posts-list');
  const noPosts = document.getElementById('no-posts');

  if (posts.length === 0) {
    postsList.innerHTML = '';
    noPosts.style.display = 'block';
    return;
  }

  noPosts.style.display = 'none';
  postsList.innerHTML = posts.map(post => `
    <div class="post-card" onclick="goToPost(${post.id})">
      <h2>${escapeHtml(post.title)}</h2>
      <div class="post-meta">
        <span>📅 ${formatDate(post.created_at || post.date)}</span>
        <span>📂 ${escapeHtml(post.category || '')}</span>
      </div>
      <p class="post-excerpt">${escapeHtml(post.excerpt || '')}</p>
      <div class="post-footer">
        <div class="post-tags">
          ${(post.tags || []).map(tag => `<span class="post-tag">#${escapeHtml(tag)}</span>`).join('')}
        </div>
        <a href="#" class="read-more">阅读全文 →</a>
      </div>
    </div>
  `).join('');
}

function renderCategories() {
  const categoriesList = document.getElementById('categories-list');
  const categories = getAllCategories();
  categoriesList.innerHTML = categories.map(category => {
    const count = getPostsByCategory(category).length;
    return `
      <li>
        <a href="#" onclick="filterByCategory('${escapeHtml(category)}'); return false;">
          <span>${escapeHtml(category)}</span>
          <span class="category-count">${count}</span>
        </a>
      </li>
    `;
  }).join('');
}

function renderTagsCloud() {
  const tagsCloud = document.getElementById('tags-cloud');
  const tags = getAllTags();
  tagsCloud.innerHTML = tags.map(tag =>
    `<span class="tag" onclick="filterByTag('${escapeHtml(tag)}')">#${escapeHtml(tag)}</span>`
  ).join('');
}

function attachEventListeners() {
  document.getElementById('search-btn').addEventListener('click', performSearch);
  document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') performSearch();
  });
  document.getElementById('categories-link').addEventListener('click', function (e) {
    e.preventDefault(); showCategoriesModal();
  });
  document.getElementById('tags-link').addEventListener('click', function (e) {
    e.preventDefault(); showTagsModal();
  });
  document.getElementById('about-link').addEventListener('click', function (e) {
    e.preventDefault();
    alert('这是一个现代化的静态个人博客。\n\n功能特性：\n• 文章分类和标签\n• 评论系统\n• 网盘功能\n• 后台管理\n\n欢迎访问！');
  });
  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function () { this.closest('.modal').style.display = 'none'; });
  });
  window.addEventListener('click', function (e) {
    document.querySelectorAll('.modal').forEach(modal => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });
}

function performSearch() {
  const query = document.getElementById('search-input').value.trim();
  renderPosts(query ? searchPosts(query) : blogPosts);
}

function filterByCategory(category) {
  renderPosts(getPostsByCategory(category));
  document.getElementById('search-input').value = '';
  window.scrollTo(0, 0);
}

function filterByTag(tag) {
  renderPosts(getPostsByTag(tag));
  document.getElementById('search-input').value = '';
  window.scrollTo(0, 0);
}

function showCategoriesModal() {
  const modal = document.getElementById('category-modal');
  const categories = getAllCategories();
  document.getElementById('category-title').textContent = '所有分类';
  document.getElementById('category-posts').innerHTML = categories.map(category => {
    const posts = getPostsByCategory(category);
    return `
      <div style="margin-bottom:1.5rem">
        <h3 style="color:var(--primary-color);margin-bottom:1rem">${escapeHtml(category)} (${posts.length})</h3>
        <ul style="list-style:none">
          ${posts.map(post => `
            <li style="margin-bottom:.5rem">
              <a href="#" onclick="goToPost(${post.id});return false;" style="color:var(--primary-color);text-decoration:none">
                ${escapeHtml(post.title)}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');
  modal.style.display = 'block';
}

function showTagsModal() {
  const modal = document.getElementById('tag-modal');
  const tags = getAllTags();
  document.getElementById('tag-title').textContent = '所有标签';
  document.getElementById('tag-posts').innerHTML = tags.map(tag => {
    const posts = getPostsByTag(tag);
    return `
      <div style="margin-bottom:1.5rem">
        <h3 style="color:var(--primary-color);margin-bottom:1rem">#${escapeHtml(tag)} (${posts.length})</h3>
        <ul style="list-style:none">
          ${posts.map(post => `
            <li style="margin-bottom:.5rem">
              <a href="#" onclick="goToPost(${post.id});return false;" style="color:var(--primary-color);text-decoration:none">
                ${escapeHtml(post.title)}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');
  modal.style.display = 'block';
}

function goToPost(postId) {
  window.location.href = `post.html?id=${postId}`;
}

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}
