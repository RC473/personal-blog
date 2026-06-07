// ── 评论系统 ──────────────────────────────────────────
// 依赖 supabase.js 中的 CommentsAPI
// 在 post.html 中引入

let currentPostId = null;
let replyToId = null;   // 当前回复的父评论 ID

// ── 初始化 ───────────────────────────────────────────
async function initComments(postId) {
  currentPostId = postId;
  await loadComments();
}

// ── 加载评论 ─────────────────────────────────────────
async function loadComments() {
  const container = document.getElementById('comments-list');
  if (!container) return;
  container.innerHTML = '<p style="color:#a0aec0;text-align:center;padding:24px">加载评论中...</p>';

  try {
    const comments = await CommentsAPI.listByPost(currentPostId);
    renderComments(comments);
  } catch (e) {
    container.innerHTML = `<p style="color:red;text-align:center;padding:24px">加载失败：${e.message}</p>`;
  }
}

// ── 渲染评论树 ───────────────────────────────────────
function renderComments(comments) {
  const container = document.getElementById('comments-list');
  const count = document.getElementById('comments-count');
  if (count) count.textContent = comments.length;

  // 构建树结构（顶级 + 回复）
  const roots = comments.filter(c => !c.parent_id);
  const childMap = {};
  comments.filter(c => c.parent_id).forEach(c => {
    if (!childMap[c.parent_id]) childMap[c.parent_id] = [];
    childMap[c.parent_id].push(c);
  });

  if (roots.length === 0) {
    container.innerHTML = '<p style="color:#a0aec0;text-align:center;padding:24px">还没有评论，成为第一个评论者吧！</p>';
    return;
  }

  container.innerHTML = roots.map(c => renderCommentItem(c, childMap, false)).join('');
}

function renderCommentItem(c, childMap, isReply) {
  const children = (childMap[c.id] || []);
  const avatar = getAvatar(c.nickname);
  const date = new Date(c.created_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return `
    <div class="comment-item ${isReply ? 'comment-reply' : ''}">
      <div class="comment-avatar">${avatar}</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-name">${escHtml(c.nickname)}</span>
          ${c.email ? `<span class="comment-email">${escHtml(c.email)}</span>` : ''}
          <span class="comment-date">${date}</span>
        </div>
        <div class="comment-content">${escHtml(c.content)}</div>
        <div class="comment-actions">
          <button class="comment-reply-btn" onclick="startReply(${c.id}, '${escHtml(c.nickname)}')">💬 回复</button>
        </div>
      </div>
    </div>
    ${children.map(child => renderCommentItem(child, childMap, true)).join('')}
  `;
}

// ── 回复功能 ─────────────────────────────────────────
function startReply(parentId, name) {
  replyToId = parentId;
  const hint = document.getElementById('reply-hint');
  if (hint) {
    hint.textContent = `↩️ 回复 @${name}`;
    hint.style.display = 'block';
  }
  document.getElementById('comment-content').focus();
}

function cancelReply() {
  replyToId = null;
  const hint = document.getElementById('reply-hint');
  if (hint) hint.style.display = 'none';
}

// ── 提交评论 ─────────────────────────────────────────
async function submitComment() {
  const nickname = document.getElementById('comment-nickname').value.trim();
  const email = document.getElementById('comment-email').value.trim();
  const content = document.getElementById('comment-content').value.trim();

  if (!nickname) { showFormError('请填写昵称'); return; }
  if (!content) { showFormError('请填写评论内容'); return; }
  if (email && !isValidEmail(email)) { showFormError('邮箱格式不正确'); return; }

  const btn = document.getElementById('submit-comment-btn');
  btn.disabled = true;
  btn.textContent = '提交中...';

  try {
    await CommentsAPI.create({
      post_id: parseInt(currentPostId),
      nickname,
      email: email || null,
      content,
      parent_id: replyToId || null
    });

    // 清空表单
    document.getElementById('comment-content').value = '';
    cancelReply();
    showFormSuccess('评论发布成功！');
    await loadComments();
  } catch (e) {
    showFormError('提交失败：' + e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = '发表评论';
  }
}

// ── 工具 ─────────────────────────────────────────────
function getAvatar(name) {
  const colors = ['#667eea', '#48bb78', '#ed8936', '#e53e3e', '#805ad5', '#38b2ac'];
  const idx = name.charCodeAt(0) % colors.length;
  const bg = colors[idx];
  const char = name[0].toUpperCase();
  return `<div style="background:${bg};color:white;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0">${char}</div>`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormError(msg) {
  const el = document.getElementById('comment-form-msg');
  if (!el) return;
  el.textContent = msg;
  el.className = 'form-msg error';
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

function showFormSuccess(msg) {
  const el = document.getElementById('comment-form-msg');
  if (!el) return;
  el.textContent = msg;
  el.className = 'form-msg success';
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
