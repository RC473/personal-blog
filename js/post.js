// 文章详情页（从 Supabase 读取数据）

document.addEventListener('DOMContentLoaded', async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) { window.location.href = 'index.html'; return; }

  await displayPost(postId);
  attachEventListeners();
});

async function displayPost(postId) {
  try {
    const post = await PostsAPI.getById(postId);
    if (!post) { window.location.href = 'index.html'; return; }

    document.title = post.title + ' - My Blog';
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-date').textContent = '📅 ' + formatDate(post.created_at || post.date);
    document.getElementById('post-category').textContent = '📂 ' + (post.category || '');
    document.getElementById('post-author').textContent = post.author ? ('✍️ ' + post.author) : '';

    const tagsContainer = document.getElementById('post-tags');
    tagsContainer.innerHTML = (post.tags || []).map(tag =>
      `<span class="post-tag">#${escapeHtml(tag)}</span>`
    ).join('');

    document.getElementById('post-content').innerHTML = post.content;

    // 加载评论
    await initComments(postId);

    // 相关文章
    await renderRelatedPosts(post);
  } catch (e) {
    document.getElementById('post-content').innerHTML = `<p style="color:red">加载失败：${e.message}</p>`;
  }
}

async function renderRelatedPosts(currentPost) {
  const container = document.getElementById('related-posts-list');
  try {
    const all = await PostsAPI.list();
    const related = all
      .filter(p => p.id !== currentPost.id)
      .filter(p => (p.tags || []).some(t => (currentPost.tags || []).includes(t)))
      .slice(0, 3);

    if (related.length === 0) {
      container.innerHTML = '<p style="color:#a0aec0">暂无相关文章</p>';
      return;
    }
    container.innerHTML = related.map(post => `
      <div class="post-card" onclick="window.location.href='post.html?id=${post.id}'">
        <h3>${escapeHtml(post.title)}</h3>
        <div class="post-meta">
          <span>${formatDate(post.created_at || post.date)}</span>
          <span>${escapeHtml(post.category || '')}</span>
        </div>
        <p style="color:#718096;margin:.5rem 0">${escapeHtml(post.excerpt || '')}</p>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<p style="color:#a0aec0">暂无相关文章</p>';
  }
}

function attachEventListeners() {
  document.getElementById('categories-link')?.addEventListener('click', e => { e.preventDefault(); window.location.href = 'index.html'; });
  document.getElementById('tags-link')?.addEventListener('click', e => { e.preventDefault(); window.location.href = 'index.html'; });
  document.getElementById('about-link')?.addEventListener('click', e => { e.preventDefault(); alert('这是一个现代化的静态个人博客。'); });
}

function escapeHtml(text) {
  if (!text) return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
}
