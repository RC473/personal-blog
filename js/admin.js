// ── 登录状态 ────────────────────────────────────────
function isLoggedIn() { return sessionStorage.getItem('admin_logged_in') === '1'; }

function doLogin() {
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
    sessionStorage.setItem('admin_logged_in', '1');
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('admin-page').classList.add('active');
    initAdmin();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

function doLogout() {
  sessionStorage.removeItem('admin_logged_in');
  location.reload();
}

document.getElementById('login-password').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

// ── 初始化 ───────────────────────────────────────────
function initAdmin() {
  loadDashboard();
}

if (isLoggedIn()) {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('admin-page').classList.add('active');
  initAdmin();
}

// ── 标签页切换 ───────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  event.currentTarget.classList.add('active');

  if (name === 'posts') loadPosts();
  if (name === 'comments') loadComments();
  if (name === 'storage') loadAdminFiles();
  if (name === 'dashboard') loadDashboard();
}

// ── Toast 提示 ───────────────────────────────────────
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show' + (type ? ' ' + type : '');
  setTimeout(() => el.className = '', 3000);
}

// ── 仪表盘 ───────────────────────────────────────────
async function loadDashboard() {
  try {
    const [posts, comments, files] = await Promise.all([
      PostsAPI.list(),
      CommentsAPI.listAll(),
      StorageAPI.list()
    ]);

    document.getElementById('stat-posts').textContent = posts.length;
    document.getElementById('stat-comments').textContent = comments.length;
    const fileArr = Array.isArray(files) ? files : [];
    document.getElementById('stat-files').textContent = fileArr.length;
    const totalBytes = fileArr.reduce((s, f) => s + (f.metadata?.size || 0), 0);
    document.getElementById('stat-storage').textContent = formatSize(totalBytes);

    const tbody = document.getElementById('dashboard-posts');
    tbody.innerHTML = posts.slice(0, 8).map(p => `
      <tr>
        <td>${escHtml(p.title)}</td>
        <td><span class="badge badge-blue">${escHtml(p.category || '未分类')}</span></td>
        <td>${fmtDate(p.created_at)}</td>
      </tr>
    `).join('') || '<tr><td colspan="3" style="text-align:center;color:#a0aec0;padding:24px">暂无文章</td></tr>';
  } catch (e) {
    toast('加载失败：' + e.message, 'error');
  }
}

// ── 文章管理 ─────────────────────────────────────────
let editingPostId = null;

