const SUPABASE_URL = 'https://gqwxslartbdvfjgxcmye.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdxd3hzbGFydGJkdmZqZ3hjbXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjQyODUsImV4cCI6MjA5NjI0MDI4NX0.6domkvEQg1gdfRWDf0SqhIBwgCBPs3lEH0xxCS4gBU8';
const BUCKET = 'blog-files';

// ── Supabase Storage API 封装 ──────────────────────
const api = {
  async list() {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix: '', limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    });
    return res.json();
  },

  async upload(file) {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY, 'Content-Type': file.type || 'application/octet-stream' },
      body: file
    });
    return res.json();
  },

  async delete(name) {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${SUPABASE_ANON_KEY}`, 'apikey': SUPABASE_ANON_KEY }
    });
    return res.json();
  },

  getPublicUrl(name) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(name)}`;
  }
};

// ── 工具函数 ──────────────────────────────────────
function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  const icons = {
    pdf: '📄', jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️',
    mp4: '🎬', mov: '🎬', mp3: '🎵', wav: '🎵',
    zip: '🗜️', rar: '🗜️', '7z': '🗜️',
    doc: '📝', docx: '📝', xls: '📊', xlsx: '📊',
    ppt: '📋', pptx: '📋', txt: '📃'
  };
  return icons[ext] || '📁';
}

// ── 加载文件列表 ──────────────────────────────────
async function loadFiles() {
  const container = document.getElementById('files-container');
  const noFiles = document.getElementById('no-files');
  container.innerHTML = '<p style="text-align:center;color:#888;padding:40px">加载中...</p>';

  try {
    const files = await api.list();

    if (!Array.isArray(files) || files.length === 0) {
      container.innerHTML = '';
      noFiles.style.display = 'block';
      document.getElementById('file-count').textContent = '0';
      document.getElementById('storage-usage').textContent = '0 MB';
      return;
    }

    noFiles.style.display = 'none';
    document.getElementById('file-count').textContent = files.length;
    const totalSize = files.reduce((s, f) => s + (f.metadata?.size || 0), 0);
    document.getElementById('storage-usage').textContent = formatSize(totalSize);

    container.innerHTML = files.map(f => `
      <div class="file-card" data-name="${f.name}">
        <div class="file-icon">${getFileIcon(f.name)}</div>
        <div class="file-info">
          <div class="file-name">${f.name}</div>
          <div class="file-meta">
            ${formatSize(f.metadata?.size)} · ${new Date(f.created_at).toLocaleDateString('zh-CN')}
          </div>
        </div>
        <div class="file-actions">
          <a href="${api.getPublicUrl(f.name)}" target="_blank" download class="btn-download">⬇️ 下载</a>
          <button class="btn-delete" onclick="deleteFile('${f.name}')">🗑️ 删除</button>
        </div>
      </div>
    `).join('');

  } catch (e) {
    container.innerHTML = `<p style="color:red;text-align:center;padding:40px">加载失败：${e.message}</p>`;
  }
}

// ── 上传文件 ──────────────────────────────────────
function uploadFile(file) {
  const zone = document.getElementById('upload-zone');

  const div = document.createElement('div');
  div.style.cssText = 'margin:8px 0;font-size:14px;text-align:left;width:100%';
  div.innerHTML = `
    <span class="progress-name">📤 ${file.name}</span>
    <div style="background:#eee;border-radius:4px;height:8px;margin-top:6px">
      <div class="progress-bar" style="background:#667eea;height:8px;border-radius:4px;width:0%;transition:width .3s"></div>
    </div>`;
  zone.appendChild(div);

  const bar = div.querySelector('.progress-bar');
  const label = div.querySelector('.progress-name');

  // 用 XHR 显示上传进度
  const xhr = new XMLHttpRequest();
  xhr.open('POST', `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${encodeURIComponent(file.name)}`);
  xhr.setRequestHeader('Authorization', `Bearer ${SUPABASE_ANON_KEY}`);
  xhr.setRequestHeader('apikey', SUPABASE_ANON_KEY);
  xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

  xhr.upload.addEventListener('progress', e => {
    if (e.lengthComputable) {
      const pct = Math.round(e.loaded / e.total * 100);
      bar.style.width = pct + '%';
      label.textContent = `📤 ${file.name} — ${pct}%`;
    }
  });

  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      label.textContent = `✅ ${file.name} 上传成功`;
      setTimeout(() => { div.remove(); loadFiles(); }, 1000);
    } else {
      const err = JSON.parse(xhr.responseText);
      label.textContent = `❌ 上传失败：${err.message || xhr.status}`;
    }
  });

  xhr.addEventListener('error', () => {
    label.textContent = `❌ ${file.name} 网络错误`;
  });

  xhr.send(file);
}

// ── 删除文件 ──────────────────────────────────────
window.deleteFile = async function(name) {
  if (!confirm(`确定删除 "${name}"？`)) return;
  try {
    await api.delete(name);
    loadFiles();
  } catch (e) {
    alert('删除失败：' + e.message);
  }
};

// ── 事件绑定 ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFiles();

  const input = document.getElementById('file-input');
  const zone  = document.getElementById('upload-zone');

  document.getElementById('select-files').addEventListener('click', () => input.click());
  input.addEventListener('change', e => {
    [...e.target.files].forEach(uploadFile);
    input.value = '';
  });

  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    [...e.dataTransfer.files].forEach(uploadFile);
  });

  document.getElementById('file-search')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.file-card').forEach(card => {
      card.style.display = card.dataset.name.toLowerCase().includes(q) ? '' : 'none';
    });
  });
});