async function loadPosts() {
  const tbody = document.getElementById('posts-table');
  tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:#a0aec0">加载中...</td></tr>';
  try {
    const posts = await PostsAPI.list();
    tbody.innerHTML = posts.map(p => `
      <tr>
        <td><strong>${escHtml(p.title)}</strong></td>
        <td><span class="badge badge-blue">${escHtml(p.category || '未分类')}</span></td>
        <td>${(p.tags || []).map(t => `<span class="badge badge-gray">${escHtml(t)}</span>`).join(' ')}</td>
        <td>${fmtDate(p.created_at)}</td>
        <td>
          <div class="td-actions">
            <button class="btn btn-sm btn-outline" onclick="editPost(${p.id})">✏️ 编辑</button>
            <button class="btn btn-sm btn-danger" onclick="deletePost(${p.id}, '${escHtml(p.title)}')">🗑️ 删除</button>
          </div>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px;color:#a0aec0">暂无文章，点击「新建文章」开始创作</td></tr>';
  } catch (e) {
    toast('加载文章失败：' + e.message, 'error');
  }
}

function openPostModal(post = null) {
  editingPostId = post ? post.id : null;
  document.getElementById('post-modal-title').textContent = post ? '编辑文章' : '新建文章';
  document.getElementById('p-title').value = post?.title || '';
  document.getElementById('p-category').value = post?.category || '';
  document.getElementById('p-tags').value = (post?.tags || []).join(', ');
  document.getElementById('p-excerpt').value = post?.excerpt || '';
  document.getElementById('p-content').value = post?.content || '';
  document.getElementById('p-author').value = post?.author || 'Ricky';
  document.getElementById('post-modal').classList.add('open');
}

function closePostModal() {
  document.getElementById('post-modal').classList.remove('open');
}

async function editPost(id) {
  try {
    const post = await PostsAPI.getById(id);
    if (post) openPostModal(post);
  } catch (e) {
    toast('获取文章失败：' + e.message, 'error');
  }
}

async function savePost() {
  const title = document.getElementById('p-title').value.trim();
  const content = document.getElementById('p-content').value.trim();
  const category = document.getElementById('p-category').value.trim();
  if (!title || !content) { toast('标题和内容不能为空', 'error'); return; }

  const tagsRaw = document.getElementById('p-tags').value;
  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
  const excerpt = document.getElementById('p-excerpt').value.trim()
    || content.replace(/<[^>]+>/g, '').slice(0, 100) + '...';

  const payload = {
    title,
    content,
    category: category || '未分类',
    tags,
    excerpt,
    author: document.getElementById('p-author').value.trim() || 'Ricky'
  };

  try {
    if (editingPostId) {
      await PostsAPI.update(editingPostId, payload);
      toast('✅ 文章已更新');
    } else {
      await PostsAPI.create(payload);
      toast('✅ 文章已发布');
    }
    closePostModal();
    loadPosts();
    loadDashboard();
  } catch (e) {
    toast('保存失败：' + e.message, 'error');
  }
}

async function deletePost(id, title) {
  if (!confirm(`确定删除「${title}」？此操作不可恢复。`)) return;
  try {
    await PostsAPI.delete(id);
    toast('✅ 文章已删除');
    loadPosts();
    loadDashboard();
  } catch (e) {
    toast('删除失败：' + e.message, 'error');
  }
}

// ── 评论管理 ─────────────────────────────────────────
async function loadComments() {
  const tbody = document.getElementById('comments-table');
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:#a0aec0">加载中...</td></tr>';
  try {
    const [comments, posts] = await Promise.all([CommentsAPI.listAll(), PostsAPI.list()]);
    const postMap = {};
    posts.forEach(p => postMap[p.id] = p.title);

    tbody.innerHTML = comments.map(c => `
      <tr>
        <td><strong>${escHtml(c.nickname)}</strong></td>
        <td class="comment-row-info">${escHtml(c.email || '—')}</td>
        <td><div class="truncate comment-row-content">${escHtml(c.content)}</div></td>
        <td class="comment-row-info">${escHtml(postMap[c.post_id] || '已删除')}</td>
        <td class="comment-row-info">${fmtDate(c.created_at)}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteComment(${c.id})">🗑️ 删除</button>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px;color:#a0aec0">暂无评论</td></tr>';
  } catch (e) {
    toast('加载评论失败：' + e.message, 'error');
  }
}

async function deleteComment(id) {
  if (!confirm('确定删除这条评论？')) return;
  try {
    await CommentsAPI.delete(id);
    toast('✅ 评论已删除');
    loadComments();
  } catch (e) {
    toast('删除失败：' + e.message, 'error');
  }
}

// ── 网盘管理 ─────────────────────────────────────────
async function loadAdminFiles() {
  const grid = document.getElementById('admin-files-grid');
  grid.innerHTML = '<p style="text-align:center;color:#a0aec0;padding:32px">加载中...</p>';
  try {
    const files = await StorageAPI.list();
    const arr = Array.isArray(files) ? files : [];
    if (arr.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:#a0aec0;padding:32px">暂无文件</p>';
      return;
    }
    grid.innerHTML = arr.map(f => `
      <div class="file-card-admin">
        <div class="file-top">
          <div class="file-icon">${getFileIcon(f.name)}</div>
          <div>
            <div class="file-name">${escHtml(f.name)}</div>
            <div class="file-meta">${formatSize(f.metadata?.size)}</div>
          </div>
        </div>
        <div class="file-btns">
          <a href="${StorageAPI.getPublicUrl(f.name)}" target="_blank" class="btn btn-sm btn-outline">⬇️ 下载</a>
          <button class="btn btn-sm btn-danger" onclick="adminDeleteFile('${escHtml(f.name)}')">🗑️</button>
        </div>
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = `<p style="color:red;text-align:center;padding:32px">加载失败：${e.message}</p>`;
  }
}

async function adminDeleteFile(name) {
  if (!confirm(`确定删除「${name}」？`)) return;
  try {
    await StorageAPI.delete(name);
    toast('✅ 文件已删除');
    loadAdminFiles();
  } catch (e) {
    toast('删除失败：' + e.message, 'error');
  }
}

// 上传
function adminUploadFile(file) {
  const progress = document.getElementById('admin-upload-progress');
  const div = document.createElement('div');
  div.style.cssText = 'margin:8px 0;font-size:14px';
  div.innerHTML = `
    <span class="pname">📤 ${escHtml(file.name)}</span>
    <div style="background:#eee;border-radius:4px;height:6px;margin-top:6px">
      <div class="pbar" style="background:var(--primary);height:6px;border-radius:4px;width:0%;transition:width .3s"></div>
    </div>`;
  progress.appendChild(div);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(file.name)}`);
  xhr.setRequestHeader('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
  xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
  xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
  xhr.upload.addEventListener('progress', e => {
    if (e.lengthComputable) {
      const pct = Math.round(e.loaded / e.total * 100);
      div.querySelector('.pbar').style.width = pct + '%';
      div.querySelector('.pname').textContent = `📤 ${file.name} — ${pct}%`;
    }
  });
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      div.querySelector('.pname').textContent = `✅ ${file.name}`;
      setTimeout(() => { div.remove(); loadAdminFiles(); }, 1200);
    } else {
      div.querySelector('.pname').textContent = `❌ 上传失败：${xhr.status}`;
    }
  });
  xhr.send(file);
}

document.addEventListener('DOMContentLoaded', () => {
  const zone = document.getElementById('admin-upload-zone');
  const input = document.getElementById('admin-file-input');
  if (!zone) return;

  input.addEventListener('change', e => {
    [...e.target.files].forEach(adminUploadFile);
    input.value = '';
  });
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    [...e.dataTransfer.files].forEach(adminUploadFile);
  });
});

// ── 工具函数 ─────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function fmtDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function getFileIcon(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  const icons = { pdf:'📄', jpg:'🖼️', jpeg:'🖼️', png:'🖼️', gif:'🖼️', webp:'🖼️',
    mp4:'🎬', mov:'🎬', mp3:'🎵', wav:'🎵', zip:'🗜️', rar:'🗜️',
    doc:'📝', docx:'📝', xls:'📊', xlsx:'📊', ppt:'📋', pptx:'📋', txt:'📃' };
  return icons[ext] || '📁';
}
